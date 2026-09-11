"""
Định tuyến API (FastAPI Router) cho phân hệ chuyển đổi văn bản thành giọng nói (Text-to-Speech).
Cung cấp endpoint streaming âm thanh MP3 chuẩn bản xứ cho 3 Khoa/Viện HUTECH.
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse

from app.schemas.tts import TTSRequest, TTSVoicesResponse
from app.services.tts_service import (
    get_supported_voices,
    resolve_voice,
    stream_audio_chunks,
    clean_text_for_tts,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/tts",
    tags=["Text-to-Speech (TTS)"],
    responses={
        400: {"description": "Dữ liệu yêu cầu không hợp lệ (văn bản rỗng hoặc sai định dạng)"},
        500: {"description": "Lỗi nội bộ hệ thống trong quá trình tổng hợp giọng nói"},
        503: {"description": "Dịch vụ Edge-TTS tạm thời không khả dụng"}
    }
)


@router.get(
    "/voices",
    response_model=TTSVoicesResponse,
    summary="Lấy danh mục giọng đọc bản ngữ",
    description="Trả về danh sách toàn bộ các giọng đọc chuẩn bản ngữ hỗ trợ 3 Khoa/Viện HUTECH (Anh, Nhật, Hàn, Việt)."
)
async def list_voices():
    """
    Endpoint cung cấp danh mục giọng đọc hỗ trợ trong hệ thống.
    """
    voices = get_supported_voices()
    return TTSVoicesResponse(total=len(voices), voices=voices)


@router.post(
    "/synthesize",
    summary="Tổng hợp giọng nói từ văn bản (Streaming MP3)",
    description="Nhận văn bản và thuộc tính giọng đọc, stream trực tiếp luồng dữ liệu byte âm thanh định dạng MP3."
)
async def synthesize_speech(request: TTSRequest):
    """
    Endpoint POST nhận dữ liệu JSON và stream file âm thanh MP3 về client.
    """
    cleaned = clean_text_for_tts(request.text)
    if not cleaned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nội dung văn bản yêu cầu không được để trống hoặc chỉ chứa ký tự đặc biệt."
        )

    voice_used = resolve_voice(
        voice=request.voice,
        language_code=request.language_code,
        gender=request.gender
    )

    try:
        audio_stream = stream_audio_chunks(
            text=cleaned,
            voice=voice_used,
            language_code=request.language_code,
            gender=request.gender,
            rate=request.rate,
            pitch=request.pitch
        )

        return StreamingResponse(
            audio_stream,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": 'inline; filename="speech.mp3"',
                "X-Voice-Used": voice_used,
                "Cache-Control": "no-cache",
            }
        )
    except Exception as e:
        logger.error(f"Lỗi khi tổng hợp giọng nói Edge-TTS: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Không thể tổng hợp giọng đọc từ máy chủ Edge-TTS: {str(e)}"
        )


@router.get(
    "/speak",
    summary="Phát giọng đọc trực tiếp qua Query Params",
    description="Hỗ trợ phát âm nhanh thông qua thẻ HTML `<audio src='/api/tts/speak?...'>` mà không cần gọi API tạo blob."
)
async def speak_text(
    text: str = Query(..., min_length=1, max_length=5000, description="Đoạn văn bản cần phát âm"),
    language_code: str = Query("en", description="Mã ngôn ngữ ('en', 'ja', 'ko', 'vi')"),
    voice: Optional[str] = Query(None, description="Tên giọng đọc cụ thể"),
    gender: str = Query("female", description="Giới tính ('female', 'male')"),
    rate: str = Query("+0%", description="Tốc độ đọc (+0%, -10%, +10%)"),
    pitch: str = Query("+0Hz", description="Cao độ (+0Hz, +5Hz)")
):
    """
    Endpoint GET phát âm nhanh cho frontend qua URL thẻ audio.
    """
    cleaned = clean_text_for_tts(text)
    if not cleaned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nội dung văn bản yêu cầu không được để trống hoặc chỉ chứa ký tự đặc biệt."
        )

    voice_used = resolve_voice(
        voice=voice,
        language_code=language_code,
        gender=gender
    )

    try:
        audio_stream = stream_audio_chunks(
            text=cleaned,
            voice=voice_used,
            language_code=language_code,
            gender=gender,
            rate=rate,
            pitch=pitch
        )

        return StreamingResponse(
            audio_stream,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": 'inline; filename="speech.mp3"',
                "X-Voice-Used": voice_used,
                "Cache-Control": "no-cache",
            }
        )
    except Exception as e:
        logger.error(f"Lỗi khi tổng hợp giọng nói Edge-TTS qua GET /speak: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Không thể tổng hợp giọng đọc: {str(e)}"
        )
