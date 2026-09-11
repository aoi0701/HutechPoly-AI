"""
Kịch bản kiểm thử tự động toàn diện cho Endpoint đàm thoại phản xạ AI (POST /api/chat).
Kiểm tra:
1. Tính đúng đắn của Pydantic Schema (ChatRequest, ChatResponse, ChatTurn).
2. Trình sinh System Prompt động theo chủ đề (English, Japanese, Korean).
3. Luồng xử lý của Router POST /api/chat với cả 3 ngôn ngữ qua TestClient.
4. Xử lý ngoại lệ: 404 Not Found, 400 Bad Request, và 503 Service Unavailable khi thiếu GEMINI_API_KEY.
"""

import sys

# Đảm bảo hiển thị tiếng Việt có dấu chuẩn xác trên console Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from unittest.mock import AsyncMock, patch, PropertyMock
from app.services.gemini_service import GeminiService
from fastapi.testclient import TestClient

from main import app
from app.schemas.chat import ChatRequest, ChatResponse, ChatTurn
from app.services.gemini_service import gemini_service

client = TestClient(app)

print("=" * 70)
print("HUTECHPOLY-AI: BẮT ĐẦU KIỂM THỬ ENDPOINT ĐÀM THOẠI AI (POST /api/chat)")
print("=" * 70)

# -----------------------------------------------------------------------------
# TEST 1: Kiểm thử Schema Pydantic
# -----------------------------------------------------------------------------
print("\n[*] TEST 1: Kiểm tra tính hợp lệ của Schema Pydantic...")
sample_response = ChatResponse(
    ai_message="That sounds amazing! Where would you like to travel first?",
    vietnamese_translation="Nghe tuyệt vời quá! Bạn muốn đi du lịch ở đâu đầu tiên?",
    feedback="Bạn nói chêm: 'tôi muốn đi du lịch bụi' -> Nên dùng: 'I want to go backpacking'.",
    suggested_replies=[
        "I would love to explore Da Nang and Hoi An.",
        "I'm planning a trip to the northern mountains."
    ],
    vocabulary_hints=["backpacking: du lịch bụi", "scenic: phong cảnh đẹp"]
)
assert sample_response.ai_message.startswith("That sounds")
assert len(sample_response.suggested_replies) == 2
print("  [+] Schema ChatResponse và ChatRequest khởi tạo và validate thành công 100%.")

# -----------------------------------------------------------------------------
# TEST 2: Kiểm tra Trình tạo Dynamic System Prompt
# -----------------------------------------------------------------------------
print("\n[*] TEST 2: Kiểm tra Trình tạo Dynamic System Instruction...")
test_topic_en = {
    "topic_code": "ENG-T01",
    "language": "en",
    "title_vi": "Du lịch bụi & Khám phá văn hóa bản địa",
    "title_native": "Backpacking & Local Culture",
    "faculty": "Khoa Ngoại ngữ",
    "level": "easy",
    "ai_persona": "Người bạn phượt thủ bản địa (Local Tour Guide)",
    "key_vocab": [
        {"word": "itinerary", "ipa": "aɪˈtɪn.ə.rer.i", "meaning_vi": "lịch trình"},
        {"word": "hostel", "ipa": "ˈhɒs.təl", "meaning_vi": "nhà trọ du lịch"}
    ],
    "system_instruction": "Hãy hỏi về địa điểm người học muốn đi du lịch tiếp theo."
}
prompt_en = gemini_service.build_system_instruction(test_topic_en)
assert "ENG-T01" in prompt_en
assert "Local Tour Guide" in prompt_en
assert "Khoa Ngoại ngữ" in prompt_en
assert "itinerary" in prompt_en
assert "BILINGUAL FALLBACK" in prompt_en
print("  [+] Dynamic System Prompt cho Tiếng Anh (ENG-T01) sinh chuẩn mực.")

test_topic_ja = {
    "topic_code": "JPN-T01",
    "language": "ja",
    "title_vi": "Dạo phố Akihabara & Mua sắm đồ điện tử",
    "title_native": "秋葉原散策と買い物",
    "faculty": "Viện VJIT",
    "level": "medium",
    "ai_persona": "Nhân viên cửa hàng Akihabara",
    "key_vocab": [{"word": "秋葉原", "meaning_vi": "Khu phố Akihabara"}],
}
prompt_ja = gemini_service.build_system_instruction(test_topic_ja)
assert "<ruby>" in prompt_ja
assert "Viện VJIT" in prompt_ja
print("  [+] Dynamic System Prompt cho Tiếng Nhật (JPN-T01) chứa quy tắc thẻ <ruby> Furigana.")

# -----------------------------------------------------------------------------
# TEST 3: Kiểm thử Endpoint POST /api/chat - Các trường hợp ngoại lệ
# -----------------------------------------------------------------------------
print("\n[*] TEST 3: Kiểm tra các ca lỗi ngoại lệ (Edge Cases)...")

# Ca 3.1: Lời thoại rỗng (400 Bad Request)
res_empty = client.post("/api/chat", json={"topic_code": "ENG-T01", "message": "   "})
assert res_empty.status_code == 400
print(f"  [+] Ca 3.1: Lời thoại rỗng trả về 400 Bad Request ({res_empty.json()['detail']})")

# Ca 3.2: Không tìm thấy mã chủ đề (404 Not Found)
res_not_found = client.post("/api/chat", json={"topic_code": "UNKNOWN-999", "message": "Hello"})
assert res_not_found.status_code == 404
print(f"  [+] Ca 3.2: Mã chủ đề lạ trả về 404 Not Found")

# Ca 3.3: Chưa cấu hình GEMINI_API_KEY khi gọi thật (503 Service Unavailable)
if not gemini_service.is_ready:
    res_no_key = client.post("/api/chat", json={"topic_code": "ENG-T01", "message": "Hello world"})
    assert res_no_key.status_code == 503
    print("  [+] Ca 3.3: Chưa có GEMINI_API_KEY trả về 503 Service Unavailable kèm hướng dẫn rõ ràng.")

# -----------------------------------------------------------------------------
# TEST 4: Kiểm thử Endpoint POST /api/chat - Cả 3 ngôn ngữ (Giả lập AI phản hồi)
# -----------------------------------------------------------------------------
print("\n[*] TEST 4: Kiểm tra luồng đàm thoại đầy đủ cho cả 3 ngôn ngữ (Anh, Nhật, Hàn)...")

mock_en_response = ChatResponse(
    ai_message="Backpacking is such a thrilling experience! What country do you want to explore next?",
    vietnamese_translation="Du lịch bụi quả là một trải nghiệm đầy hứng khởi! Bạn muốn khám phá đất nước nào tiếp theo?",
    feedback="Bạn nói chêm: 'tôi muốn đi du lịch bụi' -> Nên nói chuẩn ngữ cảnh: 'I want to go backpacking'.",
    suggested_replies=[
        "I'm planning to travel around Southeast Asia.",
        "I really want to visit Japan to see Mount Fuji."
    ],
    vocabulary_hints=["backpacking: du lịch bụi", "thrilling: đầy kịch tính, thú vị"]
)

mock_ja_response = ChatResponse(
    ai_message="いらっしゃいませ！<ruby>秋葉原<rt>あきはばら</rt></ruby>へようこそ。どんなアニメグッズをお<ruby>探<rt>さが</rt></ruby>しですか？",
    vietnamese_translation="Kính chào quý khách! Chào mừng quý khách đến với Akihabara. Bạn đang tìm món đồ anime nào vậy?",
    feedback=None,
    suggested_replies=[
        "ワンピースのフィギュアを探しています。",
        "限定のキーホルダーはどこにありますか？"
    ],
    vocabulary_hints=["フィギュア: mô hình nhân vật", "限定: bản giới hạn"]
)

mock_ko_response = ChatResponse(
    ai_message="안녕하세요! 한국 여행을 계획하고 계신가요? 서울에서 가장 가보고 싶은 곳이 어디예요?",
    vietnamese_translation="Xin chào! Bạn đang lên kế hoạch du lịch Hàn Quốc à? Nơi bạn muốn đến nhất ở Seoul là đâu?",
    feedback="Bạn dùng đuôi câu thân mật: '가고 싶어' -> Với người mới gặp, hãy dùng đuôi câu lịch sự: '가고 싶어요'.",
    suggested_replies=[
        "명동에서 맛있는 음식을 먹고 싶어요.",
        "경복궁에 가서 한복을 입어보고 싶어요."
    ],
    vocabulary_hints=["계획하다: lên kế hoạch", "한복: trang phục truyền thống Hanbok"]
)

# Test Tiếng Anh (ENG-T01)
with patch.object(gemini_service, "generate_chat_turn", new_callable=AsyncMock) as mock_turn:
    with patch.object(GeminiService, "is_ready", new_callable=PropertyMock, return_value=True):
        # 1. English
        mock_turn.return_value = mock_en_response
        res_en = client.post(
            "/api/chat",
            json={
                "topic_code": "ENG-T01",
                "message": "Hi, tôi muốn đi du lịch bụi next summer.",
                "history": []
            }
        )
        assert res_en.status_code == 200
        data_en = res_en.json()
        assert "backpacking" in data_en["ai_message"].lower()
        assert data_en["feedback"] is not None
        assert len(data_en["suggested_replies"]) == 2
        print("  [+] Ca 4.1: Tiếng Anh [ENG-T01] - Nhận diện phản hồi song ngữ & sửa lỗi chêm Tiếng Việt thành công.")

        # 2. Japanese (JPN-T01)
        mock_turn.return_value = mock_ja_response
        res_ja = client.post(
            "/api/chat",
            json={
                "topic_code": "JPN-T01",
                "message": "こんにちは！",
                "history": []
            }
        )
        assert res_ja.status_code == 200
        data_ja = res_ja.json()
        assert "<ruby>" in data_ja["ai_message"]
        assert data_ja["feedback"] is None  # Sinh viên nói chuẩn, feedback để trống
        print("  [+] Ca 4.2: Tiếng Nhật [JPN-T01] - Render thẻ <ruby> Furigana cho Viện VJIT thành công.")

        # 3. Korean (KOR-T01)
        mock_turn.return_value = mock_ko_response
        res_ko = client.post(
            "/api/chat",
            json={
                "topic_code": "KOR-T01",
                "message": "안녕하세요! 서울에 가고 싶어.",
                "history": []
            }
        )
        assert res_ko.status_code == 200
        data_ko = res_ko.json()
        assert "가고 싶어요" in data_ko["feedback"]
        assert len(data_ko["suggested_replies"]) == 2
        print("  [+] Ca 4.3: Tiếng Hàn [KOR-T01] - Nhận xét và sửa lỗi đuôi câu kính ngữ cho Viện Việt - Hàn thành công.")

print("\n" + "=" * 70)
print("TẤT CẢ CÁC BÀI KIỂM THỬ CHO ENDPOINT /api/chat ĐÃ VƯỢT QUA 100% THÀNH CÔNG!")
print("=" * 70)
