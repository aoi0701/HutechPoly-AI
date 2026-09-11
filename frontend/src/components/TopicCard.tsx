"use client";

import React from "react";
import Link from "next/link";
import { Bot, ArrowRight, BookOpen, Layers, Sparkles } from "lucide-react";
import { Topic } from "@/types/topic";

interface TopicCardProps {
  topic: Topic;
}

/**
 * Thẻ hiển thị chủ đề đàm thoại học thuật chuẩn Đại học HUTECH
 * Thiết kế tinh tế, trực quan, phục vụ học tập và đánh giá đồ án tốt nghiệp.
 */
export default function TopicCard({ topic }: TopicCardProps) {
  // Xác định thông tin Khoa/Viện quản lý
  const getFacultyMeta = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "en":
        return {
          flag: "🇬🇧",
          langName: "Tiếng Anh",
          faculty: "Khoa Ngoại ngữ",
          badgeColor: "bg-blue-50 text-[#0054A6] border-blue-200/80",
          tagBg: "bg-blue-600",
        };
      case "ja":
        return {
          flag: "🇯🇵",
          langName: "Tiếng Nhật",
          faculty: "Viện VJIT",
          badgeColor: "bg-rose-50 text-[#E31B23] border-rose-200/80",
          tagBg: "bg-[#E31B23]",
        };
      case "ko":
        return {
          flag: "🇰🇷",
          langName: "Tiếng Hàn",
          faculty: "Viện Việt - Hàn",
          badgeColor: "bg-amber-50 text-amber-900 border-amber-200/80",
          tagBg: "bg-amber-600",
        };
      default:
        return {
          flag: "🌐",
          langName: "Đa ngữ",
          faculty: "Đại học HUTECH",
          badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
          tagBg: "bg-slate-600",
        };
    }
  };

  // Chuẩn hóa cấp độ đào tạo theo khung năng lực
  const getLevelMeta = (level: string) => {
    const l = level.toLowerCase();
    if (l === "easy" || l === "beginner" || l === "dễ") {
      return {
        label: "Sơ cấp",
        sublabel: "A1 - A2",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
      };
    }
    if (l === "medium" || l === "intermediate" || l === "vừa") {
      return {
        label: "Trung cấp",
        sublabel: "B1 - B2",
        className: "bg-blue-50 text-[#0054A6] border-blue-200",
        dotColor: "bg-[#0054A6]",
      };
    }
    return {
      label: "Nâng cao",
      sublabel: "C1 - C2",
      className: "bg-purple-50 text-purple-700 border-purple-200",
      dotColor: "bg-purple-600",
    };
  };

  const facultyMeta = getFacultyMeta(topic.language);
  const levelMeta = getLevelMeta(topic.level);
  const previewVocabs = (topic.key_vocab || []).slice(0, 3);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0054A6]/50 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Vạch nhận diện thương hiệu học thuật trên đầu card */}
      <div className="h-1 w-full bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-[#0054A6] group-hover:to-[#E31B23] transition-all duration-300" />

      <div className="p-5 sm:p-6 pb-4">
        {/* Hàng metadata trên cùng: Mã học phần + Đơn vị quản lý + Thang năng lực */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200/90 group-hover:bg-[#0054A6] group-hover:text-white group-hover:border-[#0054A6] transition-colors">
              {topic.topic_code}
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${facultyMeta.badgeColor}`}
            >
              <span>{facultyMeta.flag}</span>
              <span>{facultyMeta.faculty}</span>
            </span>
          </div>

          <div
            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${levelMeta.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${levelMeta.dotColor}`} />
            <span>{levelMeta.label}</span>
            <span className="text-[9px] opacity-75 font-normal">({levelMeta.sublabel})</span>
          </div>
        </div>

        {/* Tiêu đề tiếng Việt */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0054A6] transition-colors line-clamp-1 mb-1">
          {topic.title_vi}
        </h3>

        {/* Tiêu đề ngoại ngữ bản xứ */}
        <p className="text-xs font-semibold text-slate-500 line-clamp-1 italic mb-4">
          {topic.title_native}
        </p>

        {/* Khung Persona Trợ giảng AI */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 mb-4 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-[#0054A6] shrink-0 mt-0.5 shadow-2xs">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Vai trò đối tác AI (Persona)
            </span>
            <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium mt-0.5">
              {topic.ai_persona}
            </p>
          </div>
        </div>

        {/* Danh sách từ vựng gợi ý xem trước */}
        {previewVocabs.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              <BookOpen className="w-3 h-3 text-[#0054A6]" />
              <span>Từ vựng trọng tâm:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {previewVocabs.map((vocab, index) => {
                const displayWord =
                  vocab.word || vocab.romaji || vocab.hangeul || "Từ vựng";
                return (
                  <span
                    key={index}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
                  >
                    {displayWord}
                  </span>
                );
              })}
              {(topic.key_vocab || []).length > 3 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-blue-50 text-[#0054A6] font-bold border border-blue-100">
                  +{(topic.key_vocab || []).length - 3} từ
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chân thẻ: Nhóm kỹ năng & Nút Vào luyện phản xạ */}
      <div className="p-4 sm:p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 truncate">
          <Layers className="w-3.5 h-3.5 text-[#0054A6]" />
          <span className="truncate">{topic.category}</span>
        </div>

        <Link
          href={`/practice/${topic.topic_code}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0054A6] hover:bg-[#003B7A] transition-all shadow-2xs shrink-0"
        >
          <span>Vào luyện phản xạ</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
