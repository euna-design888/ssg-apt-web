import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheongyakScoreCalculator from '@/components/CheongyakScoreCalculator';
import StatFigure from '@/components/StatFigure';
import rawApartments from '@/data/apartments.json';
import { Apartment } from '@/types/apartment';
import { BASIS, status, thisWeek, upcoming, sidoCounts, SIDO_SLUG, rangeText, money, md, ymd } from '@/lib/cheongyak';

// 쓱보는 청약 홈 (2026-10-12 리디자인 · Hallmark Stat-Led/Cobalt). 숫자는 전부 청약홈 데이터에서 계산한 실제 값.
const legacy = rawApartments as Apartment[]; // 가점 계산기가 아직 옛 8단지 목록을 참조 (링크 /apt/…는 살아 있음)

export const metadata = {
  title: '쓱보는 청약 — 이번 주 청약 접수 단지·분양가·가점 계산기',
  description: '이번 주 청약 접수 단지와 일정·분양가·특별공급 세대를 청약홈 공식 데이터로 매일 갱신합니다. 84점 만점 청약 가점 계산기 무료.',
  alternates: { canonical: 'https://www.fundmoney8.com/' },
  openGraph: { title: '쓱보는 청약 — 이번 주 청약 접수 단지·분양가·가점 계산기', description: '청약홈 공식 데이터로 매일 갱신하는 청약 일정·분양가·특별공급 세대. 가점 계산기 무료.', url: 'https://www.fundmoney8.com/' },
};

export default function HomePage() {
  const week = thisWeek();
  const weekHouseholds = week.reduce((s, c) => s + c.supply, 0);
  const live = upcoming();
  const counts = sidoCounts();
  const faq = [
    { q: '이 사이트의 청약 일정은 어디서 가져오나요?', a: '한국부동산원 청약홈의 공공데이터(분양정보·경쟁률)를 매일 아침 받아 그대로 보여줍니다. 기준일은 각 페이지 위에 적혀 있습니다.' },
    { q: '내 가점은 어떻게 계산하나요?', a: '무주택 기간(최대 32점)·부양가족 수(최대 35점)·청약통장 가입 기간(최대 17점)을 더해 84점 만점으로 계산합니다. 아래 계산기에 세 가지만 넣으면 됩니다.' },
    { q: '당첨가점이 공개되면 그게 커트라인인가요?', a: '아닙니다. 청약홈이 공개하는 최저 당첨가점은 주택형별·가점제 물량 기준이라 단지 전체 커트라인이 아닙니다. 같은 지역의 비슷한 주택형을 여러 개 보고 판단하세요.' },
    { q: '달력에 넣기는 어떻게 쓰나요?', a: '단지 페이지의 "일정 달력에 넣기"를 누르면 특별공급·1순위·발표·계약일이 담긴 달력 파일이 내려옵니다. 구글 캘린더나 아이폰 달력에서 열면 바로 들어갑니다.' },
  ];

  return (
    <div className="sb-page">
      <Header />
      <main>
        {/* 히어로 · Stat-Led: 이번 주 접수 단지 수가 주인공, 옆에 말이 붙는다 */}
        <section className="sb-wrap sb-hero">
          <div>
            <p className="sb-meta">이번 주 청약 접수 · {ymd(BASIS)} 기준</p>
            <div className="sb-hero__figure" aria-label={`이번 주 접수 ${week.length}개 단지`}>
              <StatFigure value={week.length} /><span className="sb-hero__unit">개 단지</span>
            </div>
            <h1 className="sb-hero__title">이번 주 접수 {week.length}곳, 내 가점으로 갈 곳이 보입니다</h1>
            <p className="sb-hero__lede">총 {weekHouseholds.toLocaleString()}세대. 접수일·분양가·특별공급 세대를 청약홈 공식 데이터로 매일 아침 갱신합니다.</p>
            <div className="sb-hero__actions">
              <a href="#calculator" className="sb-btn sb-btn--primary">내 가점 계산하기</a>
              <a href="/cheongyak/this-week" className="sb-btn sb-btn--outline">이번 주 단지 모두 보기</a>
            </div>
          </div>
          <div className="sb-table" aria-label="이번 주 접수 단지, 공급 세대 순">
            <div className="sb-table__cap"><span className="sb-meta">공급 세대 많은 순</span><span className="sb-meta">접수일</span></div>
            {week.slice(0, 5).map((c) => (
              <a key={c.id} href={`/cheongyak/${c.id}`} className="sb-row">
                <span className="sb-row__name">{status(c) === 'applying' && <span className="sb-live">접수 중</span>}{c.name}</span>
                <span className="sb-row__num sb-tnum">{c.supply.toLocaleString()}<small>{md(c.schedule.receipt?.[0])}~{md(c.schedule.receipt?.[1])}</small></span>
                <span className="sb-row__sub">{c.sido} · 분양가 {money(c.priceMin)}{c.priceMax > c.priceMin ? ` ~ ${money(c.priceMax)}` : ''}</span>
              </a>
            ))}
            {week.length > 5 && <a href="/cheongyak/this-week" className="sb-table__more">나머지 {week.length - 5}곳 보기 →</a>}
            {week.length === 0 && <p className="sb-row__sub" style={{ padding: 'var(--space-md) 0' }}>이번 주 접수 단지가 없습니다. 아래 다음 접수 단지를 보세요.</p>}
          </div>
        </section>

        {/* 접수 예정 전체 · 괘선 표 */}
        <section className="sb-section">
          <div className="sb-wrap">
            <h2 className="sb-h2">지금 접수 중이거나 곧 접수하는 단지는 어디인가요?<small>{live.length}곳 · 접수 시작일 순 · 마감된 단지는 지역 페이지에서</small></h2>
            <div className="sb-table sb-list">
              {live.slice(0, 12).map((c) => (
                <a key={c.id} href={`/cheongyak/${c.id}`} className="sb-row">
                  <span className="sb-row__name">{status(c) === 'applying' && <span className="sb-live">접수 중</span>}{c.name}</span>
                  <span className="sb-row__when sb-tnum">{rangeText(c.schedule.receipt)}</span>
                  <span className="sb-row__num sb-tnum">{c.supply.toLocaleString()}<small>세대</small></span>
                  <span className="sb-row__sub">{c.sido} · {c.saleType === '국민' ? '공공분양' : '민영분양'} · 발표 {ymd(c.schedule.announce)}</span>
                </a>
              ))}
            </div>
            {live.length > 12 && <a href="/cheongyak/this-week" className="sb-table__more">전체 {live.length}곳 보기 →</a>}
          </div>
        </section>

        {/* 지역 */}
        <section className="sb-section">
          <div className="sb-wrap">
            <h2 className="sb-h2">지역별 청약 일정<small>최근 45일부터 앞으로 75일까지 공고 기준</small></h2>
            <div className="sb-chips">
              {Object.entries(SIDO_SLUG).map(([name, slug]) => (
                <a key={slug} href={`/cheongyak/region/${slug}`} className={`sb-chip ${counts[name] ? '' : 'sb-chip--empty'}`}>{name} <b>{counts[name] || 0}</b></a>
              ))}
            </div>
          </div>
        </section>

        {/* 흑연 띠 · 쓰는 법 3단계 (순서가 있는 내용이라 번호 허용) */}
        <section className="sb-section sb-band">
          <div className="sb-wrap">
            <h2 className="sb-h2">세 번이면 끝납니다<small>가점 확인 → 단지 고르기 → 달력에 넣기</small></h2>
            <div className="sb-steps">
              <div className="sb-step"><h3>내 가점을 압니다</h3><p>무주택 기간·부양가족·통장 가입 기간 세 가지로 84점 만점 점수를 냅니다. <a href="#calculator">계산기로 바로</a>.</p></div>
              <div className="sb-step"><h3>이번 주 단지를 고릅니다</h3><p>세대 수·분양가·특별공급 배정을 보고 넣을 단지를 정합니다. 규제지역이면 1순위 요건을 먼저 확인합니다.</p></div>
              <div className="sb-step"><h3>일정을 달력에 넣습니다</h3><p>단지 페이지에서 달력 파일을 받으면 특별공급·1순위·발표일이 내 달력에 들어갑니다. 접수 전날 달력이 알려줍니다.</p></div>
            </div>
          </div>
        </section>

        {/* 가점 계산기 (기존 컴포넌트) */}
        <section className="sb-section sb-calc" id="calculator">
          <div className="sb-wrap">
            <h2 className="sb-h2">청약 가점 계산기<small>84점 만점 · 입력값은 이 브라우저에만 저장됩니다</small></h2>
            <p className="sb-calc__intro">무주택 기간은 만 30세 또는 혼인신고일 중 빠른 날부터 셉니다. 배우자 통장 가입 기간 합산(2024년 3월부터)은 계산기 안내를 따르세요.</p>
            <CheongyakScoreCalculator apartments={legacy} />
          </div>
        </section>

        {/* FAQ */}
        <section className="sb-section">
          <div className="sb-wrap">
            <h2 className="sb-h2">자주 묻는 질문</h2>
            <div className="sb-faq">
              {faq.map((f) => (<details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }) }} />
    </div>
  );
}
