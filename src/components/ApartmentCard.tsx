'use client';

import React from 'react';
import Link from 'next/link';
import { Apartment } from '@/types/apartment';

interface Props {
  apt: Apartment;
}

export default function ApartmentCard({ apt }: Props) {
  const formatMoney = (val: number) => {
    const eok = Math.floor(val / 10000);
    const man = val % 10000;
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man.toLocaleString()}만`;
  };

  // 분양가 대비 시세 비율 계산 (안전마진 게이지)
  const pricePercent = Math.min(
    Math.round((apt.priceMin / apt.estimatedMarketPrice) * 100),
    85
  );
  const discountRate = Math.round(
    ((apt.estimatedMarketPrice - apt.priceMin) / apt.estimatedMarketPrice) * 100
  );

  return (
    <a href={`/apt/${apt.id}`} className="feed-card-link">
      <div className="feed-card">
        {/* 1. 상단 상태 배지 & 카테고리 */}
        <div className="card-top-row">
          <div className="card-badges">
            <span className={`status-pill ${apt.status === 'applying' ? 'status-live' : 'status-soon'}`}>
              {apt.status === 'applying' ? '● 청약 접수중' : '접수 예정'}
            </span>
            <span className="category-pill">{apt.category}</span>
          </div>
          <span className="schedule-pill">
            발표일 {apt.schedule.announcement?.slice(5) || '추후공지'}
          </span>
        </div>

        {/* 2. 단지명 & 지역/스펙 */}
        <div className="card-header-block">
          <h3 className="card-complex-name">{apt.name}</h3>
          <p className="card-location-text">
            {apt.region} · {apt.exclusiveArea} · {apt.supplyScale.split('중')[0]}
          </p>
        </div>

        {/* 3. 호갱노노/아실 스타일 시세 비교 비주얼 박스 (절대 안 잘리는 2단 레이아웃) */}
        <div className="price-gauge-container">
          <div className="price-label-row">
            <div className="price-col-left">
              <span className="gauge-label">분양가</span>
              <span className="gauge-main-price">{formatMoney(apt.priceMin)}~</span>
            </div>
            <div className="margin-pill-badge">
              <span className="margin-icon">▲</span>
              <span>마진 +{formatMoney(apt.safetyMargin)}</span>
              <span className="margin-pct">({discountRate}% 저렴)</span>
            </div>
          </div>

          {/* 시각적 비교 바 */}
          <div className="gauge-track">
            <div
              className="gauge-bar-fill"
              style={{ width: `${pricePercent}%` }}
              title={`분양가 ${pricePercent}%`}
            />
            <div
              className="gauge-bar-margin"
              style={{ width: `${100 - pricePercent}%` }}
              title={`안전마진 ${100 - pricePercent}%`}
            />
          </div>
          <div className="gauge-track-legend">
            <span>분양가 {formatMoney(apt.priceMin)}</span>
            <span>인근 준신축 시세 약 {formatMoney(apt.estimatedMarketPrice)}</span>
          </div>
        </div>

        {/* 4. 핵심 태그 칩 (복잡한 줄글 전면 배제) */}
        <div className="card-tag-chips">
          {apt.tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className="tag-chip">
              #{tag}
            </span>
          ))}
        </div>

        {/* 5. 심플 액션 푸터 */}
        <div className="card-footer-action">
          <span>팩트·리스크 분석 리포트 보기</span>
          <span className="arrow-icon">→</span>
        </div>
      </div>
    </a>
  );
}
