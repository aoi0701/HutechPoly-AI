"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Sparkles, Globe2, User, Phone, Mail } from "lucide-react";

/**
 * Header chuẩn nhận diện thương hiệu Cổng Học Vụ Điện Tử - Đại học HUTECH
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Thanh thông tin phụ trên cùng (Top Bar chuẩn HUTECH) */}
      <div className="bg-[#0054A6] text-white text-[11px] py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#FFC20E]" />
              <span>Hotline Học vụ: (028) 710 566 86</span>
            </span>
            <span className="hidden sm:flex items-center gap-1 text-blue-200">
              <Mail className="w-3 h-3 text-[#FFC20E]" />
              <span>hocvudientu@hutech.edu.vn</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-blue-200">
              Hệ thống Học vụ Điện tử • Đồ án Tốt nghiệp CNTT Hiến tặng
            </span>
            <span className="bg-[#E31B23] text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">
              HUTECHPOLY-AI
            </span>
          </div>
        </div>
      </div>

      {/* Thanh Header chính */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo HUTECH và Tên Hệ thống */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
              <Image
                src="/logohutech.png"
                alt="Logo HUTECH"
                fill
                sizes="(max-width: 640px) 48px, 56px"
                className="object-contain"
                priority
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0054A6]">
                  HUTECH
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#E31B23] uppercase tracking-wide">
                  Đại học Công nghệ TP.HCM
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                  HỆ THỐNG HỌC VỤ ĐIỆN TỬ
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs sm:text-sm font-black text-[#0054A6]">
                  HutechPoly <span className="text-[#E31B23]">AI</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Huy hiệu 3 Khoa/Viện Chuyên Ngữ */}
          <div className="hidden xl:flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#0054A6] font-semibold flex items-center gap-1.5 shadow-2xs">
              <span>🇬🇧</span> Khoa Ngoại ngữ
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-[#E31B23] font-semibold flex items-center gap-1.5 shadow-2xs">
              <span>🇯🇵</span> Viện VJIT
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold flex items-center gap-1.5 shadow-2xs">
              <span>🇰🇷</span> Viện Việt - Hàn
            </span>
          </div>

          {/* Điều hướng và Profile sinh viên */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-xs sm:text-sm font-bold text-[#0054A6] hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <Globe2 className="w-4 h-4 text-[#E31B23]" />
              <span className="hidden sm:inline">24 Chủ đề</span> Phản xạ
            </Link>

            <Link
              href="https://hocvudientu.hutech.edu.vn"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0054A6] border border-[#0054A6]/30 hover:bg-[#0054A6] hover:text-white transition-all shadow-2xs hidden md:flex items-center gap-1"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Cổng Học Vụ</span>
            </Link>

            {/* Profile sinh viên HUTECH mô phỏng */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0054A6] to-blue-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                SV
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  Sinh viên HUTECH
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Đang trực tuyến
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
