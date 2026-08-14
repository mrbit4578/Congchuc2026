"""Helper script to create all Python backend files for the RAG system."""
import os

BASE = "E:/AI/app/services"
NL = "\n"

def write_file(name, content):
    path = os.path.join(BASE, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Created {name}")

# document_loader.py
write_file("document_loader.py", f'''import os
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
                docs.append({{
                    "doc_id": folder,
                    "title": fname.replace(".md", ""),
                    "content": content,
                    "source": fpath
                }})
    logger.info(f"Loaded {{len(docs)}} markdown documents from {{downloads_dir}}")
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
            docs.append({{
                "doc_id": fname.replace(".html", ""),
                "title": soup.find("title").get_text(strip=True) if soup.find("title") else fname,
                "content": text,
                "source": fpath
            }})
    logger.info(f"Loaded {{len(docs)}} HTML documents from {{html_dir}}")
    return docs
''')

# chunker.py
write_file("chunker.py", f'''import re
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
        chunk_text = f"{{heading}}{{chr(10)}}{{text}}".strip()
        info = entry.get("info", {{}})
        meta_line = f"[{{info.get('soHieu', '')}} - {{info.get('loai', '')}}]"
        chunk_text = f"{{meta_line}}{{chr(10)}}{{chunk_text}}"
        chunks.append({{
            "chunk_id": f"{{doc_id}}__s{{i}}",
            "doc_id": doc_id,
            "doc_title": doc_title,
            "section_heading": heading,
            "source_tier": 1,
            "text": chunk_text
        }})
    return chunks

def chunk_markdown(text: str, doc_id: str, doc_title: str) -> List[Dict[str, Any]]:
    chunks = []
    lines = text.split(chr(10))
    current_heading = "Mo dau"
    current_lines = []
    section_idx = 0
    for line in lines:
        if re.match(r"^#{{1,3}}\\s", line):
            if current_lines:
                chunk_text = chr(10).join(current_lines).strip()
                if len(chunk_text) > 50:
                    chunks.append({{
                        "chunk_id": f"{{doc_id}}__md{{section_idx}}",
                        "doc_id": doc_id,
                        "doc_title": doc_title,
                        "section_heading": current_heading,
                        "source_tier": 2,
                        "text": chunk_text
                    }})
                    section_idx += 1
            current_heading = re.sub(r"^#{{1,3}}\\s*", "", line).strip()
            current_lines = []
        else:
            current_lines.append(line)
    if current_lines:
        chunk_text = chr(10).join(current_lines).strip()
        if len(chunk_text) > 50:
            chunks.append({{
                "chunk_id": f"{{doc_id}}__md{{section_idx}}",
                "doc_id": doc_id,
                "doc_title": doc_title,
                "section_heading": current_heading,
                "source_tier": 2,
                "text": chunk_text
            }})
    return chunks

def chunk_html_text(text: str, doc_id: str, doc_title: str) -> List[Dict[str, Any]]:
    chunks = []
    sections = re.split(r"\\n(?=[A-Z][\\w\\s]*:)", text)
    for i, section in enumerate(sections):
        section = section.strip()
        if len(section) > 50:
            chunks.append({{
                "chunk_id": f"{{doc_id}}__html{{i}}",
                "doc_id": doc_id,
                "doc_title": doc_title,
                "section_heading": section[:80],
                "source_tier": 3,
                "text": section[:2000]
            }})
    return chunks
''')

# embeddings.py
write_file("embeddings.py", '''import os
import logging
from typing import List

logger = logging.getLogger("tvpl_downloader.rag.embeddings")

_client = None

def get_client():
    global _client
    if _client is None:
        from openai import OpenAI
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not set. Set it in .env or via POST /api/qa/config")
        _client = OpenAI(api_key=api_key)
    return _client

def get_embedding(text: str, model: str = "text-embedding-3-small") -> List[float]:
    client = get_client()
    response = client.embeddings.create(model=model, input=text)
    return response.data[0].embedding

def get_embeddings_batch(texts: List[str], model: str = "text-embedding-3-small") -> List[List[float]]:
    client = get_client()
    all_embeddings = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        response = client.embeddings.create(model=model, input=batch)
        batch_embeddings = [item.embedding for item in response.data]
        all_embeddings.extend(batch_embeddings)
        logger.info(f"Embedded batch {i//batch_size + 1} ({len(batch)} texts)")
    return all_embeddings
''')

# vector_store.py
write_file("vector_store.py", '''import os
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
''')

# bm25_store.py
write_file("bm25_store.py", '''import os
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
        from underthesea import word_segment
        return word_segment(text).split()
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
''')

# hybrid_retriever.py
write_file("hybrid_retriever.py", '''import logging
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
''')

# rag_pipeline.py
write_file("rag_pipeline.py", '''import os
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
    api_key_set = bool(os.environ.get("OPENAI_API_KEY"))
    return {
        "indexed": vs_status["indexed"],
        "total_chunks": vs_status["total_chunks"],
        "configured": api_key_set,
        "embedding_model": "text-embedding-3-small",
        "llm_model": "gpt-4o"
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
    api_key = os.environ.get("OPENAI_API_KEY")
    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        temperature=0.2,
        max_tokens=1024
    )
    answer = response.choices[0].message.content
    return {
        "success": True,
        "answer": answer,
        "sources": sources,
        "model": "gpt-4o",
        "chunks_used": len(retrieved)
    }
''')

print("All service files created!")
