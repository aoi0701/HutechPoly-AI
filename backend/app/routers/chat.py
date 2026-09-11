"""
Bộ định tuyến API xử lý đàm thoại thông minh (Chat & Practice Router).
Cung cấp điểm cuối POST /api/chat phục vụ luồng hội thoại phản xạ đa ngữ thời gian thực.
Tích hợp trí tuệ nhân tạo Google Gemini 2.5 Flash và cơ chế cứu cánh song ngữ Bilingual Fallback.
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, status
from app.core.supabase import get_supabase_client
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.gemini_service import gemini_service

# Thiết lập bộ ghi log riêng cho Router đàm thoại
logger = logging.getLogger("hutechpoly.routers.chat")

router = APIRouter()

# Đường dẫn đến file dữ liệu 24 chủ đề dự phòng (Local Fallback)
SEED_FILE_PATH = Path(__file__).resolve().parent.parent.parent.parent / "docs" / "topics" / "topics_seed.json"


def get_topic_by_code(topic_code: str) -> Optional[Dict[str, Any]]:
    """
    Tìm kiếm thông tin chủ đề theo mã (topic_code).
    Ưu tiên truy vấn trực tiếp từ cơ sở dữ liệu Supabase.
    Nếu có sự cố mạng hoặc chưa kết nối DB, tự động fallback sang đọc file seed cục bộ.
    """
    clean_code = topic_code.strip().upper()

    # 1. Thử truy vấn từ Supabase
    try:
        supabase = get_supabase_client()
        query_res = (
            supabase.table("topics")
            .select("*")
            .eq("topic_code", clean_code)
            .eq("is_active", True)
            .limit(1)
            .execute()
        )
        if query_res.data and len(query_res.data) > 0:
            return query_res.data[0]
    except Exception as db_err:
        logger.warning(f"Không thể truy vấn Supabase ({db_err}). Đang chuyển sang đọc dữ liệu dự phòng từ file seed.")

    # 2. Fallback sang file seed cục bộ
    if SEED_FILE_PATH.exists():
        try:
            with open(SEED_FILE_PATH, "r", encoding="utf-8") as f:
                seed_data = json.load(f)
                for item in seed_data:
                    if item.get("topic_code", "").upper() == clean_code:
                        return item
        except Exception as seed_err:
            logger.error(f"Lỗi khi đọc file seed dự phòng: {seed_err}")

    return None


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Thực hiện lượt đàm thoại phản xạ với Trợ giảng AI",
    description="Gửi câu nói của sinh viên cùng lịch sử đối thoại để nhận phản hồi thông minh, bản dịch đối chiếu và nhận xét sửa lỗi song ngữ từ Gemini 2.5 Flash.",
)
@router.post(
    "/practice/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
async def process_chat_turn(request: ChatRequest) -> ChatResponse:
    """
    Điểm cuối xử lý một lượt đối thoại (Chat Turn):
    - Kiểm tra tính hợp lệ của câu nói và mã chủ đề.
    - Nạp bối cảnh và vai trò Persona từ cơ sở dữ liệu.
    - Gọi mô hình Gemini 2.5 Flash và ép chuẩn cấu trúc JSON.
    - Trả về câu đối thoại, bản dịch tiếng Việt, nhận xét sửa lỗi và câu gợi ý.
    """
    clean_message = request.message.strip()
    if not clean_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lời thoại của sinh viên không được để trống.",
        )

    # 1. Kiểm tra và lấy thông tin chủ đề
    topic_data = get_topic_by_code(request.topic_code)
    if not topic_data:
        logger.warning(f"Không tìm thấy thông tin cho mã chủ đề: '{request.topic_code}'")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy chủ đề với mã '{request.topic_code}'. Vui lòng kiểm tra lại danh mục chủ đề hợp lệ (ví dụ: ENG-T01, JPN-T01, KOR-T01).",
        )

    # 2. Kiểm tra tính sẵn sàng của Gemini Service
    if not gemini_service.is_ready:
        logger.error("GEMINI_API_KEY chưa được cấu hình trong backend/.env.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Dịch vụ AI chưa thể khởi tạo do chưa tìm thấy khóa GEMINI_API_KEY. "
                "Vui lòng truy cập https://aistudio.google.com/apikey để tạo khóa API miễn phí và điền vào file backend/.env."
            ),
        )

    # 3. Tiến hành gọi Gemini 2.5 Flash để sinh câu phản xạ
    try:
        logger.info(
            f"Bắt đầu xử lý lượt thoại cho chủ đề [{request.topic_code}] - Lời thoại: '{clean_message[:50]}...'"
        )
        response = await gemini_service.generate_chat_turn(
            message=clean_message,
            topic=topic_data,
            history=request.history,
        )
        return response

    except RuntimeError as r_err:
        err_msg = str(r_err)
        logger.error(f"Lỗi trong quá trình sinh hội thoại: {err_msg}")
        if "quota" in err_msg.lower() or "rate" in err_msg.lower() or "429" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Hệ thống AI đang tạm thời vượt quá giới hạn tần suất yêu cầu (Rate Limit). Vui lòng thử lại sau vài giây.",
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Không thể xử lý phản hồi từ AI: {err_msg}",
        )
    except Exception as exc:
        logger.error(f"Lỗi không xác định tại router chat: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Phát sinh lỗi nội bộ máy chủ khi đàm thoại: {str(exc)}",
        )
