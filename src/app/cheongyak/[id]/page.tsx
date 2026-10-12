import React from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ITEMS, BASIS, SOURCE, byId, status, STATUS_LABEL, rangeText, ymd, money, pyeong, typeLabel, regulationTags, SIDO_SLUG } from "@/lib/cheongyak";

// 단지 페이지 (2026-10-12) — 청약홈 공공데이터로 매일 갱신되는 정적 페이지. AI 인용용: 표·FAQ·JSON-LD·기준일
export const dynamicParams = false;
export async function generateStaticParams() { return ITEMS.map((c) => ({ id: c.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const c = byId(id);
  if (!c) return { title: "단지를 찾을 수 없습니다" };
  const title = `${c.name} 청약 일정·분양가·특별공급 (${ymd(BASIS)} 기준)`;
  const description = `${c.name}(${c.sido}, 총 ${c.supply.toLocaleString()}세대) 청약 접수 ${rangeText(c.schedule.receipt)}, 당첨자 발표 ${ymd(c.schedule.announce)}, 분양가 ${money(c.priceMin)}${c.priceMax > c.priceMin ? `~${money(c.priceMax)}` : ""}. 청약홈 공공데이터.`;
  return { title, description, alternates: { canonical: `https://www.fundmoney8.com/cheongyak/${c.id}` }, openGraph: { title, description, url: `https://www.fundmoney8.com/cheongyak/${c.id}` } };
}

const th: React.CSSProperties = { textAlign: "left", padding: "10px 8px", background: "var(--color-paper-2)", fontSize: 16, whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 8px", borderBottom: "1px solid var(--color-rule)", fontSize: 18 };
const h2: React.CSSProperties = { fontSize: 22, margin: "32px 0 12px" };

export default async function CheongyakPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const c = byId(id);
  if (!c) notFound();
  const st = status(c);
  const totalSpecial = c.types.reduce((s, t) => s + t.special, 0);
  const sb = c.types.reduce((acc, t) => { for (const [k, v] of Object.entries(t.specialBreakdown)) acc[k] = (acc[k] || 0) + v; return acc; }, {} as Record<string, number>);
  const sbLabel: Record<string, string> = { multiChild: "다자녀", newlywed: "신혼부부", firstLife: "생애최초", elderly: "노부모부양", institution: "기관추천", newborn: "신생아", youth: "청년", relocation: "이전기관" };
  const regulated = c.flags.speculation || c.flags.adjust;
  const faq = [
    { q: `${c.name} 청약 접수는 언제인가요?`, a: `특별공급 ${rangeText(c.schedule.special)}, 1순위 ${rangeText(c.schedule.rank1)}, 2순위 ${rangeText(c.schedule.rank2)}입니다. 당첨자 발표는 ${ymd(c.schedule.announce)}, 계약은 ${rangeText(c.schedule.contract)}입니다.` },
    { q: `${c.name} 분양가는 얼마인가요?`, a: c.priceMin ? `주택형별 최고 분양가 기준 ${money(c.priceMin)}${c.priceMax > c.priceMin ? `부터 ${money(c.priceMax)}` : ""}입니다. 발코니 확장·옵션비는 별도이며 층·향에 따라 다릅니다.` : "입주자모집공고 원문에서 주택형별 분양가를 확인하세요." },
    { q: `${c.name} 특별공급은 몇 세대인가요?`, a: totalSpecial ? `총 ${c.supply.toLocaleString()}세대 중 특별공급 ${totalSpecial.toLocaleString()}세대입니다. ${Object.entries(sb).filter(([, v]) => v > 0).map(([k, v]) => `${sbLabel[k]} ${v}`).join(", ")}세대입니다.` : "특별공급 배정이 없거나 공고에서 확인이 필요합니다." },
    { q: `${c.name}은 규제지역인가요?`, a: `${regulationTags(c).join(", ")}입니다. ${regulated ? "투기과열지구·조정대상지역은 1순위 요건(청약통장 가입 2년, 세대주, 5년 내 당첨 이력 없음 등)이 강화되고 전매제한이 깁니다." : "비규제지역은 1순위 요건이 완화되지만, 지역별 통장 가입 기간 요건은 공고문을 확인해야 합니다."}` },
    { q: "어디에서 신청하나요?", a: "한국부동산원 청약홈(applyhome.co.kr)에서 접수합니다. 접수 전 입주자모집공고 원문의 자격·서류를 반드시 확인하세요." },
  ];
  const ld = [
    { "@context": "https://schema.org", "@type": "Event", name: `${c.name} 청약 접수`, startDate: c.schedule.receipt?.[0], endDate: c.schedule.receipt?.[1], eventStatus: st === "closed" ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode", location: { "@type": "VirtualLocation", url: "https://www.applyhome.co.kr" }, organizer: { "@type": "Organization", name: c.developer || c.builder },
      description: `${c.name} (${c.address}) 청약 접수. 총 ${c.supply}세대.`, url: `https://www.fundmoney8.com/cheongyak/${c.id}` },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "청약 허브", item: "https://www.fundmoney8.com/" },
      { "@type": "ListItem", position: 2, name: c.sido, item: `https://www.fundmoney8.com/cheongyak/region/${SIDO_SLUG[c.sido] || "etc"}` },
      { "@type": "ListItem", position: 3, name: c.name } ] },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-paper)" }}>
      <Header />
      <main className="container" style={{ flex: 1, fontSize: 18, lineHeight: 1.6 }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        <p style={{ fontSize: 15, color: "var(--color-muted)", margin: "16px 0 4px" }}>기준일 {ymd(BASIS)} · 출처 {SOURCE} · <a href={`/cheongyak/region/${SIDO_SLUG[c.sido] || "etc"}`}>{c.sido} 청약 목록</a></p>
        <h1 style={{ fontSize: 26, lineHeight: 1.3, margin: "0 0 8px" }}>{c.name} 청약 일정·분양가·특별공급</h1>
        <p style={{ margin: "0 0 16px" }}>
          <span className={`status-pill ${st === "applying" ? "status-live" : "status-soon"}`}>{STATUS_LABEL[st]}</span>{" "}
          {c.sido} · {c.saleType === "국민" ? "공공분양" : "민영분양"} · 총 {c.supply.toLocaleString()}세대 · 입주 예정 {c.moveIn || "미정"}
        </p>
        <p style={{ background: "var(--color-paper)", border: "1px solid var(--color-rule)", borderRadius: 12, padding: 16 }}>
          <b>{c.name}</b>은 {c.address}에 공급되는 {c.supply.toLocaleString()}세대 {c.saleType === "국민" ? "공공분양" : "민영분양"} 아파트입니다.
          청약 접수는 <b>{rangeText(c.schedule.receipt)}</b>, 당첨자 발표는 <b>{ymd(c.schedule.announce)}</b>이며, 분양가는 주택형별 최고가 기준 <b>{money(c.priceMin)}{c.priceMax > c.priceMin ? ` ~ ${money(c.priceMax)}` : ""}</b>입니다.
        </p>

        <h2 style={h2}>청약 일정은 언제인가요?</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--color-paper)" }}><tbody>
          {[["모집공고일", ymd(c.noticeDate)], ["특별공급 접수", rangeText(c.schedule.special)], ["1순위 접수", rangeText(c.schedule.rank1)], ["2순위 접수", rangeText(c.schedule.rank2)], ["당첨자 발표", ymd(c.schedule.announce)], ["계약 체결", rangeText(c.schedule.contract)], ["입주 예정", c.moveIn || "미정"]].map(([k, v]) => (
            <tr key={k}><th style={th}>{k}</th><td style={td}>{v}</td></tr>))}
        </tbody></table>
        <p style={{ marginTop: 10 }}>
          <a href={`/api/ics?ids=${c.id}`} className="official-btn" style={{ display: "inline-block", minHeight: 52, lineHeight: "52px", padding: "0 20px", borderRadius: 12, background: "var(--color-ink)", color: "var(--color-paper)", textDecoration: "none", fontWeight: 700 }}>일정 달력에 넣기</a>
          <span style={{ fontSize: 15, color: "var(--color-muted)", marginLeft: 10 }}>구글·아이폰 달력에 접수·발표일이 들어갑니다</span>
        </p>

        <h2 style={h2}>분양가와 주택형은 어떻게 되나요?</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--color-paper)", minWidth: 520 }}>
            <thead><tr><th style={th}>주택형</th><th style={th}>공급면적</th><th style={th}>세대</th><th style={th}>특별공급</th><th style={th}>최고 분양가</th></tr></thead>
            <tbody>{c.types.map((t) => (
              <tr key={t.no}><td style={td}>{typeLabel(t.type)}㎡</td><td style={td}>{t.supplyArea ? `${t.supplyArea.toFixed(1)}㎡ (${pyeong(t.supplyArea)})` : "-"}</td><td style={td}>{t.households}</td><td style={td}>{t.special}</td><td style={td}><b>{money(t.price)}</b></td></tr>))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 15, color: "var(--color-muted)" }}>분양가는 주택형별 최고가(공고 기준)이며 층·향별로 다릅니다. 발코니 확장·옵션비 별도.</p>

        <h2 style={h2}>특별공급은 누가 몇 세대인가요?</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--color-paper)" }}><tbody>
          {Object.entries(sb).filter(([, v]) => v > 0).map(([k, v]) => (<tr key={k}><th style={th}>{sbLabel[k]}</th><td style={td}>{v.toLocaleString()}세대</td></tr>))}
          <tr><th style={th}>특별공급 합계</th><td style={td}><b>{totalSpecial.toLocaleString()}세대</b> / 총 {c.supply.toLocaleString()}세대</td></tr>
        </tbody></table>

        <h2 style={h2}>청약 자격은 어떻게 되나요?</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li>규제 구분: <b>{regulationTags(c).join(" · ")}</b></li>
          <li>{regulated ? "투기과열지구·조정대상지역: 1순위는 청약통장 가입 2년 이상, 세대주, 세대원 전원 5년 내 당첨 이력 없음 등 강화 요건이 적용됩니다." : "비규제지역: 1순위 통장 가입 기간 요건이 완화됩니다(수도권·비수도권 다름). 정확한 기간은 공고문 확인."}</li>
          <li>{c.flags.priceCap ? "분양가상한제 적용 단지: 거주의무·전매제한 기간을 공고문에서 확인하세요." : "분양가상한제 미적용 단지입니다."}</li>
          <li>내 가점이 궁금하면 <a href="/#calculator">청약 가점 계산기</a>로 84점 만점 기준 점수를 먼저 확인하세요.</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          <a href="/#calculator" style={{ display: "inline-block", minHeight: 52, lineHeight: "52px", padding: "0 20px", borderRadius: 12, background: "var(--color-accent)", color: "var(--color-paper)", textDecoration: "none", fontWeight: 700 }}>내 가점 계산하기</a>
        </p>

        <h2 style={h2}>자주 묻는 질문</h2>
        {faq.map((f) => (<details key={f.q} style={{ background: "var(--color-paper)", border: "1px solid var(--color-rule)", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}><summary style={{ fontWeight: 700, cursor: "pointer", minHeight: 36 }}>{f.q}</summary><p style={{ margin: "8px 0 0" }}>{f.a}</p></details>))}

        <h2 style={h2}>공식 자료</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li><a href={c.pblancUrl} target="_blank" rel="noopener">청약홈 입주자모집공고 원문</a></li>
          {c.homepage && <li><a href={c.homepage} target="_blank" rel="noopener nofollow">분양 홈페이지</a> · 문의 {c.tel}</li>}
          <li>시행 {c.developer}{c.builder && c.builder !== c.developer ? ` · 시공 ${c.builder}` : ""}</li>
        </ul>
        <p style={{ fontSize: 15, color: "var(--color-muted)", background: "var(--color-paper-2)", borderRadius: 12, padding: 14, margin: "24px 0 32px" }}>
          이 페이지는 {SOURCE} 공공데이터를 {ymd(BASIS)} 기준으로 가공한 정보이며 투자 권유나 당첨 보장이 아닙니다. 접수 전 반드시 입주자모집공고 원문을 확인하세요. 공개되는 당첨가점은 타입별·가점제 물량 기준이라 단지 전체 커트라인이 아닙니다.
        </p>
      </main>
      <Footer />
    </div>
  );
}
