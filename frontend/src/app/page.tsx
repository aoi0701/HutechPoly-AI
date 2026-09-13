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
  MapPin,
  GraduationCap,
  Sparkles,
  BookOpen,
  Filter,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Mic,
  Award,
  FileText,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Target,
  ArrowRight,
  Languages,
  Check,
  Zap,
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
 */
function TopicCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-slate-200" />
      <div className="p-5 sm:p-6 pb-4 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-slate-200 rounded" />
            <div className="h-5 w-24 bg-slate-100 rounded" />
          </div>
          <div className="h-5 w-20 bg-slate-100 rounded-full" />
        </div>
        <div className="h-5 w-4/5 bg-slate-200 rounded" />
        <div className="h-3.5 w-3/5 bg-slate-100 rounded" />
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-200 shrink-0 mt-0.5" />
          <div className="w-full space-y-1.5">
            <div className="h-2.5 w-28 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-4/5 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="space-y-2 pt-1">
          <div className="h-3 w-28 bg-slate-200 rounded" />
          <div className="flex flex-wrap gap-1.5">
            <div className="h-5 w-16 bg-slate-100 rounded-md border border-slate-200/60" />
            <div className="h-5 w-20 bg-slate-100 rounded-md border border-slate-200/60" />
            <div className="h-5 w-14 bg-slate-100 rounded-md border border-slate-200/60" />
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-8 w-32 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

// Dữ liệu mẫu Sổ tay lỗi sai (Mistakes Notebook - TSK-24)
const MOCK_MISTAKES = [
  {
    id: "mis-1",
    topicCode: "ENG-T05",
    topicTitle: "Phỏng vấn Thực tập sinh Công ty Quốc tế",
    lang: "en",
    langBadge: "Khoa Ngoại ngữ",
    type: "Bilingual Fallback",
    studentSaid: "I want to apply for this job because tôi có 2 năm kinh nghiệm làm React.",
    saidViPart: "tôi có 2 năm kinh nghiệm làm React",
    aiFeedback:
      "Bạn nói chêm tiếng Việt khi bí từ. Trong phỏng vấn tiếng Anh, hãy dùng cấu trúc kinh nghiệm chuẩn mực.",
    aiCorrection:
      "I want to apply for this job because I have two years of hands-on experience developing with React.",
    vocabHints: [
      "hands-on experience: kinh nghiệm thực chiến",
      "apply for a position: ứng tuyển vào vị trí",
    ],
    status: "needs_review",
    statusLabel: "Cần ôn tập thêm",
    timestamp: "Hôm nay, 09:30",
  },
  {
    id: "mis-2",
    topicCode: "JPN-T01",
    topicTitle: "Dạo phố Akihabara & Mua sắm Anime",
    lang: "ja",
    langBadge: "Viện VJIT",
    type: "Bilingual Fallback",
    studentSaid: "秋葉原でフィギュアを買いたいです。Nhưng mà tôi không biết đường đến ga.",
    saidViPart: "Nhưng mà tôi không biết đường đến ga",
    aiFeedback:
      "Cách dùng trợ từ và từ vựng hỏi đường cơ bản. Hãy thay thế vế tiếng Việt bằng mẫu câu liên từ でも và 行き方.",
    aiCorrection:
      "秋葉原でフィギュアを買いたいです。でも、駅への行き方が分かりません。",
    vocabHints: [
      "行き方 (いきかた): cách đi / đường đi",
      "駅 (えき): nhà ga",
    ],
    status: "reviewed",
    statusLabel: "Đã ôn tập",
    timestamp: "Hôm qua, 16:45",
  },
  {
    id: "mis-3",
    topicCode: "KOR-T06",
    topicTitle: "Thuê phòng One-room tại Seoul",
    lang: "ko",
    langBadge: "Viện Việt - Hàn",
    type: "Bilingual Fallback",
    studentSaid: "이 원룸 보증금 얼마예요? Tiền thuê hàng tháng bao nhiêu vậy ạ?",
    saidViPart: "Tiền thuê hàng tháng bao nhiêu vậy ạ?",
    aiFeedback:
      "Để hỏi tiền thuê nhà hàng tháng trong hợp đồng thuê phòng ở Hàn Quốc, hãy dùng từ chuyên ngành 월세 thay vì tiếng Việt.",
    aiCorrection:
      "이 원룸 보증금 얼마예요? 월세는 한 달에 얼마인가요?",
    vocabHints: [
      "월세 (Wolse): tiền thuê nhà hàng tháng",
      "보증금 (Bojeunggeum): tiền đặt cọc",
    ],
    status: "reviewed",
    statusLabel: "Đã ôn tập",
    timestamp: "2 ngày trước",
  },
  {
    id: "mis-4",
    topicCode: "ENG-T06",
    topicTitle: "Thuyết trình dự án & Đàm phán nhóm",
    lang: "en",
    langBadge: "Khoa Ngoại ngữ",
    type: "Ngữ pháp (Grammar)",
    studentSaid: "He don't know about our presentation schedule for next Monday.",
    saidViPart: "",
    aiFeedback:
      "Lỗi chia động từ ngôi thứ ba số ít (Third-person singular): Chủ ngữ 'He' phải đi cùng trợ động từ phủ định 'doesn't' thay vì 'don't'.",
    aiCorrection:
      "He doesn't know about our presentation schedule for next Monday.",
    vocabHints: [
      "presentation schedule: lịch trình thuyết trình",
      "third-person singular: ngôi thứ 3 số ít",
    ],
    status: "reviewed",
    statusLabel: "Đã ôn tập",
    timestamp: "3 ngày trước",
  },
  {
    id: "mis-5",
    topicCode: "JPN-T03",
    topicTitle: "Trao đổi học tập cùng Sensei người Nhật",
    lang: "ja",
    langBadge: "Viện VJIT",
    type: "Kính ngữ (Sonkeigo)",
    studentSaid: "先生、私の論文をもう見ましたか？",
    saidViPart: "",
    aiFeedback:
      "Khi thưa gửi giáo sư (Sensei), câu hỏi '見ましたか' chưa đủ độ tôn kính. Nên chuyển sang dạng kính ngữ trang trọng ご覧になりましたか.",
    aiCorrection:
      "先生、私の論文をもうご覧になっていただけましたでしょうか。",
    vocabHints: [
      "ご覧になる (ごらんになる): tôn kính ngữ của 見る (nhìn, xem)",
      "論文 (ろんぶん): luận văn, bài báo cáo",
    ],
    status: "needs_review",
    statusLabel: "Cần ôn tập thêm",
    timestamp: "Tuần trước",
  },
];

export default function HomePage() {
  // Quản lý Tab hiển thị trên giao diện (Multi-View Tab: 0ms chuyển đổi tức thì)
  const [activeTab, setActiveTab] = useState<string>("home");

  // Dữ liệu gốc toàn bộ 24 chủ đề nạp từ Backend (lưu trữ trong bộ nhớ RAM Client)
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Bộ lọc chuyên môn cho kho chủ đề (Client-Side State)
  const [selectedLang, setSelectedLang] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Bộ lọc cho sổ tay lỗi sai
  const [notebookFilter, setNotebookFilter] = useState<string>("ALL");
  const [notebookSearch, setNotebookSearch] = useState<string>("");

  // Thu gọn / mở rộng hướng dẫn nhanh
  const [guideOpen, setGuideOpen] = useState<boolean>(false);

  // Đọc tab khởi tạo từ URL query param hoặc hash (nếu có)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam &&
        ["home", "topics", "notebook", "progress", "guide"].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      } else if (window.location.hash === "#topics-catalog") {
        setActiveTab("topics");
      } else if (window.location.hash === "#guide") {
        setActiveTab("guide");
      }
    }
  }, []);

  // Hàm chuyển Tab tức thì và đồng bộ URL mà không làm reload trang
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tabId);
      url.hash = "";
      window.history.replaceState(null, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Tải dữ liệu từ Backend FastAPI (chỉ gọi 1 lần khi khởi tạo)
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

  useEffect(() => {
    fetchAllTopics();
  }, []);

  // Tính toán số lượng chủ đề cho từng Khoa/Viện từ RAM
  const tabCounts = useMemo(() => {
    return {
      ALL: allTopics.length || 24,
      EN: allTopics.filter((t) => t.language.toLowerCase() === "en").length || 8,
      JA: allTopics.filter((t) => t.language.toLowerCase() === "ja").length || 8,
      KO: allTopics.filter((t) => t.language.toLowerCase() === "ko").length || 8,
    };
  }, [allTopics]);

  // Bộ lọc tức thì trên RAM (Instant 0ms In-Memory Filter)
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
        if (targetDiff === "easy")
          return lvl === "easy" || lvl === "dễ" || lvl === "beginner";
        if (targetDiff === "medium")
          return (
            lvl === "medium" || lvl === "vừa" || lvl === "intermediate"
          );
        if (targetDiff === "hard")
          return (
            lvl === "hard" || lvl === "nâng cao" || lvl === "advanced"
          );
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

  // Bộ lọc cho sổ tay lỗi sai
  const filteredMistakes = useMemo(() => {
    let list = MOCK_MISTAKES;
    if (notebookFilter !== "ALL") {
      if (notebookFilter === "fallback") {
        list = list.filter((m) => m.type.includes("Bilingual Fallback"));
      } else {
        list = list.filter((m) => m.lang === notebookFilter);
      }
    }
    if (notebookSearch.trim()) {
      const q = notebookSearch.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.studentSaid.toLowerCase().includes(q) ||
          m.aiCorrection.toLowerCase().includes(q) ||
          m.topicCode.toLowerCase().includes(q) ||
          m.topicTitle.toLowerCase().includes(q)
      );
    }
    return list;
  }, [notebookFilter, notebookSearch]);

  // Các chủ đề đề xuất cho màn hình Trang chủ (Lấy 3 chủ đề tiêu biểu 3 Khoa/Viện)
  const featuredTopics = useMemo(() => {
    const enTopic = allTopics.find((t) => t.language.toLowerCase() === "en");
    const jaTopic = allTopics.find((t) => t.language.toLowerCase() === "ja");
    const koTopic = allTopics.find((t) => t.language.toLowerCase() === "ko");
    const list: Topic[] = [];
    if (enTopic) list.push(enTopic);
    if (jaTopic) list.push(jaTopic);
    if (koTopic) list.push(koTopic);
    return list;
  }, [allTopics]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-row font-sans text-slate-800 w-full overflow-x-hidden">
      {/* 1. CỘT ĐIỀU HƯỚNG DỌC BÊN TRÁI (Hỗ trợ chuyển đổi tab tức thì 0ms) */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. KHU VỰC CHÍNH TRẢI DÀI TOÀN MÀN HÌNH */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Banner trường chuẩn nhận diện HUTECH */}
        <Header />

        {/* Thanh collapsible: Cẩm nang luyện phản xạ AI rút gọn */}
        <div className="w-full bg-white border-b border-slate-200 shadow-2xs">
          <button
            onClick={() => setGuideOpen(!guideOpen)}
            className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-[#0054A6]">
              <Sparkles className="w-4 h-4 text-[#E31B23]" />
              <span>
                💡 HutechPoly AI: Hướng dẫn nhanh quy trình luyện phản xạ & cứu cánh song ngữ (Bilingual Fallback)
              </span>
            </div>
            {guideOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {guideOpen && (
            <div className="px-4 sm:px-6 py-4 bg-blue-50/40 border-t border-blue-100 text-xs sm:text-sm text-slate-700 space-y-2.5">
              <p className="font-semibold text-[#0054A6]">
                Chào mừng sinh viên HUTECH đến với Nền tảng Luyện phản xạ Đa ngữ Thông minh HutechPoly AI!
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs">
                <li>
                  <strong>Bước 1:</strong> Chọn phân hệ Khoa / Viện của bạn (Khoa Ngoại ngữ - Tiếng Anh, Viện VJIT - Tiếng Nhật, Viện Việt - Hàn - Tiếng Hàn).
                </li>
                <li>
                  <strong>Bước 2:</strong> Lựa chọn cấp độ phù hợp (Sơ cấp, Trung cấp, Nâng cao) và bấm <em>"Vào luyện phản xạ"</em> tại chuyên đề mong muốn.
                </li>
                <li>
                  <strong>Bước 3:</strong> Sử dụng micro đàm thoại hoặc gõ văn bản trực tiếp để đối thoại hai chiều với trợ giảng AI bản ngữ.
                </li>
                <li>
                  <strong>Cơ chế cứu cánh song ngữ (Bilingual Fallback):</strong> Khi bị bí từ vựng hoặc chưa nhớ mẫu câu, sinh viên hoàn toàn có thể <strong>nói chêm tiếng Việt</strong>. AI bản ngữ sẽ tự động bắt trúng ngữ cảnh, đối đáp bằng ngoại ngữ và gợi ý sửa lỗi tức thì!
                </li>
              </ul>
              <div className="pt-1">
                <button
                  onClick={() => handleTabChange("guide")}
                  className="text-xs font-bold text-[#0054A6] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem cẩm nang đầy đủ và chi tiết tại đây</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. NỘI DUNG THAY ĐỔI THEO TAB ĐANG CHỌN (0ms Instant Switch) */}
        <main className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* ========================================================================= */}
          {/* VIEW 1: TRANG CHỦ (activeTab === 'home')                                   */}
          {/* ========================================================================= */}
          {activeTab === "home" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* CỘT TRÁI (Lg: 4/12): HỒ SƠ NGƯỜI HỌC & MỤC TIÊU NĂNG LỰC */}
                <div className="lg:col-span-5 xl:col-span-4 space-y-5">
                  {/* Thẻ Hồ sơ người học HutechPoly AI */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                    <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0054A6] to-[#003B7A] text-white flex items-center justify-center font-black text-lg shadow-md border-2 border-[#FFC20E]">
                        NT
                      </div>
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                          Nguyễn Phan Ngọc Trường
                        </h2>
                        <span className="font-mono text-xs font-bold text-slate-500 block">
                          MSSV: 2380602415 • 23DTHC3
                        </span>
                        <span className="text-xs font-semibold text-[#0054A6] block">
                          Khoa Công nghệ thông tin
                        </span>
                      </div>
                    </div>

                    {/* Các chỉ số thống kê luyện phản xạ thực tế */}
                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-[#F58220] fill-[#F58220]" />
                          <span>Chuỗi ngày luyện nói (Streak)</span>
                        </span>
                        <strong className="text-[#F58220] font-black text-sm">
                          3 Ngày liên tục
                        </strong>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#0054A6]" />
                          <span>Thời gian đàm thoại tuần này</span>
                        </span>
                        <strong className="text-slate-900 font-bold">
                          45 Phút
                        </strong>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tổng câu thoại đã tương tác</span>
                        </span>
                        <strong className="text-emerald-700 font-bold">
                          62 Lượt đàm thoại
                        </strong>
                      </div>

                      <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                          <span>Từ vựng mới đã tích lũy</span>
                        </span>
                        <strong className="text-purple-700 font-bold">
                          38 Từ vựng
                        </strong>
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
                      <button
                        onClick={() => handleTabChange("progress")}
                        className="text-[11px] text-[#0054A6] font-bold hover:underline cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Tiếng Anh */}
                      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-[#0054A6] text-[11px]">
                            EN
                          </span>
                          <span className="font-semibold text-slate-800">
                            Khoa Ngoại ngữ (VSTEP B1/B2)
                          </span>
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
                          <span className="font-semibold text-slate-800">
                            Viện VJIT (Kaiwa N4 - N2)
                          </span>
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
                          <span className="font-semibold text-slate-800">
                            Viện Việt - Hàn (TOPIK 2 - 3)
                          </span>
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
                      Khi gặp khó khăn về từ vựng hoặc chưa nhớ mẫu câu, sinh viên được phép{" "}
                      <strong className="text-[#E31B23]">nói chêm Tiếng Việt</strong>. AI bản
                      ngữ sẽ thấu hiểu ngữ cảnh để đối thoại tự nhiên, đồng thời gợi ý sửa lỗi
                      ngữ pháp & từ vựng thay thế tức thì!
                    </p>
                  </div>
                </div>

                {/* CỘT PHẢI (Lg: 7/12 hoặc 8/12): WIDGET & CHỦ ĐỀ GỢI Ý HÔM NAY */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                  {/* Hàng 3 Widget số liệu */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div
                      onClick={() => handleTabChange("topics")}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-2 hover:border-[#0054A6] hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 block">
                          Chuyên đề đàm thoại mới
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0054A6] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-4xl font-black text-[#0054A6] leading-none">
                        24
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 pt-1">
                        8 Anh • 8 Nhật • 8 Hàn (Nhấn xem)
                      </div>
                    </div>

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

                    <div
                      onClick={() => handleTabChange("notebook")}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-2 hover:border-[#E31B23] hover:shadow-xs transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 block">
                          Sổ tay lỗi sai & Sửa lỗi
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E31B23] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div className="text-4xl font-black text-[#E31B23] leading-none">
                        7 Lỗi
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400 pt-1">
                        5 đã sửa • 2 cần ôn tập (Nhấn xem)
                      </div>
                    </div>
                  </div>

                  {/* Phần: Chủ đề gợi ý hôm nay */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#F58220]" />
                          <span>Chuyên Đề Luyện Tập Đề Xuất Hôm Nay</span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          Các tình huống đàm thoại thông dụng được tuyển chọn cho sinh viên 3 Khoa/Viện.
                        </p>
                      </div>

                      <button
                        onClick={() => handleTabChange("topics")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#0054A6] hover:bg-[#0054A6] hover:text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <span>Xem toàn bộ 24 chủ đề</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Lưới 3 thẻ đề xuất */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {featuredTopics.length > 0 ? (
                        featuredTopics.map((topic) => (
                          <TopicCard key={topic.topic_code} topic={topic} />
                        ))
                      ) : (
                        <>
                          <TopicCardSkeleton />
                          <TopicCardSkeleton />
                          <TopicCardSkeleton />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Banner kêu gọi hành động nhanh */}
                  <div className="bg-gradient-to-r from-[#0054A6] to-[#003B7A] rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-xs font-bold text-[#FFC20E] uppercase tracking-wider block">
                        KHÁM PHÁ TOÀN DIỆN KHO CHỦ ĐỀ AI
                      </span>
                      <h4 className="text-base font-extrabold">
                        Rèn luyện phản xạ giao tiếp tự nhiên cùng AI bản ngữ
                      </h4>
                      <p className="text-xs text-blue-100">
                        Đa dạng 24 chủ đề từ đời sống, văn hóa đến phỏng vấn việc làm chuẩn quốc tế.
                      </p>
                    </div>

                    <button
                      onClick={() => handleTabChange("topics")}
                      className="px-5 py-2.5 rounded-xl bg-[#FFC20E] hover:bg-[#F58220] text-slate-900 hover:text-white text-xs font-extrabold transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
                    >
                      <Languages className="w-4 h-4" />
                      <span>Mở Kho 24 Chủ Đề AI</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: CHỦ ĐỀ AI (activeTab === 'topics') - TSK-08                        */}
          {/* ========================================================================= */}
          {activeTab === "topics" && (
            <div className="space-y-6">
              {/* Tiêu đề trang danh mục */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0054A6] uppercase tracking-wider">
                  <Languages className="w-4 h-4 text-[#0054A6]" />
                  <span>KHO CHỦ ĐỀ ĐÀM THOẠI THỰC CHIẾN</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  24 Chuyên Đề Phản Xạ Đa Ngữ AI — HUTECHPOLY AI
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                  Khám phá kho 24 kịch bản đối thoại nhập vai chuyên sâu, mô phỏng sinh động các tình huống thực tế cho sinh viên Khoa Ngoại ngữ (Tiếng Anh), Viện VJIT (Tiếng Nhật) và Viện Việt - Hàn (Tiếng Hàn).
                </p>
              </div>

              {/* Hộp điều khiển lọc Khoa/Viện và Tìm kiếm chuyên sâu */}
              <div
                id="topics-catalog"
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4"
              >
                {/* Tabs Khoa/Viện */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                  {FACULTY_TABS.map((tab) => {
                    const isActive = selectedLang === tab.id;
                    const count =
                      tabCounts[tab.id as keyof typeof tabCounts] ?? tab.count;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedLang(tab.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
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
                        className={`w-4 h-4 ${
                          isRefreshing || initialLoading
                            ? "animate-spin text-[#0054A6]"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Báo lỗi nếu có */}
              {error && (
                <div className="p-4 bg-red-50/80 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-xs">
                  <AlertCircle className="w-5 h-5 text-[#E31B23] shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-bold text-slate-900">{error}</p>
                    <p className="text-slate-600">
                      Vui lòng kiểm tra backend FastAPI tại địa chỉ http://localhost:8000.
                    </p>
                  </div>
                  <button
                    onClick={() => fetchAllTopics(true)}
                    className="px-3 py-1.5 bg-[#E31B23] text-white font-bold rounded-xl hover:bg-red-700 transition-colors shrink-0 cursor-pointer"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {/* Lưới 24 thẻ chuyên đề trải rộng toàn màn hình */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {initialLoading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <TopicCardSkeleton key={`skeleton-${idx}`} />
                  ))
                ) : filteredTopics.length > 0 ? (
                  filteredTopics.map((topic) => (
                    <TopicCard key={topic.topic_code} topic={topic} />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200/90 p-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-extrabold text-sm text-slate-800">
                        Không tìm thấy chuyên đề phù hợp
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Thử điều chỉnh lại từ khóa tìm kiếm hoặc chọn lại cấp độ đào tạo.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLang("ALL");
                        setSelectedDifficulty("ALL");
                        setSearchQuery("");
                      }}
                      className="px-4 py-2 bg-[#0054A6] text-white rounded-xl text-xs font-bold hover:bg-[#003B7A] transition-colors cursor-pointer"
                    >
                      Đặt lại bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: SỔ TAY LỖI SAI (activeTab === 'notebook') - TSK-24                 */}
          {/* ========================================================================= */}
          {activeTab === "notebook" && (
            <div className="space-y-6">
              {/* Tiêu đề Sổ tay lỗi sai */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#E31B23] uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-[#E31B23]" />
                  <span>SỔ TAY LỖI SAI & HIỆU ĐÍNH SONG NGỮ (MISTAKES NOTEBOOK)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Nhật Ký Chỉnh Sửa Lỗi & Tối Ưu Phản Xạ Đàm Thoại
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                  Hệ thống tự động ghi nhận các câu nói chêm tiếng Việt (Bilingual Fallback), lỗi ngữ pháp và kính ngữ trong các buổi luyện thoại để bạn ôn tập và rèn luyện lại cho chuẩn bản xứ.
                </p>
              </div>

              {/* 4 Thống kê tổng quan sổ tay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-slate-500">Tổng số lỗi ghi nhận</span>
                  <div className="text-3xl font-black text-[#0054A6]">7 Lỗi</div>
                  <span className="text-[11px] text-slate-400">Từ 5 phiên luyện gần nhất</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-slate-500">Đã khắc phục chuẩn</span>
                  <div className="text-3xl font-black text-emerald-600">5 Câu</div>
                  <span className="text-[11px] text-emerald-600 font-semibold">Tỷ lệ tiến bộ 71%</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-slate-500">Cần luyện tập thêm</span>
                  <div className="text-3xl font-black text-[#E31B23]">2 Câu</div>
                  <span className="text-[11px] text-amber-600 font-semibold">Ưu tiên ôn tập hôm nay</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-1">
                  <span className="text-xs font-bold text-slate-500">Độ chính xác trung bình</span>
                  <div className="text-3xl font-black text-purple-600">92%</div>
                  <span className="text-[11px] text-purple-600 font-semibold">+6% so với tuần trước</span>
                </div>
              </div>

              {/* Bộ lọc Sổ tay lỗi */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                  {[
                    { id: "ALL", label: "Tất cả lỗi (5)" },
                    { id: "en", label: "🇬🇧 Tiếng Anh (2)" },
                    { id: "ja", label: "🇯🇵 Tiếng Nhật (2)" },
                    { id: "ko", label: "🇰🇷 Tiếng Hàn (1)" },
                    { id: "fallback", label: "🇻🇳 Bilingual Fallback (3)" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setNotebookFilter(tab.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        notebookFilter === tab.id
                          ? "bg-[#0054A6] text-white shadow-2xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={notebookSearch}
                    onChange={(e) => setNotebookSearch(e.target.value)}
                    placeholder="Tìm theo nội dung câu nói, câu sửa, mã chủ đề..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:bg-white text-slate-800 transition-colors"
                  />
                </div>
              </div>

              {/* Danh sách thẻ lỗi sai thực tế */}
              <div className="space-y-4">
                {filteredMistakes.map((mis) => (
                  <div
                    key={mis.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3.5 hover:border-[#0054A6]/60 transition-all"
                  >
                    {/* Header Thẻ Lỗi */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#0054A6] text-white">
                          {mis.topicCode}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {mis.topicTitle}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0054A6] border border-blue-200">
                          {mis.langBadge}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {mis.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400">{mis.timestamp}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            mis.status === "reviewed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {mis.statusLabel}
                        </span>
                      </div>
                    </div>

                    {/* Câu sinh viên nói */}
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-500 block">
                        Câu bạn đã nói:
                      </span>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium">
                        &ldquo;{mis.studentSaid}&rdquo;
                      </div>
                    </div>

                    {/* Phản hồi & Câu sửa chuẩn mực từ Gemini AI */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0054A6]">
                        <Sparkles className="w-3.5 h-3.5 text-[#E31B23]" />
                        <span>Câu chỉnh sửa chuẩn bản ngữ từ AI:</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-semibold">
                        &ldquo;{mis.aiCorrection}&rdquo;
                      </div>
                      <p className="text-xs text-slate-600 italic">
                        {mis.aiFeedback}
                      </p>
                    </div>

                    {/* Từ vựng gợi ý & Nút hành động */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 mr-1">
                          Từ vựng gợi ý:
                        </span>
                        {mis.vocabHints.map((hint, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {hint}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/practice/${mis.topicCode}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0054A6] hover:bg-[#003B7A] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Luyện lại câu này</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: TIẾN ĐỘ HỌC (activeTab === 'progress') - TSK-25                    */}
          {/* ========================================================================= */}
          {activeTab === "progress" && (
            <div className="space-y-6">
              {/* Tiêu đề Báo cáo Tiến độ */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F58220] uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#F58220]" />
                  <span>BÁO CÁO TIẾN ĐỘ & KHUNG NĂNG LỰC ĐẦU RA</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Bảng Thống Kê Chuỗi Ngày Streak & Lộ Trình Ngoại Ngữ
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                  Theo dõi thời lượng đàm thoại thực tế, phân tích các chỉ số phát âm, ngữ pháp và mức độ hoàn thành chuẩn đầu ra theo quy định của 3 Khoa/Viện HUTECH.
                </p>
              </div>

              {/* Thẻ Chuỗi ngày Streak rực rỡ */}
              <div className="bg-gradient-to-br from-[#003B7A] via-[#0054A6] to-[#002D5E] rounded-2xl p-6 text-white shadow-md space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#FFC20E] uppercase tracking-wider block">
                      CHUỖI NGÀY LUYỆN NÓI LIÊN TỤC (STREAK)
                    </span>
                    <div className="flex items-center gap-2">
                      <Flame className="w-8 h-8 text-[#F58220] fill-[#F58220] animate-bounce" />
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        3 Ngày Liên Tục
                      </span>
                    </div>
                    <p className="text-xs text-blue-100">
                      Chỉ cần luyện tập ít nhất 10 phút mỗi ngày để duy trì chuỗi Streak và rèn luyện phản xạ!
                    </p>
                  </div>

                  <Link
                    href="/practice/ENG-T01"
                    className="px-5 py-2.5 rounded-xl bg-[#F58220] hover:bg-[#FFC20E] text-white hover:text-slate-900 text-xs font-extrabold transition-all shadow-md shrink-0 flex items-center gap-2 self-start sm:self-auto"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Luyện 10 Phút Hôm Nay</span>
                  </Link>
                </div>

                {/* Lịch 7 ngày trong tuần */}
                <div className="grid grid-cols-7 gap-2 pt-2 border-t border-blue-400/30">
                  {[
                    { day: "Thứ 2", active: true, minutes: "15p" },
                    { day: "Thứ 3", active: true, minutes: "18p" },
                    { day: "Thứ 4", active: true, minutes: "12p" },
                    { day: "Thứ 5", active: false, minutes: "0p" },
                    { day: "Thứ 6", active: false, minutes: "0p" },
                    { day: "Thứ 7", active: false, minutes: "0p" },
                    { day: "CN", active: false, minutes: "0p" },
                  ].map((d, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-center flex flex-col items-center gap-1 transition-all ${
                        d.active
                          ? "bg-white/20 border border-[#FFC20E] shadow-xs"
                          : "bg-white/5 border border-white/10 opacity-70"
                      }`}
                    >
                      <span className="text-[10px] font-bold text-blue-200">
                        {d.day}
                      </span>
                      {d.active ? (
                        <Flame className="w-4 h-4 text-[#FFC20E] fill-[#FFC20E]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/30" />
                      )}
                      <span className="text-[9px] font-mono font-bold text-white">
                        {d.minutes}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Thống kê chi tiết */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Tổng thời gian luyện</span>
                    <Clock className="w-4 h-4 text-[#0054A6]" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">45 Phút</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0054A6] h-full w-3/4 rounded-full" />
                  </div>
                  <span className="text-[11px] text-slate-400 block pt-0.5">
                    Mục tiêu tuần: 60 Phút (75%)
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Lượt thoại tương tác</span>
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">62 Lượt</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-4/5 rounded-full" />
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold block pt-0.5">
                    Phản hồi trung bình: 1.1s
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Từ vựng bản xứ mới</span>
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">38 Từ</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full w-3/5 rounded-full" />
                  </div>
                  <span className="text-[11px] text-purple-600 font-semibold block pt-0.5">
                    Đã lưu vào bộ nhớ RAM
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>Điểm phản xạ tự nhiên</span>
                    <TrendingUp className="w-4 h-4 text-[#F58220]" />
                  </div>
                  <div className="text-3xl font-black text-[#F58220]">86/100</div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#F58220] h-full w-[86%] rounded-full" />
                  </div>
                  <span className="text-[11px] text-slate-400 block pt-0.5">
                    Đánh giá từ Gemini AI
                  </span>
                </div>
              </div>

              {/* Khung Năng lực 3 Khoa/Viện & 4 Trụ cột phản xạ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cột 1: Tiến độ chuẩn đầu ra 3 Khoa/Viện */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#0054A6]" />
                      <span>Tiến Độ Khung Năng Lực 3 Khoa / Viện</span>
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Khoa Ngoại ngữ */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">
                          Khoa Ngoại ngữ — Chuẩn VSTEP B1/B2
                        </span>
                        <span className="text-[#0054A6]">65% (5/8 Chủ đề)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#0054A6] h-full w-[65%] rounded-full" />
                      </div>
                    </div>

                    {/* Viện VJIT */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">
                          Viện VJIT — Kaiwa N4 - N2 & Kính ngữ
                        </span>
                        <span className="text-[#E31B23]">50% (4/8 Chủ đề)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#E31B23] h-full w-[50%] rounded-full" />
                      </div>
                    </div>

                    {/* Viện Việt - Hàn */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">
                          Viện Việt - Hàn — TOPIK 2 - 3 Giao tiếp
                        </span>
                        <span className="text-amber-600">38% (3/8 Chủ đề)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[38%] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cột 2: 4 Trụ cột kỹ năng phản xạ */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <span>Đánh Giá 4 Trụ Cột Đàm Thoại AI</span>
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">
                        1. Phát âm chuẩn & Ngữ điệu bản ngữ:
                      </span>
                      <strong className="text-emerald-700 font-extrabold">85/100</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">
                        2. Ngữ pháp & Trật tự câu đàm thoại:
                      </span>
                      <strong className="text-[#0054A6] font-extrabold">80/100</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">
                        3. Tốc độ phản xạ không gián đoạn:
                      </span>
                      <strong className="text-[#F58220] font-extrabold">88/100</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">
                        4. Vốn từ vựng tình huống thực chiến:
                      </span>
                      <strong className="text-purple-700 font-extrabold">82/100</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: CẨM NANG (activeTab === 'guide')                                   */}
          {/* ========================================================================= */}
          {activeTab === "guide" && (
            <div className="space-y-6">
              {/* Tiêu đề Cẩm nang */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0054A6] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#0054A6]" />
                  <span>CẨM NANG HƯỚNG DẪN HỌC TẬP THỰC CHIẾN</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Phương Pháp Luyện Phản Xạ Đàm Thoại Thông Minh Cùng AI
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
                  Bí quyết giúp sinh viên HUTECH xóa bỏ hoàn toàn rào cản sợ sai, mở rộng vốn từ vựng bản xứ và tận dụng tối đa cơ chế độc quyền Bilingual Fallback.
                </p>
              </div>

              {/* 3 Bước thực hành chuẩn mực */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0054A6] flex items-center justify-center font-black text-base">
                    1
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Chọn Chuyên Đề & Persona AI
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lựa chọn một trong 24 kịch bản phù hợp với Khoa/Viện của bạn. Mỗi chuyên đề đều có AI Persona đảm nhận vai trò thực tế (đồng nghiệp, bạn bè, sensei hoặc nhà tuyển dụng).
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#F58220] flex items-center justify-center font-black text-base">
                    2
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Bật Micro Đối Thoại Tự Do
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sử dụng tính năng Push-to-Talk để nói trực tiếp. Trả lời thoải mái theo suy nghĩ của bạn, không bị ràng buộc bởi bất kỳ kịch bản cứng nhắc nào.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-base">
                    3
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Nhận Phản Hồi & Sửa Lỗi Tức Thì
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AI đối đáp lại bằng giọng đọc bản xứ chuẩn (Edge-TTS) trong vòng &lt; 1.2s, đồng thời cung cấp bản dịch đối chiếu và gợi ý sửa lỗi ngữ pháp.
                  </p>
                </div>
              </div>

              {/* Chuyên mục: Cơ chế Cứu cánh song ngữ (Bilingual Fallback) */}
              <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-2xl border border-blue-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#E31B23]" />
                  <h3 className="text-base font-extrabold text-[#0054A6]">
                    Cơ Chế Độc Quyền: Bilingual Fallback (Nói Chêm Tiếng Việt Khi Bí Từ)
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Một trong những rào cản lớn nhất của người học ngoại ngữ là <strong>sợ bị ngắt quãng</strong> khi không nhớ ra một từ vựng hay ngữ pháp cụ thể. Với HutechPoly AI, bạn được phép nói chêm tiếng Việt ngay trong câu nói của mình.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white border border-blue-100 space-y-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0054A6]">
                      🇬🇧 Tiếng Anh
                    </span>
                    <p className="text-xs text-slate-800 font-medium">
                      &ldquo;I want to apply because <em>tôi có 2 năm kinh nghiệm làm React</em>.&rdquo;
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      AI hiểu ý và sửa lại: &ldquo;I have two years of hands-on experience developing with React.&rdquo;
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-rose-100 space-y-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-[#E31B23]">
                      🇯🇵 Tiếng Nhật
                    </span>
                    <p className="text-xs text-slate-800 font-medium">
                      &ldquo;秋葉原で買い物をします。<em>Nhưng tôi không biết đường</em>.&rdquo;
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      AI hiểu ý và sửa lại: &ldquo;でも、行き方が分かりません。&rdquo;
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-amber-100 space-y-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      🇰🇷 Tiếng Hàn
                    </span>
                    <p className="text-xs text-slate-800 font-medium">
                      &ldquo;이 원룸 보증금 얼마예요? <em>Tiền thuê bao nhiêu ạ</em>?&rdquo;
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      AI hiểu ý và sửa lại: &ldquo;월세는 얼마인가요?&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* 5 Mẹo rèn luyện hiệu quả */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>5 Mẹo Vàng Rèn Luyện Phản Xạ Cùng HutechPoly AI</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 pl-4 list-disc">
                  <li>
                    <strong>Luyện tập đều đặn mỗi ngày từ 10 - 15 phút:</strong> Sự kiên trì quan trọng hơn thời lượng luyện tập dồn dập.
                  </li>
                  <li>
                    <strong>Đọc to theo AI (Shadowing):</strong> Lặp lại các câu phản hồi của AI để luyện ngữ điệu và phát âm chuẩn bản ngữ.
                  </li>
                  <li>
                    <strong>Đừng sợ sai:</strong> Mỗi lần nói sai là cơ hội để AI ghi nhận vào <em>Sổ tay lỗi</em> và giúp bạn tiến bộ.
                  </li>
                  <li>
                    <strong>Tra cứu nhanh từ vựng:</strong> Nhấn vào các từ vựng mới trong khung Persona để ghi nhớ ngữ cảnh sử dụng.
                  </li>
                  <li>
                    <strong>Tắt bản dịch khi đã quen:</strong> Khi đã tự tin, hãy ẩn bản dịch tiếng Việt để ép não bộ phản xạ 100% bằng ngoại ngữ mục tiêu.
                  </li>
                </ul>
              </div>
            </div>
          )}
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
                    <span className="font-mono font-bold px-1 rounded bg-blue-900 text-blue-200 text-[10px]">
                      EN
                    </span>
                    <span>
                      <strong>Khoa Ngoại ngữ:</strong> Chuẩn VSTEP B1/B2/C1 & IELTS Quốc tế
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono font-bold px-1 rounded bg-rose-900 text-rose-200 text-[10px]">
                      JA
                    </span>
                    <span>
                      <strong>Viện VJIT:</strong> Chuẩn Kaiwa N5 - N2 & Kính ngữ doanh nghiệp
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-mono font-bold px-1 rounded bg-amber-900 text-amber-200 text-[10px]">
                      KO
                    </span>
                    <span>
                      <strong>Viện Việt - Hàn:</strong> Chuẩn TOPIK 2 - 3 & Giao tiếp Seoul
                    </span>
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
                    <span>
                      <strong>Trụ sở chính:</strong> 475A Điện Biên Phủ, P.25, Q.Bình Thạnh, TP.HCM
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFC20E] shrink-0 mt-0.5" />
                    <span>
                      <strong>Cơ sở Ung Văn Khiêm:</strong> 31/36 Ung Văn Khiêm, P.25, Q.Bình Thạnh, TP.HCM
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FFC20E] shrink-0 mt-0.5" />
                    <span>
                      <strong>Phân hiệu Khu Công nghệ cao:</strong> Xa lộ Hà Nội, P.Hiệp Phú, TP.Thủ Đức
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-blue-300">
              <span>
                © 2026 HutechPoly AI — Bản quyền thuộc về Trường Đại học Công nghệ TP.HCM (HUTECH).
              </span>
              <span>
                Khung năng lực đánh giá: CEFR (Anh) • JLPT (Nhật) • TOPIK (Hàn).
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
