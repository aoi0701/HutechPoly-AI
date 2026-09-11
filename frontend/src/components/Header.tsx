"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Sparkles, Globe2, BookOpen } from "lucide-react";

/**
 * Thành phần Header nhận diện thương hiệu Đại học HUTECH
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#003B7A] text-white shadow-md border-b-4 border-[#F58220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo và Tên Nền tảng HutechPoly-AI */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-200">
              <span className="text-xl sm:text-2xl font-black text-[#003B7A] tracking-tighter">
                H<span className="text-[#F58220]">P</span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Hutech<span className="text-[#F58220]">Poly</span>-AI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-[#F58220]/20 text-[#F58220] border border-[#F58220]/40 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Đồ án Hiến tặng
                </span>
              </div>
              <p className="text-xs text-blue-200 hidden md:block">
                Hệ Thống Luyện Phản Xạ Đa Ngữ Thông Minh • Đại Học HUTECH
              </p>
            </div>
          </Link>

          {/* Huy hiệu 3 Khoa/Viện thụ hưởng */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-blue-900/60 border border-blue-400/30 text-blue-100 flex items-center gap-1">
              🇬🇧 Khoa Ngoại ngữ
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-900/60 border border-blue-400/30 text-blue-100 flex items-center gap-1">
              🇯🇵 Viện VJIT
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-900/60 border border-blue-400/30 text-blue-100 flex items-center gap-1">
              🇰🇷 Viện Việt - Hàn
            </span>
          </div>

          {/* Menu Điều hướng */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium rounded-lg text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <Globe2 className="w-4 h-4 text-[#F58220]" />
              <span className="hidden sm:inline">Khám phá</span> Chủ đề
            </Link>
            <Link
              href="https://hutech.edu.vn"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F58220] text-white hover:bg-[#d96d10] transition-colors shadow-sm flex items-center gap-1"
            >
              <GraduationCap className="w-4 h-4" />
              <span>HUTECH</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
