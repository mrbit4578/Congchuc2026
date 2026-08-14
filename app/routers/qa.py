import os
import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict

logger = logging.getLogger("tvpl_downloader.rag.qa")

router = APIRouter()

class QARequest(BaseModel):
    question: str
    top_k: int = 5
    history: Optional[List[Dict[str, str]]] = None

class ConfigRequest(BaseModel):
    gemini_api_key: str

def _ensure_initialized():
    from app.services import rag_pipeline
    status = rag_pipeline.get_status()
    if not status["indexed"]:
        rag_pipeline.initialize()

@router.post("/qa")
def qa_endpoint(req: QARequest):
    try:
        _ensure_initialized()
        from app.services.rag_pipeline import answer_question
        result = answer_question(req.question, top_k=req.top_k, history=req.history)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"QA error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/qa/status")
def qa_status():
    from app.services.rag_pipeline import get_status
    return get_status()

@router.post("/qa/config")
def qa_config(req: ConfigRequest):
    os.environ["GEMINI_API_KEY"] = req.gemini_api_key
    env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
    try:
        with open(env_path, "w") as f:
            f.write(f"GEMINI_API_KEY={req.gemini_api_key}\n")
    except Exception as e:
        logger.warning(f"Could not write .env file: {e}")
    from app.services import embeddings
    embeddings._client = None
    return {"success": True, "message": "Da luu Gemini API key."}

@router.post("/qa/reindex")
def qa_reindex(bg: BackgroundTasks):
    def do_reindex():
        from app.services import vector_store, bm25_store, rag_pipeline
        vector_store.clear()
        bm25_store.clear()
        rag_pipeline.initialize()
    bg.add_task(do_reindex)
    return {"success": True, "message": "Da bat dau xay dung lai chi muc..."}
