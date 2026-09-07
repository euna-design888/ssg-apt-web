import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import AdPlaceholder from '@/components/AdPlaceholder';
import Footer from '@/components/Footer';
import rawApartments from '@/data/apartments.json';
import { Apartment } from '@/types/apartment';

const apartments = rawApartments as Apartment[];

// Vercel 배포 시 영구 비용 0원을 위한 정적 페이지 사전 생성 (SSG)
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
    description: `${apt.name}의 확정 분양가, 인근 시세 대비 안전마진 +${Math.floor(apt.safetyMargin / 10000)}억, 바름 공공 팩트 및 단호 레드 플래그 리스크 총정리`,
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
        {/* 상단 빵부스러기 네비게이션 */}
        <div style={{ marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
          <Link href="/">홈</Link> &gt; <span>{apt.region}</span> &gt; <strong style={{ color: '#0f172a' }}>{apt.name}</strong>
        </div>

        {/* 단지 헤더 타이틀 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className={`status-badge badge-${apt.status}`}>
              {apt.status === 'applying' ? '🔥 청약 접수중' : apt.status === 'upcoming' ? '⏳ 분양 예정' : '마감'}
            </span>
            <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
              {apt.category}
            </span>
            {apt.tags.map((t) => (
              <span key={t} style={{ background: '#ecfdf5', color: '#047857', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
                #{t}
              </span>
            ))}
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
            {apt.name}
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            📍 {apt.locationDetail} · {apt.supplyScale} · {apt.exclusiveArea}
          </p>

          {/* 핵심 요약 바 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '24px', background: '#f8fafc', padding: '18px', borderRadius: '14px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>확정 분양가</span>
              <strong style={{ fontSize: '20px', color: '#1e3a8a', fontWeight: 900 }}>
                {formatMoney(apt.priceMin)} ~ {formatMoney(apt.priceMax)}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>인근 준신축 실거래가</span>
              <strong style={{ fontSize: '20px', color: '#475569', fontWeight: 800 }}>
                약 {formatMoney(apt.estimatedMarketPrice)}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#047857', display: 'block' }}>예상 안전마진 (시세차익)</span>
              <strong style={{ fontSize: '22px', color: '#059669', fontWeight: 900 }}>
                +{formatMoney(apt.safetyMargin)}원
              </strong>
            </div>
          </div>
        </div>

        {/* 상단 리더보드 광고 */}
        <AdPlaceholder slotType="header-banner" />

        {/* 청약 일정 타임라인 표 */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
            📅 청약 주요 일정 (타임라인)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>특별공급</span>
              <div style={{ fontWeight: 800, color: '#1e3a8a', marginTop: '4px' }}>{apt.schedule.specialSupply || '해당없음'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>1순위 접수</span>
              <div style={{ fontWeight: 800, color: '#1e3a8a', marginTop: '4px' }}>{apt.schedule.firstRank || '추후공지'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>당첨자 발표</span>
              <div style={{ fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>{apt.schedule.announcement || '추후공지'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>계약 체결</span>
              <div style={{ fontWeight: 800, color: '#475569', marginTop: '4px' }}>{apt.schedule.contract || '추후공지'}</div>
            </div>
          </div>
        </div>

        {/* 1. 바름(Bareum) 공공 팩트체크 카드 */}
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderLeft: '6px solid #059669', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ background: '#059669', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
              공공 팩트체크 인증
            </span>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#065f46', fontWeight: 900 }}>
              바름(Bareum)의 1차 공공 데이터 검증 리포트
            </h3>
          </div>
          <ul style={{ paddingLeft: '20px', color: '#166534', lineHeight: '1.8', fontSize: '14px' }}>
            <li><strong>공식 원천:</strong> {apt.bareumFact.sourceName}</li>
            <li><strong>규제 사항:</strong> {apt.bareumFact.regulations.join(', ')}</li>
            <li><strong>공식 공고 확인:</strong> <a href={apt.bareumFact.officialUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontWeight: 700 }}>주무관청 공고문 바로가기 ➔</a></li>
            <li><strong>최종 팩트 검증일:</strong> {apt.bareumFact.verifiedDate}</li>
          </ul>
        </div>

        {/* 2. 단호(Danho) 악마의 변호인 리스크 경고 박스 */}
        <div style={{ background: '#fff1f2', border: '1.5px solid #fca5a5', borderLeft: '6px solid #e11d48', borderRadius: '16px', padding: '24px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ background: '#e11d48', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
              단호의 냉철한 리스크 점검
            </span>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#9f1239', fontWeight: 900 }}>
              계약금 날리기 전 필독할 3대 킬러 리스크
            </h3>
          </div>
          <ul style={{ paddingLeft: '20px', color: '#881337', lineHeight: '1.8', fontSize: '14px' }}>
            {apt.danhoRisk.profitSharingRate && (
              <li><strong>안전마진의 맹점:</strong> {apt.danhoRisk.profitSharingRate}</li>
            )}
            <li><strong>대출 규제 함정:</strong> {apt.danhoRisk.dsrWarning}</li>
            <li><strong>부적격 탈락 킬러 조항:</strong> {apt.danhoRisk.disqualificationTrap}</li>
          </ul>
          <div style={{ marginTop: '12px', background: '#ffe4e6', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, color: '#9f1239' }}>
            💬 단호의 한줄평: {apt.danhoRisk.criticSummary}
          </div>
        </div>

        {/* 골든 결과 슬롯 광고 */}
        <AdPlaceholder slotType="golden-result" />

        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <Link href="/" style={{ display: 'inline-block', background: '#0f172a', color: '#ffffff', padding: '12px 26px', borderRadius: '10px', fontWeight: 800, fontSize: '14px' }}>
            ← 전체 분양 단지 목록으로 돌아가기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
