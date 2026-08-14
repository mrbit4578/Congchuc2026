import os
import glob
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from tvpl_downloader.downloader import DownloaderEngine

app = FastAPI(
    title="ThuVienPhapLuat Downloader API",
    description="API cho ứng dụng tự động tải dữ liệu văn bản từ thuvienphapluat.vn",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve downloads directory statically
os.makedirs("public/downloads", exist_ok=True)
app.mount("/downloads", StaticFiles(directory="public/downloads"), name="downloads")

downloader = DownloaderEngine(headless=True, output_base_dir="public/downloads")

class BatchRequest(BaseModel):
    urls: List[str]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "ThuVienPhapLuat Auto Downloader Engine",
        "endpoints": {
            "download_single": "/api/download?url=<URL>",
            "download_batch": "/api/download-batch",
            "list_documents": "/api/documents"
        }
    }

@app.get("/api/download")
def download_single(url: str = Query(..., description="ThuVienPhapLuat document URL")):
    """Downloads a single document from URL and returns direct download file paths."""
    try:
        res = downloader.download_url(url)
        
        # Build public download URLs
        dir_name = os.path.basename(res["directory"])
        files_info = {}
        for fmt, path in res["exported_files"].items():
            fname = os.path.basename(path)
            files_info[fmt] = f"/downloads/{dir_name}/{fname}"
            
        attachment_links = []
        for path in res.get("attachments", []):
            fname = os.path.basename(path)
            attachment_links.append(f"/downloads/{dir_name}/{fname}")
            
        return {
            "success": True,
            "title": res.get("title"),
            "so_hieu": res.get("so_hieu"),
            "exported_files": files_info,
            "attachments": attachment_links,
            "message": "Đã tải dữ liệu văn bản thành công!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/download-batch")
def download_batch_api(req: BatchRequest, background_tasks: BackgroundTasks):
    """Triggers batch document downloading in background."""
    background_tasks.add_task(downloader.download_batch, req.urls)
    return {
        "success": True,
        "message": f"Đã bắt đầu tiến trình tải {len(req.urls)} văn bản trong nền."
    }

@app.get("/api/documents")
def list_documents():
    """Lists all locally downloaded document folders and files."""
    docs = []
    base_dir = "public/downloads"
    if os.path.exists(base_dir):
        for item in os.listdir(base_dir):
            item_path = os.path.join(base_dir, item)
            if os.path.isdir(item_path) and not item.startswith("_"):
                files = os.listdir(item_path)
                docs.append({
                    "folder": item,
                    "files": [f"/downloads/{item}/{f}" for f in files]
                })
    return {"documents": docs}
