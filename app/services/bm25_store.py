import os
import pickle
import logging
from typing import List, Dict, Any

logger = logging.getLogger("tvpl_downloader.rag.bm25_store")

INDEX_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "bm25_index.pkl")

_bm25 = None
_chunks_map = {}
_tokenized_corpus = []

def _tokenize_vietnamese(text: str) -> List[str]:
    try:
        from underthesea import word_tokenize
        return word_tokenize(text)
    except ImportError:
        logger.warning("underthesea not installed, falling back to space tokenization")
        return text.split()

def build_index(chunks: List[Dict[str, Any]]):
    global _bm25, _chunks_map, _tokenized_corpus
    from rank_bm25 import BM25Okapi
    _tokenized_corpus = [_tokenize_vietnamese(c["text"]) for c in chunks]
    _bm25 = BM25Okapi(_tokenized_corpus)
    _chunks_map = {c["chunk_id"]: c for c in chunks}
    logger.info(f"Built BM25 index with {len(chunks)} chunks")

def save_index():
    data = {
        "bm25": _bm25,
        "chunks_map": _chunks_map,
        "tokenized_corpus": _tokenized_corpus
    }
    os.makedirs(os.path.dirname(INDEX_PATH), exist_ok=True)
    with open(INDEX_PATH, "wb") as f:
        pickle.dump(data, f)
    logger.info(f"Saved BM25 index to {INDEX_PATH}")

def load_index() -> bool:
    global _bm25, _chunks_map, _tokenized_corpus
    if not os.path.exists(INDEX_PATH):
        return False
    try:
        with open(INDEX_PATH, "rb") as f:
            data = pickle.load(f)
        _bm25 = data["bm25"]
        _chunks_map = data["chunks_map"]
        _tokenized_corpus = data["tokenized_corpus"]
        logger.info(f"Loaded BM25 index with {len(_chunks_map)} chunks")
        return True
    except Exception as e:
        logger.warning(f"Failed to load BM25 index: {e}")
        return False

def is_indexed() -> bool:
    return _bm25 is not None

def query(question: str, top_k: int = 10) -> List[Dict[str, Any]]:
    if _bm25 is None:
        return []
    tokens = _tokenize_vietnamese(question)
    scores = _bm25.get_scores(tokens)
    top_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:top_k]
    items = []
    chunk_ids = list(_chunks_map.keys())
    for idx in top_indices:
        if idx < len(chunk_ids):
            chunk_id = chunk_ids[idx]
            chunk = _chunks_map[chunk_id]
            items.append({
                "chunk_id": chunk_id,
                "doc_id": chunk["doc_id"],
                "doc_title": chunk["doc_title"],
                "section_heading": chunk["section_heading"],
                "source_tier": chunk["source_tier"],
                "text": chunk["text"],
                "score": float(scores[idx])
            })
    return items

def clear():
    global _bm25, _chunks_map, _tokenized_corpus
    _bm25 = None
    _chunks_map = {}
    _tokenized_corpus = []
    if os.path.exists(INDEX_PATH):
        os.remove(INDEX_PATH)
