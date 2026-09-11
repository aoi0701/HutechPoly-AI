"""
Mô-đun cấu hình và quản lý biến môi trường cho dự án HutechPoly-AI.
Sử dụng thư viện pydantic-settings để nạp và kiểm tra dữ liệu từ file .env.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Lớp lưu trữ toàn bộ cấu hình hệ thống Backend.
    Tự động đọc các biến môi trường từ hệ thống hoặc các file .env tương ứng.
    """

    # --- Thông tin chung của ứng dụng ---
    APP_NAME: str = "HutechPoly-AI API"
    APP_VERSION: str = "1.0.0"
    ENV: str = "development"
    DEBUG: bool = True

    # --- Cấu hình cổng và địa chỉ mạng ---
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000

    # --- Cấu hình CORS (Cho phép giao tiếp với Frontend) ---
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:8000,http://127.0.0.1:3000,http://127.0.0.1:8000"

    # --- Cấu hình Trí tuệ nhân tạo (Google Gemini 2.5 Flash) ---
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # --- Cấu hình Nhận diện giọng nói (STT: Deepgram / Whisper) ---
    DEEPGRAM_API_KEY: str = ""

    # --- Cấu hình Cơ sở dữ liệu đám mây (Supabase PostgreSQL) ---
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # --- Cấu hình nạp file môi trường của Pydantic ---
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    @property
    def cors_origins(self) -> List[str]:
        """
        Chuyển đổi chuỗi ALLOWED_ORIGINS (phân cách bằng dấu phẩy) thành danh sách các địa chỉ URL hợp lệ.
        Mặc định cho phép cổng 3000 của Frontend Next.js.
        """
        if not self.ALLOWED_ORIGINS:
            return ["http://localhost:3000"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]


# Khởi tạo đối tượng cấu hình dùng chung (Singleton) cho toàn hệ thống
settings = Settings()
