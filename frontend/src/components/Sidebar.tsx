"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Mic,
  GraduationCap,
  Languages,
  Layers,
  Award,
  ExternalLink,
  Clock,
  FileText,
} from "lucide-react";

/**
 * Thanh điều hướng dọc chuẩn Cổng Học Vụ Điện Tử HUTECH (Left Sidebar)
 * Tương tự thanh menu icon dọc của trang https://hocvudientu.hutech.edu.vn
 */
export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      id: "home",
      label: "Trang chủ",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      id: "topics",
      label: "Danh mục chủ đề",
      href: "/#topics-catalog",
      icon: BookOpen,
      isActive: false,
    },
    {
      id: "practice",
      label: "Phòng luyện AI",
      href: "/practice/ENG-T01",
      icon: Mic,
      isActive: pathname.startsWith("/practice"),
    },
    {
      id: "schedule",
      label: "Thời khoá biểu",
      href: "#",
      icon: Clock,
      isActive: false,
    },
    {
      id: "records",
      label: "Tiến độ học tập",
      href: "#",
      icon: GraduationCap,
      isActive: false,
    },
    {
      id: "portal",
      label: "Cổng Học vụ",
      href: "https://hocvudientu.hutech.edu.vn",
      icon: ExternalLink,
      isActive: false,
      isExternal: true,
    },
  ];

  return (
    <aside className="w-[88px] sm:w-24 bg-white border-r border-slate-200 shrink-0 min-h-screen py-3 flex flex-col items-center justify-between z-30 select-none">
      <div className="w-full flex flex-col items-center space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isCurrent = item.isActive;

          return (
            <Link
              key={item.id}
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noreferrer" : undefined}
              className={`w-[76px] sm:w-[84px] py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                isCurrent
                  ? "bg-blue-50/80 border-2 border-[#0054A6] text-[#0054A6] shadow-2xs font-bold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent font-medium"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isCurrent ? "text-[#0054A6]" : "text-slate-500"
                }`}
              />
              <span className="text-[10px] sm:text-[11px] leading-tight block line-clamp-2">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Chân sidebar: Huy hiệu phiên bản */}
      <div className="text-center pb-2">
        <span className="text-[9px] font-bold text-slate-400 block">v2.0</span>
        <span className="text-[8px] font-black text-[#0054A6] uppercase">HUTECH</span>
      </div>
    </aside>
  );
}
