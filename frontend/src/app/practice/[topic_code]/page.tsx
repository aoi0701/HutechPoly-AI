"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
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
  HelpCircle,
  CheckCircle2,
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
  // Mở gói params trong Next.js 15 App Router
  const resolvedParams = use(params);
  const topicCode = resolvedParams.topic_code;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái hội thoại và nhập liệu
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showViTranslation, setShowViTranslation] = useState<boolean>(true);

  // Tải chi tiết chủ đề từ Backend FastAPI
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
          `Không thể tải chủ đề ${topicCode} (Mã lỗi: ${res.status})`
        );
      }

      const data: Topic = await res.json();
      setTopic(data);

      // Khởi tạo các tin nhắn mẫu sinh động (AI mở đầu + Sinh viên phản hồi)
      const initialMessages: ChatMessage[] = [
        {
          id: "m-1",
          sender: "ai",
          text: data.opening_line,
          vi_translation:
            "Xin chào! Chào mừng bạn đến với phiên luyện đàm thoại. Bạn đã sẵn sàng chia sẻ cùng tôi chưa?",
          timestamp: "Vừa xong",
        },
        {
          id: "m-2",
          sender: "user",
          text:
            data.language === "en"
              ? "Hi! I am ready, but sometimes tôi bị bí từ so I will speak Vietnamese."
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
              ? "No worries at all! Speaking some Vietnamese when stuck is totally fine. Let's practice naturally together!"
              : data.language === "ja"
              ? "大丈夫ですよ！言葉に詰まったらベトナム語を交えても構いません。自然に楽しく話しましょう！"
              : "괜찮아요! 막힐 때는 베트남어로 편하게 말해도 돼요. 자연스럽게 연습해 봐요!",
          vi_translation:
            "Không sao cả! Việc chêm tiếng Việt khi bí từ là hoàn toàn bình thường. Hãy cùng luyện phản xạ thật tự nhiên nhé!",
          grammar_feedback:
            "💡 Gợi ý: Khi muốn nói 'tôi bị bí từ', bạn có thể dùng: 'I got stuck on a word' (EN) / '言葉に詰まりました' (JA) / '단어가 생각이 안 났어요' (KO).",
          vocabulary_hints: ["get stuck: bị kẹt, bí từ", "practice: luyện tập"],
          timestamp: "Vừa xong",
        },
      ];
      setMessages(initialMessages);
    } catch (err: any) {
      console.error("Lỗi khi tải chi tiết chủ đề:", err);
      setError(err.message || "Không thể kết nối đến máy chủ Backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicDetail();
  }, [topicCode]);

  // Xử lý gửi tin nhắn của người dùng
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

    // Giả lập AI phản hồi sau 1 giây
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text:
          topic?.language === "en"
            ? "That sounds interesting! Could you tell me more about your thoughts on this?"
            : topic?.language === "ja"
            ? "それは面白いですね！それについてもっと詳しく教えてもらえますか？"
            : "흥미롭네요! 그것에 대해 조금 더 자세히 이야기해 주실 수 있나요?",
        vi_translation: "Nghe thú vị quá! Bạn có thể chia sẻ thêm cho tôi về điều này không?",
        timestamp: "Vừa xong",
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1000);
  };

  // Bật/tắt mô phỏng ghi âm giọng nói
  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    if (!isRecording) {
      // Giả lập sau 3 giây tự động nhận diện xong giọng nói
      setTimeout(() => {
        setIsRecording(false);
        setInputText(
          topic?.language === "en"
            ? "I really enjoy this topic because tôi học được nhiều từ vựng mới."
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
          <RefreshCw className="w-8 h-8 text-[#003B7A] animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">
            Đang tải phòng thoại chủ đề {topicCode}...
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#003B7A] hover:bg-[#F58220] text-white text-xs font-bold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Thanh điều hướng đỉnh phòng thoại */}
      <header className="h-16 bg-[#003B7A] text-white border-b-2 border-[#F58220] px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
            title="Quay lại danh mục chủ đề"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-[#F58220] text-white">
                {topic.topic_code}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {topic.title_vi}
              </h1>
            </div>
            <p className="text-xs text-blue-200 line-clamp-1 hidden sm:block">
              {topic.title_native} • {topic.faculty}
            </p>
          </div>
        </div>

        {/* Trạng thái kết nối */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold hidden sm:inline">Phản xạ sẵn sàng</span>
          </div>
          <button
            onClick={() => setShowViTranslation(!showViTranslation)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-blue-100 text-xs font-medium transition-colors"
          >
            {showViTranslation ? "Ẩn dịch nghĩa" : "Hiện dịch nghĩa"}
          </button>
        </div>
      </header>

      {/* Thân giao diện: 2 cột (Sidebar từ vựng & Khung chat) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thanh Bên (Sidebar): Bối cảnh & Danh mục Từ vựng gợi ý */}
        <aside className="w-80 lg:w-96 bg-white border-r border-slate-200 hidden md:flex flex-col shrink-0 overflow-y-auto">
          {/* Vai trò AI Persona */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs font-bold text-[#003B7A] uppercase tracking-wider mb-2">
              <Bot className="w-4 h-4 text-[#F58220]" />
              <span>Đối tác AI (Persona)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
              {topic.ai_persona}
            </p>
          </div>

          {/* Câu mở đầu */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-[#F58220]" />
              <span>Câu mở đầu dẫn dắt</span>
            </div>
            <div className="text-xs text-slate-800 bg-blue-50/60 p-3 rounded-xl border border-blue-100 font-medium italic">
              "{topic.opening_line}"
            </div>
          </div>

          {/* Danh sách Từ vựng gợi ý (Key Vocab) */}
          <div className="p-5 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#003B7A]" />
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
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#003B7A]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-sm font-bold text-[#003B7A]">
                        {primaryWord}
                      </span>
                      {vocab.ipa && (
                        <span className="font-mono text-xs text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {vocab.ipa}
                        </span>
                      )}
                      {vocab.honorific_type && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                          {vocab.honorific_type}
                        </span>
                      )}
                    </div>

                    {/* Hiển thị Furigana hoặc Romaja */}
                    {vocab.word_ruby && (
                      <div
                        className="text-xs text-red-600 mb-1"
                        dangerouslySetInnerHTML={{ __html: vocab.word_ruby }}
                      />
                    )}
                    {vocab.romaja && (
                      <div className="text-[11px] text-purple-600 mb-1">
                        Romaja: {vocab.romaja}
                      </div>
                    )}

                    <div className="text-xs text-slate-600">
                      {vocab.meaning_vi}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Khung Chat Chính */}
        <main className="flex-1 flex flex-col bg-slate-100 overflow-hidden">
          {/* Danh sách Tin nhắn */}
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
                    <div className="w-8 h-8 rounded-full bg-[#003B7A] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl p-4 shadow-sm space-y-2 ${
                      isAi
                        ? "bg-white text-slate-900 border border-slate-200 rounded-tl-sm"
                        : "bg-[#003B7A] text-white rounded-tr-sm"
                    }`}
                  >
                    {/* Nội dung tin nhắn chính */}
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>

                    {/* Bản dịch tiếng Việt hỗ trợ (chỉ hiện cho tin AI) */}
                    {isAi && msg.vi_translation && showViTranslation && (
                      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 italic">
                        {msg.vi_translation}
                      </div>
                    )}

                    {/* Hộp nhận xét sửa lỗi ngữ pháp (Bilingual feedback) */}
                    {isAi && msg.grammar_feedback && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                        {msg.grammar_feedback}
                      </div>
                    )}

                    {/* Gợi ý từ vựng (Vocabulary hints) */}
                    {isAi && msg.vocabulary_hints && msg.vocabulary_hints.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.vocabulary_hints.map((hint, hIdx) => (
                          <span
                            key={hIdx}
                            className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md"
                          >
                            {hint}
                          </span>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[10px] text-right ${
                        isAi ? "text-slate-400" : "text-blue-200"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-full bg-[#F58220] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Thanh Công Cụ Nhập Liệu Phía Dưới */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            {/* Lời nhắc cơ chế song ngữ */}
            <div className="max-w-4xl mx-auto mb-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F58220]" />
                <span>Mẹo: Nếu bí từ ngoại ngữ, bạn cứ nói chêm Tiếng Việt nhé!</span>
              </span>
              <span className="hidden sm:inline">Phím Enter để gửi</span>
            </div>

            {/* Ô nhập và các nút chức năng */}
            <div className="max-w-4xl mx-auto flex items-center gap-2">
              {/* Nút Micro mô phỏng ghi âm giọng nói */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-sm shrink-0 ${
                  isRecording
                    ? "bg-red-600 text-white animate-pulse scale-105 shadow-red-500/30"
                    : "bg-[#F58220] hover:bg-[#d96d10] text-white shadow-orange-500/20"
                }`}
                title={isRecording ? "Đang ghi âm... Bấm để dừng" : "Bấm giữ để nói"}
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

              {/* Ô gõ tin nhắn văn bản */}
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
                      : "Nhập tin nhắn đàm thoại (hoặc bấm mic để nói)..."
                  }
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003B7A] focus:bg-white transition-colors"
                />
              </div>

              {/* Nút gửi tin nhắn */}
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-3 rounded-xl bg-[#003B7A] hover:bg-[#002752] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm shrink-0"
                title="Gửi tin nhắn"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
