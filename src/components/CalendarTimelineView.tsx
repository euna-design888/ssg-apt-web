'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apartment } from '@/types/apartment';

interface Props {
  apartments: Apartment[];
}

export default function CalendarTimelineView({ apartments }: Props) {
  const [selectedMonth, setSelectedMonth] = useState<'all' | '09' | '10'>('all');

  const formatMoney = (val: number) => {
    const eok = Math.floor(val / 10000);
    const man = val % 10000;
    if (eok > 0 && man === 0) return `${eok}억`;
    if (eok > 0) return `${eok}억 ${man.toLocaleString()}만`;
    return `${man.toLocaleString()}만`;
  };

  // 1순위 접수일 기준 정렬
  const sortedList = [...apartments].sort((a, b) => {
    const dateA = a.schedule.firstRank || '9999-99-99';
    const dateB = b.schedule.firstRank || '9999-99-99';
    return dateA.localeCompare(dateB);
  });

  const filteredList = sortedList.filter((apt) => {
    if (selectedMonth === 'all') return true;
    return apt.schedule.firstRank?.includes(`-0${selectedMonth.replace('0', '')}-`);
  });

  return (
    <div className="timeline-container">
      {/* 월별 필터 칩 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
        <button
          type="button"
          className={`chip-btn ${selectedMonth === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedMonth('all')}
        >
          전체 일정 ({apartments.length})
        </button>
        <button
          type="button"
          className={`chip-btn ${selectedMonth === '09' ? 'active' : ''}`}
          onClick={() => setSelectedMonth('09')}
        >
          📅 2026년 9월 접수
        </button>
        <button
          type="button"
          className={`chip-btn ${selectedMonth === '10' ? 'active' : ''}`}
          onClick={() => setSelectedMonth('10')}
        >
          🍁 2026년 10월 접수
        </button>
      </div>

      {/* 타임라인 피드 */}
      <div className="timeline-feed">
        {filteredList.map((apt) => {
          const isLive = apt.status === 'applying';
          return (
            <div key={apt.id} className="timeline-card">
              <div className="timeline-card-left">
                <div className="timeline-date-badge">
                  <span className="month-text">
                    {apt.schedule.firstRank ? `${parseInt(apt.schedule.firstRank.split('-')[1])}월` : '-'}
                  </span>
                  <span className="day-text">
                    {apt.schedule.firstRank ? apt.schedule.firstRank.split('-')[2] : '-'}
                  </span>
                </div>
                <div className={`status-badge-mini ${isLive ? 'badge-live' : 'badge-soon'}`}>
                  {isLive ? '접수중' : '예정'}
                </div>
              </div>

              <div className="timeline-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6b7684', fontWeight: 600 }}>
                      {apt.region} · {apt.category}
                    </span>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#191f28', margin: '2px 0 6px 0' }}>
                      {apt.name}
                    </h4>
                  </div>
                  <span className="timeline-margin-tag">
                    마진 +{formatMoney(apt.safetyMargin)}
                  </span>
                </div>

                {/* 3대 일정 일자 */}
                <div className="timeline-dates-row">
                  <div className="date-item">
                    <span className="date-lbl">특별공급</span>
                    <strong className="date-val">{apt.schedule.specialSupply?.slice(5) || '-'}</strong>
                  </div>
                  <div className="date-item active-date">
                    <span className="date-lbl">1순위 접수</span>
                    <strong className="date-val">{apt.schedule.firstRank?.slice(5) || '-'}</strong>
                  </div>
                  <div className="date-item">
                    <span className="date-lbl">당첨자 발표</span>
                    <strong className="date-val">{apt.schedule.announcement?.slice(5) || '-'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#4e5968', fontWeight: 600 }}>
                    분양가 {formatMoney(apt.priceMin)}~
                  </span>
                  <a href={`/apt/${apt.id}`} className="timeline-link-btn">
                    리포트 & 자금계산 ➔
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
