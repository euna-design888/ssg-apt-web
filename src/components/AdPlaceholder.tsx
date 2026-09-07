import React from 'react';

interface AdProps {
  slotType: 'header-banner' | 'infeed' | 'sticky-sidebar' | 'golden-result';
}

export default function AdPlaceholder({ slotType }: AdProps) {
  if (slotType === 'header-banner') {
    return (
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '14px',
          padding: '16px 20px',
          margin: '18px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <span style={{ background: '#1d4ed8', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', marginRight: '8px' }}>
              공식 제휴
            </span>
            <strong style={{ color: '#1e3a8a', fontSize: '15px' }}>
              2026 1금융권 최저금리 주택담보대출 & 디딤돌 금리 전수비교
            </strong>
          </div>
          <a
            href="https://fine.fss.or.kr"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#1e40af',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              padding: '9px 18px',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            금감원 파인 실시간 조회 ➔
          </a>
        </div>
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
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
          Sponsored Financial Hub
        </span>
        <h4 style={{ margin: '6px 0 10px 0', fontSize: '16px', color: '#78350f' }}>
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
      border: '1px dashed #cbd5e1',
      borderRadius: '10px',
      padding: '14px',
      textAlign: 'center',
      color: '#64748b',
      fontSize: '12px',
      margin: '18px 0'
    }}>
      광고 슬롯 ({slotType}) — Google AdSense Auto-Responsive Slot
    </div>
  );
}
