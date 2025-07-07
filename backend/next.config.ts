import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15에서는 appDir이 기본값이므로 제거
  async headers() {
    // 환경변수에서 허용할 도메인 가져오기
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'];
    const origin = process.env.NODE_ENV === 'production' 
      ? allowedOrigins 
      : ['http://localhost:5173', 'http://localhost:3000'];

    return [
      {
        // 모든 API 라우트에 CORS 헤더 적용
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: origin.join(',') },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
