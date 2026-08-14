import os
import logging
from typing import Dict, Any, List
from .browser import BrowserManager
from .scraper import DocumentScraper
from .exporter import DocumentExporter

logger = logging.getLogger("tvpl_downloader.downloader")

class DownloaderEngine:
    """Orchestrates document downloading, parsing, exporting, and file management."""

    def __init__(self, headless: bool = False, output_base_dir: str = "public/downloads"):
        self.headless = headless
        self.output_base_dir = output_base_dir

    def download_url(self, url: str) -> Dict[str, Any]:
        """Downloads a single document from URL, extracts content, and exports to disk."""
        logger.info(f"Starting download pipeline for URL: {url}")
        
        bm = BrowserManager(headless=self.headless)
        context = bm.start()
        page = context.new_page()
        
        try:
            scraper = DocumentScraper(page)
            temp_download_dir = os.path.join(self.output_base_dir, "_temp")
            
            result = scraper.scrape_url(url, temp_download_dir)
            
            meta = result.get("metadata", {})
            slug = DocumentExporter._get_slug(meta, url)
            target_dir = os.path.join(self.output_base_dir, slug)
            os.makedirs(target_dir, exist_ok=True)
            
            moved_attachments = []
            for file_path in result.get("downloaded_files", []):
                if os.path.exists(file_path):
                    filename = os.path.basename(file_path)
                    dest_path = os.path.join(target_dir, filename)
                    os.replace(file_path, dest_path)
                    moved_attachments.append(dest_path)
            
            result["downloaded_files"] = moved_attachments
            exported_paths = DocumentExporter.export_all(result, target_dir)
            
            summary = {
                "url": url,
                "title": meta.get("title"),
                "so_hieu": meta.get("so_hieu"),
                "directory": target_dir,
                "exported_files": exported_paths,
                "attachments": moved_attachments
            }
            logger.info(f"Successfully processed document: {meta.get('title')}")
            return summary
            
        finally:
            bm.close()

    def download_batch(self, urls: List[str]) -> List[Dict[str, Any]]:
        """Downloads a batch of document URLs sequentially."""
        results = []
        for index, url in enumerate(urls):
            logger.info(f"Processing item [{index + 1}/{len(urls)}]: {url}")
            try:
                res = self.download_url(url)
                results.append(res)
            except Exception as e:
                logger.error(f"Failed to download {url}: {e}")
                results.append({"url": url, "error": str(e)})
        return results
