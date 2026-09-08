'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apartment } from '@/types/apartment';
import AdPlaceholder from '@/components/AdPlaceholder';

interface Props {
  apt: Apartment;
}

export default function ApartmentDetailView({ apt }: Props) {
  const [activeTab, setActiveTab] = useState<'bareum' | 'danho' | 'finance' | 'schedule'>('bareum');
  const [copied, setCopied] = useState(false);

  // 자금 계산기 입력 상태 (단지 기본값 연동)
  const defaultDownPayment = Math.round(apt.priceMin * ((apt.financialPlan?.downPaymentPercent || 10) / 100));
  const [myCash, setMyCash] = useState<number>(defaultDownPayment);
  const [myIncome, setMyIncome] = useState<number>(6500); // 6,500만 원
  const [otherDebt, setOtherDebt] = useState<number>(0);

  const formatMoney = (val: number) => {
    const eok = Math.floor(val / 10000);
    const man = val % 10000;
    if (eok > 0 && man === 0) return `${eok}억`;
    if (eok > 0) return `${eok}억 ${man.toLocaleString()}만`;
    return `${man.toLocaleString()}만원`;
  };

  const pricePercent = Math.min(
    Math.round((apt.priceMin / apt.estimatedMarketPrice) * 100),
    90
  );
  const discountRate = Math.round(
    ((apt.estimatedMarketPrice - apt.priceMin) / apt.estimatedMarketPrice) * 100
  );

  // 자금 스케줄 산출
  const downRate = apt.financialPlan?.downPaymentPercent || 10;
  const middleRate = apt.financialPlan?.middlePaymentPercent || 60;
  const balanceRate = apt.financialPlan?.balancePaymentPercent || 30;

  const downAmount = Math.round(apt.priceMin * (downRate / 100));
  const middleAmount = Math.round(apt.priceMin * (middleRate / 100));
  const balanceAmount = Math.round(apt.priceMin * (balanceRate / 100));
  const taxAmount = apt.financialPlan?.estimatedAcquisitionTax || Math.round(apt.priceMin * 0.015);
  const optionAmount = apt.financialPlan?.estimatedOptionCost || 1500;
  const totalHiddenCost = taxAmount + optionAmount;
  const minRequiredCash = downAmount + totalHiddenCost;

  // DSR 및 대출 가능액 판정 (스트레스 DSR 2단계 가산금리 반영 약 5.2% 기준)
  const annualMaxPayment = myIncome * 0.4;
  const estimatedMaxMortgage = Math.round(annualMaxPayment / 0.065); // 원리금 균등 상환 역산
  const actualMortgagePossible = Math.max(0, estimatedMaxMortgage - otherDebt);
  const cashDeficit = Math.max(0, minRequiredCash - myCash);

  // 링크 복사 핸들러
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // 구글/네이버 AEO & GEO 최적화 종합 JSON-LD 구조화 데이터
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateListing',
        '@id': `https://fundmoney8.com/apt/${encodeURIComponent(apt.id)}#listing`,
        name: `${apt.name} 분양가 & 안전마진 팩트체크`,
        description: `${apt.name} 분양가 ${formatMoney(apt.priceMin)}부터, 안전마진 약 ${formatMoney(apt.safetyMargin)}, 실거주의무 및 DSR 2단계 분석`,
        url: `https://fundmoney8.com/apt/${encodeURIComponent(apt.id)}`,
        price: apt.priceMin * 10000,
        priceCurrency: 'KRW',
        address: {
          '@type': 'PostalAddress',
          addressRegion: apt.region,
          streetAddress: apt.locationDetail,
          addressCountry: 'KR'
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '쓱보는 청약 홈',
            item: 'https://fundmoney8.com'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: apt.name,
            item: `https://fundmoney8.com/apt/${encodeURIComponent(apt.id)}`
          }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `${apt.name}의 분양가와 예상 안전마진(시세차익)은 얼마인가요?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${apt.name}의 분양가는 최저 ${formatMoney(apt.priceMin)} ~ 최고 ${formatMoney(apt.priceMax)}입니다. 인근 준신축 시세(${formatMoney(apt.estimatedMarketPrice)}) 대비 약 ${formatMoney(apt.safetyMargin)}(약 ${discountRate}% 저렴)의 안전마진이 예상됩니다.`
            }
          },
          {
            '@type': 'Question',
            name: `${apt.name}의 전매제한 및 실거주의무 규제는 어떻게 되나요?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${apt.name}은(는) ${apt.bareumFact.regulations.join(', ')} 조건이 적용됩니다. 입주 시점 전세 활용 여부와 실거주의무를 반드시 확인해야 합니다.`
            }
          },
          {
            '@type': 'Question',
            name: `${apt.name} 청약 전 주의해야 할 대출 및 탈락 위험은 무엇인가요?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `수석 감사관 분석: ${apt.danhoRisk.criticSummary} (대출 주의사항: ${apt.danhoRisk.dsrWarning})`
            }
          }
        ]
      }
    ]
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
      {/* JSON-LD 검색엔진 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="container" style={{ flex: 1, padding: '24px 18px' }}>
        {/* 네비게이션 & 공유 버튼 행 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Link href="/" className="back-link">
            ← 전체 분양 단지 목록
          </Link>
          <button type="button" onClick={handleCopyLink} className="share-btn">
            {copied ? '✅ 복사 완료!' : '🔗 리포트 공유하기'}
          </button>
        </div>

        {/* 1. 단지 메인 요약 히어로 카드 */}
        <section className="detail-hero-card">
          <div className="card-top-row" style={{ marginBottom: '10px' }}>
            <div className="card-badges">
              <span className={`status-pill ${apt.status === 'applying' ? 'status-live' : 'status-soon'}`}>
                {apt.status === 'applying' ? '● 현재 접수중' : '접수 예정'}
              </span>
              <span className="category-pill">{apt.category}</span>
            </div>
            <span className="schedule-pill">
              발표일 {apt.schedule.announcement?.slice(5) || '추후공지'}
            </span>
          </div>

          <h1 className="detail-title">{apt.name}</h1>
          <p className="detail-sub">{apt.locationDetail} · {apt.exclusiveArea}</p>

          {/* 호갱노노 스타일 시세 비교 비주얼 박스 */}
          <div className="detail-price-box">
            <div className="detail-price-main-row">
              <div>
                <span className="detail-price-label">분양가 (최저~최고)</span>
                <div className="detail-price-num">
                  {formatMoney(apt.priceMin)} ~ {formatMoney(apt.priceMax)}
                </div>
              </div>
              <div className="detail-margin-badge">
                <span className="margin-arrow">▲</span>
                <span className="margin-amount">마진 +{formatMoney(apt.safetyMargin)}</span>
                <span className="margin-rate">({discountRate}% 저렴)</span>
              </div>
            </div>

            {/* 비교 게이지 바 */}
            <div className="gauge-track" style={{ height: '10px', marginTop: '16px' }}>
              <div className="gauge-bar-fill" style={{ width: `${pricePercent}%` }} />
              <div className="gauge-bar-margin" style={{ width: `${100 - pricePercent}%` }} />
            </div>
            <div className="detail-gauge-labels">
              <span>분양가 {formatMoney(apt.priceMin)}</span>
              <span>인근 준신축 시세 약 {formatMoney(apt.estimatedMarketPrice)}</span>
            </div>
          </div>
        </section>

        {/* 1-1. AEO 핵심 직답 브리핑 (구글 AI Overviews & 네이버 AI 브리핑 타겟) */}
        <section className="aeo-direct-box" aria-label="AI 핵심 요약 브리핑">
          <div className="aeo-direct-header">
            <span className="aeo-badge">AEO 직답</span>
            <h2 className="aeo-direct-title">{apt.name} 청약 3줄 핵심 팩트</h2>
          </div>
          <ul className="aeo-direct-list">
            <li className="aeo-direct-item">
              <span className="aeo-direct-bullet">①</span>
              <span>
                <strong>분양가 & 안전마진:</strong> 최저 {formatMoney(apt.priceMin)} ~ 최고 {formatMoney(apt.priceMax)}로 공급되며, 인근 시세 대비 <strong>약 +{formatMoney(apt.safetyMargin)}({discountRate}% 저렴)</strong>의 시세차익이 기대됩니다.
              </span>
            </li>
            <li className="aeo-direct-item">
              <span className="aeo-direct-bullet">②</span>
              <span>
                <strong>규제 & 거주의무:</strong> {apt.bareumFact.regulations.slice(0, 3).join(' · ')} 조건이 적용되며, 1차 출처({apt.bareumFact.sourceName}) 공고 기준 검증을 완료했습니다.
              </span>
            </li>
            <li className="aeo-direct-item">
              <span className="aeo-direct-bullet">③</span>
              <span>
                <strong>주의 리스크:</strong> {apt.danhoRisk.criticSummary}
              </span>
            </li>
          </ul>
        </section>

        {/* 1-2. AEO 정형 데이터 비교표 (검색 엔진 스니펫 인용 1순위) */}
        <section className="aeo-table-wrapper" aria-label="단지 핵심 요약 비교표">
          <div className="aeo-table-title">
            <span>📊 {apt.name} 공공 팩트체크 요약표</span>
          </div>
          <table className="aeo-fact-table">
            <tbody>
              <tr>
                <th scope="row">공급 위치</th>
                <td>{apt.locationDetail}</td>
              </tr>
              <tr>
                <th scope="row">분양가 범위</th>
                <td><strong>{formatMoney(apt.priceMin)} ~ {formatMoney(apt.priceMax)}</strong></td>
              </tr>
              <tr>
                <th scope="row">인근 시세 / 안전마진</th>
                <td>약 {formatMoney(apt.estimatedMarketPrice)} (<strong>+{formatMoney(apt.safetyMargin)}</strong>)</td>
              </tr>
              <tr>
                <th scope="row">전매제한 및 거주의무</th>
                <td>{apt.bareumFact.regulations.find((r) => r.includes('전매')) || '전매 1년'} · {apt.bareumFact.regulations.find((r) => r.includes('거주')) || '실거주의무 없음'}</td>
              </tr>
              <tr>
                <th scope="row">1순위 청약일</th>
                <td><strong>{apt.schedule.firstRank || '추후 공지'}</strong> (발표일: {apt.schedule.announcement || '추후 공지'})</td>
              </tr>
              <tr>
                <th scope="row">공식 출처 검증</th>
                <td>
                  <a href={apt.bareumFact.officialUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3182f6', textDecoration: 'underline' }}>
                    {apt.bareumFact.sourceName} ↗
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 2. 호갱노노 스타일 4대 핵심 스펙 시트 (2x2 그리드) */}
        <section className="spec-grid-section">
          <div className="spec-card">
            <div className="spec-icon">🏢</div>
            <div className="spec-info">
              <span className="spec-title">공급규모</span>
              <strong className="spec-desc">{apt.supplyScale}</strong>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon">🛡️</div>
            <div className="spec-info">
              <span className="spec-title">규제 구분</span>
              <strong className="spec-desc">{apt.bareumFact.regulations[0] || '일반공급'}</strong>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon">⏳</div>
            <div className="spec-info">
              <span className="spec-title">전매 및 거주의무</span>
              <strong className="spec-desc">
                {apt.bareumFact.regulations.find((r) => r.includes('전매')) || '전매 1년'} ·{' '}
                {apt.bareumFact.regulations.find((r) => r.includes('거주')) || '의무 없음'}
              </strong>
            </div>
          </div>
          <div className="spec-card">
            <div className="spec-icon">📅</div>
            <div className="spec-info">
              <span className="spec-title">청약 일정</span>
              <strong className="spec-desc">
                1순위 {apt.schedule.firstRank?.slice(5) || '-'} · 발표 {apt.schedule.announcement?.slice(5) || '-'}
              </strong>
            </div>
          </div>
        </section>

        {/* 중간 제휴 배너 슬롯 */}
        <AdPlaceholder slotType="header-banner" />

        {/* 3. 토스 스타일 인터랙티브 4분할 탭 (팩트 / 리스크 / 자금 / 일정) */}
        <section className="analysis-tab-section">
          <div className="analysis-tab-nav">
            <button
              type="button"
              className={`analysis-tab-btn ${activeTab === 'bareum' ? 'active tab-bareum' : ''}`}
              onClick={() => setActiveTab('bareum')}
            >
              ⚖️ 공공 팩트
            </button>
            <button
              type="button"
              className={`analysis-tab-btn ${activeTab === 'danho' ? 'active tab-danho' : ''}`}
              onClick={() => setActiveTab('danho')}
            >
              ⚠️ 리스크 점검
            </button>
            <button
              type="button"
              className={`analysis-tab-btn ${activeTab === 'finance' ? 'active tab-finance' : ''}`}
              onClick={() => setActiveTab('finance')}
            >
              💰 자금 스케줄
            </button>
            <button
              type="button"
              className={`analysis-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              📅 청약 일정
            </button>
          </div>

          {/* 탭 1: 바름 공공 팩트 */}
          {activeTab === 'bareum' && (
            <div className="tab-pane">
              <div className="official-source-banner">
                <div className="source-meta">
                  <span className="source-label">1차 공공 데이터 검증</span>
                  <strong className="source-name">{apt.bareumFact.sourceName}</strong>
                </div>
                <a
                  href={apt.bareumFact.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="official-btn"
                >
                  공식 공고문 원문 확인 ↗
                </a>
              </div>

              <div className="checklist-group">
                {apt.bareumFact.regulations.map((reg, idx) => (
                  <div key={idx} className="checklist-row">
                    <span className="check-mark">✔</span>
                    <span className="check-text">{reg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 탭 2: 단호 리스크 점검 */}
          {activeTab === 'danho' && (
            <div className="tab-pane">
              <div className="risk-cards-list">
                {apt.danhoRisk.profitSharingRate && (
                  <div className="risk-item-card">
                    <div className="risk-badge">🚨 시세차익 환수 조항</div>
                    <p className="risk-text">{apt.danhoRisk.profitSharingRate}</p>
                  </div>
                )}
                <div className="risk-item-card">
                  <div className="risk-badge">🚨 잔금 대출(DSR) 축소 위험</div>
                  <p className="risk-text">{apt.danhoRisk.dsrWarning}</p>
                </div>
                <div className="risk-item-card">
                  <div className="risk-badge">🚨 부적격 당첨 킬러 조항</div>
                  <p className="risk-text">{apt.danhoRisk.disqualificationTrap}</p>
                </div>
              </div>

              <div className="danho-conclusion-card">
                <span className="conclusion-title">💡 단호의 최종 계약 결론</span>
                <p className="conclusion-body">{apt.danhoRisk.criticSummary}</p>
              </div>
            </div>
          )}

          {/* 탭 3: 자금 스케줄 & 내 자금 적합도 3초 판정기 */}
          {activeTab === 'finance' && (
            <div className="tab-pane">
              {/* 단계별 자금 로드맵 카드 */}
              <div className="finance-roadmap-box">
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#191f28', marginBottom: '14px' }}>
                  💳 {apt.name} 단계별 필요 자금
                </h4>

                <div className="roadmap-grid">
                  <div className="roadmap-step">
                    <div className="step-tag">계약 시 (당첨 1개월 내)</div>
                    <div className="step-val">{formatMoney(downAmount)}</div>
                    <div className="step-desc">계약금 {downRate}% (순수 현금 필요)</div>
                  </div>
                  <div className="roadmap-step">
                    <div className="step-tag">공사 기간 (중도금)</div>
                    <div className="step-val">{formatMoney(middleAmount)}</div>
                    <div className="step-desc">중도금 {middleRate}% ({apt.financialPlan?.middleLoanInterest || '이자후불제'})</div>
                  </div>
                  <div className="roadmap-step">
                    <div className="step-tag">입주 시 (잔금)</div>
                    <div className="step-val">{formatMoney(balanceAmount)}</div>
                    <div className="step-desc">잔금 {balanceRate}% (주담대 전환)</div>
                  </div>
                </div>

                {/* 숨은 비용 경고 안내 */}
                <div className="hidden-cost-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#854d0e', fontWeight: 700 }}>
                      ⚠️ 단호가 짚어주는 필수 부대비용
                    </span>
                    <strong style={{ fontSize: '14px', color: '#854d0e' }}>
                      약 +{formatMoney(totalHiddenCost)}
                    </strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#a16207', lineHeight: 1.4 }}>
                    취득세 약 {formatMoney(taxAmount)} + 발코니 확장 및 필수 옵션비 약 {formatMoney(optionAmount)}이 추가로 소요됩니다.
                  </p>
                </div>
              </div>

              {/* 내 자금 적합도 3초 시뮬레이터 */}
              <div className="calc-mini-container">
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#191f28', marginBottom: '12px' }}>
                  🧮 내 보유 자금으로 청약 가능할까?
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#6b7684' }}>현재 보유 현금</label>
                    <input
                      type="number"
                      value={myCash}
                      onChange={(e) => setMyCash(Number(e.target.value))}
                      className="mini-input"
                      step="500"
                    />
                    <span style={{ fontSize: '11px', color: '#8b95a1' }}>= {formatMoney(myCash)}</span>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#6b7684' }}>부부 합산 연봉</label>
                    <input
                      type="number"
                      value={myIncome}
                      onChange={(e) => setMyIncome(Number(e.target.value))}
                      className="mini-input"
                      step="500"
                    />
                    <span style={{ fontSize: '11px', color: '#8b95a1' }}>= {formatMoney(myIncome)}</span>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#6b7684' }}>기존 대출 잔액 (원금)</label>
                    <input
                      type="number"
                      value={otherDebt}
                      onChange={(e) => setOtherDebt(Number(e.target.value))}
                      className="mini-input"
                      step="500"
                    />
                    <span style={{ fontSize: '11px', color: '#8b95a1' }}>= {formatMoney(otherDebt)}</span>
                  </div>
                </div>

                {/* 진단 판정 결과 */}
                <div className="mini-result-card">
                  {cashDeficit > 0 ? (
                    <div>
                      <span className="result-chip chip-danger">🚨 계약금+부대비용 부족 경고</span>
                      <p style={{ fontSize: '14px', color: '#991b1b', marginTop: '6px', fontWeight: 700 }}>
                        계약금 및 부대비용을 치르려면 약 <span style={{ textDecoration: 'underline' }}>{formatMoney(cashDeficit)}</span>의 현금이 더 필요합니다.
                      </p>
                    </div>
                  ) : actualMortgagePossible < balanceAmount ? (
                    <div>
                      <span className="result-chip chip-warning">⚠️ 입주 시점 잔금 DSR 주의</span>
                      <p style={{ fontSize: '14px', color: '#92400e', marginTop: '6px', fontWeight: 700 }}>
                        계약금은 충족하나, 입주 잔금 주담대 한도가 다소 빠듯합니다. 기존 부채 상환을 권장합니다.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="result-chip chip-success">✅ 청약 자금 안전권 판정</span>
                      <p style={{ fontSize: '14px', color: '#166534', marginTop: '6px', fontWeight: 700 }}>
                        계약금(현금)과 입주 시 주담대(DSR 40% 내) 모두 안정적인 범위 내에 있습니다!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 탭 4: 청약 상세 일정 */}
          {activeTab === 'schedule' && (
            <div className="tab-pane">
              <div className="timeline-table">
                <div className="timeline-row">
                  <span className="timeline-col-name">특별공급 접수</span>
                  <strong className="timeline-col-date">{apt.schedule.specialSupply || '-'}</strong>
                </div>
                <div className="timeline-row highlight">
                  <span className="timeline-col-name">1순위 접수</span>
                  <strong className="timeline-col-date">{apt.schedule.firstRank || '-'}</strong>
                </div>
                <div className="timeline-row">
                  <span className="timeline-col-name">2순위 접수</span>
                  <strong className="timeline-col-date">{apt.schedule.secondRank || '-'}</strong>
                </div>
                <div className="timeline-row prize">
                  <span className="timeline-col-name">당첨자 발표</span>
                  <strong className="timeline-col-date">{apt.schedule.announcement || '-'}</strong>
                </div>
                <div className="timeline-row">
                  <span className="timeline-col-name">계약 체결일</span>
                  <strong className="timeline-col-date">{apt.schedule.contract || '-'}</strong>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3-1. AEO 자연어 검색 타겟 Q&A (FAQ) */}
        <section className="aeo-faq-section" aria-label="자주 묻는 질문 FAQ">
          <h2 className="aeo-faq-heading">
            <span>💬</span> {apt.name} 청약 자주 묻는 질문 (AptFact Q&A)
          </h2>
          <div className="aeo-faq-list">
            <article className="aeo-faq-card">
              <h3 className="aeo-faq-q">
                <span className="aeo-q-badge">Q.</span>
                <span>{apt.name} 분양가와 예상 시세차익(안전마진)은 얼마인가요?</span>
              </h3>
              <p className="aeo-faq-a">
                최저 {formatMoney(apt.priceMin)}에서 최고 {formatMoney(apt.priceMax)}로 공급됩니다. 인근 준신축 시세({formatMoney(apt.estimatedMarketPrice)})와 비교 시 <strong>약 +{formatMoney(apt.safetyMargin)}({discountRate}% 저렴)</strong>의 시세차익이 기대됩니다.
              </p>
            </article>

            <article className="aeo-faq-card">
              <h3 className="aeo-faq-q">
                <span className="aeo-q-badge">Q.</span>
                <span>전매제한 및 실거주의무 규제는 어떻게 되나요?</span>
              </h3>
              <p className="aeo-faq-a">
                해당 단지는 <strong>{apt.bareumFact.regulations.join(', ')}</strong> 규정이 적용됩니다. 입주 시점에 전세를 놓아 잔금을 충당할 수 있는지 실거주의무 유예 여부를 공고문에서 반드시 확인해야 합니다.
              </p>
            </article>

            <article className="aeo-faq-card">
              <h3 className="aeo-faq-q">
                <span className="aeo-q-badge">Q.</span>
                <span>청약 시 꼭 주의해야 할 부적격 및 자금 리스크는?</span>
              </h3>
              <p className="aeo-faq-a">
                {apt.danhoRisk.criticSummary} (세부 대출 규제: {apt.danhoRisk.dsrWarning}) 계약 전 자금 계획을 면밀히 세우시기 바랍니다.
              </p>
            </article>
          </div>
        </section>

        {/* 4. 본문 중간 핵심 반응형 애드센스 광고 */}
        <AdPlaceholder slotType="infeed" />

        {/* 5. 하단 고단가 금융 제휴 배너 슬롯 */}
        <AdPlaceholder slotType="golden-result" />

        {/* 하단 다른 단지 둘러보기 버튼 */}
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <Link href="/" className="bottom-back-btn">
            ← 다른 분양 단지 비교하기
          </Link>
        </div>
      </main>
    </div>
  );
}
