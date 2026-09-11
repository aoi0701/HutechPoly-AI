"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import TopicCard from "@/components/TopicCard";
import { Topic, TopicListResponse } from "@/types/topic";
import {
  Search,
  Sparkles,
  RefreshCw,
  MessageSquare,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

// Các tab lọc đơn vị Khoa/Viện chuyên môn tại HUTECH
const FACULTY_TABS = [
  { id: "ALL", label: "Tất cả chủ đề (24)", flag: "🌐", code: "" },
  { id: "EN", label: "Khoa Ngoại ngữ (Anh)", flag: "🇬🇧", code: "en" },
  { id: "JA", label: "Viện VJIT (Nhật)", flag: "🇯🇵", code: "ja" },
  { id: "KO", label: "Viện Việt - Hàn (Hàn)", flag: "🇰🇷", code: "ko" },
];

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Bộ lọc
  const [selectedLang, setSelectedLang] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Gọi API danh sách chủ đề từ Backend FastAPI
  const fetchTopics = async () => {
    setLoading(true);
    setError(null);

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    try {
      const url = new URL(`${apiUrl}/topics`);
      if (selectedLang !== "ALL") {
        url.searchParams.append("language", selectedLang.toLowerCase());
      }
      if (selectedDifficulty !== "ALL") {
        url.searchParams.append("difficulty", selectedDifficulty.toLowerCase());
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Máy chủ phản hồi mã: ${response.status} (${response.statusText})`
        );
      }

      const data: TopicListResponse = await response.json();
      setTopics(data.items || []);
    } catch (err: any) {
      console.error("Lỗi khi tải danh mục chủ đề:", err);
      setError(
        err.message ||
          "Không thể kết nối đến máy chủ Backend. Vui lòng đảm bảo cổng 8000 đang hoạt động."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [selectedLang, selectedDifficulty]);

  // Lọc theo từ khóa tìm kiếm
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(
      (t) =>
        t.title_vi.toLowerCase().includes(q) ||
        t.title_native.toLowerCase().includes(q) ||
        t.topic_code.toLowerCase().includes(q) ||
        t.ai_persona.toLowerCase().includes(q) ||
        t.faculty.toLowerCase().includes(q)
    );
  }, [topics, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans">
      <Header />

      {/* Hero Banner chuẩn phong cách Cổng Học Vụ Điện Tử HUTECH */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Họa tiết trang trí lượn sóng và chấm ma trận chuẩn HUTECH */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-50/50 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Cột Trái: Tiêu đề & Giới thiệu đề tài */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0054A6] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#E31B23]" />
                <span>Khóa Luận Tốt Nghiệp CNTT • Trao Tặng Trường Đại Học HUTECH</span>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <h1 className="text-3xl sm:text-5xl font-black text-[#0054A6] tracking-tight">
                  HỆ THỐNG
                </h1>
                <span className="text-2xl sm:text-4xl font-black text-white bg-[#E31B23] px-4 py-1 rounded-2xl shadow-sm">
                  LUYỆN PHẢN XẠ ĐA NGỮ
                </span>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                Nền tảng luyện giao tiếp thông minh theo chủ đề đa dạng dành riêng cho sinh viên{" "}
                <strong className="text-[#0054A6]">Khoa Ngoại ngữ</strong>,{" "}
                <strong className="text-[#E31B23]">Viện VJIT</strong> và{" "}
                <strong className="text-amber-700">Viện Việt - Hàn</strong>.
              </p>

              {/* Thông báo cơ chế song ngữ đặc biệt */}
              <div className="bg-gradient-to-r from-blue-50 to-amber-50/60 border border-blue-200/80 rounded-2xl p-4 max-w-2xl text-xs sm:text-sm text-slate-800 leading-relaxed shadow-2xs">
                <div className="font-bold text-[#0054A6] flex items-center gap-1.5 mb-1">
                  <span>💡</span>
                  <span>Cơ chế phản xạ song ngữ đặc biệt (Bilingual Fallback):</span>
                </div>
                <p className="text-slate-600">
                  Khi sinh viên bị bí từ, bạn có thể{" "}
                  <strong className="text-[#E31B23] font-bold">
                    nói chêm Tiếng Việt
                  </strong>
                  . Hệ thống AI vẫn hiểu trọn vẹn ngữ cảnh, đối đáp bằng Ngoại ngữ bản xứ chuẩn mực và chỉ ra lỗi ngữ pháp kèm từ vựng gợi ý tức thì!
                </p>
              </div>
            </div>

            {/* Cột Phải: Thẻ thông số tóm tắt đồ án */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-center shadow-2xs hover:border-[#0054A6] transition-colors">
                <div className="text-3xl font-black text-[#0054A6]">24</div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  Chủ đề thực chiến
                </div>
                <div className="text-[10px] text-slate-400">8 Anh • 8 Nhật • 8 Hàn</div>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-center shadow-2xs hover:border-[#E31B23] transition-colors">
                <div className="text-3xl font-black text-[#E31B23]">&lt; 1.2s</div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  Độ trễ toàn trình
                </div>
                <div className="text-[10px] text-slate-400">Streaming hai chiều</div>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-center shadow-2xs hover:border-[#0054A6] transition-colors">
                <div className="text-3xl font-black text-[#0054A6]">3</div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  Khoa / Viện thụ hưởng
                </div>
                <div className="text-[10px] text-slate-400">Chuẩn đầu ra HUTECH</div>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-center shadow-2xs hover:border-emerald-600 transition-colors">
                <div className="text-3xl font-black text-emerald-600">&gt; 90%</div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  Độ chính xác STT
                </div>
                <div className="text-[10px] text-slate-400">Deepgram / Whisper</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thân trang: Thanh lọc Tab Khoa/Viện và Lưới 24 chủ đề */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hộp điều khiển lọc & Tìm kiếm chuẩn giao diện học vụ */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
          {/* Tabs chuyển đổi Khoa/Viện */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
            {FACULTY_TABS.map((tab) => {
              const isActive = selectedLang === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedLang(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                    isActive
                      ? "bg-[#0054A6] text-white shadow-sm scale-[1.01]"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span className="text-base">{tab.flag}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Ô Tìm Kiếm và Lọc Cấp Độ Khó */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo mã chủ đề (ENG-T01...), tên bài học, vai trò AI..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:bg-white transition-colors text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3.5 py-2.5 text-xs sm:text-sm font-bold bg-slate-50 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0054A6]"
              >
                <option value="ALL">Tất cả cấp độ</option>
                <option value="easy">Cơ bản (Dễ)</option>
                <option value="medium">Trung cấp (Vừa)</option>
                <option value="hard">Nâng cao (Khó)</option>
              </select>

              <button
                onClick={fetchTopics}
                title="Tải lại danh sách chủ đề"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin text-[#0054A6]" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Thông báo lỗi kết nối */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-900 mb-1">
              Chưa thể tải danh mục chủ đề từ Backend
            </h3>
            <p className="text-sm text-red-600 max-w-md mx-auto mb-4">{error}</p>
            <button
              onClick={fetchTopics}
              className="px-4 py-2 bg-[#0054A6] hover:bg-[#E31B23] text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử kết nối lại</span>
            </button>
          </div>
        )}

        {/* Trạng thái Skeleton Loading */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-slate-200 rounded w-20" />
                  <div className="h-5 bg-slate-200 rounded w-24" />
                </div>
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-16 bg-slate-100 rounded-xl" />
                <div className="h-9 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Danh sách Thẻ Chủ Đề */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                <span>Danh Mục Chủ Đề Đàm Thoại</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0054A6] text-white">
                  {filteredTopics.length}
                </span>
              </h2>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">
                  Không tìm thấy chủ đề phù hợp
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Vui lòng thử chọn lại Khoa/Viện hoặc từ khóa tìm kiếm.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.topic_code} topic={topic} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer chuẩn Cổng Học vụ Đại học HUTECH */}
      <footer className="bg-[#0054A6] text-white pt-8 pb-4 border-b-4 border-[#E31B23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-blue-400/30 text-xs">
            {/* Cột 1: Thông tin Trường */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white">
                  TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TP.HCM (HUTECH)
                </span>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Khóa Luận Tốt Nghiệp Ngành Công Nghệ Thông Tin
              </p>
              <p className="text-blue-200">
                Đề tài: Hệ thống Luyện phản xạ hội thoại thông minh HutechPoly AI
              </p>
            </div>

            {/* Cột 2: Đơn vị Thụ Hưởng & Phòng ban */}
            <div className="space-y-2">
              <span className="font-bold text-sm text-[#FFC20E] block">
                ĐƠN VỊ ĐÀO TẠO NGOẠI NGỮ
              </span>
              <ul className="space-y-1 text-blue-100">
                <li>• Khoa Ngoại ngữ (Tiếng Anh - VSTEP / IELTS)</li>
                <li>• Viện Công nghệ Việt - Nhật (VJIT - Kaiwa N5-N2)</li>
                <li>• Viện Công nghệ Việt - Hàn (Tiếng Hàn & TOPIK)</li>
              </ul>
            </div>

            {/* Cột 3: Liên hệ hỗ trợ học vụ */}
            <div className="space-y-2">
              <span className="font-bold text-sm text-[#FFC20E] block">
                HỖ TRỢ HỌC VỤ & KỸ THUẬT
              </span>
              <p className="text-blue-100 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#FFC20E]" />
                <span>Hotline: (028) 710 566 86</span>
              </p>
              <p className="text-blue-100 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FFC20E]" />
                <span>hocvudientu@hutech.edu.vn</span>
              </p>
              <p className="text-blue-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFC20E]" />
                <span>475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM</span>
              </p>
            </div>
          </div>

          <div className="pt-4 text-center text-[11px] text-blue-200">
            © 2026 HutechPoly AI • Sản phẩm khóa luận tốt nghiệp hiến tặng Đại học HUTECH. Mọi quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  );
}
