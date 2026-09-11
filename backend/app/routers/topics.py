"""
Bộ định tuyến API quản lý danh mục chủ đề đàm thoại phản xạ (Topics Router).
Cung cấp các điểm cuối truy vấn danh sách 24 chủ đề (có hỗ trợ lọc theo ngôn ngữ, độ khó)
và lấy chi tiết thông tin chủ đề phục vụ giao diện Topic Grid và phòng thoại Voice Room.
"""

import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field, ConfigDict

from app.core.supabase import get_supabase_client

# Thiết lập bộ ghi log riêng cho Router chủ đề
logger = logging.getLogger("hutechpoly.routers.topics")

router = APIRouter()

# Bảng ánh xạ độ khó giữa quy ước người dùng (beginner/intermediate/advanced) và database (easy/medium/hard)
LEVEL_MAPPING = {
    "beginner": "easy",
    "intermediate": "medium",
    "advanced": "hard",
    "easy": "easy",
    "medium": "medium",
    "hard": "hard",
    "dễ": "easy",
    "vừa": "medium",
    "nâng cao": "hard",
}


# =============================================================================
# CÁC PYDANTIC RESPONSE MODELS (ĐỊNH NGHĨA KHUÔN MẪU DỮ LIỆU ĐẦU RA)
# =============================================================================

class VocabItem(BaseModel):
    """
    Khuôn mẫu dữ liệu cho một từ vựng trọng tâm trong chủ đề.
    Hỗ trợ linh hoạt cho cả tiếng Anh (IPA), tiếng Nhật (<ruby>), và tiếng Hàn (Romaja, Kính ngữ).
    """
    word: Optional[str] = Field(None, description="Từ vựng (Tiếng Anh)")
    ipa: Optional[str] = Field(None, description="Ký hiệu phiên âm quốc tế IPA")
    part_of_speech: Optional[str] = Field(None, description="Từ loại (noun, verb, adj...)")
    word_ruby: Optional[str] = Field(None, description="Chữ Hán bọc thẻ HTML <ruby> (Tiếng Nhật)")
    romaji: Optional[str] = Field(None, description="Phiên âm Latinh Romaji (Tiếng Nhật)")
    hangeul: Optional[str] = Field(None, description="Từ viết bằng chữ Hangeul (Tiếng Hàn)")
    romaja: Optional[str] = Field(None, description="Phiên âm Latinh Romaja (Tiếng Hàn)")
    honorific_type: Optional[str] = Field(None, description="Loại kính ngữ/phong cách câu (Tiếng Hàn)")
    meaning_vi: Optional[str] = Field(None, description="Ý nghĩa dịch sang tiếng Việt")

    model_config = ConfigDict(extra="allow")


class TopicResponse(BaseModel):
    """
    Khuôn mẫu dữ liệu chi tiết của một chủ đề phản xạ đàm thoại.
    """
    id: Optional[str] = Field(None, description="Khóa chính UUID của chủ đề trong Supabase")
    topic_code: str = Field(..., description="Mã định danh duy nhất (ví dụ: ENG-T01, JPN-T01, KOR-T01)")
    language: str = Field(..., description="Ngôn ngữ mục tiêu (en: Anh, ja: Nhật, ko: Hàn)")
    faculty: str = Field(..., description="Khoa/Viện phụ trách tại Đại học HUTECH")
    level: str = Field(..., description="Cấp độ khó của chủ đề (easy, medium, hard)")
    title_vi: str = Field(..., description="Tên chủ đề dịch sang tiếng Việt")
    title_native: str = Field(..., description="Tên chủ đề bằng ngôn ngữ bản xứ")
    category: str = Field(..., description="Nhóm chủ đề (Đời sống, Ẩm thực, Học thuật HUTECH...)")
    ai_persona: str = Field(..., description="Vai trò và nhân cách hóa của AI khi đàm thoại")
    opening_line: str = Field(..., description="Câu chào mào đầu dẫn dắt người học của AI")
    system_instruction: Optional[str] = Field(None, description="Chỉ dẫn hệ thống cho bộ não Gemini")
    key_vocab: List[Dict[str, Any]] = Field(default_factory=list, description="Danh sách từ vựng gợi ý kèm tính năng học thuật")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Thông tin mở rộng bổ trợ")
    is_active: bool = Field(True, description="Trạng thái kích hoạt chủ đề")
    created_at: Optional[str] = Field(None, description="Thời gian tạo bản ghi")

    model_config = ConfigDict(from_attributes=True)


class TopicListResponse(BaseModel):
    """
    Khuôn mẫu phản hồi cho danh sách chủ đề kèm tổng số lượng bản ghi.
    """
    total: int = Field(..., description="Tổng số lượng chủ đề phù hợp với bộ lọc")
    items: List[TopicResponse] = Field(..., description="Danh sách chi tiết các chủ đề")


# =============================================================================
# CÁC ENDPOINT ĐIỀU HƯỚNG NGHIỆP VỤ (API ENDPOINTS)
# =============================================================================

@router.get(
    "",
    response_model=TopicListResponse,
    summary="Lấy danh sách toàn bộ chủ đề phản xạ",
    description="Truy vấn danh sách 24 chủ đề từ cơ sở dữ liệu Supabase. Hỗ trợ tham số lọc theo ngôn ngữ và độ khó.",
)
async def get_all_topics(
    language: Optional[str] = Query(
        None,
        description="Lọc theo ngôn ngữ: 'EN', 'JA', 'KO' (không phân biệt chữ hoa/thường)",
        examples=["EN", "ja", "ko"],
    ),
    difficulty: Optional[str] = Query(
        None,
        description="Lọc theo cấp độ: 'beginner', 'intermediate', 'advanced' hoặc 'easy', 'medium', 'hard'",
        examples=["beginner", "intermediate", "advanced", "easy", "medium", "hard"],
    ),
):
    """
    Endpoint: GET /api/topics
    Trả về danh sách các chủ đề đàm thoại đang được kích hoạt (is_active = True).
    """
    try:
        supabase = get_supabase_client()
        query = supabase.table("topics").select("*").eq("is_active", True)

        # 1. Lọc theo ngôn ngữ (chuẩn hóa về chữ thường: en, ja, ko)
        if language:
            clean_lang = language.strip().lower()
            query = query.eq("language", clean_lang)
            logger.info(f"Đang áp dụng bộ lọc ngôn ngữ: {clean_lang}")

        # 2. Lọc theo độ khó (ánh xạ sang: easy, medium, hard)
        if difficulty:
            clean_diff = difficulty.strip().lower()
            mapped_level = LEVEL_MAPPING.get(clean_diff, clean_diff)
            query = query.eq("level", mapped_level)
            logger.info(f"Đang áp dụng bộ lọc cấp độ: {mapped_level} (từ '{difficulty}')")

        # 3. Sắp xếp danh sách theo thứ tự mã chủ đề tăng dần (ENG-T01 -> JPN-T01 -> KOR-T01)
        response = query.order("topic_code", desc=False).execute()
        topics_data = response.data or []

        return TopicListResponse(
            total=len(topics_data),
            items=topics_data,
        )

    except Exception as exc:
        logger.error(f"Lỗi khi truy vấn danh sách chủ đề từ Supabase: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi tải danh sách chủ đề: {str(exc)}",
        )


@router.get(
    "/{topic_code}",
    response_model=TopicResponse,
    summary="Lấy chi tiết một chủ đề theo mã định danh",
    description="Tra cứu thông tin chi tiết một chủ đề đàm thoại bằng mã topic_code (ví dụ: ENG-T01, JPN-T03).",
)
async def get_topic_by_code(topic_code: str):
    """
    Endpoint: GET /api/topics/{topic_code}
    Trả về chi tiết 1 chủ đề hoặc ném mã lỗi 404 nếu không tìm thấy.
    """
    clean_code = topic_code.strip().upper()
    try:
        supabase = get_supabase_client()
        # Thử tìm kiếm theo mã in hoa chuẩn
        response = supabase.table("topics").select("*").eq("topic_code", clean_code).execute()

        # Nếu không thấy theo chữ in hoa, thử tìm lại với chuỗi gốc
        if not response.data:
            response = supabase.table("topics").select("*").eq("topic_code", topic_code.strip()).execute()

        if not response.data:
            logger.warning(f"Không tìm thấy chủ đề nào có mã: {topic_code}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy chủ đề với mã định danh: '{topic_code}'",
            )

        # Lấy bản ghi đầu tiên khớp với mã
        topic_item = response.data[0]
        return TopicResponse(**topic_item)

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Lỗi khi lấy thông tin chi tiết chủ đề {topic_code}: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi hệ thống khi tải chi tiết chủ đề: {str(exc)}",
        )
