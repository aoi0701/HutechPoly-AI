import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cho phép kết nối Hot Reload an toàn từ IP mạng LAN (máy tính & điện thoại)
  allowedDevOrigins: ["192.168.1.74", "localhost:3000"],
};

export default nextConfig;
