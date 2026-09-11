"""
Mô-đun dịch vụ trí tuệ nhân tạo Gemini dành cho dự án HutechPoly-AI.
Tích hợp bộ công cụ Google Gemini 2.5 Flash SDK phục vụ hội thoại phản xạ đa ngữ thời gian thực.
Tuân thủ nghiêm ngặt PROJECT_RULES.md và hợp đồng dữ liệu Response Contract.
"""

import json
import logging
from typing import AsyncGenerator, Dict, List, Optional, Any
from app.core.config import settings
from app.schemas.chat import ChatResponse, ChatTurn

# Thiết lập bộ ghi log riêng cho dịch vụ Gemini
logger = logging.getLogger("hutechpoly.gemini")

# Kiểm tra an toàn xem thư viện google-genai đã được cài đặt trong môi trường hay chưa
try:
    from google import genai
    from google.genai import types
    from google.genai.errors import APIError
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("Thư viện google-genai chưa được cài đặt. Vui lòng cài đặt google-genai >= 1.0.0.")


class GeminiService:
    """
    Lớp điều phối dịch vụ tương tác với mô hình ngôn ngữ lớn Google Gemini 2.5 Flash.
    Chịu trách nhiệm:
    - Xây dựng Dynamic System Prompt theo từng chủ đề và Khoa/Viện HUTECH.
    - Ép chuẩn JSON Structured Output theo khuôn mẫu ChatResponse.
    - Duy trì cơ chế cứu cánh song ngữ (Bilingual Fallback Mechanism) và sửa lỗi người học.
    - Quản lý cửa sổ trượt (sliding window) 8 lượt thoại gần nhất.
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Khởi tạo dịch vụ Gemini với khóa API được cung cấp hoặc nạp từ settings.GEMINI_API_KEY.
        """
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self._client = None
        self._initialize_client()

    def _initialize_client(self):
        """
        Khởi tạo hoặc làm mới Client kết nối đến Google GenAI.
        """
        # Cập nhật lại key từ settings nếu trước đó chưa có
        if not self.api_key and settings.GEMINI_API_KEY:
            self.api_key = settings.GEMINI_API_KEY

        if GENAI_AVAILABLE and self.api_key:
            try:
                self._client = genai.Client(api_key=self.api_key)
                logger.info(f"Khởi tạo thành công Gemini Client với mô hình {self.model_name}.")
            except Exception as exc:
                logger.error(f"Lỗi khi khởi tạo kết nối đến Gemini: {exc}")
                self._client = None
        else:
            if not self.api_key:
                logger.warning("Chưa cấu hình GEMINI_API_KEY trong file .env. Dịch vụ AI đang ở chế độ chờ.")

    @property
    def is_ready(self) -> bool:
        """
        Kiểm tra xem Client Gemini đã sẵn sàng nhận yêu cầu hay chưa.
        """
        if not self._client and settings.GEMINI_API_KEY:
            self.api_key = settings.GEMINI_API_KEY
            self._initialize_client()
        return self._client is not None

    def build_system_instruction(self, topic: Dict[str, Any]) -> str:
        """
        Xây dựng Lời nhắc hệ thống động (Dynamic System Instruction) dựa trên siêu dữ liệu của chủ đề.
        Tích hợp toàn bộ nghiệp vụ sư phạm: nhập vai Persona, kiểm soát độ khó,
        lồng ghép từ vựng mục tiêu, cơ chế Bilingual Fallback và bắt lỗi người học.
        """
        topic_code = topic.get("topic_code", "UNKNOWN")
        language_code = topic.get("language", "en").lower()
        title_vi = topic.get("title_vi", "Chủ đề đàm thoại")
        title_native = topic.get("title_native", "")
        faculty = topic.get("faculty", "Đại học HUTECH")
        level = topic.get("level", "medium").lower()
        ai_persona = topic.get("ai_persona", "Trợ giảng AI Bản Xứ thân thiện")
        system_instruction_db = topic.get("system_instruction", "")
        key_vocab = topic.get("key_vocab", [])

        # Xác định tên ngôn ngữ và các yêu cầu đặc thù theo từng Khoa/Viện
        lang_names = {
            "en": "Tiếng Anh (English)",
            "ja": "Tiếng Nhật (日本語 - Japanese)",
            "ko": "Tiếng Hàn (한국어 - Korean)",
        }
        lang_name = lang_names.get(language_code, "Ngoại ngữ mục tiêu")

        # Quy đổi cấp độ khó sang chuẩn khung tham chiếu đào tạo
        level_descriptions = {
            "easy": "Sơ cấp (A1 - A2 / N5 / TOPIK 1-2): Dùng câu ngắn, từ ngữ quen thuộc, tốc độ nói chậm rãi, rõ ràng.",
            "beginner": "Sơ cấp (A1 - A2 / N5 / TOPIK 1-2): Dùng câu ngắn, từ ngữ quen thuộc, tốc độ nói chậm rãi, rõ ràng.",
            "medium": "Trung cấp (B1 - B2 / N4-N3 / TOPIK 3-4): Mẫu câu tự nhiên, mở rộng vốn từ học thuật/công sở, đối đáp linh hoạt.",
            "intermediate": "Trung cấp (B1 - B2 / N4-N3 / TOPIK 3-4): Mẫu câu tự nhiên, mở rộng vốn từ học thuật/công sở, đối đáp linh hoạt.",
            "hard": "Nâng cao (C1 - C2 / N2-N1 / TOPIK 5-6): Diễn đạt sâu sắc, vận dụng từ vựng chuyên ngành, cấu trúc ngữ pháp phức hợp, phản biện sắc bén.",
            "advanced": "Nâng cao (C1 - C2 / N2-N1 / TOPIK 5-6): Diễn đạt sâu sắc, vận dụng từ vựng chuyên ngành, cấu trúc ngữ pháp phức hợp, phản biện sắc bén.",
        }
        level_desc = level_descriptions.get(level, level_descriptions["medium"])

        # Trích xuất và định dạng danh sách từ vựng trọng tâm
        vocab_lines = []
        for v in key_vocab[:6]:
            if isinstance(v, dict):
                word = v.get("word") or v.get("hangeul") or v.get("romaji") or ""
                meaning = v.get("meaning_vi", "")
                ipa = v.get("ipa", "")
                honorific = v.get("honorific_type", "")
                detail = f"- {word}"
                if ipa:
                    detail += f" /{ipa}/"
                if honorific:
                    detail += f" [{honorific}]"
                if meaning:
                    detail += f": {meaning}"
                vocab_lines.append(detail)

        vocab_formatted = "\n".join(vocab_lines) if vocab_lines else "Không có danh sách cố định, sử dụng từ ngữ tự nhiên theo ngữ cảnh."

        # Hướng dẫn riêng theo từng ngôn ngữ chuyên ngành
        language_specific_rules = ""
        if language_code == "ja":
            language_specific_rules = """
5. QUY TẮC ĐẶC THÙ CHO TIẾNG NHẬT (VIỆN CÔNG NGHỆ VIỆT - NHẬT VJIT):
- Bọc thẻ HTML <ruby>漢字<rt>かんじ</rt></ruby> cho TẤT CẢ các chữ Hán (Kanji) trong trường `ai_message` để sinh viên dễ đọc Furigana.
  Ví dụ: "<ruby>秋葉原<rt>あきはばら</rt></ruby>に<ruby>行<rt>い</rt></ruby>きましょう。"
- Chú ý rèn luyện cách sử dụng kính ngữ: Tôn kính ngữ (Sonkeigo), Khiêm nhường ngữ (Kenjougo), Thể lịch sự Teineigo (-ます/-です).
- Nhắc nhở và sửa lỗi nếu sinh viên nói chuyện quá suồng sã với cấp trên/Sensei trong các tình huống trang trọng.
"""
        elif language_code == "ko":
            language_specific_rules = """
5. QUY TẮC ĐẶC THÙ CHO TIẾNG HÀN (VIỆN CÔNG NGHỆ VIỆT - HÀN):
- Đảm bảo đối thoại đúng phong cách đuôi câu:
  + Trang trọng công sở / học thuật: Đuôi câu `-ㅂ니다 / -습니다`.
  + Thân mật lịch sự đời thường: Đuôi câu `-아/어요`.
- Nhận xét và hướng dẫn nếu sinh viên dùng nhầm đuôi câu thân mật (Banmal - 반말) trong ngữ cảnh cần trang trọng.
"""
        elif language_code == "en":
            language_specific_rules = """
5. QUY TẮC ĐẶC THÙ CHO TIẾNG ANH (KHOA NGOẠI NGỮ HUTECH):
- Định hướng chuẩn đầu ra VSTEP B1/B2/C1 và IELTS.
- Khuyến khích sử dụng các cụm liên kết ý (Signposting phrases: 'Firstly', 'On the other hand', 'In my perspective'...).
- Chú ý sửa các lỗi phổ biến của người Việt (thiếu âm đuôi s/es/ed, sai thì, thiếu mạo từ a/an/the).
"""

        prompt = f"""Bạn là Trợ giảng AI Bản Xứ thuộc Hệ thống Luyện Phản Xạ Đa Ngữ Thông Minh (HutechPoly-AI) của Trường Đại học Công nghệ TP.HCM (HUTECH).
Nhiệm vụ của bạn là đồng hành, đối thoại và rèn luyện phản xạ giao tiếp cho sinh viên theo từng chuyên đề thực chiến.

=== THÔNG TIN CHỦ ĐỀ HIỆN TẠI ===
- Mã chuyên đề: {topic_code}
- Tên chuyên đề (Tiếng Việt): {title_vi}
- Tên chuyên đề (Bản xứ): {title_native}
- Đơn vị phụ trách: {faculty}
- Ngôn ngữ mục tiêu: {lang_name}
- Cấp độ đào tạo: {level_desc}
- VAI TRÒ NHẬP VAI (PERSONA): {ai_persona}

=== TỪ VỰNG TRỌNG TÂM CẦN LỒNG GHÉP KHÉO LÉO ===
{vocab_formatted}

=== CHỈ DẪN HỆ THỐNG BỔ SUNG CỦA CHỦ ĐỀ ===
{system_instruction_db}

=== CÁC NGUYÊN TẮC CỐT LÕI BẮT BUỘC TUÂN THỦ ===
1. NHẬP VAI TUYỆT ĐỐI (ROLEPLAYING):
   - Bạn PHẢI nói chuyện hoàn toàn theo đúng nhân vật `{ai_persona}`.
   - Thể hiện cảm xúc tự nhiên, văn phong đời thực, không trả lời như một chatbot máy móc.
   - Luôn kết thúc lượt thoại bằng một câu hỏi gợi mở hoặc phản hồi kích thích sinh viên tiếp tục nói để luyện phản xạ.

2. CƠ CHẾ CỨU CÁNH SONG NGỮ (BILINGUAL FALLBACK) & NÓI CHÊM TIẾNG VIỆT:
   - Sinh viên có thể bị "bí từ" và nói chêm Tiếng Việt vào câu (Ví dụ: "I like this place because phong cảnh rất đẹp").
   - NGUYÊN TẮC VÀNG: Bạn TUYỆT ĐỐI KHÔNG chuyển toàn bộ hội thoại sang tiếng Việt! Bạn vẫn thấu hiểu trọn vẹn ý định của sinh viên và trả lời hoàn toàn bằng {lang_name}.
   - Hãy trích xuất phần tiếng Việt sinh viên đã nói chêm, giải thích và chỉ ra cách diễn đạt chuẩn bằng {lang_name} trong trường `feedback`.

3. BẮT LỖI NGƯỜI HỌC VÀ ĐƯA RA GÓP Ý XÂY DỰNG (FEEDBACK):
   - Nếu sinh viên mắc lỗi ngữ pháp, chia sai thì, dùng sai kính ngữ, hoặc nói chêm tiếng Việt:
     -> Ghi nhận xét chi tiết, ân cần và song ngữ vào trường `feedback`.
     -> Cung cấp mẫu câu đúng để sinh viên so sánh và học hỏi.
   - Nếu sinh viên nói tốt, chuẩn xác và tự nhiên:
     -> Để trường `feedback` là null hoặc chuỗi rỗng "". Không khen ngợi sáo rỗng trong feedback nếu không có lỗi cần sửa.

4. GỢI Ý CÂU TRẢ LỜI MẪU (SUGGESTED REPLIES):
   - Luôn cung cấp 2-3 câu trả lời mẫu ngắn gọn, tự nhiên bằng {lang_name} trong trường `suggested_replies` để sinh viên có thể tham khảo khi bị bí ý tưởng ở lượt tiếp theo.
{language_specific_rules}
=== ĐỊNH DẠNG ĐẦU RA JSON BẮT BUỘC ===
Bạn PHẢI trả về duy nhất một đối tượng JSON tuân thủ chính xác Schema sau:
{{
  "ai_message": "Lời thoại của bạn bằng {lang_name} (nếu tiếng Nhật hãy dùng thẻ <ruby>)",
  "vietnamese_translation": "Bản dịch nghĩa tiếng Việt đầy đủ và tự nhiên của ai_message",
  "feedback": "Nhận xét sửa lỗi ngữ pháp/từ vựng/chêm tiếng Việt (nếu có lỗi), hoặc để null nếu sinh viên nói tốt",
  "suggested_replies": [
    "Câu gợi ý trả lời mẫu 1 bằng {lang_name}",
    "Câu gợi ý trả lời mẫu 2 bằng {lang_name}"
  ],
  "vocabulary_hints": [
    "từ_vựng: ý nghĩa tiếng Việt"
  ]
}}
"""
        return prompt.strip()

    async def generate_chat_turn(
        self,
        message: str,
        topic: Dict[str, Any],
        history: Optional[List[ChatTurn]] = None,
    ) -> ChatResponse:
        """
        Xử lý một lượt đối thoại hoàn chỉnh từ sinh viên:
        Gửi yêu cầu đến Gemini 2.5 Flash và nhận về phản hồi đã chuẩn hóa theo Pydantic Schema.
        """
        # Kiểm tra xem khóa API đã được cấu hình chưa
        if not self.is_ready:
            raise RuntimeError(
                "Chưa cấu hình GEMINI_API_KEY trong file backend/.env. "
                "Vui lòng truy cập https://aistudio.google.com/apikey để tạo khóa API miễn phí và điền vào backend/.env"
            )

        # 1. Xây dựng System Prompt động
        system_instruction = self.build_system_instruction(topic)

        # 2. Chuẩn bị lịch sử đối thoại (Áp dụng cửa sổ trượt 8 lượt gần nhất)
        contents = []
        if history:
            sliding_history = history[-8:]
            for turn in sliding_history:
                # Chuẩn hóa role: google-genai chấp nhận 'user' và 'model'
                role = "user" if turn.role.lower() in ["user", "student", "sinh_vien"] else "model"
                contents.append({
                    "role": role,
                    "parts": [{"text": turn.content}]
                })

        # Đưa câu nói mới của sinh viên vào cuối chuỗi
        contents.append({
            "role": "user",
            "parts": [{"text": message}]
        })

        # 3. Cấu hình JSON Structured Output bằng Pydantic Schema
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=ChatResponse,
            temperature=0.7,
        )

        try:
            # Gọi API bất đồng bộ từ Google GenAI SDK
            response = await self._client.aio.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=config,
            )

            raw_text = response.text or "{}"
            logger.info(f"Gemini phản hồi thành công (độ dài text: {len(raw_text)} ký tự).")

            # 4. Parse và Validate với Pydantic
            cleaned_text = self._clean_json_markdown(raw_text)
            parsed_data = json.loads(cleaned_text)
            return ChatResponse.model_validate(parsed_data)

        except APIError as api_err:
            logger.error(f"Lỗi gọi Gemini API: {api_err}", exc_info=True)
            raise RuntimeError(f"Lỗi máy chủ Gemini AI: {api_err.message or str(api_err)}") from api_err
        except json.JSONDecodeError as json_err:
            logger.error(f"Không thể parse JSON từ Gemini: {json_err}. Raw: {raw_text}", exc_info=True)
            # Fallback an toàn nếu chuỗi JSON bị lỗi định dạng
            return ChatResponse(
                ai_message="I understand your point! Let's continue practicing.",
                vietnamese_translation="Tôi hiểu ý bạn! Chúng ta hãy tiếp tục luyện tập nhé.",
                feedback="Hệ thống đã ghi nhận phản hồi của bạn.",
                suggested_replies=["Can you tell me more about that?"],
                vocabulary_hints=[]
            )
        except Exception as exc:
            logger.error(f"Lỗi không xác định khi tạo lượt đối thoại AI: {exc}", exc_info=True)
            raise RuntimeError(f"Lỗi xử lý phản xạ AI: {str(exc)}") from exc

    def _clean_json_markdown(self, raw_text: str) -> str:
        """
        Làm sạch chuỗi JSON nếu mô hình bao quanh bởi khối mã Markdown (```json ... ```).
        """
        cleaned = raw_text.strip()
        if cleaned.startswith("```"):
            lines = cleaned.split("\n")
            if lines and lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            cleaned = "\n".join(lines).strip()
        return cleaned


# Khởi tạo một thể hiện dùng chung (Singleton) cho toàn bộ ứng dụng
gemini_service = GeminiService()
