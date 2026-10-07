import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // public/family/index.html(추석 가족 사주 관계도, 원본은 family-saju-map 레포)을 /family로 노출
  async rewrites() {
    return {
      // gold.fundmoney8.com 전용: 같은 프로젝트의 public/gold/ 정적 사이트(금은 거래 가이드)를 이 주소의 루트로 보여준다.
      // beforeFiles여야 루트("/")가 앱 홈보다 먼저 이 규칙에 걸린다. 다른 주소(www 등)에는 영향 없음.
      beforeFiles: [
        { source: "/", has: [{ type: "host" as const, value: "gold.fundmoney8.com" }], destination: "/gold/index.html" },
        { source: "/:path((?!_next|gold/).*)", has: [{ type: "host" as const, value: "gold.fundmoney8.com" }], destination: "/gold/:path" },
        // trip.fundmoney8.com 전용: public/trip/ 정적 사이트(여행 모아보기)를 이 주소의 루트로 (gold와 같은 방식)
        { source: "/", has: [{ type: "host" as const, value: "trip.fundmoney8.com" }], destination: "/trip/index.html" },
        { source: "/:path((?!_next|trip/).*)", has: [{ type: "host" as const, value: "trip.fundmoney8.com" }], destination: "/trip/:path" },
      ],
      afterFiles: [
        { source: "/family", destination: "/family/index.html" },
        { source: "/airport", destination: "/airport/index.html" },
        { source: "/festival", destination: "/festival/index.html" },
        { source: "/camping", destination: "/camping/index.html" },
        { source: "/trip", destination: "/trip/index.html" },
        { source: "/privacy", destination: "/privacy/index.html" },
      ],
      fallback: [],
    };
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
      // 축제 가는 법 스레드 고정댓글 (e = event): 진주남강유등축제 / 횡성한우축제
      { source: "/ej", destination: "/festival/jinju-lantern.html?utm_source=threads&utm_campaign=festival_jinju", permanent: false },
      { source: "/eh", destination: "/festival/hoengseong-hanwoo.html?utm_source=threads&utm_campaign=festival_hoengseong", permanent: false },
    ];
  },
};

export default nextConfig;
