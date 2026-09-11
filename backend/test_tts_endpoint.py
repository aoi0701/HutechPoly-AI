"""
Bộ kịch bản kiểm thử tự động toàn diện cho phân hệ Text-to-Speech (TTS)
sử dụng Microsoft Edge-TTS phục vụ dự án HutechPoly-AI Trường Đại học HUTECH.

Kiểm tra:
1. Danh mục giọng đọc bản ngữ cho 3 Khoa/Viện (Anh, Nhật, Hàn, Việt) qua GET /api/tts/voices.
2. Sinh âm thanh tiếng Anh (Khoa Ngoại ngữ - Jenny) qua POST /api/tts/synthesize.
3. Sinh âm thanh tiếng Nhật bóc tách thẻ <ruby> (Viện VJIT - Nanami).
4. Sinh âm thanh tiếng Hàn chuẩn Seoul (Viện Việt - Hàn - SunHi).
5. Phát âm trực tiếp qua query params GET /api/tts/speak.
6. Xử lý ngoại lệ đầu vào không hợp lệ (400 Bad Request).
"""

import sys
import asyncio
from fastapi.testclient import TestClient

# Đảm bảo mã hóa UTF-8 trên Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from main import app

client = TestClient(app)


def test_list_supported_voices():
    """
    Kiểm thử 1: Lấy danh mục giọng đọc chuẩn bản xứ cho 3 Khoa/Viện.
    """
    print("\n" + "=" * 80)
    print("TEST 1: Kiểm thử lấy danh mục giọng đọc (GET /api/tts/voices)")
    print("=" * 80)

    response = client.get("/api/tts/voices")
    assert response.status_code == 200, f"Lỗi: status_code = {response.status_code}"

    data = response.json()
    assert "total" in data and "voices" in data
    assert data["total"] >= 8, f"Số lượng giọng đọc quá ít ({data['total']})"

    voices = data["voices"]
    languages = {v["language_code"] for v in voices}
    assert "en" in languages, "Thiếu giọng đọc tiếng Anh cho Khoa Ngoại ngữ"
    assert "ja" in languages, "Thiếu giọng đọc tiếng Nhật cho Viện VJIT"
    assert "ko" in languages, "Thiếu giọng đọc tiếng Hàn cho Viện Việt - Hàn"
    assert "vi" in languages, "Thiếu giọng đọc tiếng Việt"

    print(f"-> Thành công! Tổng cộng {data['total']} giọng đọc hỗ trợ 4 ngôn ngữ: {languages}")
    for v in voices:
        print(f"   [{v['language_code'].upper()}] {v['voice_id']} - {v['name']} ({v['faculty']})")


def test_synthesize_english():
    """
    Kiểm thử 2: Sinh âm thanh tiếng Anh cho Khoa Ngoại ngữ (Jenny).
    """
    print("\n" + "=" * 80)
    print("TEST 2: Kiểm thử sinh âm thanh Tiếng Anh (Khoa Ngoại ngữ - en-US-JennyNeural)")
    print("=" * 80)

    payload = {
        "text": "Welcome to HUTECH University! Let's practice English conversation together.",
        "language_code": "en",
        "gender": "female"
    }

    response = client.post("/api/tts/synthesize", json=payload)
    assert response.status_code == 200, f"Lỗi POST /api/tts/synthesize: {response.status_code}"
    assert "audio/mpeg" in response.headers.get("content-type", "")
    assert response.headers.get("x-voice-used") == "en-US-JennyNeural"

    audio_bytes = response.content
    assert len(audio_bytes) > 2000, f"Dung lượng audio quá nhỏ: {len(audio_bytes)} bytes"

    print(f"-> Thành công! Header X-Voice-Used: {response.headers.get('x-voice-used')}")
    print(f"-> Nhận được {len(audio_bytes)} bytes dữ liệu MP3 phát âm tiếng Anh.")


def test_synthesize_japanese_with_ruby():
    """
    Kiểm thử 3: Sinh âm thanh tiếng Nhật cho Viện VJIT kèm bóc tách thẻ <ruby> (Nanami).
    """
    print("\n" + "=" * 80)
    print("TEST 3: Kiểm thử sinh âm thanh Tiếng Nhật kèm xử lý thẻ <ruby> (Viện VJIT - Nanami)")
    print("=" * 80)

    # Văn bản chứa thẻ HTML <ruby> thường gặp khi Gemini trả về kết quả cho Viện VJIT
    payload = {
        "text": "<ruby>秋葉原<rt>あきはばら</rt></ruby>へようこそ！**アニメ**と<ruby>電化製品<rt>でんかせいひん</rt></ruby>の街です。",
        "language_code": "ja",
        "gender": "female"
    }

    response = client.post("/api/tts/synthesize", json=payload)
    assert response.status_code == 200, f"Lỗi tiếng Nhật: {response.status_code}"
    assert "audio/mpeg" in response.headers.get("content-type", "")
    assert response.headers.get("x-voice-used") == "ja-JP-NanamiNeural"

    audio_bytes = response.content
    assert len(audio_bytes) > 2000, f"Dung lượng audio tiếng Nhật quá nhỏ: {len(audio_bytes)} bytes"

    print(f"-> Thành công! Header X-Voice-Used: {response.headers.get('x-voice-used')}")
    print(f"-> Bóc tách chuẩn xác thẻ <ruby>, nhận được {len(audio_bytes)} bytes MP3 tiếng Nhật.")


def test_synthesize_korean():
    """
    Kiểm thử 4: Sinh âm thanh tiếng Hàn cho Viện Việt - Hàn (SunHi).
    """
    print("\n" + "=" * 80)
    print("TEST 4: Kiểm thử sinh âm thanh Tiếng Hàn (Viện Việt - Hàn - SunHi)")
    print("=" * 80)

    payload = {
        "text": "안녕하세요! 호치민 기술대학교(HUTECH)에 오신 것을 환영합니다.",
        "language_code": "ko",
        "gender": "female"
    }

    response = client.post("/api/tts/synthesize", json=payload)
    assert response.status_code == 200, f"Lỗi tiếng Hàn: {response.status_code}"
    assert "audio/mpeg" in response.headers.get("content-type", "")
    assert response.headers.get("x-voice-used") == "ko-KR-SunHiNeural"

    audio_bytes = response.content
    assert len(audio_bytes) > 2000, f"Dung lượng audio tiếng Hàn quá nhỏ: {len(audio_bytes)} bytes"

    print(f"-> Thành công! Header X-Voice-Used: {response.headers.get('x-voice-used')}")
    print(f"-> Nhận được {len(audio_bytes)} bytes MP3 tiếng Hàn chuẩn Seoul.")


def test_speak_get_endpoint():
    """
    Kiểm thử 5: Endpoint GET /api/tts/speak cho phát âm nhanh qua URL thẻ audio.
    """
    print("\n" + "=" * 80)
    print("TEST 5: Kiểm thử phát âm nhanh qua GET /api/tts/speak")
    print("=" * 80)

    response = client.get("/api/tts/speak?text=Hello+from+HUTECH&language_code=en&gender=male")
    assert response.status_code == 200, f"Lỗi GET /speak: {response.status_code}"
    assert "audio/mpeg" in response.headers.get("content-type", "")
    assert response.headers.get("x-voice-used") == "en-US-GuyNeural"

    audio_bytes = response.content
    assert len(audio_bytes) > 1000

    print(f"-> Thành công! Giọng nam en-US-GuyNeural nhận được {len(audio_bytes)} bytes.")


def test_error_handling_empty_text():
    """
    Kiểm thử 6: Xử lý ngoại lệ khi văn bản rỗng hoặc chỉ chứa ký tự đặc biệt.
    """
    print("\n" + "=" * 80)
    print("TEST 6: Kiểm thử bắt lỗi 400 khi văn bản rỗng")
    print("=" * 80)

    # 1. Chuỗi rỗng
    res1 = client.post("/api/tts/synthesize", json={"text": "   ", "language_code": "en"})
    assert res1.status_code == 400, f"Mong đợi 400 nhưng nhận: {res1.status_code}"

    # 2. Chuỗi chỉ chứa thẻ HTML bị bóc tách hết
    res2 = client.post("/api/tts/synthesize", json={"text": "<rt></rt> *** ", "language_code": "ja"})
    assert res2.status_code == 400, f"Mong đợi 400 nhưng nhận: {res2.status_code}"

    print(f"-> Bắt lỗi chính xác! Chi tiết lỗi: {res1.json().get('detail')}")


if __name__ == "__main__":
    print("\n" + "#" * 80)
    print("# BẮT ĐẦU BỘ KIỂM THỬ DỊCH VỤ TEXT-TO-SPEECH (EDGE-TTS) HUTECHPOLY-AI")
    print("#" * 80)

    try:
        test_list_supported_voices()
        test_synthesize_english()
        test_synthesize_japanese_with_ruby()
        test_synthesize_korean()
        test_speak_get_endpoint()
        test_error_handling_empty_text()

        print("\n" + "=" * 80)
        print("TẤT CẢ 6 BÀI KIỂM THỬ EDGE-TTS ĐÃ VƯỢT QUA 100% THÀNH CÔNG RỰC RỠ!")
        print("=" * 80 + "\n")
    except AssertionError as e:
        print(f"\n[THẤT BẠI] Kiểm thử không đạt: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[LỖI HỆ THỐNG] Ngoại lệ ngoài ý muốn: {e}")
        sys.exit(1)
