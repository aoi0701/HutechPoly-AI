"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Mic,
  Send,
  Bot,
  User,
  Sparkles,
  BookOpen,
  Volume2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { Topic, VocabItem } from "@/types/topic";

interface PracticePageProps {
  params: Promise<{
    topic_code: string;
  }>;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  vi_translation?: string;
  grammar_feedback?: string;
  vocabulary_hints?: string[];
  timestamp: string;
}

export default function PracticePage({ params }: PracticePageProps) {
  const resolvedParams = use(params);
  const topicCode = resolvedParams.topic_code;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái đàm thoại
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showViTranslation, setShowViTranslation] = useState<boolean>(true);

  // Tải chi tiết chủ đề từ Backend
  const fetchTopicDetail = async () => {
    setLoading(true);
    setError(null);
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    try {
      const res = await fetch(`${apiUrl}/topics/${topicCode}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(
          `Không tìm thấy dữ liệu chủ đề ${topicCode} (Mã phản hồi: ${res.status})`
        );
      }

      const data: Topic = await res.json();
      setTopic(data);

      // Khởi tạo các lượt đối thoại mẫu chuẩn nhận diện HUTECH
      const initialMessages: ChatMessage[] = [
        {
          id: "m-1",
          sender: "ai",
          text: data.opening_line,
          vi_translation:
            "Xin chào bạn! Chào mừng bạn đến với phiên luyện phản xạ cùng HutechPoly AI. Bạn đã sẵn sàng cùng tôi luyện tập chưa?",
          timestamp: "Vừa xong",
        },
        {
          id: "m-2",
          sender: "user",
          text:
            data.language === "en"
              ? "Hi there! I am ready to practice, but sometimes tôi bị bí từ nên sẽ nói tiếng Việt nhé."
              : data.language === "ja"
              ? "こんにちは！準備ができました。でも時々 tôi bị bí từ nên sẽ nói tiếng Việt nhé."
              : "안녕하세요! 준비됐어요. 그런데 가끔 bí từ thì tôi nói tiếng Việt nhé.",
          timestamp: "1 phút trước",
        },
        {
          id: "m-3",
          sender: "ai",
          text:
            data.language === "en"
              ? "No problem at all! Switching to Vietnamese when stuck is totally fine. I am here to help you speak with full confidence!"
              : data.language === "ja"
              ? "全く問題ありませんよ！言葉に詰まったらベトナム語を交えても大丈夫です。自信を持って楽しく話しましょう！"
              : "전혀 문제없어요! 막힐 때는 편하게 베트남어를 섞어 말해도 돼요. 함께 자신 있게 연습해 봐요!",
          vi_translation:
            "Hoàn toàn không sao bạn nhé! Khi bí từ cứ tự nhiên nói chêm tiếng Việt. Tôi ở đây để hỗ trợ bạn nói ngoại ngữ thật tự tin!",
          grammar_feedback:
            "💡 Sửa lỗi câu chêm tiếng Việt: Thay vì nói 'tôi bị bí từ', bạn nên dùng mẫu câu: 'I got stuck on a word' (EN) / '言葉に詰まりました' (JA) / '단어가 생각이 안 났어요' (KO).",
          vocabulary_hints: ["confidence: sự tự tin", "get stuck: bị kẹt từ"],
          timestamp: "Vừa xong",
        },
      ];
      setMessages(initialMessages);
    } catch (err: any) {
      console.error("Lỗi tải chi tiết chủ đề:", err);
      setError(err.message || "Không thể kết nối đến máy chủ Backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicDetail();
  }, [topicCode]);

  // Gửi tin nhắn
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      timestamp: "Vừa xong",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Phản hồi giả lập từ AI
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text:
          topic?.language === "en"
            ? "That is a very good point! What other experiences do you have in this area?"
            : topic?.language === "ja"
            ? "とても素晴らしい視点ですね！この分野で他にどんな経験がありますか？"
            : "정말 좋은 생각이네요! 이 분야에서 다른 어떤 경험이 있으신가요?",
        vi_translation: "Ý kiến của bạn rất hay! Bạn có thêm trải nghiệm nào khác về chủ đề này không?",
        timestamp: "Vừa xong",
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  // Mô phỏng Push-to-Talk ghi âm
  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputText(
          topic?.language === "en"
            ? "I really like this topic because tôi học được nhiều từ vựng thực tế."
            : topic?.language === "ja"
            ? "このテーマはとても面白いです。Tôi thấy học được nhiều mẫu câu hay."
            : "이 주제는 정말 재미있어요. Tôi đã học được nhiều điều mới."
        );
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#0054A6] animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">
            Đang kết nối phòng đàm thoại {topicCode}...
          </p>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 p-6 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Không tìm thấy chủ đề {topicCode}
          </h2>
          <p className="text-xs text-slate-500">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0054A6] hover:bg-[#E31B23] text-white text-xs font-bold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh mục</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F4F6F9] overflow-hidden">
      {/* 1. Header phòng thực hành chuẩn Cổng Học Vụ HUTECH */}
      <header className="h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0054A6] transition-colors"
            title="Quay lại danh mục chuyên đề"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="relative w-8 h-8 shrink-0 hidden sm:block">
            <Image
              src="/logohutech.png"
              alt="HUTECH Logo"
              fill
              sizes="32px"
              className="object-contain"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-[#0054A6] text-white">
                {topic.topic_code}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                {topic.title_vi}
              </h1>
            </div>
            <p className="text-xs font-medium text-slate-500 line-clamp-1 hidden sm:block">
              {topic.title_native} • <span className="text-[#0054A6] font-semibold">{topic.faculty}</span>
            </p>
          </div>
        </div>

        {/* Trạng thái kết nối phòng & Nút bật/tắt dịch nghĩa */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Phòng luyện tập sẵn sàng</span>
          </div>

          <button
            onClick={() => setShowViTranslation(!showViTranslation)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200/80 transition-colors"
          >
            {showViTranslation ? "Ẩn bản dịch" : "Hiện bản dịch"}
          </button>
        </div>
      </header>

      {/* 2. Thân giao diện: Sidebar Chuyên Môn & Khung Đàm Thoại AI */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Chuyên Môn: Bối cảnh Persona & Ngân hàng Từ vựng */}
        <aside className="w-80 lg:w-96 bg-white border-r border-slate-200/90 hidden md:flex flex-col shrink-0 overflow-y-auto">
          {/* Đối tác AI Persona */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0054A6] uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4 text-[#0054A6]" />
              <span>Đối tác AI Bản Xứ (Persona)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/90 font-medium">
              {topic.ai_persona}
            </p>
          </div>

          {/* Câu mở đầu dẫn dắt */}
          <div className="p-4 sm:p-5 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0054A6]" />
              <span>Khởi động đối thoại</span>
            </div>
            <div className="text-xs text-slate-800 bg-blue-50/60 p-3 rounded-xl border border-blue-200/80 font-semibold italic">
              "{topic.opening_line}"
            </div>
          </div>

          {/* Danh sách Từ vựng trọng điểm */}
          <div className="p-4 sm:p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-[#0054A6]" />
                <span>Từ vựng trọng tâm ({topic.key_vocab?.length || 0})</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {(topic.key_vocab || []).map((vocab: VocabItem, idx: number) => {
                const primaryWord =
                  vocab.word || vocab.romaji || vocab.hangeul || "Từ vựng";

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-[#0054A6]/60 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs sm:text-sm font-bold text-[#0054A6]">
                        {primaryWord}
                      </span>
                      {vocab.ipa && (
                        <span className="font-mono text-[11px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {vocab.ipa}
                        </span>
                      )}
                      {vocab.honorific_type && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                          {vocab.honorific_type}
                        </span>
                      )}
                    </div>

                    {/* Furigana Kanji hoặc Romaja */}
                    {vocab.word_ruby && (
                      <div
                        className="text-xs text-[#E31B23] font-bold mb-1"
                        dangerouslySetInnerHTML={{ __html: vocab.word_ruby }}
                      />
                    )}
                    {vocab.romaja && (
                      <div className="text-[11px] text-purple-600 font-medium mb-1">
                        Romaja: {vocab.romaja}
                      </div>
                    )}

                    <div className="text-xs text-slate-600 font-medium">
                      {vocab.meaning_vi}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Khung Đối Thoại Chính */}
        <main className="flex-1 flex flex-col bg-[#F4F6F9] overflow-hidden">
          {/* Luồng Tin Nhắn Đàm Thoại */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isAi ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAi && (
                    <div className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0 mt-1 relative overflow-hidden">
                      <Image
                        src="/logohutech.png"
                        alt="AI Mascot"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl p-4 shadow-2xs space-y-2 ${
                      isAi
                        ? "bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs"
                        : "bg-[#0054A6] text-white rounded-tr-xs"
                    }`}
                  >
                    {/* Tên người nói */}
                    <div
                      className={`text-[11px] font-bold pb-1 border-b flex items-center justify-between ${
                        isAi
                          ? "border-slate-100 text-[#0054A6]"
                          : "border-blue-400/30 text-blue-100"
                      }`}
                    >
                      <span>{isAi ? "Trợ giảng AI Bản Xứ" : "Sinh viên HUTECH"}</span>
                      <span className="text-[10px] opacity-70 font-normal">{msg.timestamp}</span>
                    </div>

                    {/* Nội dung câu nói */}
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </p>

                    {/* Bản dịch đối chiếu tiếng Việt */}
                    {isAi && msg.vi_translation && showViTranslation && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 italic">
                        {msg.vi_translation}
                      </div>
                    )}

                    {/* Khung Góp ý phản xạ tức thì (Bilingual feedback) */}
                    {isAi && msg.grammar_feedback && (
                      <div className="mt-2 p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 leading-relaxed font-medium">
                        {msg.grammar_feedback}
                      </div>
                    )}

                    {/* Từ vựng gợi ý */}
                    {isAi && msg.vocabulary_hints && msg.vocabulary_hints.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.vocabulary_hints.map((hint, hIdx) => (
                          <span
                            key={hIdx}
                            className="text-[11px] font-semibold bg-blue-50 text-[#0054A6] border border-blue-200/80 px-2 py-0.5 rounded-md"
                          >
                            {hint}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-9 h-9 rounded-full bg-[#0054A6] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs mt-1 border-2 border-white ring-1 ring-blue-200">
                      SV
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Thanh Nhập Liệu & Nút Micro Push-to-Talk */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200/90 shadow-2xs">
            {/* Lời nhắc song ngữ học vụ */}
            <div className="max-w-4xl mx-auto mb-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="flex items-center gap-1 text-[#0054A6] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#E31B23]" />
                <span>Bí từ ngoại ngữ? Sinh viên cứ nói chêm Tiếng Việt thoải mái!</span>
              </span>
              <span className="hidden sm:inline text-slate-400">Nhấn Enter để gửi phản hồi</span>
            </div>

            {/* Ô nhập và cụm nút tương tác */}
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              {/* Nút Micro thu âm */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-xs shrink-0 ${
                  isRecording
                    ? "bg-[#E31B23] text-white animate-pulse scale-105"
                    : "bg-[#0054A6] hover:bg-[#003B7A] text-white"
                }`}
                title={isRecording ? "Đang ghi âm giọng nói... Nhấn để dừng" : "Nhấn giữ để nói"}
              >
                <Mic className="w-5 h-5" />
                {isRecording && (
                  <div className="flex items-center gap-0.5 h-4">
                    <span className="w-1 bg-white rounded-full animate-soundwave-1" />
                    <span className="w-1 bg-white rounded-full animate-soundwave-2" />
                    <span className="w-1 bg-white rounded-full animate-soundwave-3" />
                    <span className="w-1 bg-white rounded-full animate-soundwave-4" />
                    <span className="w-1 bg-white rounded-full animate-soundwave-5" />
                  </div>
                )}
              </button>

              {/* Ô gõ tin nhắn */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder={
                    isRecording
                      ? "Đang lắng nghe giọng nói của bạn..."
                      : "Nhập phản hồi thoại (hoặc nhấn micro để luyện nói)..."
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:bg-white transition-colors text-slate-800 font-medium"
                />
              </div>

              {/* Nút gửi */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-2.5 sm:p-3 rounded-xl bg-[#0054A6] hover:bg-[#003B7A] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs shrink-0"
                title="Gửi tin nhắn"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
