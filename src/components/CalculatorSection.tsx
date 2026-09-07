'use client';

import React, { useState } from 'react';
import AdPlaceholder from './AdPlaceholder';

export default function CalculatorSection() {
  const [calcTab, setCalcTab] = useState<'point' | 'dsr'>('point');

  // 1. 청약 가점 상태
  const [period, setPeriod] = useState<number>(32);
  const [family, setFamily] = useState<number>(15);
  const [bank, setBank] = useState<number>(17);

  const totalScore = period + family + bank;

  // 2. DSR 상태
  const [price, setPrice] = useState<number>(60000); // 6억
  const [myCash, setMyCash] = useState<number>(12000); // 1.2억
  const [income, setIncome] = useState<number>(6000); // 6천만원

  // 계산
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
    <section id="calculator" className="calc-section">
      <div className="calc-title-box">
        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '6px 14px', borderRadius: '18px', fontSize: '14px', fontWeight: 900 }}>
          정부 법정 기준 준수 · 노안 안심 대형 계산기
        </span>
        <h3 style={{ marginTop: '12px' }}>
          🏢 청약 가점 & 분양 필요자금 간편 계산기
        </h3>
        <p>
          작은 글씨 없이 돋보기 없이도 내 점수와 대출 가능액을 바로 확인하세요.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px auto' }}>
        <button
          type="button"
          className={`filter-btn ${calcTab === 'point' ? 'active' : ''}`}
          style={{ flex: 1 }}
          onClick={() => setCalcTab('point')}
        >
          🎯 내 청약 가점 계산
        </button>
        <button
          type="button"
          className={`filter-btn ${calcTab === 'dsr' ? 'active' : ''}`}
          style={{ flex: 1 }}
          onClick={() => setCalcTab('dsr')}
        >
          💰 분양 필요자금 계산
        </button>
      </div>

      {calcTab === 'point' ? (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontWeight: 900, fontSize: '17px', color: '#0f172a', marginBottom: '8px' }}>
              1. 무주택 기간 (최대 32점)
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="calc-control"
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

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontWeight: 900, fontSize: '17px', color: '#0f172a', marginBottom: '8px' }}>
              2. 부양가족 수 (배우자·자녀·부모 등, 최대 35점)
            </label>
            <select
              value={family}
              onChange={(e) => setFamily(Number(e.target.value))}
              className="calc-control"
            >
              <option value={5}>0명 (본인 1인 단독) (5점)</option>
              <option value={10}>1명 (10점)</option>
              <option value={15}>2명 (15점)</option>
              <option value={20}>3명 (20점)</option>
              <option value={25}>4명 (25점)</option>
              <option value={30}>5명 (30점)</option>
              <option value={35}>6명 이상 (35점 - 만점)</option>
            </select>
          </div>

          <div style={{ marginBottom: '26px' }}>
            <label style={{ display: 'block', fontWeight: 900, fontSize: '17px', color: '#0f172a', marginBottom: '8px' }}>
              3. 청약통장 가입기간 (최대 17점)
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(Number(e.target.value))}
              className="calc-control"
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

          {/* 대형 점수판 */}
          <div style={{ background: '#f8fafc', border: '2.5px solid #0f2b5c', borderRadius: '20px', padding: '28px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: '16px', color: '#475569', fontWeight: 800 }}>내 최종 청약 가점 총점</span>
            <div style={{ fontSize: '54px', fontWeight: 900, color: '#0f2b5c', margin: '10px 0' }}>{totalScore}점</div>
            <p style={{ fontSize: '17px', color: totalScore >= 60 ? '#15803d' : '#b45309', fontWeight: 900 }}>
              {totalScore >= 65 ? '🏆 서울 주요 상급지 및 수도권 대장단지 당첨 유력권' : totalScore >= 50 ? '🥈 수도권 신도시 및 분양가 상한제 단지 당첨 가시권' : '⚠️ 가점제 불리 구간 (생애최초·신혼 특공 및 추첨제 위주 공략 권장)'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
                아파트 분양가 (만원)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="calc-control"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
                보유 순수 현금 (만원)
              </label>
              <input
                type="number"
                value={myCash}
                onChange={(e) => setMyCash(Number(e.target.value))}
                className="calc-control"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '6px' }}>
                연 소득 (만원)
              </label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="calc-control"
              />
            </div>
          </div>

          {/* 필수 단계별 납부표 */}
          <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '22px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '18px', color: '#0f2b5c', fontWeight: 900, marginBottom: '14px' }}>📋 단계별 필수 납부 금액</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1.5px dashed #cbd5e1', fontSize: '17px' }}>
              <span>1. 계약금 (10% - 대출 불가 / 순수 현금)</span>
              <strong style={{ color: '#b91c1c' }}>{formatMan(contract)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1.5px dashed #cbd5e1', fontSize: '17px' }}>
              <span>2. 중도금 (60% - 집단대출 가능)</span>
              <strong>{formatMan(middle)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '17px' }}>
              <span>3. 잔금 (30% - 입주 시 주담대 전환)</span>
              <strong>{formatMan(balance)}</strong>
            </div>
          </div>

          {/* 대출 진단 */}
          <div style={{ background: '#eff6ff', border: '2px solid #60a5fa', borderRadius: '18px', padding: '24px' }}>
            <h4 style={{ fontSize: '19px', color: '#1e40af', fontWeight: 900, marginBottom: '10px' }}>
              🔍 스트레스 DSR 2단계 주택담보대출 한도 진단
            </h4>
            <p style={{ fontSize: '17px', color: '#1e293b', lineHeight: '1.9' }}>
              • <strong>최대 주담대 가능액:</strong> <span style={{ color: '#0f2b5c', fontWeight: 900, fontSize: '20px' }}>{formatMan(maxLoan)}</span><br />
              • <strong>입주 시점 총 필요 현금:</strong> <span style={{ color: '#b91c1c', fontWeight: 900, fontSize: '20px' }}>{formatMan(reqCash)}</span><br />
              • <strong>내 현재 자금 대비 상태:</strong> {cashGap <= 0 ? (
                <span style={{ color: '#15803d', fontWeight: 900, fontSize: '19px' }}>보유 현금 충분 (자금 조달 안전권)</span>
              ) : (
                <span style={{ color: '#b91c1c', fontWeight: 900, fontSize: '19px' }}>약 {formatMan(cashGap)} 추가 현금 필요</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* 결과창 직하단 광고 */}
      <AdPlaceholder slotType="golden-result" />
    </section>
  );
}
