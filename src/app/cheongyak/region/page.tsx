import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ITEMS, BASIS, SOURCE, SIDO_SLUG, status, upcoming, rangeText, money, ymd, STATUS_LABEL } from "@/lib/cheongyak";

// 전국 한눈에 (2026-10-12) — 시도별로 묶어 한 페이지에. 데이터는 매일 갱신되는 cheongyak.json
const title = "전국 청약 일정 한눈에 — 시도별 접수 예정·진행 단지";
const description = "전국 17개 시도의 아파트 청약 접수 예정·진행 단지를 지역별로 묶어 한 페이지에 정리했습니다. 세대 수·접수일·분양가·발표일, 청약홈 공공데이터로 매일 갱신.";
export const metadata = { title, description, alternates: { canonical: "https://www.fundmoney8.com/cheongyak/region" }, openGraph: { title, description, url: "https://www.fundmoney8.com/cheongyak/region" } };

export default function NationwidePage() {
  const live = upcoming();
  const groups = Object.entries(SIDO_SLUG).map(([name, slug]) => {
    const list = live.filter((c) => c.sido === name);
    const closed = ITEMS.filter((c) => c.sido === name && status(c) === "closed").length;
    return { name, slug, list, closed, households: list.reduce((s, c) => s + c.supply, 0), applying: list.filter((c) => status(c) === "applying").length };
  }).sort((a, b) => b.list.length - a.list.length || b.households - a.households);
  const total = live.reduce((s, c) => s + c.supply, 0), applying = live.filter((c) => status(c) === "applying").length;
  const active = groups.filter((g) => g.list.length);
  const ld = [
    { "@context": "https://schema.org", "@type": "ItemList", name: "전국 청약 접수 예정·진행 단지", itemListElement: live.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: `${c.name} (${c.sido})`, url: `https://www.fundmoney8.com/cheongyak/${c.id}` })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "청약 허브", item: "https://www.fundmoney8.com/" }, { "@type": "ListItem", position: 2, name: "전국 청약 일정" }] },
  ];
  return (
    <div className="sb-page">
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <section className="sb-wrap" style={{ paddingBlock: "var(--space-xl) var(--space-lg)" }}>
          <p className="sb-meta">전국 청약 일정 · {ymd(BASIS)} 기준</p>
          <h1 className="sb-hero__title" style={{ maxWidth: "none", margin: "var(--space-sm) 0 var(--space-md)" }}>전국 청약 일정 한눈에</h1>
          <p className="sb-hero__lede" style={{ maxWidth: "60ch", marginBottom: "var(--space-lg)" }}>
            오늘 기준 전국에서 접수 예정이거나 접수 중인 아파트는 <b>{live.length}개 단지, {total.toLocaleString()}세대</b>입니다. 그중 지금 접수 중인 단지는 {applying}곳이고, 단지가 있는 지역은 {active.length}개 시도입니다. 지역을 누르면 그 지역만 모아 봅니다.
          </p>
          <nav className="sb-chips" aria-label="지역 바로가기">
            {groups.map((g) => (<a key={g.slug} href={`#${g.slug}`} className={`sb-chip ${g.list.length ? "" : "sb-chip--empty"}`}>{g.name} <b>{g.list.length}</b></a>))}
          </nav>
        </section>

        {active.map((g) => (
          <section key={g.slug} id={g.slug} className="sb-section" style={{ paddingBlock: "var(--space-xl)" }}>
            <div className="sb-wrap">
              <h2 className="sb-h2">{g.name} 청약 일정은 어떻게 되나요?<small>{g.list.length}곳 · {g.households.toLocaleString()}세대 · 접수 중 {g.applying}곳{g.closed ? ` · 최근 마감 ${g.closed}곳` : ""} · <a href={`/cheongyak/region/${g.slug}`}>{g.name} 페이지</a></small></h2>
              <div className="sb-table sb-list">
                {g.list.map((c) => (
                  <a key={c.id} href={`/cheongyak/${c.id}`} className="sb-row">
                    <span className="sb-row__name">{status(c) === "applying" && <span className="sb-live">{STATUS_LABEL.applying}</span>}{c.name}</span>
                    <span className="sb-row__when sb-tnum">{rangeText(c.schedule.receipt)}</span>
                    <span className="sb-row__num sb-tnum">{c.supply.toLocaleString()}<small>세대</small></span>
                    <span className="sb-row__sub">{c.saleType === "국민" ? "공공분양" : "민영분양"} · 분양가 {money(c.priceMin)}{c.priceMax > c.priceMin ? ` ~ ${money(c.priceMax)}` : ""} · 발표 {ymd(c.schedule.announce)}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ))}

        {groups.some((g) => !g.list.length) && (
          <section className="sb-section" style={{ paddingBlock: "var(--space-xl)" }}>
            <div className="sb-wrap">
              <h2 className="sb-h2">지금 접수 예정 단지가 없는 지역<small>최근 45일~앞으로 75일 공고 기준. 공고가 나오면 자동으로 올라옵니다</small></h2>
              <p>{groups.filter((g) => !g.list.length).map((g) => g.name).join(" · ")}</p>
            </div>
          </section>
        )}

        <section className="sb-section" style={{ paddingBlock: "var(--space-xl)" }}>
          <div className="sb-wrap">
            <p className="sb-foot__note">{SOURCE} 공공데이터를 매일 아침 갱신합니다. 투자 권유가 아니며 접수 전 입주자모집공고 원문을 확인하세요.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
