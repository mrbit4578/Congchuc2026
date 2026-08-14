import os
import re
import time
import logging
from typing import Dict, Any, List, Optional
from bs4 import BeautifulSoup
from playwright.sync_api import Page, BrowserContext

logger = logging.getLogger("tvpl_downloader.scraper")

class DocumentScraper:
    """Scrapes legal document metadata, content, and downloadable attachments from thuvienphapluat.vn."""

    def __init__(self, page: Page):
        self.page = page

    def scrape_url(self, url: str, download_dir: str) -> Dict[str, Any]:
        logger.info(f"Navigating to URL: {url}")
        os.makedirs(download_dir, exist_ok=True)
        
        # Navigate to page
        self.page.goto(url, wait_until="domcontentloaded", timeout=60000)
        
        # Wait up to 20s for Cloudflare turnstile auto-verify & main document title H1 load
        for attempt in range(20):
            try:
                h1s = self.page.locator("h1").all_inner_texts()
                valid_titles = [
                    t.strip() for t in h1s 
                    if t.strip().lower() != "thuvienphapluat.vn" 
                    and "chờ một chút" not in t.lower() 
                    and "just a moment" not in t.lower()
                ]
                if valid_titles:
                    logger.info(f"Page loaded successfully at attempt {attempt + 1}. Title: {valid_titles[0]}")
                    break
            except Exception:
                pass
                
            logger.info(f"Waiting for Cloudflare turnstile & content... ({attempt + 1}/20)")
            self.page.wait_for_timeout(1000)
            
        self.page.wait_for_timeout(2000)
        
        html_content = self.page.content()
        soup = BeautifulSoup(html_content, "lxml")
        
        # 1. Extract Metadata
        metadata = self._extract_metadata(soup, url)
        
        # 2. Extract Document Text Content
        content_html, text_content = self._extract_body_content(soup)
        
        # 3. Download Original Files (DOCX, PDF)
        downloaded_files = self._download_attachments(url, download_dir)
        
        return {
            "url": url,
            "metadata": metadata,
            "html_content": content_html,
            "text_content": text_content,
            "downloaded_files": downloaded_files
        }

    def _extract_metadata(self, soup: BeautifulSoup, url: str) -> Dict[str, Any]:
        """Extracts key attributes such as document number, dates, issuer, status."""
        title = ""
        # Find document title H1 (ignore logo H1)
        h1_elements = soup.find_all("h1")
        for h1 in h1_elements:
            text = h1.get_text(strip=True)
            if text and text.lower() != "thuvienphapluat.vn":
                title = text
                break
                
        if not title:
            title_el = soup.find("h2", class_="title") or soup.find("div", class_="title")
            if title_el:
                title = title_el.get_text(strip=True)
                
        if not title:
            title = "Văn bản pháp luật"
            
        title = re.sub(r"\s+", " ", title)
        
        metadata = {
            "title": title,
            "url": url,
            "so_hieu": "",
            "loai_van_ban": "",
            "ngay_ban_hanh": "",
            "ngay_hieu_luc": "",
            "co_quan_ban_hanh": "",
            "tinh_trang": "",
            "nguoi_ky": "",
        }
        
        # Find property table
        table = soup.find("table", class_=re.compile(r"thuoctinh|tblThuocTinh", re.I))
        if not table:
            for t in soup.find_all("table"):
                text_content = t.get_text()
                if "Số hiệu" in text_content or "Ngày ban hành" in text_content or "Loại văn bản" in text_content:
                    table = t
                    break
                    
        if table:
            rows = table.find_all("tr")
            for r in rows:
                cols = r.find_all(["td", "th"])
                if len(cols) >= 2:
                    k = cols[0].get_text(strip=True).lower()
                    v = cols[1].get_text(strip=True)
                    if "số hiệu" in k:
                        metadata["so_hieu"] = v
                    elif "loại văn bản" in k:
                        metadata["loai_van_ban"] = v
                    elif "ngày ban hành" in k:
                        metadata["ngay_ban_hanh"] = v
                    elif "ngày hiệu lực" in k:
                        metadata["ngay_hieu_luc"] = v
                    elif "cơ quan ban hành" in k or "người ký" in k:
                        metadata["co_quan_ban_hanh"] = v
                    elif "tình trạng" in k or "trạng thái" in k:
                        metadata["tinh_trang"] = v

        # Extract so_hieu from title if missing
        if not metadata["so_hieu"]:
            match = re.search(r"(\d+/\d+/[A-Za-z0-9\-]+)", title)
            if match:
                metadata["so_hieu"] = match.group(1)

        return metadata

    def _extract_body_content(self, soup: BeautifulSoup) -> tuple[str, str]:
        """Finds main text container and extracts clean HTML & plaintext."""
        content_div = (
            soup.find("div", id="divContent") or
            soup.find("div", class_="content1") or
            soup.find("div", id="divNoiDung") or
            soup.find("div", class_="content-law") or
            soup.find("div", class_="fulltext")
        )
        
        if not content_div:
            content_div = soup.find("body")
            
        if not content_div:
            return "", ""
            
        for el in content_div.find_all(["script", "style", "iframe", "ins", "form"]):
            el.decompose()
            
        html_str = str(content_div)
        text_str = content_div.get_text(separator="\n", strip=True)
        return html_str, text_str

    def _download_attachments(self, url: str, download_dir: str) -> List[str]:
        """Interprets download triggers and saves original files (DOCX, PDF)."""
        downloaded = []
        
        try:
            tab8 = self.page.query_selector('#tab8, a[href="#tab8"], a:has-text("Tải về")')
            if tab8:
                tab8.click()
                self.page.wait_for_timeout(2000)
                
            links = self.page.query_selector_all('a[href*="download.aspx"], a[id*="HyperLink"], a:has-text("Tải bản"), a:has-text("Tải Văn bản")')
            logger.info(f"Found {len(links)} potential download triggers.")
            
            for link in links:
                link_text = link.inner_text().strip()
                href = link.get_attribute("href") or ""
                
                if not ("docx" in link_text.lower() or "pdf" in link_text.lower() or "download.aspx" in href or "HyperLink" in href):
                    continue
                    
                logger.info(f"Attempting download trigger: {link_text}")
                
                try:
                    with self.page.expect_download(timeout=10000) as download_info:
                        link.click()
                    download = download_info.value
                    
                    suggested_filename = download.suggested_filename
                    save_path = os.path.join(download_dir, suggested_filename)
                    download.save_as(save_path)
                    logger.info(f"Successfully downloaded attachment: {save_path}")
                    downloaded.append(save_path)
                except Exception as ex:
                    logger.debug(f"Download trigger '{link_text}' did not initiate direct file stream: {ex}")
                    
        except Exception as e:
            logger.warning(f"Error during attachment downloading: {e}")

        return downloaded
