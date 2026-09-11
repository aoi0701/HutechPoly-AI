"""
Dịch vụ tổng hợp tiếng nói Text-to-Speech (TTS) sử dụng Microsoft Edge-TTS
phục vụ cho dự án HutechPoly-AI hiến tặng Trường Đại học HUTECH.

Hỗ trợ giọng đọc chuẩn bản xứ cho 3 Khoa/Viện:
- Khoa Ngoại ngữ: Tiếng Anh (en-US-JennyNeural, en-US-GuyNeural, en-GB-SoniaNeural)
- Viện VJIT: Tiếng Nhật chuẩn Tokyo (ja-JP-NanamiNeural, ja-JP-KeitaNeural)
- Viện Việt - Hàn: Tiếng Hàn chuẩn Seoul (ko-KR-SunHiNeural, ko-KR-InJoonNeural)
- Tiếng Việt học thuật: vi-VN-HoaiMyNeural, vi-VN-NamMinhNeural
"""

import re
import logging
from typing import AsyncGenerator, Dict, List, Optional
import edge_tts

from app.schemas.tts import TTSVoiceInfo

logger = logging.getLogger(__name__)

# Danh mục các giọng đọc bản ngữ chuẩn mực phục vụ 3 Khoa/Viện HUTECH
SUPPORTED_VOICES: List[TTSVoiceInfo] = [
    # 1. Khoa Ngoại ngữ (Tiếng Anh)
    TTSVoiceInfo(
        voice_id="en-US-JennyNeural",
        name="Jenny (Nữ - Tiếng Anh Mỹ)",
        gender="female",
        language_code="en",
        faculty="Khoa Ngoại ngữ",
        description="Giọng nữ bản xứ chuẩn Anh - Mỹ, tự nhiên, thân thiện và phát âm rõ ràng"
    ),
    TTSVoiceInfo(
        voice_id="en-US-GuyNeural",
        name="Guy (Nam - Tiếng Anh Mỹ)",
        gender="male",
        language_code="en",
        faculty="Khoa Ngoại ngữ",
        description="Giọng nam bản xứ chuẩn Anh - Mỹ, trầm ấm, phong thái chuyên nghiệp"
    ),
    TTSVoiceInfo(
        voice_id="en-GB-SoniaNeural",
        name="Sonia (Nữ - Tiếng Anh Anh)",
        gender="female",
        language_code="en",
        faculty="Khoa Ngoại ngữ",
        description="Giọng nữ chuẩn Anh - Anh (British Accent) sang trọng, phát âm chuẩn Oxford"
    ),
    TTSVoiceInfo(
        voice_id="en-GB-RyanNeural",
        name="Ryan (Nam - Tiếng Anh Anh)",
        gender="male",
        language_code="en",
        faculty="Khoa Ngoại ngữ",
        description="Giọng nam chuẩn Anh - Anh (British Accent) lịch lãm"
    ),

    # 2. Viện Công nghệ Việt - Nhật (VJIT - Tiếng Nhật)
    TTSVoiceInfo(
        voice_id="ja-JP-NanamiNeural",
        name="Nanami (Nữ - Tiếng Nhật Tokyo)",
        gender="female",
        language_code="ja",
        faculty="Viện VJIT",
        description="Giọng nữ chuẩn Tokyo trong trẻo, tự nhiên, chuẩn mực đàm thoại Kaiwa"
    ),
    TTSVoiceInfo(
        voice_id="ja-JP-KeitaNeural",
        name="Keita (Nam - Tiếng Nhật Tokyo)",
        gender="male",
        language_code="ja",
        faculty="Viện VJIT",
        description="Giọng nam chuẩn Tokyo, phong thái doanh nghiệp, chuẩn kính ngữ thương mại"
    ),

    # 3. Viện Công nghệ Việt - Hàn (Tiếng Hàn)
    TTSVoiceInfo(
        voice_id="ko-KR-SunHiNeural",
        name="SunHi (Nữ - Tiếng Hàn Seoul)",
        gender="female",
        language_code="ko",
        faculty="Viện Việt - Hàn",
        description="Giọng nữ chuẩn Seoul nhẹ nhàng, tự nhiên, hỗ trợ luyện thi TOPIK"
    ),
    TTSVoiceInfo(
        voice_id="ko-KR-InJoonNeural",
        name="InJoon (Nam - Tiếng Hàn Seoul)",
        gender="male",
        language_code="ko",
        faculty="Viện Việt - Hàn",
        description="Giọng nam chuẩn Seoul, rõ ràng, phong thái tự tin"
    ),

    # 4. Tiếng Việt (Hỗ trợ giải thích học thuật)
    TTSVoiceInfo(
        voice_id="vi-VN-HoaiMyNeural",
        name="Hoài My (Nữ - Tiếng Việt)",
        gender="female",
        language_code="vi",
        faculty="Toàn trường HUTECH",
        description="Giọng nữ tiếng Việt dịu dàng, tự nhiên, phục vụ phát âm phần giải nghĩa"
    ),
    TTSVoiceInfo(
        voice_id="vi-VN-NamMinhNeural",
        name="Nam Minh (Nam - Tiếng Việt)",
        gender="male",
        language_code="vi",
        faculty="Toàn trường HUTECH",
        description="Giọng nam tiếng Việt trầm ấm, truyền cảm"
    ),
]

# Bảng tra cứu nhanh Voice ID mặc định theo (ngôn ngữ, giới tính)
DEFAULT_VOICE_MAP: Dict[str, Dict[str, str]] = {
    "en": {
        "female": "en-US-JennyNeural",
        "male": "en-US-GuyNeural",
    },
    "ja": {
        "female": "ja-JP-NanamiNeural",
        "male": "ja-JP-KeitaNeural",
    },
    "ko": {
        "female": "ko-KR-SunHiNeural",
        "male": "ko-KR-InJoonNeural",
    },
    "vi": {
        "female": "vi-VN-HoaiMyNeural",
        "male": "vi-VN-NamMinhNeural",
    },
}

VALID_VOICE_IDS = {v.voice_id for v in SUPPORTED_VOICES}


def get_supported_voices() -> List[TTSVoiceInfo]:
    """
    Trả về danh mục toàn bộ các giọng đọc được hỗ trợ.
    """
    return SUPPORTED_VOICES


def resolve_voice(
    voice: Optional[str] = None,
    language_code: str = "en",
    gender: str = "female"
) -> str:
    """
    Xác định Voice ID chuẩn xác dựa trên voice chỉ định hoặc (ngôn ngữ, giới tính).
    """
    if voice and voice in VALID_VOICE_IDS:
        return voice

    lang_lower = (language_code or "en").lower().strip()
    gender_lower = (gender or "female").lower().strip()
    if gender_lower not in ("female", "male"):
        gender_lower = "female"

    lang_map = DEFAULT_VOICE_MAP.get(lang_lower, DEFAULT_VOICE_MAP["en"])
    return lang_map.get(gender_lower, "en-US-JennyNeural")


def clean_text_for_tts(text: str) -> str:
    """
    Làm sạch văn bản trước khi đưa vào bộ chuyển đổi giọng nói Edge-TTS:
    1. Bóc tách thẻ Furigana HTML tiếng Nhật <ruby>漢字<rt>かんじ</rt></ruby> -> giữ lại '漢字'
       (Edge TTS tiếng Nhật tự động đọc Kanji rất chuẩn trong văn cảnh tự nhiên).
    2. Loại bỏ các thẻ HTML còn lại.
    3. Loại bỏ ký tự định dạng Markdown (*, _, #, `, >, ~).
    4. Chuẩn hóa khoảng trắng.
    """
    if not text:
        return ""

    # Bước 1: Xóa nội dung trong thẻ <rt>...</rt> để tránh TTS đọc lặp lại cả Kanji và Furigana
    cleaned = re.sub(r'<rt>.*?</rt>', '', text, flags=re.DOTALL | re.IGNORECASE)

    # Bước 2: Xóa các thẻ HTML còn lại (như <ruby>, </ruby>, <span>, v.v.)
    cleaned = re.sub(r'<[^>]+>', '', cleaned)

    # Bước 3: Loại bỏ ký tự Markdown
    cleaned = re.sub(r'[*_#`~>\[\]()]', ' ', cleaned)

    # Bước 4: Chuẩn hóa khoảng trắng
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()

    return cleaned


async def generate_audio_bytes(
    text: str,
    voice: Optional[str] = None,
    language_code: str = "en",
    gender: str = "female",
    rate: str = "+0%",
    pitch: str = "+0Hz"
) -> bytes:
    """
    Tổng hợp văn bản thành mảng byte MP3 hoàn chỉnh.
    Thích hợp cho việc lưu trữ hoặc phản hồi toàn phần.
    """
    cleaned_text = clean_text_for_tts(text)
    if not cleaned_text:
        raise ValueError("Nội dung văn bản sau khi làm sạch không thể để trống.")

    selected_voice = resolve_voice(voice=voice, language_code=language_code, gender=gender)
    logger.info(f"Đang sinh âm thanh Edge-TTS với giọng {selected_voice} cho {len(cleaned_text)} ký tự...")

    communicate = edge_tts.Communicate(
        text=cleaned_text,
        voice=selected_voice,
        rate=rate or "+0%",
        pitch=pitch or "+0Hz"
    )

    audio_chunks = []
    async for chunk in communicate.stream():
        if chunk.get("type") == "audio" and "data" in chunk:
            audio_chunks.append(chunk["data"])

    if not audio_chunks:
        raise RuntimeError("Không nhận được dữ liệu âm thanh từ dịch vụ Edge-TTS.")

    return b"".join(audio_chunks)


async def stream_audio_chunks(
    text: str,
    voice: Optional[str] = None,
    language_code: str = "en",
    gender: str = "female",
    rate: str = "+0%",
    pitch: str = "+0Hz"
) -> AsyncGenerator[bytes, None]:
    """
    Bộ tạo (Async Generator) stream trực tiếp các gói byte MP3 theo thời gian thực.
    Tối ưu hóa độ trễ phản hồi (First Audio Byte Latency) khi truyền về trình duyệt hoặc WebSocket.
    """
    cleaned_text = clean_text_for_tts(text)
    if not cleaned_text:
        raise ValueError("Nội dung văn bản sau khi làm sạch không thể để trống.")

    selected_voice = resolve_voice(voice=voice, language_code=language_code, gender=gender)
    logger.info(f"Bắt đầu stream âm thanh Edge-TTS ({selected_voice})...")

    communicate = edge_tts.Communicate(
        text=cleaned_text,
        voice=selected_voice,
        rate=rate or "+0%",
        pitch=pitch or "+0Hz"
    )

    has_audio = False
    async for chunk in communicate.stream():
        if chunk.get("type") == "audio" and "data" in chunk:
            has_audio = True
            yield chunk["data"]

    if not has_audio:
        raise RuntimeError("Không nhận được dữ liệu âm thanh từ Edge-TTS.")
