import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // public/family/index.html(추석 가족 사주 관계도, 원본은 family-saju-map 레포)을 /family로 노출
  async rewrites() {
    return [{ source: "/family", destination: "/family/index.html" }];
  },
  // 스레드 홍보용 짧은 링크: /f1~/f30 → 글 버전별 추적 꼬리표가 붙은 /family (임시 이동이라 GA에 UTM이 남음)
  async redirects() {
    return [
      ...Array.from({ length: 30 }, (_, i) => ({
        source: `/f${i + 1}`,
        destination: `/family?utm_source=threads&utm_campaign=chuseok&utm_content=v${i + 1}`,
        permanent: false,
      })),
      // 네이버 블로그 글 전용
      { source: "/fb", destination: "/family?utm_source=naver_blog&utm_campaign=chuseok", permanent: false },
    ];
  },
};

export default nextConfig;
