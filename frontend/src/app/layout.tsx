import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HutechPoly AI | Nền Tảng Luyện Phản Xạ Đa Ngữ Thông Minh - ĐH HUTECH",
  description:
    "Hệ thống luyện phản xạ hội thoại thông minh đa ngữ (Anh - Nhật - Hàn) ứng dụng trí tuệ nhân tạo dành cho sinh viên Trường Đại học HUTECH.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className="h-full bg-slate-50 text-slate-900 antialiased"
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
