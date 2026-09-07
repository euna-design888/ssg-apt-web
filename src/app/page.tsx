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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f2f4f6' }}>
      <Header />

      <main className="container" style={{ flex: 1 }}>
        {/* 1. 산뜻하고 밝은 미니멀 히어로 */}
        <section className="hero-clean">
          <h1>
            수도권 분양 청약,<br />
            실제 안전마진만 모아봤어요
          </h1>
          <p>
            공공 팩트(바름)와 치명적 리스크(단호)를 한눈에 1초 스캔하세요.
          </p>
        </section>

        {/* 2. 상단 고단가 제휴 광고 슬롯 */}
        <AdPlaceholder slotType="header-banner" />

        {/* 3. 모던 가로 칩 필터 */}
        <div className="chip-group">
          <button
            type="button"
            className={`chip-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            전체 단지 ({apartments.length})
          </button>
          <button
            type="button"
            className={`chip-btn ${filter === 'applying' ? 'active' : ''}`}
            onClick={() => setFilter('applying')}
          >
            🔥 현재 접수중
          </button>
          <button
            type="button"
            className={`chip-btn ${filter === 'lotto' ? 'active' : ''}`}
            onClick={() => setFilter('lotto')}
          >
            💰 차익 +3억 이상 (로또)
          </button>
          <button
            type="button"
            className={`chip-btn ${filter === 'caps' ? 'active' : ''}`}
            onClick={() => setFilter('caps')}
          >
            🏷️ 분양가 상한제
          </button>
          <button
            type="button"
            className={`chip-btn ${filter === 'seoul' ? 'active' : ''}`}
            onClick={() => setFilter('seoul')}
          >
            🏙️ 서울 분양
          </button>
        </div>

        {/* 4. 피드 형태의 클린 카드 리스트 (답답함 제로) */}
        <div className="feed-list">
          {filteredList.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))}
        </div>

        {/* 5. 올인원 계산기 위젯 */}
        <CalculatorSection />
      </main>

      <Footer />
    </div>
  );
}
