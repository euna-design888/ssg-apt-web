import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // public/family/index.html(추석 가족 사주 관계도, 원본은 family-saju-map 레포)을 /family로 노출
  async rewrites() {
    return [{ source: "/family", destination: "/family/index.html" }];
  },
  // 스레드 홍보용 짧은 링크: /f1~/f80 → 글 버전별 추적 꼬리표가 붙은 /family (임시 이동이라 GA에 UTM이 남음)
  async redirects() {
    return [
      ...Array.from({ length: 80 }, (_, i) => ({
        source: `/f${i + 1}`,
        destination: `/family?utm_source=threads&utm_campaign=chuseok&utm_content=v${i + 1}`,
        permanent: false,
      })),
      // 스레드 공통 링크(모든 계정 고정댓글에 같은 링크, 계정별 성과는 스레드 조회수로 봄)
      { source: "/f", destination: "/family?utm_source=threads&utm_campaign=chuseok2", permanent: false },
      // 커플·부부 궁합 모드 (명절 밖 상시 홍보용)
      { source: "/fc", destination: "/family?m=c&utm_source=threads&utm_campaign=couple", permanent: false },
      // 우리 아이 기질 & 부모 궁합 모드
      { source: "/fk", destination: "/family?m=k&utm_source=threads&utm_campaign=kid", permanent: false },
      // 네이버 블로그 글 전용
      { source: "/fb", destination: "/family?utm_source=naver_blog&utm_campaign=chuseok", permanent: false },
    ];
  },
};

export default nextConfig;
