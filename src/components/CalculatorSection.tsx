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

  // 계약금 10%, 중도금 60%, 잔금 30%
  const contract = Math.round(price * 0.1);
  const middle = Math.round(price * 0.6);
  const balance = Math.round(price * 0.3);

  // 스트레스 DSR 2단계: 가산금리 1.2% 반영 약 5.4%, 30년 상환계수 약 0.0674
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
        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 800 }}>
          바름 공공 법령 & 금융위원회 DSR 지침 준수
        </span>
        <h3 style={{ marginTop: '10px' }}>⚡ 2026 청약 가점 & 분양 필요자금 올인원 계산기</h3>
        <p style={{ color: '#64748b', fontSize: '14px' }}>
          84점 만점 청약 가점 및 스트레스 DSR 2단계 기준 주담대 한도를 1초 만에 확인하세요.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', maxWidth: '460px', margin: '0 auto 24px auto' }}>
        <button
          className={`filter-btn ${calcTab === 'point' ? 'active' : ''}`}
          style={{ flex: 1 }}
          onClick={() => setCalcTab('point')}
        >
          🎯 내 청약 가점 진단
        </button>
        <button
          className={`filter-btn ${calcTab === 'dsr' ? 'active' : ''}`}
          style={{ flex: 1 }}
          onClick={() => setCalcTab('dsr')}
        >
          💰 필요자금 & DSR 시뮬레이션
        </button>
      </div>

      {calcTab === 'point' ? (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
              1. 무주택 기간 (최대 32점)
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px' }}
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
            <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
              2. 부양가족 수 (최대 35점)
            </label>
            <select
              value={family}
              onChange={(e) => setFamily(Number(e.target.value))}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px' }}
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
            <label style={{ display: 'block', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
              3. 청약통장 가입기간 (최대 17점)
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(Number(e.target.value))}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px' }}
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

          <div style={{ background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 700 }}>당신의 법정 청약 가점 총점</span>
            <div style={{ fontSize: '46px', fontWeight: 900, color: '#1e3a8a', margin: '8px 0' }}>{totalScore}점</div>
            <p style={{ fontSize: '14px', color: totalScore >= 60 ? '#15803d' : '#b45309', fontWeight: 700 }}>
              {totalScore >= 65 ? '🏆 서울 핵심 상급지 및 수도권 대장단지 당첨 유력권' : totalScore >= 50 ? '🥈 수도권 신도시 및 분양가 상한제 단지 당첨 가시권' : '⚠️ 가점제 불리 구간 (생애최초·신혼 특공 및 추첨제 집중 권장)'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>아파트 총 분양가 (만원)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>보유 순수 현금 (만원)</label>
              <input
                type="number"
                value={myCash}
                onChange={(e) => setMyCash(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>연 소득 (만원)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', color: '#1e3a8a', marginBottom: '10px' }}>📋 단계별 필수 납부 금액</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #cbd5e1', fontSize: '14px' }}>
              <span>계약금 (10% - 순수 현금 필요)</span>
              <strong>{formatMan(contract)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #cbd5e1', fontSize: '14px' }}>
              <span>중도금 (60% - 집단대출)</span>
              <strong>{formatMan(middle)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
              <span>잔금 (30% - 입주 시 정산)</span>
              <strong>{formatMan(balance)}</strong>
            </div>
          </div>

          <div style={{ background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '14px', padding: '20px' }}>
            <h4 style={{ fontSize: '16px', color: '#1e40af', marginBottom: '8px' }}>🔍 스트레스 DSR 2단계 주담대 진단</h4>
            <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.8' }}>
              • <strong>최대 주택담보대출 가능액:</strong> <span style={{ color: '#1e3a8a', fontWeight: 900 }}>{formatMan(maxLoan)}</span><br />
              • <strong>입주 시점 총 필요 순수 현금:</strong> <span style={{ color: '#dc2626', fontWeight: 900 }}>{formatMan(reqCash)}</span><br />
              • <strong>내 보유현금 대비 최종 상태:</strong> {cashGap <= 0 ? (
                <span style={{ color: '#15803d', fontWeight: 800 }}>보유 현금 충분 (자금 조달 안전)</span>
              ) : (
                <span style={{ color: '#dc2626', fontWeight: 800 }}>약 {formatMan(cashGap)} 추가 마련 필요</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* 결과창 직하단 고수익 골든 슬롯 배너 */}
      <AdPlaceholder slotType="golden-result" />
    </section>
  );
}
