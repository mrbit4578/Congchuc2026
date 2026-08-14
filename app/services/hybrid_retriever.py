import logging
from typing import List, Dict, Any

logger = logging.getLogger("tvpl_downloader.rag.hybrid")

def reciprocal_rank_fusion(
    dense_results: List[Dict[str, Any]],
    sparse_results: List[Dict[str, Any]],
    k: int = 60,
    top_n: int = 5
) -> List[Dict[str, Any]]:
    scores = {}
    chunk_map = {}
    for rank, result in enumerate(dense_results, start=1):
        cid = result["chunk_id"]
        scores[cid] = scores.get(cid, 0) + 1.0 / (k + rank)
        chunk_map[cid] = result
    for rank, result in enumerate(sparse_results, start=1):
        cid = result["chunk_id"]
        scores[cid] = scores.get(cid, 0) + 1.0 / (k + rank)
        if cid not in chunk_map:
            chunk_map[cid] = result
    sorted_chunks = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    fused = []
    for cid, rrf_score in sorted_chunks[:top_n]:
        item = chunk_map[cid].copy()
        item["relevance_score"] = round(rrf_score, 4)
        fused.append(item)
    return fused

def hybrid_retrieve(
    question: str,
    question_embedding: List[float],
    vector_store_mod,
    bm25_store_mod,
    top_k: int = 5,
    dense_k: int = 10,
    sparse_k: int = 10
) -> List[Dict[str, Any]]:
    dense_results = vector_store_mod.query(question, question_embedding, top_k=dense_k)
    sparse_results = bm25_store_mod.query(question, top_k=sparse_k)
    logger.info(f"Dense: {len(dense_results)} results, Sparse: {len(sparse_results)} results")
    fused = reciprocal_rank_fusion(dense_results, sparse_results, k=60, top_n=top_k)
    logger.info(f"RRF fused: {len(fused)} results")
    return fused
