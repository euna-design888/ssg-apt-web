'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import AdPlaceholder from '@/components/AdPlaceholder';
import ApartmentCard from '@/components/ApartmentCard';
import CalculatorSection from '@/components/CalculatorSection';
import Footer from '@/components/Footer';
import rawApartments from '@/data/apartments.json';
import { Apartment } from '@/types/apartment';

const apartments = rawApartments as Apartment[];

export default function HomePage() {
  const [filter, setFilter] = useState<string>('all');

  const filteredList = apartments.filter((apt) => {
    if (filter === 'all') return true;
    if (filter === 'lotto') return apt.safetyMargin >= 30000;
    if (filter === 'caps') return apt.tags.includes('분양가상한제');
    if (filter === 'applying') return apt.status === 'applying';
    if (filter === 'seoul') return apt.region.includes('서울');
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-tag">
            <span>⚖️ 바름 팩트체크</span>
            <span>×</span>
            <span>⚔️ 단호 레드팀 감사</span>
          </div>
          <h1 className="hero-title">
            장밋빛 거품을 걷어낸<br />
            실질 안전마진 & 팩트 청약 캘린더
          </h1>
          <p className="hero-desc">
            건설사 홍보 문구 뒤에 숨겨진 시세차익 환수율, 스트레스 DSR 대출 삭감 맹점, 
            부적격 탈락 킬러 조항까지 1차 공공 데이터로 철저히 검증해 드립니다.
          </p>
        </div>
      </section>

      {/* 상단 리더보드 고단가 금융 광고 슬롯 */}
      <AdPlaceholder slotType="header-banner" />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1 }}>
        {/* Quick Filter Bar */}
        <div id="calendar" style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
              📅 2026년 9월 수도권 주요 분양·청약 단지
            </h2>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 700 }}>
              총 {filteredList.length}개 단지 검증 완료
            </span>
          </div>

          <div className="filter-wrap">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              전체 보기
            </button>
            <button
              className={`filter-btn ${filter === 'lotto' ? 'active' : ''}`}
              onClick={() => setFilter('lotto')}
            >
              🔥 안전마진 3억 이상 (로또 청약)
            </button>
            <button
              className={`filter-btn ${filter === 'applying' ? 'active' : ''}`}
              onClick={() => setFilter('applying')}
            >
              ⚡ 현재 접수중
            </button>
            <button
              className={`filter-btn ${filter === 'caps' ? 'active' : ''}`}
              onClick={() => setFilter('caps')}
            >
              💰 분양가 상한제 단지
            </button>
            <button
              className={`filter-btn ${filter === 'seoul' ? 'active' : ''}`}
              onClick={() => setFilter('seoul')}
            >
              🏙️ 서울권 단지
            </button>
          </div>
        </div>

        {/* Apartments Cards Grid */}
        <div className="cards-grid">
          {filteredList.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))}
        </div>

        {/* 인터랙티브 계산기 섹션 */}
        <CalculatorSection />

        {/* 브랜드 스토리 안내 박스 */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          padding: '24px',
          margin: '30px 0 50px 0',
          fontSize: '14px',
          lineHeight: '1.7',
          color: '#334155'
        }}>
          <h4 style={{ fontSize: '17px', color: '#1e3a8a', marginBottom: '10px', fontWeight: 800 }}>
            🛡️ 쓱보는 청약만의 독보적 2중 검증 시스템
          </h4>
          <p style={{ marginBottom: '8px' }}>
            • <strong>수석 팩트 감사관 [바름(Bareum)]:</strong> 국토교통부 실거래가 시스템 및 LH/한국부동산원 청약홈 1차 모집공고문 PDF를 전수 대조하여 오차 없는 분양가와 법적 기준을 확정합니다.
          </p>
          <p>
            • <strong>수석 비판 감사관 [단호(Danho)]:</strong> 악마의 변호인 입장에서 시세차익 환수율, 대출 규제에 따른 잔금 미납 파산 위험, 가점 오류 부적격 킬러 조항을 송곳처럼 파헤쳐 독자의 계약금을 지킵니다.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
