"""
Mô-đun quản lý kết nối tập trung đến cơ sở dữ liệu Supabase cho dự án HutechPoly-AI.
Cung cấp Client an toàn (sử dụng anon key) cho các tác vụ đọc dữ liệu công khai (chủ đề, tài liệu)
và Client quản trị (sử dụng service_role key) khi cần các quyền đặc quyền.
"""

import logging
from typing import Optional
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger("hutechpoly.supabase")

# Biến lưu trữ Singleton các Client kết nối Supabase
_supabase_client: Optional[Client] = None
_supabase_admin_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Khởi tạo hoặc trả về Client Supabase an toàn (sử dụng Anon Key công khai).
    Thích hợp cho việc đọc danh mục chủ đề theo chính sách RLS (Row Level Security).
    """
    global _supabase_client

    if _supabase_client is not None:
        return _supabase_client

    url = settings.SUPABASE_URL
    key = settings.effective_supabase_anon_key

    if not url or not key:
        logger.warning(
            "Chưa cấu hình SUPABASE_URL hoặc SUPABASE_ANON_KEY trong file .env. "
            "Các thao tác tương tác dữ liệu có thể phát sinh lỗi."
        )

    try:
        _supabase_client = create_client(url, key)
        logger.info("Khởi tạo thành công Supabase Client (Anon Mode) an toàn.")
        return _supabase_client
    except Exception as exc:
        logger.error(f"Lỗi khi khởi tạo Supabase Client: {exc}", exc_info=True)
        raise RuntimeError(f"Không thể kết nối Supabase: {exc}") from exc


def get_supabase_admin_client() -> Client:
    """
    Khởi tạo hoặc trả về Client Supabase với quyền quản trị (Service Role Key).
    Dùng cho các tác vụ nội bộ của hệ thống cần bypass Row Level Security.
    """
    global _supabase_admin_client

    if _supabase_admin_client is not None:
        return _supabase_admin_client

    url = settings.SUPABASE_URL
    key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.effective_supabase_anon_key

    try:
        _supabase_admin_client = create_client(url, key)
        logger.info("Khởi tạo thành công Supabase Admin Client (Service Role Mode).")
        return _supabase_admin_client
    except Exception as exc:
        logger.error(f"Lỗi khi khởi tạo Supabase Admin Client: {exc}", exc_info=True)
        raise RuntimeError(f"Không thể kết nối Supabase Admin: {exc}") from exc
