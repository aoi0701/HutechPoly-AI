"use client";

import React from "react";
import Link from "next/link";
import { Bot, ArrowRight, BookOpen, Layers } from "lucide-react";
import { Topic } from "@/types/topic";

interface TopicCardProps {
  topic: Topic;
}

/**
 * Thẻ hiển thị một chủ đề đàm thoại trong danh mục Topic Grid
 */
export default function TopicCard({ topic }: TopicCardProps) {
  // Xác định cờ và nhãn theo ngôn ngữ
  const getLanguageMeta = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "en":
        return {
          flag: "🇬🇧",
          label: "Tiếng Anh",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        };
      case "ja":
        return {
          flag: "🇯🇵",
          label: "Tiếng Nhật",
          badgeColor: "bg-red-50 text-red-700 border-red-200",
        };
      case "ko":
        return {
          flag: "🇰🇷",
          label: "Tiếng Hàn",
          badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
        };
      default:
        return {
          flag: "🌐",
          label: "Đa ngữ",
          badgeColor: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };

  // Xác định màu sắc và nhãn hiển thị cấp độ khó
  const getLevelMeta = (level: string) => {
    const l = level.toLowerCase();
    if (l === "easy" || l === "beginner" || l === "dễ") {
      return {
        label: "Cơ bản (Dễ)",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    }
    if (l === "medium" || l === "intermediate" || l === "vừa") {
      return {
        label: "Trung cấp (Vừa)",
        className: "bg-sky-50 text-sky-700 border-sky-200",
      };
    }
    return {
      label: "Nâng cao (Khó)",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    };
  };

  const langMeta = getLanguageMeta(topic.language);
  const levelMeta = getLevelMeta(topic.level);

  // Lấy 3 từ vựng đại diện để hiển thị xem trước
  const previewVocabs = (topic.key_vocab || []).slice(0, 3);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#003B7A]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Phần đỉnh thẻ: Mã chủ đề, Ngôn ngữ, Độ khó */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-[#003B7A]/10 text-[#003B7A] border border-[#003B7A]/20">
              {topic.topic_code}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${langMeta.badgeColor}`}
            >
              <span>{langMeta.flag}</span>
              <span>{langMeta.label}</span>
            </span>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${levelMeta.className}`}
          >
            {levelMeta.label}
          </span>
        </div>

        {/* Tiêu đề tiếng Việt và Tiêu đề bản ngữ */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#003B7A] transition-colors line-clamp-1 mb-1">
          {topic.title_vi}
        </h3>
        <p className="text-sm font-medium text-slate-500 line-clamp-1 italic mb-4">
          {topic.title_native}
        </p>

        {/* Vai trò AI Persona */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#F58220]/10 text-[#F58220] shrink-0 mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Vai trò AI (Persona)
            </span>
            <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
              {topic.ai_persona}
            </p>
          </div>
        </div>

        {/* Từ vựng xem trước */}
        {previewVocabs.length > 0 && (
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              <BookOpen className="w-3 h-3" /> Từ vựng trọng tâm:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {previewVocabs.map((vocab, index) => {
                const displayWord =
                  vocab.word || vocab.romaji || vocab.hangeul || "Từ vựng";
                return (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
                  >
                    {displayWord}
                  </span>
                );
              })}
              {(topic.key_vocab || []).length > 3 && (
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                  +{(topic.key_vocab || []).length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chân thẻ: Khoa/Viện và Nút Bắt đầu luyện phản xạ */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
          <Layers className="w-3.5 h-3.5 text-[#003B7A]" />
          <span className="truncate">{topic.faculty}</span>
        </div>

        <Link
          href={`/practice/${topic.topic_code}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#003B7A] hover:bg-[#F58220] transition-colors shadow-sm shrink-0"
        >
          <span>Bắt đầu phản xạ</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
