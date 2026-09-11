"""
Điểm cuối kết nối WebSocket phục vụ giao tiếp hai chiều thời gian thực trong HutechPoly-AI.
Quản lý vòng đời kết nối, cơ chế nhịp tim giữ kết nối (ping-pong) và định dạng tin nhắn JSON chuẩn.
"""

import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

# Thiết lập bộ ghi log riêng cho tầng WebSocket
logger = logging.getLogger("hutechpoly.websocket")

router = APIRouter(tags=["Giao tiếp WebSocket"])


class ConnectionManager:
    """
    Lớp quản lý danh sách các kết nối WebSocket đang hoạt động.
    Hỗ trợ kết nối, ngắt kết nối an toàn, gửi tin nhắn cá nhân và phát thông điệp hàng loạt (broadcast).
    """

    def __init__(self):
        # Danh sách lưu trữ các đối tượng WebSocket của các sinh viên đang kết nối
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        """
        Chấp thuận yêu cầu kết nối từ phía Client và lưu vào danh sách quản lý.
        """
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"Một Client vừa kết nối thành công. Tổng số kết nối hiện tại: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """
        Loại bỏ kết nối khỏi danh sách khi Client chủ động đóng hoặc mất tín hiệu.
        """
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"Một Client đã ngắt kết nối. Số kết nối còn lại: {len(self.active_connections)}")

    async def send_json(self, message: Dict[str, Any], websocket: WebSocket):
        """
        Gửi dữ liệu dạng từ điển (dict) dưới dạng chuỗi JSON có hỗ trợ ký tự tiếng Việt có dấu.
        """
        try:
            # ensure_ascii=False để giữ nguyên tiếng Việt và các ký tự tiếng Nhật/Hàn
            await websocket.send_text(json.dumps(message, ensure_ascii=False))
        except Exception as exc:
            logger.error(f"Gặp sự cố khi gửi dữ liệu qua WebSocket: {exc}")

    async def broadcast(self, message: Dict[str, Any]):
        """
        Phát tin nhắn đồng loạt tới tất cả các kết nối đang mở trong hệ thống.
        """
        for connection in list(self.active_connections):
            await self.send_json(message, connection)


# Khởi tạo đối tượng quản lý kết nối dùng chung cho toàn bộ cổng WebSocket
manager = ConnectionManager()


@router.websocket("/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    """
    Điểm cuối WebSocket hai chiều (Full-Duplex) nhận và phản hồi tin nhắn trực tiếp.
    Đường dẫn: /ws/chat
    """
    # 1. Tiếp nhận kết nối từ sinh viên
    await manager.connect(websocket)

    # 2. Phản hồi gói tin xác nhận kết nối thành công đầu tiên cho Client
    await manager.send_json(
        {
            "type": "connection_ack",
            "message": "Kết nối thành công đến Cổng WebSocket HutechPoly-AI",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
        websocket,
    )

    try:
        while True:
            # Chờ nhận tin nhắn văn bản từ phía giao diện Web/Mobile
            raw_data = await websocket.receive_text()

            # 3. Phân tích chuỗi JSON an toàn, tránh lỗi làm sập tiến trình
            try:
                payload = json.loads(raw_data)
            except json.JSONDecodeError:
                await manager.send_json(
                    {
                        "type": "error",
                        "error": "Dữ liệu gửi lên không đúng định dạng JSON hợp lệ",
                        "received_raw": raw_data,
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    },
                    websocket,
                )
                continue

            # Xác định loại tin nhắn (mặc định là 'message' nếu không truyền)
            msg_type = payload.get("type", "message").lower()

            # 4. Xử lý cơ chế nhịp tim giữ kết nối (Heartbeat / Ping-Pong)
            if msg_type == "ping":
                await manager.send_json(
                    {
                        "type": "pong",
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                    },
                    websocket,
                )
                continue

            # 5. Xử lý tin nhắn đàm thoại thông thường (Phản hồi dạng Echo có kèm nhãn thời gian)
            content = payload.get("content") or payload.get("message") or payload.get("data", "")
            topic_id = payload.get("topic_id", "CHỦ_ĐỀ_CHUNG")

            echo_response = {
                "type": "message",
                "topic_id": topic_id,
                "data": {
                    "echo": content,
                    "status": "received",
                    "received_at": datetime.now(timezone.utc).isoformat(),
                },
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

            # Gửi gói phản hồi JSON ngược trở lại cho thiết bị của sinh viên
            await manager.send_json(echo_response, websocket)

    except WebSocketDisconnect:
        # Bắt sự kiện Client chủ động đóng ứng dụng hoặc thoát trang để dọn dẹp bộ nhớ
        manager.disconnect(websocket)
        logger.info("Sinh viên đã đóng kết nối WebSocket an toàn.")

    except Exception as exc:
        # Bắt toàn bộ các ngoại lệ bất ngờ khác nhằm đảm bảo Server luôn hoạt động liên tục 24/7
        logger.error(f"Phát hiện lỗi không mong muốn trên luồng WebSocket: {exc}", exc_info=True)
        manager.disconnect(websocket)
        try:
            await websocket.close(code=1011, reason="Lỗi máy chủ nội bộ")
        except Exception:
            pass
