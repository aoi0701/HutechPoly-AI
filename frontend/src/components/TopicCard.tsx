"use client";

import React from "react";
import Link from "next/link";
import { Bot, ArrowRight, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { Topic } from "@/types/topic";

interface TopicCardProps {
  topic: Topic;
}

/**
 * Thẻ hiển thị chủ đề đàm thoại chuẩn phong cách Cổng Học vụ HUTECH
 */
export default function TopicCard({ topic }: TopicCardProps) {
  // Xác định cờ và thông tin Khoa/Viện
  const getFacultyMeta = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "en":
        return {
          flag: "🇬🇧",
          name: "Khoa Ngoại ngữ",
          badgeColor: "bg-blue-50 text-[#0054A6] border-blue-200",
        };
      case "ja":
        return {
          flag: "🇯🇵",
          name: "Viện VJIT",
          badgeColor: "bg-red-50 text-[#E31B23] border-red-200",
        };
      case "ko":
        return {
          flag: "🇰🇷",
          name: "Viện Việt - Hàn",
          badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        };
      default:
        return {
          flag: "🌐",
          name: "Đại học HUTECH",
          badgeColor: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  // Xác định màu sắc và nhãn hiển thị cấp độ khó
  const getLevelMeta = (level: string) => {
    const l = level.toLowerCase();
    if (l === "easy" || l === "beginner" || l === "dễ") {
      return {
        label: "Cơ bản",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }
    if (l === "medium" || l === "intermediate" || l === "vừa") {
      return {
        label: "Trung cấp",
        className: "bg-blue-50 text-[#0054A6] border-blue-200",
      };
    }
    return {
      label: "Nâng cao",
      className: "bg-red-50 text-[#E31B23] border-red-200",
    };
  };

  const facultyMeta = getFacultyMeta(topic.language);
  const levelMeta = getLevelMeta(topic.level);
  const previewVocabs = (topic.key_vocab || []).slice(0, 3);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-[#0054A6]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Vạch màu nhận diện đỉnh thẻ */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0054A6] via-[#0072BC] to-[#E31B23]" />

      <div className="p-5 sm:p-6 pb-4">
        {/* Hàng nhãn: Mã chủ đề + Đơn vị + Độ khó */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-[#0054A6] text-white shadow-2xs">
              {topic.topic_code}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${facultyMeta.badgeColor}`}
            >
              <span>{facultyMeta.flag}</span>
              <span>{facultyMeta.name}</span>
            </span>
          </div>

          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${levelMeta.className}`}
          >
            {levelMeta.label}
          </span>
        </div>

        {/* Tiêu đề tiếng Việt */}
        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0054A6] transition-colors line-clamp-1 mb-1">
          {topic.title_vi}
        </h3>

        {/* Tiêu đề bản ngữ (Anh / Nhật / Hàn) */}
        <p className="text-xs sm:text-sm font-semibold text-slate-500 line-clamp-1 italic mb-4">
          {topic.title_native}
        </p>

        {/* Khung mô tả vai trò AI Persona */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 mb-4 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#0054A6]/10 text-[#0054A6] shrink-0 mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Vai trò AI Bản Xứ (Persona)
            </span>
            <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
              {topic.ai_persona}
            </p>
          </div>
        </div>

        {/* Danh sách từ vựng xem trước */}
        {previewVocabs.length > 0 && (
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#0054A6]" />
              <span>Từ vựng trọng tâm:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {previewVocabs.map((vocab, index) => {
                const displayWord =
                  vocab.word || vocab.romaji || vocab.hangeul || "Từ vựng";
                return (
                  <span
                    key={index}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium border border-slate-200/70"
                  >
                    {displayWord}
                  </span>
                );
              })}
              {(topic.key_vocab || []).length > 3 && (
                <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-[#0054A6] font-bold border border-blue-100">
                  +{(topic.key_vocab || []).length - 3} từ
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chân thẻ: Nhóm chủ đề và Nút Bắt đầu luyện phản xạ */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 truncate">
          <GraduationCap className="w-4 h-4 text-[#0054A6]" />
          <span className="truncate">{topic.category}</span>
        </div>

        <Link
          href={`/practice/${topic.topic_code}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#0054A6] hover:bg-[#E31B23] transition-colors shadow-sm shrink-0"
        >
          <span>Bắt đầu phản xạ</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
