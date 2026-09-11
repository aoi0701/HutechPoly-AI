"""
Mô-đun định nghĩa khuôn mẫu dữ liệu (Pydantic Schemas) cho phân hệ Text-to-Speech (TTS)
dựa trên công nghệ Microsoft Edge-TTS phục vụ dự án HutechPoly-AI.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class TTSVoiceInfo(BaseModel):
    """
    Thông tin chi tiết của một giọng đọc bản ngữ.
    """
    voice_id: str = Field(
        ...,
        description="Mã định danh của giọng đọc (ví dụ: en-US-JennyNeural, ja-JP-NanamiNeural)",
        examples=["en-US-JennyNeural"]
    )
    name: str = Field(
        ...,
        description="Tên thân thiện của nhân vật giọng đọc",
        examples=["Jenny (Nữ - Tiếng Anh Mỹ)"]
    )
    gender: str = Field(
        ...,
        description="Giới tính ('female' hoặc 'male')",
        examples=["female"]
    )
    language_code: str = Field(
        ...,
        description="Mã ngôn ngữ ISO ('en', 'ja', 'ko', 'vi')",
        examples=["en", "ja", "ko", "vi"]
    )
    faculty: str = Field(
        ...,
        description="Khoa / Viện thụ hưởng tại Trường Đại học HUTECH",
        examples=["Khoa Ngoại ngữ", "Viện VJIT", "Viện Việt - Hàn"]
    )
    description: str = Field(
        ...,
        description="Mô tả đặc điểm ngữ điệu của giọng đọc",
        examples=["Giọng nữ chuẩn Anh - Mỹ, tự nhiên và phát âm rõ ràng"]
    )

    model_config = ConfigDict(extra="ignore")


class TTSVoicesResponse(BaseModel):
    """
    Khuôn mẫu danh sách các giọng đọc được hỗ trợ trong hệ thống.
    """
    total: int = Field(..., description="Tổng số giọng đọc hỗ trợ")
    voices: List[TTSVoiceInfo] = Field(..., description="Danh sách các giọng đọc")


class TTSRequest(BaseModel):
    """
    Khuôn mẫu yêu cầu tổng hợp tiếng nói từ văn bản (POST /api/tts/synthesize).
    """
    text: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Đoạn văn bản cần chuyển đổi thành giọng nói",
        examples=["Hello! Welcome to HUTECH University. How can I help you today?"]
    )
    language_code: Optional[str] = Field(
        default="en",
        description="Mã ngôn ngữ đích ('en', 'ja', 'ko', 'vi'). Mặc định là 'en'",
        examples=["en", "ja", "ko"]
    )
    voice: Optional[str] = Field(
        default=None,
        description="Chỉ định cụ thể voice_id (ví dụ: en-US-JennyNeural). Nếu để trống, hệ thống sẽ tự chọn theo language_code và gender.",
        examples=["en-US-JennyNeural", "ja-JP-NanamiNeural", "ko-KR-SunHiNeural"]
    )
    gender: Optional[str] = Field(
        default="female",
        description="Giới tính giọng đọc ưu tiên ('female' hoặc 'male'). Mặc định là 'female'",
        examples=["female", "male"]
    )
    rate: Optional[str] = Field(
        default="+0%",
        description="Tùy chỉnh tốc độ đọc (ví dụ: '-10%' để đọc chậm cho sinh viên mới bắt đầu, '+0%' bình thường)",
        examples=["+0%", "-10%", "+10%"]
    )
    pitch: Optional[str] = Field(
        default="+0Hz",
        description="Tùy chỉnh cao độ giọng nói",
        examples=["+0Hz", "-5Hz", "+5Hz"]
    )

    model_config = ConfigDict(extra="ignore")
