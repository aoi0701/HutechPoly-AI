"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Mic,
  Languages,
  Award,
  FileText,
  Sparkles,
} from "lucide-react";

export interface SidebarProps {
  activeTab?: "home" | "topics" | "practice" | "notebook" | "progress" | "guide" | string;
  onTabChange?: (tabId: string) => void;
}

/**
 * Thanh điều hướng dọc chuẩn nền tảng HutechPoly AI (Left Navigation Sidebar)
 * Hỗ trợ chuyển đổi Multi-View tức thì 0ms, cập nhật trạng thái ô chọn mượt mà.
 */
export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      id: "home",
      label: "Trang chủ",
      href: "/?tab=home",
      icon: Home,
    },
    {
      id: "topics",
      label: "Chủ đề AI",
      href: "/?tab=topics",
      icon: Languages,
    },
    {
      id: "practice",
      label: "Phòng thoại",
      href: "/practice/ENG-T01",
      icon: Mic,
      isDirectLink: true,
    },
    {
      id: "notebook",
      label: "Sổ tay lỗi",
      href: "/?tab=notebook",
      icon: FileText,
      badge: "7 lỗi",
    },
    {
      id: "progress",
      label: "Tiến độ học",
      href: "/?tab=progress",
      icon: Award,
    },
    {
      id: "guide",
      label: "Cẩm nang",
      href: "/?tab=guide",
      icon: BookOpen,
    },
  ];

  // Xác định tab nào đang active:
  // 1. Ưu tiên prop activeTab nếu được truyền vào
  // 2. Nếu đang ở trang practice thì phòng thoại active
  // 3. Mặc định là 'home'
  const currentActive =
    activeTab || (pathname.startsWith("/practice") ? "practice" : "home");

  return (
    <aside className="w-[88px] sm:w-24 bg-white border-r border-slate-200 shrink-0 min-h-screen py-3 flex flex-col items-center justify-between z-30 select-none sticky top-0 h-screen">
      <div className="w-full flex flex-col items-center space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isCurrent = currentActive === item.id;

          // Nếu có handler onTabChange và không phải link trực tiếp sang trang khác
          if (onTabChange && !item.isDirectLink) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative w-[76px] sm:w-[84px] py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? "bg-blue-50/90 border-2 border-[#0054A6] text-[#0054A6] shadow-2xs font-bold scale-[1.02]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent font-medium hover:scale-[1.01]"
                }`}
              >
                {/* Dấu chấm chỉ báo active tinh tế bên cạnh */}
                {isCurrent && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#0054A6] rounded-r-full" />
                )}

                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isCurrent ? "text-[#0054A6] scale-110" : "text-slate-500"
                  }`}
                />
                <span className="text-[10px] sm:text-[11px] leading-tight block line-clamp-1">
                  {item.label}
                </span>

                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#E31B23] text-white text-[9px] font-bold rounded-full border border-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          }

          // Trường hợp Link trực tiếp (ví dụ vào phòng thoại hoặc dùng ngoài trang chủ)
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`relative w-[76px] sm:w-[84px] py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-200 ${
                isCurrent
                  ? "bg-blue-50/90 border-2 border-[#0054A6] text-[#0054A6] shadow-2xs font-bold scale-[1.02]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent font-medium hover:scale-[1.01]"
              }`}
            >
              {isCurrent && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#0054A6] rounded-r-full" />
              )}
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isCurrent ? "text-[#0054A6] scale-110" : "text-slate-500"
                }`}
              />
              <span className="text-[10px] sm:text-[11px] leading-tight block line-clamp-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Chân sidebar: Huy hiệu HutechPoly AI */}
      <div className="text-center pb-2 flex flex-col items-center">
        <Sparkles className="w-3.5 h-3.5 text-[#E31B23] mb-0.5" />
        <span className="text-[9px] font-bold text-slate-400 block">v2.0</span>
        <span className="text-[8px] font-black text-[#0054A6] uppercase tracking-wider">
          POLY AI
        </span>
      </div>
    </aside>
  );
}
