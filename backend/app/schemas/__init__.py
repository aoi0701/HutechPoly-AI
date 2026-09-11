"""
Gói khuôn mẫu dữ liệu (Schemas Package) cho dự án HutechPoly-AI.
"""
from app.schemas.chat import ChatRequest, ChatResponse, ChatTurn
from app.schemas.tts import TTSRequest, TTSVoiceInfo, TTSVoicesResponse

__all__ = ["ChatRequest", "ChatResponse", "ChatTurn", "TTSRequest", "TTSVoiceInfo", "TTSVoicesResponse"]
