"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import TopicCard from "@/components/TopicCard";
import { Topic, TopicListResponse } from "@/types/topic";
import {
  Search,
  RefreshCw,
  MessageSquare,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  GraduationCap,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Filter,
} from "lucide-react";

// Danh mục Tab phân hệ theo Khoa/Viện tại HUTECH
const FACULTY_TABS = [
  { id: "ALL", label: "Tất cả chuyên đề", count: 24, flag: "🌐", lang: "" },
  { id: "EN", label: "Khoa Ngoại ngữ", count: 8, flag: "🇬🇧", lang: "en" },
  { id: "JA", label: "Viện VJIT (Nhật)", count: 8, flag: "🇯🇵", lang: "ja" },
  { id: "KO", label: "Viện Việt - Hàn", count: 8, flag: "🇰🇷", lang: "ko" },
];

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Bộ lọc chuyên môn
  const [selectedLang, setSelectedLang] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Tải dữ liệu từ Backend FastAPI
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
          `Máy chủ học vụ phản hồi mã: ${response.status} (${response.statusText})`
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

  // Lọc tìm kiếm theo từ khóa
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
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col font-sans text-slate-800">
      <Header />

      {/* 1. Academic Hero Section: Bố cục trang trọng chuẩn Hội đồng Học vụ */}
      <section className="bg-white border-b border-slate-200/90 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb học thuật */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-[#0054A6] transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-slate-600">Cổng Học Vụ Điện Tử</span>
            <span>/</span>
            <span className="text-[#0054A6] font-bold">
              Phân hệ Luyện Phản Xạ Đa Ngữ (HutechPoly-AI)
            </span>
          </div>

          {/* Tiêu đề chính và Giới thiệu phân hệ */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[#0054A6] text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-[#0054A6]" />
                <span>Đại học HUTECH • Đề tài Khóa luận Tốt nghiệp Công nghệ Thông tin</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0054A6] tracking-tight">
                HỆ THỐNG LUYỆN PHẢN XẠ NGOẠI NGỮ THÔNG MINH
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                Môi trường đàm thoại đa ngữ thời gian thực dành cho sinh viên{" "}
                <strong className="text-slate-900 font-semibold">Khoa Ngoại ngữ</strong> (Tiếng Anh),{" "}
                <strong className="text-slate-900 font-semibold">Viện VJIT</strong> (Tiếng Nhật) và{" "}
                <strong className="text-slate-900 font-semibold">Viện Việt - Hàn</strong> (Tiếng Hàn), phục vụ cọ xát thực chiến và đáp ứng chuẩn đầu ra giao tiếp quốc tế.
              </p>
            </div>

            {/* Khung hướng dẫn tính năng Bilingual Fallback */}
            <div className="w-full lg:w-96 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-2 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0054A6]">
                <Sparkles className="w-4 h-4 text-[#E31B23]" />
                <span>Cơ chế phản xạ thông minh (Bilingual Fallback)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Sinh viên có thể <strong className="text-[#E31B23]">nói chêm Tiếng Việt</strong> khi gặp khó khăn về từ vựng. Trợ giảng AI bản xứ sẽ lập tức giải nghĩa ngữ cảnh, đối thoại tự nhiên và gợi ý sửa lỗi phát âm/ngữ pháp song ngữ.
              </p>
            </div>
          </div>

          {/* Dải chỉ số đo lường học vụ (Academic Metrics Bar) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0054A6] flex items-center justify-center font-black text-sm shrink-0">
                24
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Chuyên đề học tập</div>
                <div className="text-[11px] text-slate-500">8 Anh • 8 Nhật • 8 Hàn</div>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                &lt; 1.2s
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Độ trễ toàn trình</div>
                <div className="text-[11px] text-slate-500">Voice Streaming 2 chiều</div>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-[#E31B23] flex items-center justify-center font-black text-sm shrink-0">
                03
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Khoa / Viện thụ hưởng</div>
                <div className="text-[11px] text-slate-500">Chuẩn đầu ra HUTECH</div>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shrink-0">
                100%
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Phản hồi ngữ pháp</div>
                <div className="text-[11px] text-slate-500">Hiệu đính song ngữ tức thì</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Thân trang: Thanh điều khiển học vụ và Lưới danh mục chủ đề */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hộp điều khiển lọc & Tìm kiếm */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs mb-8 space-y-4">
          {/* Hàng Tabs chuyển đổi Khoa/Viện chuyên ngữ */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
            {FACULTY_TABS.map((tab) => {
              const isActive = selectedLang === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedLang(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-[#0054A6] text-white shadow-2xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                  }`}
                >
                  <span>{tab.flag}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Hàng Tìm kiếm & Lọc độ khó */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo mã môn (ENG-T01...), tên chủ đề, vai trò AI..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:bg-white text-slate-800 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-semibold text-slate-700">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-transparent focus:outline-none font-bold text-slate-800 cursor-pointer"
                >
                  <option value="ALL">Tất cả cấp độ</option>
                  <option value="easy">Sơ cấp (A1 - A2)</option>
                  <option value="medium">Trung cấp (B1 - B2)</option>
                  <option value="hard">Nâng cao (C1 - C2)</option>
                </select>
              </div>

              <button
                onClick={fetchTopics}
                title="Làm mới danh sách chủ đề"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-600 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin text-[#0054A6]" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Báo lỗi kết nối nếu có */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-8">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-900 mb-1">
              Chưa thể kết nối cơ sở dữ liệu học vụ
            </h3>
            <p className="text-xs text-red-600 max-w-md mx-auto mb-4">{error}</p>
            <button
              onClick={fetchTopics}
              className="px-4 py-2 bg-[#0054A6] hover:bg-[#003B7A] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thử kết nối lại máy chủ</span>
            </button>
          </div>
        )}

        {/* Trạng thái Skeleton Loading */}
        {loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded w-20" />
                  <div className="h-4 bg-slate-200 rounded w-24" />
                </div>
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-14 bg-slate-100 rounded-xl" />
                <div className="h-8 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Danh sách Thẻ Học Phần Đàm Thoại */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Danh Mục Chuyên Đề Học Vụ Trực Tuyến
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#0054A6] text-white">
                  {filteredTopics.length}
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Nhấn vào chuyên đề để bắt đầu phiên luyện phản xạ
              </span>
            </div>

            {filteredTopics.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700">
                  Không tìm thấy chuyên đề phù hợp với bộ lọc
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Vui lòng chọn lại Khoa/Viện hoặc thay đổi từ khóa tìm kiếm.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredTopics.map((topic) => (
                  <TopicCard key={topic.topic_code} topic={topic} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* 3. Footer chuẩn nhận diện Đại học HUTECH */}
      <footer className="bg-[#003B7A] text-white pt-8 pb-5 border-b-4 border-[#E31B23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-blue-800/60 text-xs">
            {/* Cột 1: Thông tin Trường & Đồ án tốt nghiệp */}
            <div className="space-y-3">
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TP.HCM (HUTECH)
                </span>
                <span className="text-[11px] text-blue-200 font-medium">
                  Khoa Công nghệ Thông tin • Đề tài Khóa Luận Tốt Nghiệp 2026
                </span>
              </div>
              <p className="text-blue-100/80 leading-relaxed">
                Hệ thống đàm thoại thông minh ứng dụng AI phản xạ phục vụ sinh viên chuyên ngữ các hệ đào tạo chính quy, chuẩn Nhật Bản (VJIT) và chuẩn Hàn Quốc (VKIT).
              </p>
            </div>

            {/* Cột 2: Các cơ sở đào tạo chính thức */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-[#FFC20E] uppercase tracking-wider block">
                CÁC CƠ SỞ ĐÀO TẠO HUTECH
              </span>
              <ul className="space-y-1.5 text-blue-100/90">
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC20E] shrink-0 mt-0.5" />
                  <span><strong>Trụ sở:</strong> 475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC20E] shrink-0 mt-0.5" />
                  <span><strong>Cơ sở Ung Văn Khiêm:</strong> 31/36 Ung Văn Khiêm, P.25, Q.Bình Thạnh, TP.HCM</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC20E] shrink-0 mt-0.5" />
                  <span><strong>Khu Công nghệ cao:</strong> Phân hiệu HUTECH tại Khu Công nghệ cao TP.Thủ Đức</span>
                </li>
              </ul>
            </div>

            {/* Cột 3: Hỗ trợ học vụ */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-[#FFC20E] uppercase tracking-wider block">
                LIÊN HỆ HỌC VỤ & KỸ THUẬT
              </span>
              <p className="text-blue-100 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFC20E]" />
                <span>Tổng đài học vụ: <strong>(028) 710 566 86</strong></span>
              </p>
              <p className="text-blue-100 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FFC20E]" />
                <span>hocvudientu@hutech.edu.vn</span>
              </p>
              <div className="pt-2">
                <Link
                  href="https://hocvudientu.hutech.edu.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#FFC20E] hover:underline font-bold"
                >
                  <span>Truy cập Cổng Học Vụ Điện Tử HUTECH</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-blue-300">
            <span>© 2026 HutechPoly-AI • Khóa Luận Tốt Nghiệp CNTT trao tặng Trường Đại học HUTECH.</span>
            <span>Hệ thống vận hành theo chuẩn khung năng lực CEFR / JLPT / TOPIK.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
