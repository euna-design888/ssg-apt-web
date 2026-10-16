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
    // 10/12 한결 점검: "당첨권·당첨 유력·100% 당첨 가능" 같은 단정 표현은 표시광고법·애드센스 허위진술에 걸린다.
    // 점수 구간만 말하고, 판단은 청약홈이 공개하는 주택형별 최저 당첨가점과 비교하라고 안내한다.
    if (score >= 70) {
      return {
        badge: '70점 이상 · 상위 가점대',
        color: '#00b06b',
        bgColor: '#e6fcf5',
        title: '가점제 물량 지원을 검토할 구간',
        desc: '같은 지역·비슷한 주택형의 청약홈 공개 최저 당첨가점과 비교해 보세요. 당첨은 단지·주택형·경쟁률에 따라 달라집니다.',
      };
    }
    if (score >= 60) {
      return {
        badge: '60~69점 · 중상위 가점대',
        color: '#1b64da',
        bgColor: '#e8f3ff',
        title: '지역과 주택형에 따라 가점제 지원을 검토할 구간',
        desc: '최근 공개된 당첨가점이 이 점수대와 비슷한 단지를 찾아 비교하세요. 선호도가 낮은 주택형은 공개 당첨가점이 낮은 경우가 있습니다.',
      };
    }
    if (score >= 48) {
      return {
        badge: '48~59점 · 중위 가점대',
        color: '#e87400',
        bgColor: '#fff4e6',
        title: '가점제와 추첨제를 함께 볼 구간',
        desc: '공공분양·비규제지역 단지의 공개 당첨가점과 비교하세요. 추첨제 비율이 있는 주택형은 가점과 별도로 추첨합니다(비율은 공고문 확인).',
      };
    }
    return {
      badge: '48점 미만 · 추첨제·특별공급 확인',
      color: '#f04452',
      bgColor: '#feeef0',
      title: '추첨제 물량과 특별공급 자격을 먼저 확인할 구간',
      desc: '추첨제 물량은 가점 없이 추첨으로 뽑습니다. 신혼부부·생애최초·다자녀 등 특별공급 자격은 입주자모집공고 원문에서 확인하세요.',
    };
  };

  const verdict = getScoreVerdict(totalScore);

  // 단지별 합격 난이도 판정
  const getComplexStatus = (apt: Apartment, score: number) => {
    // 10/12 한결 점검: 임의 커트라인(방배 70·과천 67…)은 근거 없는 단정이라 제거. 구간 안내만 하고 판단은 공개 당첨가점으로.
    void apt;
    if (score >= 60) {
      return { text: '공개 가점과 비교', class: 'status-safe', tag: '가점제 검토 구간' };
    } else if (score >= 48) {
      return { text: '가점·추첨 함께', class: 'status-caution', tag: '주택형별 확인' };
    } else {
      return { text: '추첨제·특공 확인', class: 'status-danger', tag: '공고문 자격 확인' };
    }
  };

  const handleShareScore = () => {
    const text = `[쓱보는 청약] 내 청약 가점: ${totalScore}점 / 84점 (${verdict.badge})\n쓱보는 청약 가점 계산기에서 확인하기 👉 https://apt.bluepalpal.com/#calculator`;
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
          내 청약 가점 계산
        </h2>
        <p style={{ fontSize: '13px', color: '#4e5968', lineHeight: 1.5, margin: 0 }}>
          무주택 기간(32점), 부양가족 수(35점), 통장 가입기간(17점)을 선택하면 84점 만점 기준 점수가 나옵니다. 당첨 여부는 단지·주택형별 공개 당첨가점과 비교해 판단하세요.
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

      {/* 3-2. 진단 결과 바로 아래 고수익 반응형 애드센스 광고 */}
      <AdPlaceholder slotType="infeed" />

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
