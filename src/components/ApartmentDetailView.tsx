'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apartment } from '@/types/apartment';
import AdPlaceholder from '@/components/AdPlaceholder';

interface Props {
  apt: Apartment;
}

export default function ApartmentDetailView({ apt }: Props) {
  const [activeTab, setActiveTab] = useState<'bareum' | 'danho' | 'schedule'>('bareum');

  const formatMoney = (val: number) => {
    const eok = Math.floor(val / 10000);
    const man = val % 10000;
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man.toLocaleString()}만`;
  };

  const pricePercent = Math.min(
    Math.round((apt.priceMin / apt.estimatedMarketPrice) * 100),
    90
  );
  const discountRate = Math.round(
    ((apt.estimatedMarketPrice - apt.priceMin) / apt.estimatedMarketPrice) * 100
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
      <main className="container" style={{ flex: 1, padding: '24px 18px' }}>
        {/* 네비게이션 뒤로가기 */}
        <div style={{ marginBottom: '16px' }}>
          <Link href="/" className="back-link">
            ← 전체 분양 단지 목록
          </Link>
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

        {/* 2. 호갱노노 스타일 4대 핵심 스펙 시트 (깔끔한 2x2 그리드) */}
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

        {/* 중간 광고 슬롯 */}
        <AdPlaceholder slotType="header-banner" />

        {/* 3. 토스 스타일 인터랙티브 분석 탭 (답답한 줄글 완전 해소) */}
        <section className="analysis-tab-section">
          <div className="analysis-tab-nav">
            <button
              type="button"
              className={`analysis-tab-btn ${activeTab === 'bareum' ? 'active tab-bareum' : ''}`}
              onClick={() => setActiveTab('bareum')}
            >
              ⚖️ 바름의 공공 팩트
            </button>
            <button
              type="button"
              className={`analysis-tab-btn ${activeTab === 'danho' ? 'active tab-danho' : ''}`}
              onClick={() => setActiveTab('danho')}
            >
              ⚠️ 단호의 리스크 점검
            </button>
            <button
              type="button"
              className={`analysis-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              📅 청약 상세 일정
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
                  공식 모집공고문 열기 ↗
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
                    <div className="risk-badge">🚨 시세차익 환수</div>
                    <p className="risk-text">{apt.danhoRisk.profitSharingRate}</p>
                  </div>
                )}
                <div className="risk-item-card">
                  <div className="risk-badge">🚨 대출 한도 (DSR)</div>
                  <p className="risk-text">{apt.danhoRisk.dsrWarning}</p>
                </div>
                <div className="risk-item-card">
                  <div className="risk-badge">🚨 부적격 탈락 맹점</div>
                  <p className="risk-text">{apt.danhoRisk.disqualificationTrap}</p>
                </div>
              </div>

              {/* 단호의 냉철한 1줄 총평 박스 */}
              <div className="danho-conclusion-card">
                <span className="conclusion-title">💡 단호의 최종 계약 결론</span>
                <p className="conclusion-body">{apt.danhoRisk.criticSummary}</p>
              </div>
            </div>
          )}

          {/* 탭 3: 청약 상세 일정 */}
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

        {/* 하단 고단가 제휴 광고 슬롯 */}
        <AdPlaceholder slotType="golden-result" />

        {/* 하단 둘러보기 버튼 */}
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <Link href="/" className="bottom-back-btn">
            ← 다른 분양 단지 비교하기
          </Link>
        </div>
      </main>
    </div>
  );
}
