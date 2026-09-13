"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
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
  Filter,
  Monitor,
  ChevronDown,
  ChevronUp,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  Flame,
  Mic,
} from "lucide-react";

// Danh mục Tab phân hệ theo Khoa/Viện tại HUTECH
const FACULTY_TABS = [
  { id: "ALL", label: "Tất cả chuyên đề", count: 24, flag: "🌐", lang: "" },
  { id: "EN", label: "Khoa Ngoại ngữ", count: 8, flag: "🇬🇧", lang: "en" },
  { id: "JA", label: "Viện VJIT (Nhật)", count: 8, flag: "🇯🇵", lang: "ja" },
  { id: "KO", label: "Viện Việt - Hàn", count: 8, flag: "🇰🇷", lang: "ko" },
];

/**
 * Khung tải giả lập (Skeleton Loading) chuẩn hóa chiều cao và tỷ lệ
 * Khớp chính xác 100% kích thước và bố cục của TopicCard thật nhằm triệt tiêu hoàn toàn Layout Shift
 */
function TopicCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden animate-pulse">
      {/* Vạch màu nhận diện trên cùng */}
      <div className="h-1 w-full bg-slate-200" />

      <div className="p-5 sm:p-6 pb-4 space-y-3.5">
        {/* Hàng metadata: Mã topic + Khoa viện + Level */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-slate-200 rounded" />
            <div className="h-5 w-24 bg-slate-100 rounded" />
          </div>
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>

        {/* Tiêu đề tiếng Việt */}
        <div className="h-5 w-4/5 bg-slate-200 rounded" />

        {/* Tiêu đề bản xứ */}
        <div className="h-3.5 w-3/5 bg-slate-100 rounded" />

        {/* Khung Persona AI */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-200 shrink-0 mt-0.5" />
          <div className="w-full space-y-1.5">
            <div className="h-2.5 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-4/5 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Danh sách từ vựng */}
        <div className="space-y-2 pt-1">
          <div className="h-3 w-28 bg-slate-200 rounded" />
          <div className="flex flex-wrap gap-1.5">
            <div className="h-5 w-16 bg-slate-100 rounded-md border border-slate-200/60" />
            <div className="h-5 w-20 bg-slate-100 rounded-md border border-slate-200/60" />
            <div className="h-5 w-14 bg-slate-100 rounded-md border border-slate-200/60" />
          </div>
        </div>
      </div>

      {/* Chân thẻ footer */}
      <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-8 w-32 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function HomePage() {
  // Dữ liệu gốc toàn bộ 24 chủ đề nạp từ Backend (lưu trữ trong bộ nhớ RAM Client)
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Bộ lọc chuyên môn (Client-Side State phản hồi 0ms)
  const [selectedLang, setSelectedLang] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Thu gọn / mở rộng hướng dẫn sử dụng (như ảnh mẫu)
  const [guideOpen, setGuideOpen] = useState<boolean>(false);

  // Tải dữ liệu từ Backend FastAPI (chỉ gọi đúng 1 lần khi vào trang hoặc khi bấm Làm mới)
  const fetchAllTopics = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setInitialLoading(true);
    }
    setError(null);

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    try {
      // Tải trọn vẹn danh mục chủ đề để xử lý lọc tức thì trên RAM
      const response = await fetch(`${apiUrl}/topics?limit=100`, {
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
      setAllTopics(data.items || []);
    } catch (err: any) {
      console.error("Lỗi khi tải danh mục chủ đề:", err);
      setError(
        err.message ||
          "Không thể kết nối đến máy chủ Backend. Vui lòng đảm bảo cổng 8000 đang hoạt động."
      );
    } finally {
      setInitialLoading(false);
      setIsRefreshing(false);
    }
  };

  // Chỉ gọi fetch 1 lần duy nhất khi khởi tạo component (Loại bỏ triệt để độ trễ mạng khi chuyển Tab)
  useEffect(() => {
    fetchAllTopics();
  }, []);

  // Tính toán số lượng chủ đề cho từng Khoa/Viện trực tiếp từ RAM
  const tabCounts = useMemo(() => {
    return {
      ALL: allTopics.length || 24,
      EN: allTopics.filter((t) => t.language.toLowerCase() === "en").length || 8,
      JA: allTopics.filter((t) => t.language.toLowerCase() === "ja").length || 8,
      KO: allTopics.filter((t) => t.language.toLowerCase() === "ko").length || 8,
    };
  }, [allTopics]);

  // Bộ lọc tức thì trên RAM (Instant In-Memory Filter) - Phản xạ 0ms không gọi lại API
  const filteredTopics = useMemo(() => {
    let result = allTopics;

    // 1. Lọc theo ngôn ngữ Khoa / Viện
    if (selectedLang !== "ALL") {
      const targetLang = selectedLang.toLowerCase();
      result = result.filter((t) => t.language.toLowerCase() === targetLang);
    }

    // 2. Lọc theo cấp độ đào tạo
    if (selectedDifficulty !== "ALL") {
      const targetDiff = selectedDifficulty.toLowerCase();
      result = result.filter((t) => {
        const lvl = t.level.toLowerCase();
        if (targetDiff === "easy") return lvl === "easy" || lvl === "dễ" || lvl === "beginner";
        if (targetDiff === "medium") return lvl === "medium" || lvl === "vừa" || lvl === "intermediate";
        if (targetDiff === "hard") return lvl === "hard" || lvl === "nâng cao" || lvl === "advanced";
        return lvl === targetDiff;
      });
    }

    // 3. Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title_vi.toLowerCase().includes(q) ||
          t.title_native.toLowerCase().includes(q) ||
          t.topic_code.toLowerCase().includes(q) ||
          t.ai_persona.toLowerCase().includes(q) ||
          t.faculty.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allTopics, selectedLang, selectedDifficulty, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-row font-sans text-slate-800 w-full overflow-x-hidden">
      {/* 1. CỘT ĐIỀU HƯỚNG DỌC BÊN TRÁI (Sidebar chuẩn Cổng Học Vụ HUTECH như ảnh mẫu) */}
      <Sidebar />

      {/* 2. KHU VỰC CHÍNH TRẢI DÀI 100% TOÀN MÀN HÌNH (Full Width, không bị bó hẹp) */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Banner trường chuẩn nhận diện HUTECH full-width */}
        <Header />

        {/* Thanh collapsible: Cẩm nang luyện phản xạ AI */}
        <div className="w-full bg-white border-b border-slate-200 shadow-2xs">
          <button
            onClick={() => setGuideOpen(!guideOpen)}
            className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0054A6]">
              <Sparkles className="w-4 h-4 text-[#E31B23]" />
              <span>💡 Cẩm nang luyện phản xạ đàm thoại AI cùng HutechPoly AI (nhấn để xem)</span>
            </div>
            {guideOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {guideOpen && (
            <div className="px-4 sm:px-6 py-4 bg-blue-50/40 border-t border-blue-100 text-xs sm:text-sm text-slate-700 space-y-2">
              <p className="font-semibold text-[#0054A6]">
                Chào mừng sinh viên HUTECH đến với Nền tảng Luyện phản xạ Đa ngữ Thông minh HutechPoly AI!
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                <li>
                  <strong>Bước 1:</strong> Chọn phân hệ Khoa / Viện của bạn (Khoa Ngoại ngữ - Tiếng Anh, Viện VJIT - Tiếng Nhật, Viện Việt - Hàn - Tiếng Hàn).
                </li>
                <li>
                  <strong>Bước 2:</strong> Lựa chọn cấp độ phù hợp (Sơ cấp, Trung cấp, Nâng cao) và bấm <em>"Vào luyện phản xạ"</em> tại chuyên đề mong muốn.
                </li>
                <li>
                  <strong>Bước 3:</strong> Sử dụng micro đàm thoại (Push-to-Talk) hoặc gõ văn bản trực tiếp để đối thoại hai chiều với trợ giảng AI bản ngữ.
                </li>
                <li>
                  <strong>Cơ chế cứu cánh song ngữ (Bilingual Fallback):</strong> Khi bị bí từ vựng hoặc chưa nhớ mẫu câu, sinh viên hoàn toàn có thể <strong>nói chêm tiếng Việt</strong>. AI bản ngữ sẽ tự động bắt trúng ngữ cảnh, đối đáp bằng ngoại ngữ và gợi ý sửa lỗi tức thì!
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* 3. BỐ CỤC NỘI DUNG 2 CỘT FULL-SCREEN */}
        <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CỘT TRÁI (Lg: 4/12): HỒ SƠ NGƯỜI HỌC & MỤC TIÊU NĂNG LỰC */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-5">
              {/* Thẻ Hồ sơ người học HutechPoly AI */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                {/* Header Hồ sơ */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0054A6] to-[#003B7A] text-white flex items-center justify-center font-black text-lg shadow-md border-2 border-[#FFC20E]">
                    NT
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                        Nguyễn Phan Ngọc Trường
                      </h2>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-500 block">
                      MSSV: 2380602415 • 23DTHC3
                    </span>
                    <span className="text-xs font-semibold text-[#0054A6] block">
                      Khoa Công nghệ thông tin
                    </span>
                  </div>
                </div>

                {/* Các chỉ số thống kê luyện phản xạ thực tế của sinh viên */}
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#F58220] fill-[#F58220]" />
                      <span>Chuỗi ngày luyện nói (Streak)</span>
                    </span>
                    <strong className="text-[#F58220] font-black text-sm">3 Ngày liên tục</strong>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0054A6]" />
                      <span>Thời gian đàm thoại tuần này</span>
                    </span>
                    <strong className="text-slate-900 font-bold">45 Phút</strong>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tổng câu thoại đã tương tác</span>
                    </span>
                    <strong className="text-emerald-700 font-bold">62 Lượt đàm thoại</strong>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-500 font-medium flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                      <span>Từ vựng mới đã tích lũy</span>
                    </span>
                    <strong className="text-purple-700 font-bold">38 Từ vựng</strong>
                  </div>
                </div>

                {/* Nút hành động vào phòng luyện nói nhanh */}
                <div className="pt-1">
                  <Link
                    href="/practice/ENG-T01"
                    className="w-full py-2.5 px-3 rounded-xl bg-[#0054A6] hover:bg-[#003B7A] text-white text-xs font-bold transition-all text-center shadow-2xs flex items-center justify-center gap-2"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Vào phòng luyện phản xạ ngay</span>
                  </Link>
                </div>
              </div>

              {/* Khung: Mục tiêu năng lực đầu ra 3 Khoa/Viện */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0054A6] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#0054A6]" />
                    <span>MỤC TIÊU NĂNG LỰC ĐẦU RA</span>
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Tiếng Anh */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#0054A6] text-[11px]">
                        EN
                      </span>
                      <span className="font-semibold text-slate-800">Khoa Ngoại ngữ (VSTEP B1/B2)</span>
                    </div>
                    <span className="text-amber-600 font-bold text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Đang luyện</span>
                    </span>
                  </div>

                  {/* Tiếng Nhật */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-[#E31B23] text-[11px]">
                        JA
                      </span>
                      <span className="font-semibold text-slate-800">Viện VJIT (Kaiwa N4 - N2)</span>
                    </div>
                    <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Sẵn sàng</span>
                    </span>
                  </div>

                  {/* Tiếng Hàn */}
                  <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px]">
                        KO
                      </span>
                      <span className="font-semibold text-slate-800">Viện Việt - Hàn (TOPIK 2 - 3)</span>
                    </div>
                    <span className="text-blue-600 font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Sẵn sàng</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Khung thông tin Bilingual Fallback đặc quyền */}
              <div className="bg-gradient-to-br from-blue-50 to-amber-50/50 rounded-2xl border border-blue-200/80 p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0054A6]">
                  <Sparkles className="w-4 h-4 text-[#E31B23]" />
                  <span>Cơ chế độc quyền: Bilingual Fallback</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khi gặp khó khăn về từ vựng hoặc chưa nhớ mẫu câu, sinh viên được phép <strong className="text-[#E31B23]">nói chêm Tiếng Việt</strong>. AI bản ngữ sẽ thấu hiểu ngữ cảnh để đối thoại tự nhiên, đồng thời gợi ý sửa lỗi ngữ pháp & từ vựng thay thế tức thì!
                </p>
              </div>
            </div>

            {/* CỘT PHẢI (Lg: 7/12 hoặc 8/12): WIDGET NHẮC NHỞ & LƯỚI 24 CHUYÊN ĐỀ PHẢN XẠ TRẢI RỘNG */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Hàng 3 Widget số liệu nhắc nhở chuẩn portal (như ảnh mẫu) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Widget 1 */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-2 hover:border-[#0054A6]/60 transition-colors">
                  <span className="text-xs font-bold text-slate-600 block">
                    Chuyên đề đàm thoại mới
                  </span>
                  <div className="text-4xl font-black text-[#0054A6] leading-none">
                    24
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 pt-1">
                    8 Anh • 8 Nhật • 8 Hàn
                  </div>
                </div>

                {/* Widget 2 */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-2 hover:border-emerald-500/60 transition-colors">
                  <span className="text-xs font-bold text-slate-600 block">
                    Độ trễ toàn trình AI
                  </span>
                  <div className="text-4xl font-black text-emerald-600 leading-none">
                    &lt; 1.2s
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 pt-1">
                    Voice Streaming 2 chiều
                  </div>
                </div>

                {/* Widget 3 */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-2 hover:border-[#E31B23]/60 transition-colors">
                  <span className="text-xs font-bold text-slate-600 block">
                    Phản hồi ngữ pháp & phát âm
                  </span>
                  <div className="text-4xl font-black text-[#E31B23] leading-none">
                    100%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 pt-1">
                    Hiệu đính song ngữ tức thì
                  </div>
                </div>
              </div>

              {/* Hộp điều khiển lọc Khoa/Viện và Tìm kiếm chuyên sâu */}
              <div id="topics-catalog" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
                {/* Tabs Khoa/Viện */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                  {FACULTY_TABS.map((tab) => {
                    const isActive = selectedLang === tab.id;
                    const count = tabCounts[tab.id as keyof typeof tabCounts] ?? tab.count;
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
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Ô Tìm kiếm & Cấp độ */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm theo mã môn (ENG-T01...), tên bài học, vai trò AI..."
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
                      onClick={() => fetchAllTopics(true)}
                      disabled={isRefreshing || initialLoading}
                      title="Làm mới danh sách chuyên đề từ máy chủ"
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${isRefreshing || initialLoading ? "animate-spin text-[#0054A6]" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Báo lỗi nếu có */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-red-900 mb-1">
                    Chưa thể kết nối cơ sở dữ liệu học vụ
                  </h3>
                  <p className="text-xs text-red-600 max-w-md mx-auto mb-4">{error}</p>
                  <button
                    onClick={() => fetchAllTopics(true)}
                    className="px-4 py-2 bg-[#0054A6] hover:bg-[#003B7A] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Thử kết nối lại máy chủ</span>
                  </button>
                </div>
              )}

              {/* Skeleton loading chuẩn hóa chiều cao 100% khi mới mở trang */}
              {initialLoading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TopicCardSkeleton key={i} />
                  ))}
                </div>
              )}

              {/* Lưới danh mục 24 chuyên đề trải rộng full màn hình - Tự động chuyển cảnh mượt mà */}
              {!initialLoading && !error && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">
                        Danh Mục Chuyên Đề Học Vụ Trực Tuyến
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#0054A6] text-white">
                        {filteredTopics.length}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                      Bấm vào chủ đề để bắt đầu phiên luyện phản xạ
                    </span>
                  </div>

                  {filteredTopics.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-6 animate-fade-in">
                      <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-slate-700">
                        Không tìm thấy chuyên đề phù hợp với bộ lọc
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Vui lòng chọn lại Khoa/Viện hoặc thay đổi từ khóa tìm kiếm.
                      </p>
                    </div>
                  ) : (
                    <div
                      key={`${selectedLang}-${selectedDifficulty}`}
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in"
                    >
                      {filteredTopics.map((topic) => (
                        <TopicCard key={topic.topic_code} topic={topic} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {/* 4. Footer trải rộng toàn màn hình chuẩn nhận diện HUTECH */}
        <footer className="w-full bg-[#003B7A] text-white pt-8 pb-5 border-b-4 border-[#E31B23] mt-auto">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-blue-800/60 text-xs">
              {/* Cột 1: Thông tin Trường & Nền tảng HutechPoly AI */}
              <div className="space-y-3">
                <div>
                  <span className="font-extrabold text-sm tracking-tight text-white block">
                    TRƯỜNG ĐẠI HỌC CÔNG NGHỆ TP.HCM (HUTECH)
                  </span>
                  <span className="text-[11px] text-[#FFC20E] font-bold">
                    HutechPoly AI — Nền Tảng Luyện Phản Xạ Ngoại Ngữ Thông Minh
                  </span>
                </div>
                <p className="text-blue-100/80 leading-relaxed">
                  Hệ thống đàm thoại tương tác ứng dụng mô hình trí tuệ nhân tạo Gemini 2.5 Flash và giọng đọc bản ngữ Edge-TTS, hỗ trợ sinh viên rèn luyện phản xạ giao tiếp tự nhiên chuẩn khung năng lực quốc tế.
                </p>
              </div>

              {/* Cột 2: Các phân hệ ngoại ngữ chuyên môn */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-[#FFC20E] uppercase tracking-wider block">
                  3 PHÂN HỆ NGOẠI NGỮ THỤ HƯỞNG
                </span>
                <ul className="space-y-2 text-blue-100/90">
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono font-bold px-1 rounded bg-blue-900 text-blue-200 text-[10px]">EN</span>
                    <span><strong>Khoa Ngoại ngữ:</strong> Chuẩn VSTEP B1/B2/C1 & IELTS Quốc tế</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono font-bold px-1 rounded bg-rose-900 text-rose-200 text-[10px]">JA</span>
                    <span><strong>Viện VJIT:</strong> Chuẩn Kaiwa N5 - N2 & Kính ngữ doanh nghiệp</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono font-bold px-1 rounded bg-amber-900 text-amber-200 text-[10px]">KO</span>
                    <span><strong>Viện Việt - Hàn:</strong> Chuẩn TOPIK 2 - 3 & Giao tiếp Seoul</span>
                  </li>
                </ul>
              </div>

              {/* Cột 3: Trụ sở và các cơ sở HUTECH */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-[#FFC20E] uppercase tracking-wider block">
                  TRỤ SỞ & CÁC CƠ SỞ ĐÀO TẠO HUTECH
                </span>
                <ul className="space-y-1.5 text-blue-100/90">
                  <li className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFC20E] shrink-0 mt-0.5" />
                    <span><strong>Trụ sở chính:</strong> 475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFC20E] shrink-0 mt-0.5" />
                    <span><strong>Cơ sở Ung Văn Khiêm:</strong> 31/36 Ung Văn Khiêm, P.25, Q.Bình Thạnh, TP.HCM</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFC20E] shrink-0 mt-0.5" />
                    <span><strong>Phân hiệu Khu Công nghệ cao:</strong> Xa lộ Hà Nội, P.Hiệp Phú, TP.Thủ Đức</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-blue-300">
              <span>© 2026 HutechPoly AI — Bản quyền thuộc về Trường Đại học Công nghệ TP.HCM (HUTECH).</span>
              <span>Khung năng lực đánh giá: CEFR (Anh) • JLPT (Nhật) • TOPIK (Hàn).</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
