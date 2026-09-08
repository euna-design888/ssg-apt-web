'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Apartment } from '@/types/apartment';
import AdPlaceholder from './AdPlaceholder';

interface CheongyakScoreCalculatorProps {
  apartments: Apartment[];
}

export default function CheongyakScoreCalculator({ apartments }: CheongyakScoreCalculatorProps) {
  // 1. 무주택 기간 (0 ~ 32점)
  const [periodScore, setPeriodScore] = useState<number>(32);
  // 2. 부양가족 수 (5 ~ 35점)
  const [familyScore, setFamilyScore] = useState<number>(15);
  // 3. 청약통장 가입기간 (1 ~ 17점)
  const [bankScore, setBankScore] = useState<number>(17);
  // 복사 알림 토스트
  const [copied, setCopied] = useState<boolean>(false);

  const totalScore = periodScore + familyScore + bankScore;
  const scorePercent = Math.round((totalScore / 84) * 100);

  // 등급 및 조언 판정
  const getScoreVerdict = (score: number) => {
    if (score >= 70) {
      return {
        badge: '👑 서울 로또 분상제 당첨권',
        color: '#00b06b',
        bgColor: '#e6fcf5',
        title: '강남·서초·송파 핵심 상급지 당첨 유력권',
        desc: '디에이치 방배, 잠실 래미안 등 수도권 최고 로또 단지의 가점제 커트라인에 도달 가능한 최상위 가점입니다. 특별공급보다는 일반공급 가점제 승부를 적극 추천합니다.',
      };
    }
    if (score >= 60) {
      return {
        badge: '🎯 수도권 1급지 당첨 가시권',
        color: '#1b64da',
        bgColor: '#e8f3ff',
        title: '과천·판교·서울 준상급지 적극 공략권',
        desc: '과천 지정타, 성남, 서울 주요 재개발 단지에서 높은 확률로 당첨을 노릴 수 있습니다. 인기 평형(84A)보다는 비인기 타워형이나 저층을 전략 선택하면 당첨 확률이 2배 높아집니다.',
      };
    }
    if (score >= 48) {
      return {
        badge: '⚖️ 수도권 택지지구 소신 지원권',
        color: '#e87400',
        bgColor: '#fff4e6',
        title: '수도권 공공분양 및 민간 틈새 평형 공략권',
        desc: '인천계양, 화서, 고덕강일 등 수도권 외곽 공공분양 및 일반 민간분양의 가점 틈새를 노려볼 만합니다. 추첨제 비율(60~80%)이 높은 중대형 평형도 함께 고려하세요.',
      };
    }
    return {
      badge: '💡 가점제 대신 특별공급 & 추첨제 집중',
      color: '#f04452',
      bgColor: '#feeef0',
      title: '일반 가점제 경쟁 불리 ➔ 추첨제·특공 우회 필수',
      desc: '가점제로는 서울 상급지 진입이 어렵습니다. 하지만 신혼부부, 생애최초, 다자녀 특별공급이나 규제지역 내 추첨제(최대 60~80% 추첨)를 노리면 가점과 무관하게 100% 운으로 당첨 가능합니다.',
    };
  };

  const verdict = getScoreVerdict(totalScore);

  // 단지별 합격 난이도 판정
  const getComplexStatus = (apt: Apartment, score: number) => {
    // 단지별 예상 가점 커트라인
    let minTarget = 65;
    if (apt.name.includes('방배') || apt.name.includes('잠실')) minTarget = 70;
    else if (apt.name.includes('과천')) minTarget = 67;
    else if (apt.name.includes('고덕강일') || apt.name.includes('복정')) minTarget = 55;
    else minTarget = 50;

    if (score >= minTarget) {
      return { text: '안정권', class: 'status-safe', tag: '가점제 승부 유력' };
    } else if (score >= minTarget - 8) {
      return { text: '소신/경합', class: 'status-caution', tag: '비선호 타입 공략' };
    } else {
      return { text: '추첨제 노림', class: 'status-danger', tag: '특공/추첨제 필수' };
    }
  };

  const handleShareScore = () => {
    const text = `[쓱보는 청약] 내 청약 가점 결과: ${totalScore}점 / 84점 만점 (${verdict.title})\n수도권 분양단지 안전마진 & DSR 자금 확인하기 👉 https://ssgapt.com`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div style={{ padding: '8px 0 24px' }}>
      {/* 1. 상단 안내 */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '20px', marginBottom: '16px', border: '1px solid #e5e8eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#3182f6', background: '#e8f3ff', padding: '3px 8px', borderRadius: '4px' }}>
            청약홈 공식 산식
          </span>
          <span style={{ fontSize: '12px', color: '#8b95a1' }}>총 84점 만점 기준</span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#191f28', margin: '4px 0 8px' }}>
          내 청약 가점 3초 정밀 진단
        </h2>
        <p style={{ fontSize: '13px', color: '#4e5968', lineHeight: 1.5, margin: 0 }}>
          무주택 기간(32점), 부양가족 수(35점), 통장 가입기간(17점)을 선택하면 수도권 8대 분양 단지 합격 가능성을 즉시 비교해 드립니다.
        </p>
      </div>

      {/* 2. 입력 폼 3개 */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '20px', marginBottom: '16px', border: '1px solid #e5e8eb' }}>
        {/* ① 무주택 기간 */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 800, color: '#191f28' }}>
              1. 무주택 기간 (최대 32점)
            </label>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#3182f6' }}>{periodScore}점</span>
          </div>
          <select
            value={periodScore}
            onChange={(e) => setPeriodScore(Number(e.target.value))}
            className="toss-select"
            style={{ fontWeight: 600 }}
          >
            <option value={0}>유주택자 / 만 30세 미만 미혼 (0점)</option>
            <option value={2}>1년 미만 (2점)</option>
            <option value={4}>1년 이상 ~ 2년 미만 (4점)</option>
            <option value={6}>2년 이상 ~ 3년 미만 (6점)</option>
            <option value={8}>3년 이상 ~ 4년 미만 (8점)</option>
            <option value={10}>4년 이상 ~ 5년 미만 (10점)</option>
            <option value={12}>5년 이상 ~ 6년 미만 (12점)</option>
            <option value={14}>6년 이상 ~ 7년 미만 (14점)</option>
            <option value={16}>7년 이상 ~ 8년 미만 (16점)</option>
            <option value={18}>8년 이상 ~ 9년 미만 (18점)</option>
            <option value={20}>9년 이상 ~ 10년 미만 (20점)</option>
            <option value={22}>10년 이상 ~ 11년 미만 (22점)</option>
            <option value={24}>11년 이상 ~ 12년 미만 (24점)</option>
            <option value={26}>12년 이상 ~ 13년 미만 (26점)</option>
            <option value={28}>13년 이상 ~ 14년 미만 (28점)</option>
            <option value={30}>14년 이상 ~ 15년 미만 (30점)</option>
            <option value={32}>15년 이상 (32점 - 만점)</option>
          </select>
          <div style={{ fontSize: '11px', color: '#8b95a1', marginTop: '4px' }}>
            * 만 30세 이전 결혼한 경우 혼인신고일로부터 기산, 유주택자는 처분 등기일부터 기산.
          </div>
        </div>

        {/* ② 부양가족 수 */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 800, color: '#191f28' }}>
              2. 부양가족 수 (최대 35점)
            </label>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#3182f6' }}>{familyScore}점</span>
          </div>
          <select
            value={familyScore}
            onChange={(e) => setFamilyScore(Number(e.target.value))}
            className="toss-select"
            style={{ fontWeight: 600 }}
          >
            <option value={5}>0명 (본인 단독 1인 가구) (5점)</option>
            <option value={10}>1명 (배우자 또는 자녀 1인) (10점)</option>
            <option value={15}>2명 (3인 가족) (15점)</option>
            <option value={20}>3명 (4인 가족) (20점)</option>
            <option value={25}>4명 (5인 가족) (25점)</option>
            <option value={30}>5명 (6인 가족) (30점)</option>
            <option value={35}>6명 이상 (7인 이상 대가족) (35점 - 만점)</option>
          </select>
          <div style={{ fontSize: '11px', color: '#8b95a1', marginTop: '4px' }}>
            * 배우자는 세대 분리되어 있어도 포함, 직계존속은 3년 이상 주민등록등본 등재 시 인정.
          </div>
        </div>

        {/* ③ 청약통장 가입기간 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '14px', fontWeight: 800, color: '#191f28' }}>
              3. 청약통장 가입기간 (최대 17점)
            </label>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#3182f6' }}>{bankScore}점</span>
          </div>
          <select
            value={bankScore}
            onChange={(e) => setBankScore(Number(e.target.value))}
            className="toss-select"
            style={{ fontWeight: 600 }}
          >
            <option value={1}>6개월 미만 (1점)</option>
            <option value={2}>6개월 이상 ~ 1년 미만 (2점)</option>
            <option value={3}>1년 이상 ~ 2년 미만 (3점)</option>
            <option value={4}>2년 이상 ~ 3년 미만 (4점)</option>
            <option value={5}>3년 이상 ~ 4년 미만 (5점)</option>
            <option value={6}>4년 이상 ~ 5년 미만 (6점)</option>
            <option value={7}>5년 이상 ~ 6년 미만 (7점)</option>
            <option value={8}>6년 이상 ~ 7년 미만 (8점)</option>
            <option value={9}>7년 이상 ~ 8년 미만 (9점)</option>
            <option value={10}>8년 이상 ~ 9년 미만 (10점)</option>
            <option value={11}>9년 이상 ~ 10년 미만 (11점)</option>
            <option value={12}>10년 이상 ~ 11년 미만 (12점)</option>
            <option value={13}>11년 이상 ~ 12년 미만 (13점)</option>
            <option value={14}>12년 이상 ~ 13년 미만 (14점)</option>
            <option value={15}>13년 이상 ~ 14년 미만 (15점)</option>
            <option value={16}>14년 이상 ~ 15년 미만 (16점)</option>
            <option value={17}>15년 이상 (17점 - 만점)</option>
          </select>
          <div style={{ fontSize: '11px', color: '#8b95a1', marginTop: '4px' }}>
            * 미성년자 가입기간 인정 상한 최대 2년(24회) 제한 규정 적용.
          </div>
        </div>
      </div>

      {/* 3. 진단 결과 종합 리포트 카드 */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '24px 20px', marginBottom: '20px', border: '1px solid #e5e8eb', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: verdict.color, background: verdict.bgColor, padding: '4px 10px', borderRadius: '6px' }}>
            {verdict.badge}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', margin: '10px 0 4px' }}>
            <span style={{ fontSize: '54px', fontWeight: 900, color: '#191f28', letterSpacing: '-1px' }}>
              {totalScore}
            </span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#8b95a1' }}>/ 84점</span>
          </div>

          {/* 게이지 바 */}
          <div style={{ width: '100%', height: '10px', background: '#f2f4f6', borderRadius: '5px', overflow: 'hidden', margin: '12px auto' }}>
            <div
              style={{
                width: `${scorePercent}%`,
                height: '100%',
                background: verdict.color,
                borderRadius: '5px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#191f28', margin: '10px 0 6px' }}>
            {verdict.title}
          </h3>
          <p style={{ fontSize: '13px', color: '#4e5968', lineHeight: 1.55, margin: '0 auto', maxWidth: '420px' }}>
            {verdict.desc}
          </p>
        </div>

        {/* 세부 점수 구성 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: '#f9fafb', borderRadius: '12px', padding: '12px', textAlign: 'center', margin: '16px 0' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#8b95a1' }}>무주택 기간</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#191f28', marginTop: '2px' }}>{periodScore}<span style={{ fontSize: '11px', color: '#8b95a1' }}>/32</span></div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#8b95a1' }}>부양가족 수</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#191f28', marginTop: '2px' }}>{familyScore}<span style={{ fontSize: '11px', color: '#8b95a1' }}>/35</span></div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#8b95a1' }}>통장 가입기간</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#191f28', marginTop: '2px' }}>{bankScore}<span style={{ fontSize: '11px', color: '#8b95a1' }}>/17</span></div>
          </div>
        </div>

        {/* 결과 공유 버튼 */}
        <button
          type="button"
          onClick={handleShareScore}
          style={{
            width: '100%',
            padding: '13px',
            background: copied ? '#00b06b' : '#3182f6',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {copied ? '✓ 가점 결과가 복사되었습니다!' : '📋 내 가점 결과 공유 및 복사하기'}
        </button>
      </div>

      {/* 4. 실전 수도권 8대 단지 합격 가능성 매칭 리스트 */}
      <div style={{ background: '#fff', borderRadius: '18px', padding: '20px', marginBottom: '20px', border: '1px solid #e5e8eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#191f28', margin: 0 }}>
            내 가점({totalScore}점) 기준 실전 단지 당첨 시뮬레이션
          </h3>
          <span style={{ fontSize: '12px', color: '#8b95a1' }}>수도권 8개 단지</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {apartments.map((apt) => {
            const match = getComplexStatus(apt, totalScore);
            return (
              <Link
                key={apt.id}
                href={`/apt/${apt.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  border: '1px solid #eee',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#191f28' }}>{apt.name}</div>
                  <div style={{ fontSize: '12px', color: '#6b7684', marginTop: '2px' }}>
                    안전마진 +{(apt.safetyMargin / 10000).toFixed(1)}억 | {apt.region}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: match.text === '안정권' ? '#e6fcf5' : match.text === '소신/경합' ? '#fff4e6' : '#feeef0',
                      color: match.text === '안정권' ? '#00b06b' : match.text === '소신/경합' ? '#e87400' : '#f04452',
                    }}
                  >
                    {match.text}
                  </span>
                  <div style={{ fontSize: '11px', color: '#8b95a1', marginTop: '3px' }}>
                    {match.tag}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. 광고 슬롯 */}
      <AdPlaceholder slotType="golden-result" />
    </div>
  );
}
