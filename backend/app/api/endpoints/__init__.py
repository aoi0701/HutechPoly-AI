"""
Gói chứa các điểm cuối (Endpoints) cụ thể cho từng giao thức kết nối.
"""

from .websocket import router as websocket_router

__all__ = ["websocket_router"]
