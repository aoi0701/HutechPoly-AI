"use client";

import React, { useEffect, useState, useMemo } from "react";
import Header from "@/components/Header";
import TopicCard from "@/components/TopicCard";
import { Topic, TopicListResponse } from "@/types/topic";
import {
  Search,
  Sparkles,
  Zap,
  Globe,
  RefreshCw,
  MessageSquare,
  Award,
  AlertCircle,
} from "lucide-react";

// Danh sách các tab ngôn ngữ lọc chính
const LANGUAGE_TABS = [
  { id: "ALL", label: "Tất cả chủ đề", flag: "🌐" },
  { id: "EN", label: "Tiếng Anh (EN)", flag: "🇬🇧" },
  { id: "JA", label: "Tiếng Nhật (JA)", flag: "🇯🇵" },
  { id: "KO", label: "Tiếng Hàn (KO)", flag: "🇰🇷" },
];

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái bộ lọc
  const [selectedLang, setSelectedLang] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Hàm tải danh sách chủ đề từ Backend FastAPI
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
          `Máy chủ phản hồi mã lỗi: ${response.status} (${response.statusText})`
        );
      }

      const data: TopicListResponse = await response.json();
      setTopics(data.items || []);
    } catch (err: any) {
      console.error("Lỗi kết nối Backend:", err);
      setError(
        err.message ||
          "Không thể kết nối đến máy chủ Backend FastAPI. Vui lòng kiểm tra cổng 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  // Gọi lại API mỗi khi thay đổi Tab ngôn ngữ hoặc độ khó
  useEffect(() => {
    fetchTopics();
  }, [selectedLang, selectedDifficulty]);

  // Lọc thêm theo ô tìm kiếm ở phía Client
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(
      (t) =>
        t.title_vi.toLowerCase().includes(q) ||
        t.title_native.toLowerCase().includes(q) ||
        t.topic_code.toLowerCase().includes(q) ||
        t.ai_persona.toLowerCase().includes(q)
    );
  }, [topics, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      {/* Hero Banner nhận diện thương hiệu HUTECH */}
      <section className="bg-gradient-to-b from-[#003B7A] to-[#002752] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Họa tiết nền trang trí */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F58220] blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Khóa Luận Tốt Nghiệp CNTT • Trao Tặng Trường Đại Học HUTECH</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Luyện Phản Xạ Đa Ngữ Cùng{" "}
            <span className="text-[#F58220] inline-block underline decoration-[#F58220]/40">
              HutechPoly AI
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-blue-100/90 leading-relaxed mb-8">
            Phá vỡ lối học kịch bản gò bó. Tự do đàm thoại theo 24 chủ đề thực chiến
            cùng AI bản xứ. Nếu bí từ, bạn có thể{" "}
            <strong className="text-[#F58220] font-bold">
              nói chêm Tiếng Việt
            </strong>{" "}
            — AI sẽ hiểu ý, đối đáp bằng ngoại ngữ và sửa lỗi tận tình!
          </p>

          {/* Hộp chỉ số ấn tượng */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-[#F58220]">
                24
              </div>
              <div className="text-xs text-blue-200 mt-1">
                Chủ đề thực chiến
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">3</div>
              <div className="text-xs text-blue-200 mt-1">
                Khoa / Viện HUTECH
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-[#F58220]">
                &lt; 1.2s
              </div>
              <div className="text-xs text-blue-200 mt-1">
                Phản xạ siêu tốc
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="text-2xl sm:text-3xl font-black text-white">
                Bilingual
              </div>
              <div className="text-xs text-blue-200 mt-1">Cơ chế cứu cánh bí từ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Khu vực nội dung chính: Bộ lọc và Lưới thẻ chủ đề */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Thanh công cụ tìm kiếm và lọc */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm mb-8 space-y-4">
          {/* Tabs Lựa Chọn Ngôn Ngữ */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
            {LANGUAGE_TABS.map((tab) => {
              const isActive = selectedLang === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedLang(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-200 ${
                    isActive
                      ? "bg-[#003B7A] text-white shadow-md shadow-blue-950/20 scale-[1.02]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                placeholder="Tìm kiếm theo tên chủ đề, từ khóa, vai trò AI..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003B7A] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3.5 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#003B7A]"
              >
                <option value="ALL">Mọi cấp độ</option>
                <option value="easy">Cơ bản (Dễ)</option>
                <option value="medium">Trung cấp (Vừa)</option>
                <option value="hard">Nâng cao (Khó)</option>
              </select>

              <button
                onClick={fetchTopics}
                title="Tải lại dữ liệu"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Trạng thái Lỗi kết nối */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-900 mb-1">
              Chưa thể tải danh sách chủ đề từ Backend
            </h3>
            <p className="text-sm text-red-600 max-w-md mx-auto mb-4">{error}</p>
            <button
              onClick={fetchTopics}
              className="px-4 py-2 bg-[#003B7A] hover:bg-[#F58220] text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử kết nối lại</span>
            </button>
          </div>
        )}

        {/* Trạng thái Đang Tải (Skeleton Loading) */}
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
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Danh Mục Chủ Đề Đàm Thoại</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#003B7A] text-white">
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
                  Vui lòng thử thay đổi từ khóa tìm kiếm hoặc chọn bộ lọc ngôn ngữ khác.
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

      {/* Footer bản quyền đồ án hiến tặng */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-300">
            Dự án Tốt nghiệp CNTT • Hệ thống Luyện phản xạ đa ngữ HutechPoly AI
          </p>
          <p>
            Kính tặng Trường Đại học Công nghệ TP.HCM (HUTECH) • Khoa Ngoại ngữ •
            Viện VJIT • Viện Việt - Hàn
          </p>
        </div>
      </footer>
    </div>
  );
}
