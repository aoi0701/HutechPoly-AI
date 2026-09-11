"""
Mô-đun định nghĩa khuôn mẫu dữ liệu (Pydantic Schemas) cho phân hệ hội thoại AI phản xạ.
Tuân thủ nghiêm ngặt chuẩn hợp đồng dữ liệu (Response Contract) của dự án HutechPoly-AI.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ChatTurn(BaseModel):
    """
    Khuôn mẫu cho một lượt thoại trong lịch sử hội thoại trước đó.
    """
    role: str = Field(
        ...,
        description="Vai trò người nói trong phiên luyện tập ('user' hoặc 'ai' / 'assistant')",
        examples=["user", "ai"]
    )
    content: str = Field(
        ...,
        description="Nội dung lời thoại của lượt đối thoại đó",
        examples=["Hello, nice to meet you!"]
    )

    model_config = ConfigDict(extra="ignore")


class ChatRequest(BaseModel):
    """
    Khuôn mẫu dữ liệu đầu vào cho yêu cầu đàm thoại luyện phản xạ (POST /api/chat).
    """
    topic_code: str = Field(
        ...,
        description="Mã định danh chủ đề đàm thoại trong hệ thống HUTECH (ví dụ: ENG-T01, JPN-T01, KOR-T01)",
        examples=["ENG-T01", "JPN-T01", "KOR-T01"]
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="Lời thoại mới nhất của sinh viên (hỗ trợ nói chêm tiếng Việt nếu bí từ)",
        examples=["I want to travel to Japan because tôi rất thích ăn sushi và ngắm hoa anh đào."]
    )
    history: Optional[List[ChatTurn]] = Field(
        default_factory=list,
        description="Lịch sử các lượt đối thoại trước đó trong phiên luyện tập (hệ thống sẽ áp dụng cửa sổ trượt 8 lượt gần nhất)"
    )

    model_config = ConfigDict(extra="ignore")


class ChatResponse(BaseModel):
    """
    Khuôn mẫu dữ liệu phản hồi chuẩn hóa (Response Contract) từ trí tuệ nhân tạo Gemini 2.5 Flash.
    """
    ai_message: str = Field(
        ...,
        description="Câu trả lời của AI bằng ngôn ngữ đang học (kèm phiên âm Furigana <ruby> cho tiếng Nhật, Romaja/kính ngữ cho tiếng Hàn nếu cần)"
    )
    vietnamese_translation: str = Field(
        ...,
        description="Bản dịch tiếng Việt của câu thoại AI (hỗ trợ nút bật/tắt bản dịch trên giao diện)"
    )
    feedback: Optional[str] = Field(
        default=None,
        description="Nhận xét sửa lỗi ngữ pháp/từ vựng/kính ngữ song ngữ (nếu sinh viên có lỗi hoặc chêm tiếng Việt), để trống nếu người học nói tốt"
    )
    suggested_replies: List[str] = Field(
        default_factory=list,
        description="Mảng 2-3 câu trả lời mẫu gợi ý bằng ngoại ngữ mục tiêu cho lượt tiếp theo để sinh viên tham khảo khi bí từ"
    )
    vocabulary_hints: Optional[List[str]] = Field(
        default_factory=list,
        description="Danh sách các từ vựng trọng tâm gợi ý thêm kèm nghĩa tiếng Việt"
    )

    model_config = ConfigDict(extra="allow")
