"""
Tập lệnh kiểm thử tự động các Endpoint Topics API.
"""

import sys
from pathlib import Path

# Thêm thư mục backend vào sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient
from main import app

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

client = TestClient(app)

print("=" * 60)
print("KIỂM THỬ CÁC ENDPOINT TOPICS API - HUTECHPOLY-AI")
print("=" * 60)

# 1. Kiểm thử /health
print("\n[TEST 1] Kiểm tra GET /health:")
r1 = client.get("/health")
print(f" -> Mã phản hồi: {r1.status_code}")
print(f" -> Dữ liệu: {r1.json()}")

# 2. Kiểm thử GET /api/topics (Tất cả chủ đề)
print("\n[TEST 2] Kiểm tra GET /api/topics (Danh sách toàn bộ):")
r2 = client.get("/api/topics")
print(f" -> Mã phản hồi: {r2.status_code}")
data2 = r2.json()
print(f" -> Tổng số chủ đề: {data2.get('total')}")

# 3. Kiểm thử lọc theo ngôn ngữ GET /api/topics?language=JA
print("\n[TEST 3] Kiểm tra GET /api/topics?language=JA (Chỉ tiếng Nhật):")
r3 = client.get("/api/topics?language=JA")
print(f" -> Mã phản hồi: {r3.status_code}")
data3 = r3.json()
print(f" -> Số lượng chủ đề tiếng Nhật: {data3.get('total')}")

# 4. Kiểm thử lọc theo cấp độ GET /api/topics?difficulty=beginner
print("\n[TEST 4] Kiểm tra GET /api/topics?difficulty=beginner (Chỉ cấp độ Dễ):")
r4 = client.get("/api/topics?difficulty=beginner")
print(f" -> Mã phản hồi: {r4.status_code}")
data4 = r4.json()
print(f" -> Số lượng chủ đề Dễ (Beginner/Easy): {data4.get('total')}")

# 5. Kiểm thử chi tiết chủ đề GET /api/topics/ENG-T01
print("\n[TEST 5] Kiểm tra GET /api/topics/ENG-T01 (Chi tiết chủ đề):")
r5 = client.get("/api/topics/ENG-T01")
print(f" -> Mã phản hồi: {r5.status_code}")
data5 = r5.json()
print(f" -> Mã chủ đề: {data5.get('topic_code')}")
print(f" -> Tiêu đề: {data5.get('title_vi')}")
print(f" -> Số lượng từ vựng kèm theo: {len(data5.get('key_vocab', []))}")

# 6. Kiểm thử trường hợp không tìm thấy chủ đề (Kỳ vọng 404)
print("\n[TEST 6] Kiểm tra GET /api/topics/KHONG_TON_TAI (Kỳ vọng 404):")
r6 = client.get("/api/topics/KHONG_TON_TAI")
print(f" -> Mã phản hồi: {r6.status_code}")
print(f" -> Thông báo lỗi: {r6.json().get('detail')}")

print("\n" + "=" * 60)
if r2.status_code == 200 and r5.status_code == 200 and r6.status_code == 404:
    print("[SUCCESS] TOÀN BỘ CÁC BÀI KIỂM THỬ API ĐỀU VƯỢT QUA XUẤT SẮC!")
else:
    print("[FAILURE] CÓ LỖI XẢY RA TRONG QUÁ TRÌNH KIỂM THỬ!")
print("=" * 60)
