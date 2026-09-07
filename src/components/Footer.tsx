import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '40px 0', borderTop: '1px solid #1e293b', fontSize: '13px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
          <div>
            <strong style={{ color: '#ffffff', fontSize: '16px', display: 'block', marginBottom: '8px' }}>
              🏢 쓱보는 청약 (AptFact)
            </strong>
            <p>공공 팩트체크(바름)와 악마의 변호인 리스크(단호)로 검증하는 차세대 청약 정보 포털</p>
          </div>
          <div style={{ maxWidth: '400px' }}>
            <strong style={{ color: '#ffffff', display: 'block', marginBottom: '6px' }}>법적 고지 및 데이터 원천</strong>
            <p style={{ lineHeight: '1.6' }}>
              본 서비스의 청약 일정 및 분양가는 한국부동산원 청약홈, 한국토지주택공사(LH)의 공식 입주자모집공고문을 1차 원천으로 합니다. 
              시세 안전마진은 국토교통부 실거래가 공개시스템 기준 실측치이며, 최종 청약 신청 전 반드시 주무관청 공고문을 재확인하시기 바랍니다.
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '18px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
          © 2026 쓱보는 청약 (AptFact). All Rights Reserved. Hosted with zero-cost on Vercel Edge.
        </div>
      </div>
    </footer>
  );
}
