import React from 'react';
import { BASIS, SOURCE, ymd } from '@/lib/cheongyak';

// 쓱보는 청약 푸터 (Hallmark Ft1 Mast-headed, 10/12). 출처·기준일·고지가 한 덩어리.
export default function Footer() {
  return (
    <footer className="sb-foot">
      <div className="sb-wrap">
        <p className="sb-foot__mast">쓱보는 청약</p>
        <p className="sb-foot__tag">청약홈 공공데이터로 매일 아침 갱신하는 청약 일정·분양가·가점 안내</p>
        <ul className="sb-foot__links">
          <li><a href="/cheongyak/this-week">이번 주 접수</a></li>
          <li><a href="/cheongyak/region/seoul">지역별 일정</a></li>
          <li><a href="/#calculator">가점 계산기</a></li>
          <li><a href="/privacy">개인정보처리방침</a></li>
        </ul>
        <p className="sb-foot__note">
          출처 {SOURCE} · 기준일 {ymd(BASIS)}. 이 사이트는 공공데이터를 가공해 보여주는 정보 서비스이며 투자 권유나 당첨 보장이 아닙니다. 접수 전 반드시 입주자모집공고 원문을 확인하세요.
        </p>
        <p className="sb-foot__note">© 2026 쓱보는 청약 · 방문 통계와 광고(구글 애드센스)에 쿠키를 씁니다.</p>
      </div>
    </footer>
  );
}
