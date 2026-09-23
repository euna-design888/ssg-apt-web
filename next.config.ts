import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // public/family/index.html(추석 가족 사주 관계도, 원본은 family-saju-map 레포)을 /family로 노출
  async rewrites() {
    return [{ source: "/family", destination: "/family/index.html" }];
  },
};

export default nextConfig;
