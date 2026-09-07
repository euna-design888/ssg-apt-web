import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import AdPlaceholder from '@/components/AdPlaceholder';
import Footer from '@/components/Footer';
import rawApartments from '@/data/apartments.json';
import { Apartment } from '@/types/apartment';

const apartments = rawApartments as Apartment[];

export async function generateStaticParams() {
  return apartments.map((apt) => ({
    id: apt.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apt = apartments.find((a) => a.id === id);
  if (!apt) return { title: '단지를 찾을 수 없습니다' };

  return {
    title: `${apt.name} 분양가·안전마진 & 청약 팩트체크 리포트 - 쓱보는 청약`,
    description: `${apt.name}의 확정 분양가, 인근 시세 대비 안전마진, 바름 공공 팩트 및 단호 레드 플래그 리스크 총정리`,
  };
}

export default async function ApartmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apt = apartments.find((a) => a.id === id);

  if (!apt) {
    notFound();
  }

  const formatMoney = (val: number) => {
    const eok = Math.floor(val / 10000);
    const man = val % 10000;
    if (man === 0) return `${eok}억`;
    return `${eok}억 ${man.toLocaleString()}만`;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ flex: 1, padding: '30px 20px' }}>
        {/* 상단 네비게이션 */}
        <div style={{ marginBottom: '18px', fontSize: '16px', fontWeight: 700, color: '#475569' }}>
          <Link href="/">← 전체 목록으로 돌아가기</Link> &gt; <span>{apt.region}</span>
        </div>

        {/* 단지 헤더 타이틀 박스 */}
        <div style={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '22px', padding: '32px 26px', marginBottom: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span className={`status-badge badge-${apt.status}`} style={{ fontSize: '15px', padding: '6px 14px' }}>
              {apt.status === 'applying' ? '🔴 청약 접수중' : apt.status === 'upcoming' ? '🔵 분양 예정' : '마감'}
            </span>
            <span style={{ background: '#f1f5f9', color: '#0f172a', fontSize: '15px', fontWeight: 800, padding: '6px 14px', borderRadius: '8px' }}>
              {apt.category}
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#020617', lineHeight: 1.3, marginBottom: '10px' }}>
            {apt.name}
          </h1>
          <p style={{ color: '#475569', fontSize: '18px', fontWeight: 600 }}>
            📍 {apt.locationDetail} · {apt.supplyScale} · {apt.exclusiveArea}
          </p>

          {/* 3대 핵심 요약 바 (대형 글자) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '26px', background: '#f8fafc', border: '1.5px solid #e2e8f0', padding: '22px', borderRadius: '16px' }}>
            <div>
              <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '4px' }}>확정 분양가</span>
              <strong style={{ fontSize: '24px', color: '#0f2b5c', fontWeight: 900 }}>
                {formatMoney(apt.priceMin)} ~ {formatMoney(apt.priceMax)}원
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '15px', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '4px' }}>인근 준신축 실거래가</span>
              <strong style={{ fontSize: '24px', color: '#334155', fontWeight: 900 }}>
                약 {formatMoney(apt.estimatedMarketPrice)}원
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '15px', color: '#065f46', fontWeight: 800, display: 'block', marginBottom: '4px' }}>예상 안전마진 (시세차익)</span>
              <strong style={{ fontSize: '26px', color: '#047857', fontWeight: 900 }}>
                +{formatMoney(apt.safetyMargin)}원
              </strong>
            </div>
          </div>
        </div>

        {/* 광고 슬롯 */}
        <AdPlaceholder slotType="header-banner" />

        {/* 청약 주요 일정 타임라인 */}
        <div style={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '20px', padding: '28px 24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#020617', marginBottom: '18px' }}>
            📅 청약 주요 일정 (한눈에 보기)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px 12px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 700 }}>특별공급</span>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f2b5c', marginTop: '6px' }}>{apt.schedule.specialSupply || '해당없음'}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px 12px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 700 }}>1순위 접수</span>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f2b5c', marginTop: '6px' }}>{apt.schedule.firstRank || '추후공지'}</div>
            </div>
            <div style={{ background: '#fff1f2', border: '1.5px solid #fca5a5', padding: '16px 12px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#b91c1c', fontWeight: 800 }}>당첨자 발표일</span>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#b91c1c', marginTop: '6px' }}>{apt.schedule.announcement || '추후공지'}</div>
            </div>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px 12px', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 700 }}>계약 체결</span>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#334155', marginTop: '6px' }}>{apt.schedule.contract || '추후공지'}</div>
            </div>
          </div>
        </div>

        {/* 1. 바름 팩트체크 카드 */}
        <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderLeft: '8px solid #047857', borderRadius: '20px', padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ background: '#047857', color: '#ffffff', fontSize: '13px', fontWeight: 900, padding: '4px 10px', borderRadius: '6px' }}>
              공공 팩트체크 인증
            </span>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#065f46', fontWeight: 900 }}>
              바름(Bareum)의 1차 공공 데이터 검증 리포트
            </h3>
          </div>
          <ul style={{ paddingLeft: '22px', color: '#14532d', lineHeight: '1.9', fontSize: '17px', fontWeight: 600 }}>
            <li><strong>공식 원천:</strong> {apt.bareumFact.sourceName}</li>
            <li><strong>주요 규제:</strong> {apt.bareumFact.regulations.join(', ')}</li>
            <li><strong>공식 공고문:</strong> <a href={apt.bareumFact.officialUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#047857', fontWeight: 900 }}>주무관청 공고 원문 바로가기 ➔</a></li>
            <li><strong>검증 일자:</strong> {apt.bareumFact.verifiedDate}</li>
          </ul>
        </div>

        {/* 2. 단호 리스크 점검 */}
        <div style={{ background: '#fff1f2', border: '2px solid #fca5a5', borderLeft: '8px solid #be123c', borderRadius: '20px', padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ background: '#be123c', color: '#ffffff', fontSize: '13px', fontWeight: 900, padding: '4px 10px', borderRadius: '6px' }}>
              단호의 냉철한 리스크 점검
            </span>
            <h3 style={{ margin: 0, fontSize: '20px', color: '#881337', fontWeight: 900 }}>
              계약금 날리기 전 필독할 3대 킬러 리스크
            </h3>
          </div>
          <ul style={{ paddingLeft: '22px', color: '#881337', lineHeight: '1.9', fontSize: '17px', fontWeight: 600 }}>
            {apt.danhoRisk.profitSharingRate && (
              <li><strong>안전마진의 맹점:</strong> {apt.danhoRisk.profitSharingRate}</li>
            )}
            <li><strong>대출 규제 함정:</strong> {apt.danhoRisk.dsrWarning}</li>
            <li><strong>부적격 탈락 킬러 조항:</strong> {apt.danhoRisk.disqualificationTrap}</li>
          </ul>
          <div style={{ marginTop: '16px', background: '#ffe4e6', padding: '14px 18px', borderRadius: '12px', fontSize: '16px', fontWeight: 800, color: '#881337' }}>
            💬 단호의 한줄평: {apt.danhoRisk.criticSummary}
          </div>
        </div>

        {/* 광고 슬롯 */}
        <AdPlaceholder slotType="golden-result" />

        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Link href="/" className="btn-detail" style={{ fontSize: '18px', padding: '14px 30px' }}>
            ← 다른 분양 단지 보러가기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
