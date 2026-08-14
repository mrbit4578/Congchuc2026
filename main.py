import os
import sys

# Force UTF-8 stdout encoding for Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

import argparse
import logging
from tvpl_downloader.browser import interactive_login
from tvpl_downloader.downloader import DownloaderEngine

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s: %(message)s")

CONGCHUC_URLS = [
    "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-dinh-60-2021-ND-CP-co-che-tu-chu-tai-chinh-cua-don-vi-su-nghiep-cong-lap-478766.aspx",
    "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Luat-Vien-chuc-2025-so-129-2025-QH15-675261.aspx",
    "https://thuvienphapluat.vn/van-ban/bo-may-hanh-chinh/luat-to-chuc-chinh-quyen-dia-phuong-2025-so-72-2025-qh15-649675.aspx",
    "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-dinh-232-2026-ND-CP-vi-tri-viec-lam-vien-chuc-712592.aspx",
    "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Van-ban-hop-nhat-52-VBHN-VPQH-2025-Hien-phap-nuoc-Cong-hoa-xa-hoi-chu-nghia-Viet-Nam-665872.aspx",
    "https://thuvienphapluat.vn/van-ban/Cong-nghe-thong-tin/Nghi-quyet-57-NQ-TW-2024-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-637245.aspx",
    "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-quyet-202-2025-QH15-sap-xep-don-vi-hanh-chinh-cap-tinh-648951.aspx",
    "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-quyet-1685-NQ-UBTVQH15-2025-sap-xep-cac-don-vi-hanh-chinh-cap-xa-Ho-Chi-Minh-661124.aspx",
    "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-quyet-98-2023-QH15-thi-diem-co-che-chinh-sach-dac-thu-phat-trien-Ho-Chi-Minh-571833.aspx",
    "https://thuvienphapluat.vn/van-ban/Ke-toan-Kiem-toan/Thong-tu-24-2024-TT-BTC-huong-dan-Che-do-ke-toan-hanh-chinh-su-nghiep-587876.aspx",
    "https://thuvienphapluat.vn/van-ban/Ke-toan-Kiem-toan/Luat-ke-toan-2015-298369.aspx",
    "https://thuvienphapluat.vn/van-ban/Ke-toan-Kiem-toan/Nghi-dinh-174-2016-ND-CP-huong-Luat-ke-toan-336391.aspx",
    "https://thuvienphapluat.vn/van-ban/Thue-Phi-Le-Phi/Luat-sua-doi-Luat-Chung-khoan-Ke-toan-Ngan-sach-Nha-nuoc-Thue-thu-nhap-ca-nhan-2024-622318.aspx",
    "https://thuvienphapluat.vn/van-ban/Tai-chinh-nha-nuoc/Luat-ngan-sach-nha-nuoc-2025-so-89-2025-QH15-650061.aspx",
    "https://thuvienphapluat.vn/van-ban/Tai-chinh-nha-nuoc/Nghi-dinh-73-2026-N%C3%90-CP-huong-dan-Luat-Ngan-sach-nha-nuoc-697216.aspx",
    "https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Nghi-dinh-111-2025-ND-CP-sua-doi-Nghi-dinh-60-2021-ND-CP-co-che-tu-chu-tai-chinh-don-vi-cong-lap-588880.aspx",
    "https://thuvienphapluat.vn/van-ban/Ke-toan-Kiem-toan/Thong-tu-66-2024-TT-BTC-tieu-chuan-chuyen-mon-nghiep-vu-chuc-danh-nghe-nghiep-chuyen-nganh-ke-toan-624427.aspx",
]

def main():
    parser = argparse.ArgumentParser(description="ThuVienPhapLuat Legal Document Downloader CLI")
    subparsers = parser.add_subparsers(dest="command", help="Sub-command to execute")

    # Command: download
    download_parser = subparsers.add_parser("download", help="Download a document from URL")
    download_parser.add_argument("url", type=str, help="Document URL on thuvienphapluat.vn")
    download_parser.add_argument("--headless", action="store_true", help="Run browser in headless mode (default is headful for Cloudflare bypass)")
    download_parser.add_argument("--out", type=str, default="public/downloads", help="Output directory")

    # Command: batch
    batch_parser = subparsers.add_parser("batch", help="Download all legal documents for Congchuc2026 dataset")
    batch_parser.add_argument("--headless", action="store_true", help="Run browser in headless mode")

    # Command: login
    subparsers.add_parser("login", help="Open browser to log into thuvienphapluat.vn and save cookies")

    # Command: server
    server_parser = subparsers.add_parser("server", help="Start FastAPI web backend server for auto-downloads")
    server_parser.add_argument("--port", type=int, default=8000, help="Port to run server on")

    args = parser.parse_args()

    if args.command == "login":
        interactive_login()
    elif args.command == "download":
        is_headless = args.headless
        engine = DownloaderEngine(headless=is_headless, output_base_dir=args.out)
        res = engine.download_url(args.url)
        print("\n" + "="*50)
        print("[SUCCESS] DỮ LIỆU ĐÃ ĐƯỢC TẢI VỀ THÀNH CÔNG!")
        print(f"📌 Tiêu đề: {res.get('title')}")
        print(f"📌 Số hiệu: {res.get('so_hieu')}")
        print(f"📂 Thư mục: {res.get('directory')}")
        print("📄 File xuất ra:", res.get("exported_files"))
        if res.get("attachments"):
            print("📎 File đính kèm:", res.get("attachments"))
        print("="*50 + "\n")
    elif args.command == "batch":
        print(f"🚀 Bắt đầu tải {len(CONGCHUC_URLS)} văn bản pháp luật...")
        engine = DownloaderEngine(headless=args.headless, output_base_dir="public/downloads")
        results = engine.download_batch(CONGCHUC_URLS)
        print(f"\n[SUCCESS] Hoàn tất tải {len(results)} văn bản!")
    elif args.command == "server":
        import uvicorn
        uvicorn.run("web_app:app", host="0.0.0.0", port=args.port, reload=True)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
