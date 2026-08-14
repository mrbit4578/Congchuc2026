import os
import json
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("tvpl_downloader.rag.pipeline")

GUIDES_JSON = os.path.join(os.path.dirname(__file__), "..", "data", "knowledge_base.json")
DOWNLOADS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "downloads")
HTML_DIR = os.path.join(os.path.dirname(__file__), "..", "ThiCongChuc", "on-thi-vien-chuc-2026-ke-toan")

SYSTEM_PROMPT = """Ban la tro ly AI chuyen ve phap luat Viet Nam, ho tro thi sinh on thi cong chuc.
Tra loi cau hoi dua tren cac nguon kien thuc duoc cung cap ben duoi.

Quy tac:
1. CHI su dung thong tin tu nguon duoc cung cap. Neu khong tim thay thong tin, noi ro "Khong tim thay thong tin lien quan trong tai lieu."
2. Trich dan nguon cu the: ten van ban + muc/dieu tuong ung.
3. Su dung dinh dang markdown de trinh bay ro rang.
4. Giu cau tra loi chinh xac, ngan gon, tap trung vao cau hoi.
5. Neu cau hoi lien quan den so sanh hoac phan biet, su dung bang hoac gach dau dong.
6. Tra loi bang tieng Viet."""

_all_chunks = []

def _load_and_chunk_all() -> List[Dict[str, Any]]:
    from .document_loader import load_guides, load_markdown_docs, load_html_notes
    from .chunker import chunk_guide_entry, chunk_markdown, chunk_html_text
    all_chunks = []
    if os.path.exists(GUIDES_JSON):
        guides = load_guides(GUIDES_JSON)
        for entry in guides:
            chunks = chunk_guide_entry(entry)
            all_chunks.extend(chunks)
        logger.info(f"Tier 1: {len(all_chunks)} chunks from guides")
    if os.path.exists(DOWNLOADS_DIR):
        md_docs = load_markdown_docs(DOWNLOADS_DIR)
        md_count = 0
        for doc in md_docs:
            chunks = chunk_markdown(doc["content"], doc["doc_id"], doc["title"])
            all_chunks.extend(chunks)
            md_count += 1
        logger.info(f"Tier 2: {md_count} markdown docs loaded")
    if os.path.exists(HTML_DIR):
        html_docs = load_html_notes(HTML_DIR)
        html_count = 0
        for doc in html_docs:
            chunks = chunk_html_text(doc["content"], doc["doc_id"], doc["title"])
            all_chunks.extend(chunks)
            html_count += 1
        logger.info(f"Tier 3: {html_count} HTML docs loaded")
    return all_chunks

def initialize():
    from . import vector_store as vs
    from . import bm25_store as bs
    from .embeddings import get_embeddings_batch
    global _all_chunks
    if vs.is_indexed() and bs.is_indexed():
        logger.info("Indexes already exist, skipping initialization")
        return
    logger.info("Starting RAG initialization...")
    _all_chunks = _load_and_chunk_all()
    if not _all_chunks:
        logger.warning("No chunks to index!")
        return
    texts = [c["text"] for c in _all_chunks]
    logger.info(f"Generating embeddings for {len(texts)} chunks...")
    embeddings = get_embeddings_batch(texts)
    vs.add_chunks(_all_chunks, embeddings)
    bs.build_index(_all_chunks)
    bs.save_index()
    logger.info(f"RAG initialization complete: {len(_all_chunks)} chunks indexed")

def get_status() -> Dict[str, Any]:
    from . import vector_store as vs
    from . import bm25_store as bs
    vs_status = vs.get_status()
    api_key_set = bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY"))
    return {
        "indexed": vs_status["indexed"],
        "total_chunks": vs_status["total_chunks"],
        "configured": api_key_set,
        "embedding_model": "text-embedding-004",
        "llm_model": "gemini-2.5-flash"
    }

def answer_question(
    question: str,
    top_k: int = 5,
    history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    from . import vector_store as vs
    from . import bm25_store as bs
    from .embeddings import get_embedding
    from .hybrid_retriever import hybrid_retrieve
    from openai import OpenAI
    if not vs.is_indexed() or not bs.is_indexed():
        initialize()
    question_embedding = get_embedding(question)
    retrieved = hybrid_retrieve(question, question_embedding, vs, bs, top_k=top_k)
    context_parts = []
    sources = []
    for i, chunk in enumerate(retrieved, 1):
        context_parts.append(f"[Nguon {i}] {chunk['doc_title']} -- {chunk['section_heading']}{chr(10)}{chunk['text']}")
        sources.append({
            "chunk_id": chunk["chunk_id"],
            "doc_id": chunk["doc_id"],
            "doc_title": chunk["doc_title"],
            "section_heading": chunk["section_heading"],
            "source_tier": chunk["source_tier"],
            "relevance_score": chunk.get("relevance_score", 0)
        })
    context = chr(10).join(context_parts)
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        for msg in history[-6:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
    user_content = f"## Nguon tham khao{chr(10)}{chr(10)}{context}{chr(10)}{chr(10)}## Cau hoi{chr(10)}{question}"
    messages.append({"role": "user", "content": user_content})
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("OPENAI_API_KEY")
    client = OpenAI(base_url="https://generativelanguage.googleapis.com/v1beta/openai/", api_key=api_key)
    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=messages,
        temperature=0.2,
        max_tokens=1024
    )
    answer = response.choices[0].message.content
    return {
        "success": True,
        "answer": answer,
        "sources": sources,
        "model": "gemini-2.5-flash",
        "chunks_used": len(retrieved)
    }
