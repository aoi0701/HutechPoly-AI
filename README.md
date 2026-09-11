# HutechPoly-AI

> **Hệ Thống Luyện Phản Xạ Hội Thoại Thông Minh - ĐH HUTECH**  
> Đồ án tốt nghiệp CNTT • Khóa luận hiến tặng Trường Đại học Công nghệ TP.HCM (HUTECH)  
> Hỗ trợ 3 Khoa/Viện: Khoa Ngoại ngữ (Tiếng Anh), Viện VJIT (Tiếng Nhật), Viện Việt - Hàn (Tiếng Hàn).

---

## 1. KIẾN TRÚC HỆ THỐNG TÓM TẮT

* **Frontend & Mobile:** Next.js 15 (React 19 App Router), TypeScript, Tailwind CSS, shadcn/ui. Đóng gói đa nền tảng bằng Capacitor 7 (Android native APK) và Progressive Web App (iOS PWA).
* **Backend Gateway:** FastAPI (Python 3.11+) xử lý kết nối song công qua WebSockets, quản lý connection pool và bộ đệm âm thanh thời gian thực.
* **AI Core Engine:** Google Gemini 2.5 Flash SDK (quản lý context 8 turns, cơ chế song ngữ bí từ nói tiếng Việt $\rightarrow$ phản hồi ngoại ngữ kèm gợi ý, ép chuẩn JSON).
* **Voice Pipeline:** Deepgram Nova-2 / Whisper (STT) + Microsoft Edge TTS (`edge-tts` giọng bản ngữ US/JP/KR).
* **Cloud Storage & Database:** Supabase (PostgreSQL), xác thực tài khoản sinh viên `@hutech.edu.vn`.

---

## 2. CẤU TRÚC THƯ MỤC MONOREPO

```text
HutechPoly-AI/
├── frontend/             # Ứng dụng Next.js 15, giao diện Tailwind CSS & Capacitor
├── backend/              # Dịch vụ FastAPI, WebSocket server, STT, TTS & Gemini Core
├── docs/                 # Tài liệu đặc tả (SRS), thiết kế UML và bản thảo khóa luận
├── .env.example          # Biến môi trường mẫu cho toàn bộ hệ thống
├── .gitignore            # Cấu hình bỏ qua tệp tin rác cho cả Node.js & Python
├── PROJECT_RULES.md      # Quy chuẩn kiến trúc, thương hiệu HUTECH & cơ chế song ngữ
├── ROADMAP.md            # Lộ trình 12 tuần (32 tasks) & Ma trận 24 chủ đề đàm thoại
└── README.md             # Tài liệu tổng quan dự án
```

---

## 3. HƯỚNG DẪN KHỞI ĐỘNG SƠ BỘ

### Bước 1: Thiết lập biến môi trường
Tạo file `.env` từ file mẫu tại thư mục gốc:
```bash
cp .env.example .env
```
Cập nhật các khóa API: `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DEEPGRAM_API_KEY`.

### Bước 2: Khởi chạy Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Kích hoạt môi trường ảo:
# Trên Windows:
.\venv\Scripts\activate
# Trên macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
Backend API & WebSocket sẽ sẵn sàng tại `http://localhost:8000` và `ws://localhost:8000/ws`.

### Bước 3: Khởi chạy Frontend (Next.js 15)
```bash
cd frontend
npm install
npm run dev
```
Truy cập giao diện tại `http://localhost:3000`.

---

## 4. TÀI LIỆU QUẢN TRỊ DỰ ÁN
* Tham khảo tiêu chuẩn kỹ thuật tại [PROJECT_RULES.md](file:///E:/HutechPoly-AI/PROJECT_RULES.md).
* Theo dõi tiến độ 12 tuần và 24 chủ đề tại [ROADMAP.md](file:///E:/HutechPoly-AI/ROADMAP.md).
