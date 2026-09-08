'use client';

import React, { useEffect } from 'react';

interface AdProps {
  slotType: 'header-banner' | 'infeed' | 'sticky-sidebar' | 'golden-result';
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdPlaceholder({ slotType }: AdProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignore push errors during hydration
    }
  }, []);

  if (slotType === 'header-banner') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1px solid #bfdbfe',
        borderRadius: '14px',
        padding: '14px 16px',
        margin: '16px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <div style={{ flex: '1 1 200px' }}>
          <span style={{ background: '#1d4ed8', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', marginRight: '6px' }}>
            공식 제휴
          </span>
          <strong style={{ color: '#1e3a8a', fontSize: '14px', wordBreak: 'keep-all' }}>
            2026 1금융권 최저금리 주택담보대출 & 디딤돌 금리 비교
          </strong>
        </div>
        <a
          href="https://fine.fss.or.kr"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#1e40af',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 800,
            padding: '8px 14px',
            borderRadius: '8px',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          금감원 파인 실시간 조회 ➔
        </a>
      </div>
    );
  }

  if (slotType === 'golden-result') {
    return (
      <div style={{
        background: '#fffbeb',
        border: '1.5px dashed #fcd34d',
        borderRadius: '12px',
        padding: '16px',
        margin: '20px 0',
        textAlign: 'center',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
          Sponsored Financial Hub
        </span>
        <h4 style={{ margin: '6px 0 10px 0', fontSize: '15px', color: '#78350f', wordBreak: 'keep-all' }}>
          내 DSR 한도에 맞는 최저금리 대환·주담대 상품 3초 비교
        </h4>
        <a
          href="https://fine.fss.or.kr"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#b45309',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 800,
            padding: '8px 18px',
            borderRadius: '6px'
          }}
        >
          무료 한도 진단 바로가기 ➔
        </a>
      </div>
    );
  }

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '12px',
      textAlign: 'center',
      margin: '20px 0',
      boxSizing: 'border-box',
      width: '100%',
      minHeight: '120px',
      overflow: 'hidden'
    }}>
      <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px', textAlign: 'right' }}>
        ADVERTISEMENT
      </div>
      {/* Google AdSense Responsive Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client="ca-pub-6925161017862158"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
