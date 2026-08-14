import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger("tvpl_downloader.rag.chunker")

def chunk_guide_entry(entry: Dict[str, Any]) -> List[Dict[str, Any]]:
    chunks = []
    doc_id = entry.get("doc_id", "")
    doc_title = entry.get("title", "")
    for i, section in enumerate(entry.get("sections", [])):
        heading = section.get("heading", "")
        content_parts = section.get("content", [])
        text = chr(10).join(content_parts) if isinstance(content_parts, list) else str(content_parts)
        if len(text.strip()) < 20:
            continue
        chunk_text = f"{heading}{chr(10)}{text}".strip()
        info = entry.get("info", {})
        meta_line = f"[{info.get('soHieu', '')} - {info.get('loai', '')}]"
        chunk_text = f"{meta_line}{chr(10)}{chunk_text}"
        chunks.append({
            "chunk_id": f"{doc_id}__s{i}",
            "doc_id": doc_id,
            "doc_title": doc_title,
            "section_heading": heading,
            "source_tier": 1,
            "text": chunk_text
        })
    return chunks

def chunk_markdown(text: str, doc_id: str, doc_title: str) -> List[Dict[str, Any]]:
    chunks = []
    lines = text.split(chr(10))
    current_heading = "Mo dau"
    current_lines = []
    section_idx = 0
    for line in lines:
        if re.match(r"^#{1,3}\s", line):
            if current_lines:
                chunk_text = chr(10).join(current_lines).strip()
                if len(chunk_text) > 50:
                    chunks.append({
                        "chunk_id": f"{doc_id}__md{section_idx}",
                        "doc_id": doc_id,
                        "doc_title": doc_title,
                        "section_heading": current_heading,
                        "source_tier": 2,
                        "text": chunk_text
                    })
                    section_idx += 1
            current_heading = re.sub(r"^#{1,3}\s*", "", line).strip()
            current_lines = []
        else:
            current_lines.append(line)
    if current_lines:
        chunk_text = chr(10).join(current_lines).strip()
        if len(chunk_text) > 50:
            chunks.append({
                "chunk_id": f"{doc_id}__md{section_idx}",
                "doc_id": doc_id,
                "doc_title": doc_title,
                "section_heading": current_heading,
                "source_tier": 2,
                "text": chunk_text
            })
    return chunks

def chunk_html_text(text: str, doc_id: str, doc_title: str) -> List[Dict[str, Any]]:
    chunks = []
    sections = re.split(r"\n(?=[A-Z][\w\s]*:)", text)
    for i, section in enumerate(sections):
        section = section.strip()
        if len(section) > 50:
            chunks.append({
                "chunk_id": f"{doc_id}__html{i}",
                "doc_id": doc_id,
                "doc_title": doc_title,
                "section_heading": section[:80],
                "source_tier": 3,
                "text": section[:2000]
            })
    return chunks
