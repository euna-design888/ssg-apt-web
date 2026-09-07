'use client';

import React, { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';

export default function CalculatorSection() {
  const [calcTab, setCalcTab] = useState<'point' | 'dsr'>('point');

  // 청약 가점
  const [period, setPeriod] = useState<number>(32);
  const [family, setFamily] = useState<number>(15);
  const [bank, setBank] = useState<number>(17);
  const totalScore = period + family + bank;

  // DSR
  const [price, setPrice] = useState<number>(60000);
  const [myCash, setMyCash] = useState<number>(12000);
  const [income, setIncome] = useState<number>(6000);

  const contract = Math.round(price * 0.1);
  const middle = Math.round(price * 0.6);
  const balance = Math.round(price * 0.3);

  const annualMaxPayment = income * 0.4;
  let maxLoan = Math.round(annualMaxPayment / 0.0674);
  const ltvMax = Math.round(price * 0.7);
  if (maxLoan > ltvMax) maxLoan = ltvMax;

  const reqCash = price - maxLoan;
  const cashGap = reqCash - myCash;

  const formatMan = (val: number) => {
    return val.toLocaleString() + ' 만원';
  };

  return (
    <section id="calculator" className="calc-clean-card">
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: 800, color: '#3182f6', background: '#e8f3ff', padding: '3px 8px', borderRadius: '4px' }}>
          모의 계산기
        </span>
        <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#191f28', marginTop: '6px' }}>
          {calcTab === 'point' ? '내 청약 가점 진단하기' : '분양 필요자금 & DSR 계산'}
        </h3>
      </div>

      {/* 세그먼트 네비게이션 */}
      <div className="calc-nav-tabs">
        <button
          type="button"
          className={`calc-nav-btn ${calcTab === 'point' ? 'active' : ''}`}
          onClick={() => setCalcTab('point')}
        >
          🎯 청약 가점 (84점 만점)
        </button>
        <button
          type="button"
          className={`calc-nav-btn ${calcTab === 'dsr' ? 'active' : ''}`}
          onClick={() => setCalcTab('dsr')}
        >
          💰 스트레스 DSR 자금계획
        </button>
      </div>

      {calcTab === 'point' ? (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#4e5968' }}>무주택 기간</label>
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="toss-select"
            >
              <option value={0}>유주택자 / 만 30세 미만 미혼 (0점)</option>
              <option value={2}>1년 미만 (2점)</option>
              <option value={6}>2년 이상 ~ 3년 미만 (6점)</option>
              <option value={10}>4년 이상 ~ 5년 미만 (10점)</option>
              <option value={14}>6년 이상 ~ 7년 미만 (14점)</option>
              <option value={20}>9년 이상 ~ 10년 미만 (20점)</option>
              <option value={26}>12년 이상 ~ 13년 미만 (26점)</option>
              <option value={32}>15년 이상 (32점 - 만점)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#4e5968' }}>부양가족 수</label>
            <select
              value={family}
              onChange={(e) => setFamily(Number(e.target.value))}
              className="toss-select"
            >
              <option value={5}>0명 (본인 단독 1인 가구) (5점)</option>
              <option value={10}>1명 (10점)</option>
              <option value={15}>2명 (15점)</option>
              <option value={20}>3명 (20점)</option>
              <option value={25}>4명 (25점)</option>
              <option value={30}>5명 (30점)</option>
              <option value={35}>6명 이상 (35점 - 만점)</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: 700, color: '#4e5968' }}>청약통장 가입기간</label>
            <select
              value={bank}
              onChange={(e) => setBank(Number(e.target.value))}
              className="toss-select"
            >
              <option value={1}>6개월 미만 (1점)</option>
              <option value={2}>6개월 이상 ~ 1년 미만 (2점)</option>
              <option value={4}>2년 이상 ~ 3년 미만 (4점)</option>
              <option value={7}>5년 이상 ~ 6년 미만 (7점)</option>
              <option value={11}>9년 이상 ~ 10년 미만 (11점)</option>
              <option value={14}>12년 이상 ~ 13년 미만 (14점)</option>
              <option value={17}>15년 이상 (17점 - 만점)</option>
            </select>
          </div>

          {/* 깔끔한 플랫 결과 박스 */}
          <div className="toss-result-box">
            <div style={{ fontSize: '13px', color: '#8b95a1', fontWeight: 600 }}>내 청약 가점</div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#191f28', margin: '4px 0' }}>{totalScore}점</div>
            <div style={{ fontSize: '15px', color: totalScore >= 60 ? '#00b06b' : '#f04452', fontWeight: 800 }}>
              {totalScore >= 65 ? '서울 핵심 상급지 당첨 유력' : totalScore >= 50 ? '수도권 신도시 당첨 가시권' : '추첨제 및 신혼·생초 특공 권장'}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#4e5968' }}>분양가 (만원)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="toss-select"
                style={{ background: '#f9fafb' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#4e5968' }}>보유 현금 (만원)</label>
              <input
                type="number"
                value={myCash}
                onChange={(e) => setMyCash(Number(e.target.value))}
                className="toss-select"
                style={{ background: '#f9fafb' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#4e5968' }}>연 소득 (만원)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="toss-select"
                style={{ background: '#f9fafb' }}
              />
            </div>
          </div>

          {/* 단계별 납부 한눈에 */}
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '16px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e8eb' }}>
              <span style={{ color: '#6b7684' }}>계약금 10% (순수현금)</span>
              <strong style={{ color: '#f04452' }}>{formatMan(contract)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e8eb' }}>
              <span style={{ color: '#6b7684' }}>중도금 60% (대출)</span>
              <strong>{formatMan(middle)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#6b7684' }}>잔금 30% (입주 시)</span>
              <strong>{formatMan(balance)}</strong>
            </div>
          </div>

          <div style={{ background: '#e8f3ff', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', color: '#1b64da', fontWeight: 700 }}>스트레스 DSR 2단계 최대 대출</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#1b64da', margin: '4px 0' }}>{formatMan(maxLoan)}</div>
            <div style={{ fontSize: '14px', color: cashGap <= 0 ? '#00b06b' : '#f04452', fontWeight: 800 }}>
              {cashGap <= 0 ? '✓ 현재 보유 현금으로 충분합니다' : `⚠️ 입주 시 약 ${formatMan(cashGap)} 현금 추가 필요`}
            </div>
          </div>
        </div>
      )}

      {/* 직하단 골든 광고 */}
      <AdPlaceholder slotType="golden-result" />
    </section>
  );
}
