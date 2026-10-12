import React from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheongyakCard from "@/components/CheongyakCard";
import { BASIS, SOURCE, SIDO_SLUG, SLUG_SIDO, bySido, sidoCounts, ymd } from "@/lib/cheongyak";

export const dynamicParams = false;
export async function generateStaticParams() { return Object.values(SIDO_SLUG).map((sido) => ({ sido })); }

export async function generateMetadata({ params }: { params: Promise<{ sido: string }> }) {
  const { sido } = await params; const name = SLUG_SIDO[sido];
  if (!name) return { title: "지역을 찾을 수 없습니다" };
  const title = `${name} 청약 일정 ${ymd(BASIS).slice(0, 7)} — 접수 예정·진행 단지`, description = `${name} 아파트 청약 접수 예정·진행 단지와 분양가, 발표일을 청약홈 공공데이터로 정리했습니다.`;
  const empty = (sidoCounts()[name] || 0) === 0; // 단지 0곳인 지역은 색인에서 뺌 (지이오 10/12)
  return { title, description, alternates: { canonical: `https://www.fundmoney8.com/cheongyak/region/${sido}` }, openGraph: { title, description, url: `https://www.fundmoney8.com/cheongyak/region/${sido}` }, robots: empty ? { index: false, follow: true } : undefined };
}

export default async function RegionPage({ params }: { params: Promise<{ sido: string }> }) {
  const { sido } = await params; const name = SLUG_SIDO[sido];
  if (!name) notFound();
  const list = bySido(name), counts = sidoCounts();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-paper)" }}>
      <Header />
      <main className="container" style={{ flex: 1, fontSize: 18 }}>
        <p style={{ fontSize: 15, color: "var(--color-muted)", margin: "16px 0 4px" }}>기준일 {ymd(BASIS)} · 출처 {SOURCE} · <a href="/cheongyak/this-week">이번 주 접수</a></p>
        <h1 style={{ fontSize: 26, margin: "0 0 8px" }}>{name} 청약 일정 · {list.length}개 단지</h1>
        <p style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "0 0 16px" }}>
          {Object.entries(SIDO_SLUG).map(([n, s]) => (<a key={s} href={`/cheongyak/region/${s}`} style={{ padding: "8px 12px", minHeight: 44, borderRadius: 999, background: n === name ? "var(--color-ink)" : "var(--color-paper)", color: n === name ? "var(--color-paper)" : "var(--color-ink)", border: "1px solid var(--color-rule)", textDecoration: "none", fontSize: 16 }}>{n} {counts[n] || 0}</a>))}
        </p>
        {list.length ? <div className="feed-list">{list.map((c) => <CheongyakCard key={c.id} c={c} />)}</div> : <p>최근 45일~향후 75일 사이 {name} 접수 단지가 없습니다.</p>}
        <p style={{ fontSize: 15, color: "var(--color-muted)", background: "var(--color-paper-2)", borderRadius: 12, padding: 14, margin: "24px 0 32px" }}>{SOURCE} 공공데이터 기준. 투자 권유가 아니며 접수 전 공고 원문을 확인하세요.</p>
      </main>
      <Footer />
    </div>
  );
}
