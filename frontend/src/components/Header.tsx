"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  ExternalLink,
  Phone,
  Mail,
  Menu,
  X,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

/**
 * Header chuẩn nhận diện thương hiệu học thuật Cổng Đại học HUTECH
 * Thiết kế trang trọng, chuẩn chỉ dành cho đề tài khóa luận đại học.
 */
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-2xs">
      {/* 1. Thanh tiện ích học vụ trên cùng (Top Utility Bar) */}
      <div className="bg-[#003B7A] text-white text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Thông tin liên hệ học vụ chính thức */}
          <div className="flex items-center gap-4 sm:gap-6 text-blue-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Phone className="w-3 h-3 text-[#FFC20E]" />
              <span className="hidden sm:inline">Tổng đài học vụ:</span>
              <strong className="text-white">(028) 710 566 86</strong>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-[#FFC20E]" />
              <span>hocvudientu@hutech.edu.vn</span>
            </span>
          </div>

          {/* Phân hệ đồ án tốt nghiệp trao tặng */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-blue-200 text-[11px]">
              Khóa Luận Tốt Nghiệp CNTT • Trao Tặng Trường Đại Học HUTECH
            </span>
            <div className="flex items-center gap-1.5 bg-[#0054A6] px-2.5 py-0.5 rounded-full border border-blue-400/30 text-white font-semibold text-[10px]">
              <ShieldCheck className="w-3 h-3 text-[#FFC20E]" />
              <span>HutechPoly-AI v2.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Thanh điều hướng chính (Main Academic Navbar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo HUTECH & Định Danh Hệ Thống */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            {/* Logo Khiên Trường HUTECH */}
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 shrink-0 transition-transform group-hover:scale-105 duration-200">
              <Image
                src="/logohutech.png"
                alt="Đại học Công nghệ TP.HCM - HUTECH"
                fill
                sizes="(max-width: 640px) 44px, 52px"
                className="object-contain"
                priority
              />
            </div>

            {/* Khối chữ thương hiệu trường */}
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0054A6]">
                  HUTECH
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#E31B23] uppercase tracking-wider">
                  ĐẠI HỌC CÔNG NGHỆ TP.HCM
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 leading-none">
                <span className="text-xs font-bold text-slate-700 tracking-tight">
                  HỆ THỐNG HỌC VỤ ĐIỆN TỬ
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs font-black text-[#0054A6]">
                  HutechPoly <span className="text-[#E31B23]">AI</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Menu liên kết điều hướng khoa viện (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-[#0054A6] bg-blue-50 border border-blue-100 flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0054A6]" />
              <span>Ngân Hàng Chủ Đề</span>
            </Link>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-1 text-slate-600">
              <span className="px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 transition-colors cursor-default">
                Khoa Ngoại ngữ
              </span>
              <span className="px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 transition-colors cursor-default">
                Viện VJIT
              </span>
              <span className="px-2.5 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 transition-colors cursor-default">
                Viện Việt - Hàn
              </span>
            </div>
          </nav>

          {/* Phía phải: Cổng Học Vụ Liên Kết & Thông Tin Người Dùng */}
          <div className="flex items-center gap-3">
            {/* Nút sang Cổng Học Vụ Điện Tử của trường */}
            <Link
              href="https://hocvudientu.hutech.edu.vn"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0054A6] border border-[#0054A6]/30 hover:bg-[#0054A6] hover:text-white transition-all shadow-2xs"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Cổng Học Vụ HUTECH</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            {/* Profile Sinh Viên Giả Lập Chuẩn Học Vụ */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-[#0054A6] text-white flex items-center justify-center font-bold text-xs shadow-xs border-2 border-white ring-1 ring-blue-200">
                SV
              </div>
              <div className="hidden md:block text-left leading-tight">
                <span className="text-xs font-bold text-slate-900 block">
                  Sinh viên HUTECH
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Sẵn sàng phản xạ AI
                </span>
              </div>
            </div>

            {/* Nút Hamburger menu trên Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu mở rộng trên Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200 space-y-2 pb-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-bold text-[#0054A6] bg-blue-50"
            >
              Ngân Hàng 24 Chủ Đề Đàm Thoại
            </Link>
            <div className="px-3 py-2 text-xs font-semibold text-slate-500">
              Đơn vị đào tạo ngoại ngữ HUTECH:
            </div>
            <div className="grid grid-cols-3 gap-2 px-3">
              <div className="p-2 text-center rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                Khoa Ngoại ngữ
              </div>
              <div className="p-2 text-center rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                Viện VJIT
              </div>
              <div className="p-2 text-center rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                Viện Việt - Hàn
              </div>
            </div>
            <div className="pt-2 px-3">
              <Link
                href="https://hocvudientu.hutech.edu.vn"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-bold text-[#0054A6] border border-[#0054A6]/30 bg-white"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Truy cập Cổng Học Vụ Điện Tử HUTECH</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
