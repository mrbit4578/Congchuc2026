import os
import json
import logging
from typing import List, Dict, Any

logger = logging.getLogger("tvpl_downloader.rag.loader")

def load_guides(json_path: str) -> List[Dict[str, Any]]:
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_markdown_docs(downloads_dir: str) -> List[Dict[str, Any]]:
    docs = []
    if not os.path.exists(downloads_dir):
        return docs
    for folder in os.listdir(downloads_dir):
        folder_path = os.path.join(downloads_dir, folder)
        if not os.path.isdir(folder_path) or folder.startswith("_"):
            continue
        for fname in os.listdir(folder_path):
            if fname.endswith(".md"):
                fpath = os.path.join(folder_path, fname)
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                docs.append({
                    "doc_id": folder,
                    "title": fname.replace(".md", ""),
                    "content": content,
                    "source": fpath
                })
    logger.info(f"Loaded {len(docs)} markdown documents from {downloads_dir}")
    return docs

def load_html_notes(html_dir: str) -> List[Dict[str, Any]]:
    docs = []
    if not os.path.exists(html_dir):
        return docs
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        logger.warning("beautifulsoup4 not installed, skipping HTML loading")
        return docs
    for fname in os.listdir(html_dir):
        if not fname.endswith(".html"):
            continue
        fpath = os.path.join(html_dir, fname)
        with open(fpath, "r", encoding="utf-8") as f:
            content = f.read()
        soup = BeautifulSoup(content, "lxml")
        body = soup.find("div", class_="page-body") or soup.find("body") or soup
        for tag in body.find_all(["script", "style", "nav", "header", "footer"]):
            tag.decompose()
        text = body.get_text(separator=chr(10), strip=True)
        if len(text) > 100:
            docs.append({
                "doc_id": fname.replace(".html", ""),
                "title": soup.find("title").get_text(strip=True) if soup.find("title") else fname,
                "content": text,
                "source": fpath
            })
    logger.info(f"Loaded {len(docs)} HTML documents from {html_dir}")
    return docs
