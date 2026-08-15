# Hướng dẫn cấu hình tính năng Hỏi đáp trên Vercel

## Bước 1: Cấu hình Environment Variable trên Vercel

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `congchuc2026`
3. Vào tab **Settings** → **Environment Variables**
4. Thêm environment variable mới:
   - **Name**: `DASHSCOPE_API_KEY`
   - **Value**: API key của bạn từ DashScope (Alibaba Cloud)
   - **Environments**: Chọn **Production**, **Preview**, và **Development**

## Bước 2: Lấy API Key từ DashScope

Nếu bạn chưa có API key:

1. Đăng ký tài khoản tại [DashScope Console](https://dashscope.console.aliyun.com/)
2. Sau khi đăng nhập, vào phần **API Key Management**
3. Tạo mới API key hoặc sử dụng API key có sẵn
4. Copy API key và dán vào environment variable ở Bước 1

## Bước 3: Redeploy project

Sau khi cấu hình environment variable:

1. Vào tab **Deployments** trong project Vercel
2. Chọn deployment mới nhất → click vào **...** (menu)
3. Chọn **Redeploy**
4. Đợi quá trình redeploy hoàn tất

## Bước 4: Kiểm tra tính năng Hỏi đáp

1. Truy cập https://congchuc2026.vercel.app/
2. Vào trang **Hỏi đáp** (hoặc trực tiếp: https://congchuc2026.vercel.app/hoi-dap)
3. Thử đặt câu hỏi về pháp luật viên chức
4. Kiểm tra xem hệ thống có trả lời được không

## Lưu ý quan trọng

- **Environment Variable**: Bắt buộc phải cấu hình `DASHSCOPE_API_KEY` thì tính năng hỏi đáp mới hoạt động
- **API Cost**: DashScope có thể tính phí theo số lượng request, hãy kiểm tra pricing trước khi sử dụng
- **CORS**: Đã cấu hình CORS trong API để hỗ trợ gọi từ frontend
- **Rate Limiting**: Nếu cần, có thể thêm rate limiting để tránh滥用 API

## Xử lý lỗi thường gặp

### Lỗi "DASHSCOPE_API_KEY not configured"
- Giải pháp: Kiểm tra lại environment variable trên Vercel và redeploy

### Lỗi "LLM API error"
- Giải pháp: Kiểm tra API key có hợp lệ không, tài khoản DashScope có đủ quyền hạn không

### Lỗi "Method not allowed"
- Giải pháp: Đã fix trong code mới, đảm bảo redeploy với version mới nhất

### Lỗi CORS
- Giải pháp: Đã thêm CORS headers vào API, redeploy để áp dụng thay đổi

## Cấu trúc file đã thay đổi

1. **vercel.json**: Thêm rewrite rule cho `/api/*` routes
2. **api/qa.js**: Thêm CORS headers và improve error handling

Sau khi làm theo các bước này, tính năng hỏi đáp sẽ hoạt động trên Vercel!