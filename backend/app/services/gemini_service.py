"""
Mô-đun dịch vụ trí tuệ nhân tạo Gemini dành cho dự án HutechPoly-AI.
Tích hợp bộ công cụ Google Gemini 2.5 Flash SDK phục vụ hội thoại phản xạ đa ngữ thời gian thực.
"""

import logging
from typing import AsyncGenerator, Dict, List, Optional
from app.core.config import settings

# Thiết lập bộ ghi log riêng cho dịch vụ Gemini
logger = logging.getLogger("hutechpoly.gemini")

# Kiểm tra an toàn xem thư viện google-genai đã được cài đặt trong môi trường hay chưa
try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("Thư viện google-genai chưa được cài đặt. Vui lòng chạy lệnh: pip install -r requirements.txt.")


class GeminiService:
    """
    Lớp điều phối dịch vụ tương tác với mô hình ngôn ngữ lớn Google Gemini 2.5 Flash.
    Chịu trách nhiệm quản lý ngữ cảnh hội thoại (cửa sổ trượt 8 lượt) và truyền dữ liệu dạng luồng (streaming).
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Khởi tạo dịch vụ Gemini với khóa API được cung cấp hoặc lấy từ cấu hình hệ thống.
        """
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._client = None

        if GENAI_AVAILABLE and self.api_key:
            try:
                # Khởi tạo đối tượng Client chính thức từ Google GenAI SDK
                self._client = genai.Client(api_key=self.api_key)
                logger.info(f"Khởi tạo thành công Gemini Client với mô hình {self.model_name}.")
            except Exception as exc:
                logger.error(f"Lỗi khi khởi tạo kết nối đến Gemini: {exc}")
                self._client = None
        else:
            if not self.api_key:
                logger.info("Chưa tìm thấy GEMINI_API_KEY. Dịch vụ sẵn sàng hoạt động ngay khi có khóa API.")

    async def stream_conversation(
        self,
        prompt: str,
        context: Optional[List[Dict[str, str]]] = None,
        system_instruction: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Hàm bất đồng bộ (async generator) truyền dữ liệu hội thoại từng phần (streaming) từ Gemini 2.5 Flash.

        Tham số:
            prompt (str): Câu nói mới nhất của sinh viên gửi lên.
            context (list, tùy chọn): Danh sách các lượt thoại trước đó trong phiên luyện tập.
            system_instruction (str, tùy chọn): Lời nhắc hệ thống định hình vai trò (Persona) theo chủ đề HUTECH.

        Trả về (Yield):
            Từng đoạn ký tự văn bản (chunk) phản hồi từ AI theo thời gian thực.
        """
        # Nếu chưa cấu hình khóa API, phản hồi thông báo hướng dẫn thay vì làm sập ứng dụng
        if not self._client:
            yield (
                f"[HutechPoly-AI Gemini Service]: Hệ thống đã sẵn sàng nhận diện phản xạ. "
                f"Vui lòng thiết lập biến môi trường GEMINI_API_KEY trong file .env để kích hoạt mô hình {self.model_name}."
            )
            return

        try:
            # Chuẩn bị danh sách nội dung gửi sang Gemini, áp dụng cửa sổ trượt tối đa 8 lượt thoại gần nhất
            contents = []
            if context:
                # Giới hạn 8 lượt thoại gần nhất theo quy định trong PROJECT_RULES.md để tối ưu hóa bộ nhớ và độ trễ
                sliding_context = context[-8:]
                for turn in sliding_context:
                    role = turn.get("role", "user")
                    content = turn.get("content", "")
                    contents.append({"role": role, "parts": [{"text": content}]})

            # Đưa câu nói hiện tại của sinh viên vào cuối danh sách hội thoại
            contents.append({"role": "user", "parts": [{"text": prompt}]})

            # Cấu hình lời nhắc chỉ dẫn hệ thống (System Prompt) nếu có
            config = None
            if system_instruction:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,  # Độ sáng tạo vừa phải giúp câu đối đáp tự nhiên và chuẩn xác
                )

            # Thực hiện gọi API bất đồng bộ theo luồng streaming từ Google GenAI SDK
            response_stream = await self._client.aio.models.generate_content_stream(
                model=self.model_name,
                contents=contents,
                config=config,
            )

            # Lần lượt trả từng đoạn văn bản (chunk) về cho tầng WebSocket gửi xuống giao diện người dùng
            async for chunk in response_stream:
                if chunk.text:
                    yield chunk.text

        except Exception as exc:
            logger.error(f"Phát sinh lỗi trong quá trình AI stream dữ liệu: {exc}", exc_info=True)
            yield f"[Lỗi xử lý AI]: Không thể hoàn thành luồng đối đáp ({str(exc)})"


# Khởi tạo một thể hiện dùng chung (Singleton) cho toàn bộ ứng dụng
gemini_service = GeminiService()
