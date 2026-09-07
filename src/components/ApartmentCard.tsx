'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apartment } from '@/types/apartment';

interface Props {
  apt: Apartment;
}

export default function ApartmentCard({ apt }: Props) {
  const [activeTab, setActiveTab] = useState<'bareum' | 'danho'>('bareum');

  const formatMoney = (val: number) => {
    const eok = Math.floor(val / 10000);
    const man = val % 10000;
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man.toLocaleString()}만`;
  };

  return (
    <div className="apt-card">
      <div className="card-header">
        <span className={`status-badge badge-${apt.status}`}>
          {apt.status === 'applying' ? '🔥 청약 접수중' : apt.status === 'upcoming' ? '⏳ 분양 예정' : '마감'}
        </span>
        <h3 className="apt-name">{apt.name}</h3>
        <p className="apt-region">📍 {apt.region} · {apt.exclusiveArea}</p>
      </div>

      <div className="card-body">
        <div className="price-row">
          <span style={{ fontSize: '13px', color: '#64748b' }}>분양가</span>
          <span className="price-val">
            {formatMoney(apt.priceMin)} ~ {formatMoney(apt.priceMax)}
          </span>
        </div>

        <div className="margin-highlight">
          <div className="label">인근 시세 대비 예상 안전마진</div>
          <div className="val">+{formatMoney(apt.safetyMargin)}원 예상</div>
        </div>

        {/* 바름 vs 단호 듀얼 탭 */}
        <div className="dual-tabs">
          <button
            className={`tab-pill ${activeTab === 'bareum' ? 'active-bareum' : ''}`}
            onClick={() => setActiveTab('bareum')}
          >
            ⚖️ 바름 공공 팩트
          </button>
          <button
            className={`tab-pill ${activeTab === 'danho' ? 'active-danho' : ''}`}
            onClick={() => setActiveTab('danho')}
          >
            ⚔️ 단호 레드 플래그
          </button>
        </div>

        {activeTab === 'bareum' ? (
          <div className="detail-box box-bareum">
            <p><strong>공식 출처:</strong> {apt.bareumFact.sourceName}</p>
            <p style={{ marginTop: '4px' }}><strong>규제:</strong> {apt.bareumFact.regulations.slice(0, 3).join(', ')}</p>
            <p style={{ marginTop: '4px', fontSize: '11px', opacity: 0.85 }}>공식 검증 완료일: {apt.bareumFact.verifiedDate}</p>
          </div>
        ) : (
          <div className="detail-box box-danho">
            <p><strong>리스크:</strong> {apt.danhoRisk.criticSummary}</p>
            {apt.danhoRisk.profitSharingRate && (
              <p style={{ marginTop: '4px', fontSize: '12px' }}>⚠️ {apt.danhoRisk.profitSharingRate}</p>
            )}
          </div>
        )}
      </div>

      <div className="card-footer">
        <span style={{ fontSize: '12px', color: '#64748b' }}>
          발표: {apt.schedule.announcement || '추후공지'}
        </span>
        <Link href={`/apt/${apt.id}`} className="btn-detail">
          상세 팩트 리포트 ➔
        </Link>
      </div>
    </div>
  );
}
