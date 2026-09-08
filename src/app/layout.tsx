import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "쓱보는 청약 (AptFact) - 2026 아파트 분양가 안전마진 & 청약 가점 계산기",
  description: "국내 최초 공공 팩트체크(바름)와 악마의 변호인 리스크(단호)로 검증하는 차세대 청약 정보 포털. 수도권 아파트 분양가, 실질 안전마진, 스트레스 DSR 2단계 주담대 한도 계산.",
  keywords: ["아파트청약", "청약가점계산기", "안전마진", "스트레스DSR2단계", "신혼희망타운", "분양가상한제", "성남복정2", "인천계양A6"],
  authors: [{ name: "Wolcheon Corp" }],
  verification: {
    google: "nM4yd26J-VTH9vstL6lp5M0mRifEhdaS_dnzA286DFU",
    other: {
      "naver-site-verification": "2fc632acef8e04a0bf935d031f3b5885b5c0414a",
    },
  },
  openGraph: {
    title: "쓱보는 청약 (AptFact) - 2026 아파트 분양가 안전마진 & 청약 가점 계산기",
    description: "장밋빛 환상을 걷어낸 실질 안전마진 및 1차 공공 데이터 팩트체크 청약 포털",
    type: "website",
    locale: "ko_KR",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="nM4yd26J-VTH9vstL6lp5M0mRifEhdaS_dnzA286DFU" />
        {/* Naver Search Advisor Verification */}
        <meta name="naver-site-verification" content="2fc632acef8e04a0bf935d031f3b5885b5c0414a" />
        {/* Google AdSense Account 1 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6925161017862158"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
