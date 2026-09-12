"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  ChevronDown,
  Star,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/**
 * Header Banner chuẩn nhận diện Cổng Học Vụ Điện Tử HUTECH
 * Tái hiện 100% phong cách banner thực tế của trường:
 * Nền xanh skyline, logo thẻ trắng, huy hiệu 31 năm, QS Stars, chuông báo & thông tin sinh viên.
 */
export default function Header() {
  return (
    <div className="w-full bg-[#00478F] text-white">
      {/* 1. Thanh phụ trên cùng (Top Utility Bar siêu nhỏ) */}
      <div className="bg-[#003366] text-blue-100 text-[11px] py-1 px-4 sm:px-6 flex items-center justify-between border-b border-blue-900/50">
        <div className="flex items-center gap-4 sm:gap-6">
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

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-blue-200">
            Hệ thống Học vụ Điện tử • Khóa Luận Tốt Nghiệp CNTT Trao Tặng HUTECH
          </span>
          <div className="bg-[#E31B23] text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide">
            HUTECHPOLY-AI
          </div>
        </div>
      </div>

      {/* 2. Banner chính toàn màn hình (Full-Width Academic Banner) */}
      <div className="relative w-full bg-gradient-to-r from-[#003366] via-[#0054A6] to-[#0066CC] px-4 sm:px-6 py-4 overflow-hidden shadow-sm">
        {/* Họa tiết bóng mờ thành phố / skyline đồ họa của trường HUTECH */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-repeat-x bg-bottom"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 120%, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-4 relative z-10">
          {/* Cụm Trái: Thẻ trắng chứa Logo HUTECH và Kỷ niệm 31 năm (như ảnh mẫu) */}
          <div className="flex items-center gap-3 w-full xl:w-auto justify-between sm:justify-start">
            <Link
              href="/"
              className="bg-white rounded-xl p-2.5 sm:p-3 shadow-md flex items-center gap-3 border border-slate-100 hover:shadow-lg transition-all shrink-0"
            >
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

              <div className="flex flex-col pr-2 border-r border-slate-200">
                <span className="text-xl sm:text-2xl font-black text-[#0054A6] leading-none tracking-tight">
                  HUTECH
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#E31B23] uppercase tracking-wider mt-1 leading-none">
                  Đại học Công nghệ Tp.HCM
                </span>
              </div>

              {/* Huy hiệu 31 năm HUTECH (như trên cổng học vụ) */}
              <div className="hidden sm:flex flex-col text-left pl-1">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black text-[#E31B23] leading-none">31</span>
                  <span className="text-[10px] font-black text-[#0054A6] leading-none">HUTECH</span>
                </div>
                <span className="text-[8px] text-slate-500 font-bold leading-tight mt-0.5">
                  1995 - 2026
                </span>
                <span className="text-[7px] text-[#0054A6] font-semibold tracking-tighter uppercase leading-none">
                  Phát triển bền vững • Hội nhập
                </span>
              </div>
            </Link>

            {/* Tiêu đề hệ thống trên màn hình vừa và nhỏ */}
            <div className="block xl:hidden text-right sm:text-left text-white">
              <span className="text-xs font-bold text-blue-200 block uppercase">Hệ Thống</span>
              <span className="text-sm sm:text-base font-black text-white block">
                HỌC VỤ ĐIỆN TỬ • AI
              </span>
            </div>
          </div>

          {/* Cụm Giữa: Chữ Banner Lớn Chuẩn Cổng Học Vụ HUTECH */}
          <div className="hidden xl:flex flex-col items-center justify-center text-center">
            <span className="text-xs font-extrabold tracking-widest text-blue-200 uppercase drop-shadow-xs">
              HỆ THỐNG
            </span>
            <div className="bg-white/95 text-[#E31B23] px-6 py-1 rounded-2xl shadow-md border-2 border-white/40 my-0.5">
              <span className="text-2xl font-black tracking-tight text-[#E31B23]">
                HỌC VỤ ĐIỆN TỬ
              </span>
            </div>
            <span className="text-xs font-black tracking-wider text-white uppercase drop-shadow-xs">
              PHÂN HỆ LUYỆN PHẢN XẠ NGOẠI NGỮ • HUTECHPOLY-AI
            </span>
          </div>

          {/* Cụm Phải: Huy hiệu QS Stars + Thông báo + Thông tin Sinh viên (như ảnh mẫu) */}
          <div className="flex items-center gap-3 sm:gap-4 w-full xl:w-auto justify-end">
            {/* Huy hiệu QS Stars (như ảnh mẫu) */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-xl text-white">
              <div className="flex text-[#FFC20E]">
                <Star className="w-3.5 h-3.5 fill-[#FFC20E]" />
                <Star className="w-3.5 h-3.5 fill-[#FFC20E]" />
                <Star className="w-3.5 h-3.5 fill-[#FFC20E]" />
                <Star className="w-3.5 h-3.5 fill-[#FFC20E]" />
              </div>
              <div className="text-left leading-none">
                <span className="text-[10px] font-black tracking-tight block">QS STARS</span>
                <span className="text-[8px] text-blue-200 uppercase">Rating System</span>
              </div>
            </div>

            {/* Chuông thông báo có số badge đỏ (như ảnh mẫu: 19) */}
            <div className="relative cursor-pointer p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-[#E31B23] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0054A6] shadow-sm">
                19
              </span>
            </div>

            {/* Thông tin Sinh viên chuẩn portal: Avatar + Tên + MSSV (như ảnh mẫu) */}
            <div className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-white text-[#0054A6] flex items-center justify-center font-black text-xs shadow-xs border-2 border-[#FFC20E]">
                NT
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <span className="text-xs font-extrabold text-white block">
                  Nguyễn Phan Ngọc Trường
                </span>
                <span className="text-[11px] text-blue-200 font-mono font-medium block">
                  2380602415
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-blue-200 opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
