"""
Tập lệnh tự động nạp 24 chủ đề (seed data) vào cơ sở dữ liệu Supabase cho dự án HutechPoly-AI.
Sử dụng SUPABASE_SERVICE_ROLE_KEY để vượt qua chính sách Row Level Security (RLS).
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Thiết lập bảng mã UTF-8 cho console xuất dữ liệu có dấu
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# 1. Xác định đường dẫn các file liên quan
BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
ENV_PATH = BASE_DIR / ".env"
SEED_FILE_PATH = ROOT_DIR / "docs" / "topics" / "topics_seed.json"

print("=" * 70)
print("HUTECHPOLY-AI: BẮT ĐẦU QUÁ TRÌNH NẠP DỮ LIỆU CHỦ ĐỀ VÀO SUPABASE")
print("=" * 70)

# 2. Nạp cấu hình từ file backend/.env
if not ENV_PATH.exists():
    # Thử nạp từ file .env ở thư mục gốc nếu backend/.env không có
    ENV_PATH = ROOT_DIR / ".env"

print(f"[*] Đang tải biến môi trường từ: {ENV_PATH}")
load_dotenv(dotenv_path=ENV_PATH)

supabase_url = os.getenv("SUPABASE_URL")
service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")

if not supabase_url or not service_role_key:
    print("[!] LỖI: Thiếu cấu hình SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong file .env!")
    sys.exit(1)

print(f"[*] Kết nối đến Supabase URL: {supabase_url}")

# 3. Khởi tạo Supabase Client với quyền Quản trị tối cao (Service Role)
try:
    supabase: Client = create_client(supabase_url, service_role_key)
    print("[+] Khởi tạo thành công Supabase Admin Client.")
except Exception as exc:
    print(f"[!] Không thể khởi tạo kết nối Supabase: {exc}")
    sys.exit(1)

# 4. Đọc dữ liệu từ file topics_seed.json
if not SEED_FILE_PATH.exists():
    print(f"[!] LỖI: Không tìm thấy file dữ liệu tại {SEED_FILE_PATH}")
    sys.exit(1)

print(f"[*] Đang đọc dữ liệu từ: {SEED_FILE_PATH}")
with open(SEED_FILE_PATH, "r", encoding="utf-8") as f:
    raw_topics = json.load(f)

print(f"[*] Đã tải {len(raw_topics)} chủ đề từ file JSON.")

# 5. Kiểm tra cấu trúc bảng topics trên Supabase và chuẩn bị payload
# Thử kiểm tra xem bảng topics dùng tên cột là 'topic_code' hay 'topic_id'
sample_item = raw_topics[0]
use_topic_code = True

try:
    # Thử truy vấn 1 bản ghi với cột topic_code
    check_res = supabase.table("topics").select("topic_code").limit(1).execute()
    use_topic_code = True
    print("[*] Bảng 'topics' đang sử dụng khóa 'topic_code'.")
except Exception as check_err:
    err_str = str(check_err).lower()
    if "topic_id" in err_str or "does not exist" in err_str:
        try:
            check_id_res = supabase.table("topics").select("topic_id").limit(1).execute()
            use_topic_code = False
            print("[*] Bảng 'topics' đang sử dụng khóa 'topic_id'.")
        except Exception:
            pass
    print(f"[*] Ghi chú kiểm tra cấu trúc bảng: {check_err}")

# 6. Chuẩn bị danh sách bản ghi để upsert
prepared_records = []
for item in raw_topics:
    topic_identifier = item.get("topic_id")

    record = {
        "language": item.get("language"),
        "faculty": item.get("faculty"),
        "level": item.get("level"),
        "title_vi": item.get("title_vi"),
        "title_native": item.get("title_native"),
        "category": item.get("category"),
        "ai_persona": item.get("ai_persona"),
        "opening_line": item.get("opening_line"),
        "system_instruction": item.get("system_instruction"),
        "key_vocab": item.get("key_vocab", []),
        "metadata": {"source": "topics_seed.json", "version": "1.0"},
        "is_active": True,
    }

    # Gán khóa mã chủ đề tương ứng theo cấu trúc schema
    if use_topic_code:
        record["topic_code"] = topic_identifier
    else:
        record["topic_id"] = topic_identifier

    prepared_records.append(record)

# 7. Tiến hành nạp / cập nhật (Upsert) dữ liệu vào bảng topics
print(f"[*] Đang thực hiện Upsert {len(prepared_records)} bản ghi vào bảng 'topics'...")

success_count = 0
failed_count = 0

# Upsert từng nhóm hoặc từng bản ghi để đảm bảo an toàn và báo cáo chi tiết
upsert_on_conflict = "topic_code" if use_topic_code else "topic_id"

for record in prepared_records:
    code = record.get("topic_code") or record.get("topic_id")
    title = record.get("title_vi")
    lang = record.get("language")
    try:
        # Sử dụng phương thức upsert của supabase-py
        res = supabase.table("topics").upsert(record, on_conflict=upsert_on_conflict).execute()
        if res.data:
            success_count += 1
            print(f"  [OK] Đã nạp thành công chủ đề: [{code}] ({lang.upper()}) - {title}")
        else:
            # Trường hợp một số phiên bản Supabase không trả về data khi upsert không đổi
            success_count += 1
            print(f"  [OK] Nạp thành công: [{code}] ({lang.upper()}) - {title}")
    except Exception as exc:
        failed_count += 1
        print(f"  [X] Thất bại khi nạp chủ đề [{code}]: {exc}")

# 8. Báo cáo tổng kết
print("\n" + "=" * 70)
print(f"TỔNG KẾT NẠP DỮ LIỆU:")
print(f" - Tổng số chủ đề cần nạp : {len(raw_topics)}")
print(f" - Số lượng nạp thành công: {success_count}")
print(f" - Số lượng thất bại      : {failed_count}")
print("=" * 70)

if failed_count == 0 and success_count > 0:
    print("[SUCCESS] Toàn bộ 24 chủ đề đã được nạp thành công vào cơ sở dữ liệu Supabase!")
else:
    print("[WARNING] Có một số bản ghi chưa được nạp. Vui lòng kiểm tra lại cấu trúc bảng trên Supabase.")
