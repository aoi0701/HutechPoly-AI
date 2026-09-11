"""
Tập tin khởi chạy chính (Main Entrypoint) cho dịch vụ Backend FastAPI của dự án HutechPoly-AI.
Cấu hình máy chủ, chính sách CORS, quản lý tuyến đường (routes) và điểm kiểm tra trạng thái hoạt động.
"""

from datetime import datetime, timezone
import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Nạp đối tượng cài đặt hệ thống và tuyến đường WebSocket
from app.core.config import settings
from app.api.endpoints.websocket import router as websocket_router

# Thiết lập định dạng ghi nhật ký hệ thống (Logging)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("hutechpoly.main")

# Khởi tạo ứng dụng FastAPI với đầy đủ siêu dữ liệu (metadata) của đồ án tốt nghiệp HUTECH
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Hệ thống Cổng API và WebSocket luyện phản xạ đa ngữ thời gian thực dành cho sinh viên HUTECH",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Cấu hình Middleware kiểm soát chia sẻ tài nguyên nguồn gốc chéo (CORS)
# Đảm bảo giao diện Next.js chạy tại http://localhost:3000 kết nối ổn định và an toàn
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các tuyến đường kết nối WebSocket vào ứng dụng chính
app.include_router(websocket_router)


@app.get("/health", tags=["Kiểm tra hệ thống"])
async def health_check():
    """
    Điểm cuối kiểm tra trạng thái hoạt động (Health Check Endpoint).
    Cho phép hệ thống giám sát và sinh viên kiểm tra tình trạng sống của Backend.
    """
    return {
        "status": "ok",
        "app": "HutechPoly-AI",
        "version": settings.APP_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "gemini_model": settings.GEMINI_MODEL,
        "environment": settings.ENV,
    }


# Khối thực thi trực tiếp khi chạy lệnh python main.py
if __name__ == "__main__":
    logger.info(f"Đang khởi động máy chủ {settings.APP_NAME} tại địa chỉ {settings.BACKEND_HOST}:{settings.BACKEND_PORT}")
    uvicorn.run(
        "main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=settings.DEBUG,
    )
