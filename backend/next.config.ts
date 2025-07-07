import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15에서는 appDir이 기본값이므로 제거
  async headers() {
    // 개발 환경에서는 모든 localhost 도메인 허용, 프로덕션에서는 환경변수 사용
    const allowedOrigin = process.env.NODE_ENV === 'production' 
      ? (process.env.ALLOWED_ORIGINS?.split(',')[0] || 'https://yourdomain.com')
      : '*'; // 개발 환경에서는 모든 Origin 허용

    return [
      {
        // 모든 API 라우트에 CORS 헤더 적용
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
