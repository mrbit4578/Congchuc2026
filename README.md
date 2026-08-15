# Ôn thi Viên chức 2026

Website ôn thi viên chức với kho tài liệu Vòng 1, Vòng 2, nghiệp vụ kế toán, bài kiểm tra, lộ trình học, Hỏi đáp và Hỏi/Đáp AI.

## Hỏi/Đáp AI theo RAG

Trang `/hoi-dap-ai` sử dụng kiến trúc **Hybrid RAG** ở mức ứng dụng:

1. API server nhận câu hỏi từ giao diện và không gửi API key xuống trình duyệt.
2. Bộ truy xuất cục bộ xếp hạng nội dung trong `src/data/qa.js` bằng kết hợp khớp cụm từ, khớp câu hỏi/thẻ và độ chồng lấp từ khóa.
3. Các đoạn liên quan được đưa vào prompt cùng yêu cầu AI chỉ trả lời dựa trên tư liệu được truy xuất.
4. Giao diện hiển thị câu trả lời và các nguồn `[1]`, `[2]` đã sử dụng.

## Chạy local

```bash
npm install
cp .env.example .env.local
# Điền DASHSCOPE_API_KEY vào .env.local, không commit file này.
npm run dev
```

Trong Vercel, vào **Project Settings → Environment Variables** và thêm:

| Tên | Giá trị |
| --- | --- |
| `DASHSCOPE_API_KEY` | API key Model Studio/DashScope của bạn |
| `DASHSCOPE_MODEL` | `qwen-plus` hoặc model bạn được cấp quyền |
| `DASHSCOPE_BASE_URL` | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |

Sau khi lưu biến môi trường, hãy tạo một deployment mới hoặc redeploy để Vercel nạp cấu hình. API function nằm tại `api/ask-ai.js`; giao diện nằm tại `src/pages/AiQA.jsx`.

## Lưu ý bảo mật

Không đặt API key trong `VITE_*`, mã React, `src/` hoặc GitHub. Key đã từng được chia sẻ trong cuộc trò chuyện nên nên **thu hồi/rotate key đó và tạo key mới** trước khi đưa lên môi trường production. Với câu hỏi pháp lý hoặc tuyển dụng thực tế, người dùng vẫn cần đối chiếu văn bản và thông báo chính thức.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
