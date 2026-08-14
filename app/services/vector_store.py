import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("tvpl_downloader.rag.vector_store")

CHROMA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "chroma_db")
COLLECTION_NAME = "congchuc_qa"

_client = None
_collection = None

def _get_chroma_client():
    global _client
    if _client is None:
        import chromadb
        os.makedirs(CHROMA_DIR, exist_ok=True)
        _client = chromadb.PersistentClient(path=CHROMA_DIR)
    return _client

def get_collection():
    global _collection
    if _collection is None:
        client = _get_chroma_client()
        _collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"}
        )
    return _collection

def is_indexed() -> bool:
    col = get_collection()
    return col.count() > 0

def get_status() -> Dict[str, Any]:
    col = get_collection()
    return {
        "indexed": col.count() > 0,
        "total_chunks": col.count()
    }

def add_chunks(chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
    col = get_collection()
    ids = [c["chunk_id"] for c in chunks]
    documents = [c["text"] for c in chunks]
    metadatas = [{
        "doc_id": c["doc_id"],
        "doc_title": c["doc_title"],
        "section_heading": c["section_heading"],
        "source_tier": c["source_tier"]
    } for c in chunks]
    col.add(
        ids=ids,
        documents=documents,
        metadatas=metadatas,
        embeddings=embeddings
    )
    logger.info(f"Added {len(chunks)} chunks to vector store")

def query(question: str, question_embedding: List[float], top_k: int = 10) -> List[Dict[str, Any]]:
    col = get_collection()
    results = col.query(
        query_embeddings=[question_embedding],
        n_results=top_k
    )
    items = []
    if results and results["ids"] and results["ids"][0]:
        for i, cid in enumerate(results["ids"][0]):
            items.append({
                "chunk_id": cid,
                "doc_id": results["metadatas"][0][i]["doc_id"],
                "doc_title": results["metadatas"][0][i]["doc_title"],
                "section_heading": results["metadatas"][0][i]["section_heading"],
                "source_tier": results["metadatas"][0][i]["source_tier"],
                "text": results["documents"][0][i] if results["documents"] else "",
                "distance": results["distances"][0][i] if results["distances"] else 0
            })
    return items

def clear():
    global _collection
    client = _get_chroma_client()
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass
    _collection = None
