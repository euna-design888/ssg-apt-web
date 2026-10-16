import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheongyakCard from "@/components/CheongyakCard";
import { BASIS, SOURCE, thisWeek, upcoming, ymd, addDays } from "@/lib/cheongyak";

export const metadata = {
  title: "이번 주 청약 접수 단지 — 청약홈 공공데이터로 매일 갱신",
  description: "이번 주 청약 접수가 시작되는 전국 아파트 단지를 공급 세대 순으로 모았습니다. 접수 일정·분양가·특별공급 세대까지 한 번에.",
  alternates: { canonical: "https://apt.bluepalpal.com/cheongyak/this-week" },
  openGraph: { title: "이번 주 청약 접수 단지 — 청약홈 공공데이터로 매일 갱신", description: "이번 주 접수 단지를 공급 세대 순으로. 접수 일정·분양가·특별공급 세대.", url: "https://apt.bluepalpal.com/cheongyak/this-week" },
};

export default function ThisWeekPage() {
  const week = thisWeek(), later = upcoming().filter((c) => !week.includes(c));
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-paper)" }}>
      <Header />
      <main className="container" style={{ flex: 1, fontSize: 18 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
          { "@context": "https://schema.org", "@type": "ItemList", name: "이번 주 청약 접수 단지", itemListElement: week.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: `https://apt.bluepalpal.com/cheongyak/${c.id}` })) },
          { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "청약 허브", item: "https://apt.bluepalpal.com/" }, { "@type": "ListItem", position: 2, name: "이번 주 접수" }] },
        ]) }} />
        <p style={{ fontSize: 15, color: "var(--color-muted)", margin: "16px 0 4px" }}>기준일 {ymd(BASIS)} · 출처 {SOURCE}</p>
        <h1 style={{ fontSize: 26, margin: "0 0 8px" }}>이번 주 청약 접수 단지 ({ymd(BASIS)} ~ {ymd(addDays(BASIS, 7))})</h1>
        <p style={{ margin: "0 0 16px" }}>{week.length ? `이번 주 접수 ${week.length}개 단지를 공급 세대 순으로 정리했습니다.` : "이번 주 접수 예정 단지가 없습니다. 아래 다음 접수 단지를 확인하세요."}</p>
        <div className="feed-list">{week.map((c) => <CheongyakCard key={c.id} c={c} />)}</div>
        {later.length > 0 && (<>
          <h2 style={{ fontSize: 22, margin: "32px 0 12px" }}>다음 접수 단지 · {later.length}</h2>
          <div className="feed-list">{later.slice(0, 30).map((c) => <CheongyakCard key={c.id} c={c} />)}</div>
        </>)}
        <p style={{ fontSize: 15, color: "var(--color-muted)", background: "var(--color-paper-2)", borderRadius: 12, padding: 14, margin: "24px 0 32px" }}>
          {SOURCE} 공공데이터를 매일 아침 갱신합니다. 투자 권유가 아니며, 접수 전 입주자모집공고 원문을 확인하세요.
        </p>
      </main>
      <Footer />
    </div>
  );
}
