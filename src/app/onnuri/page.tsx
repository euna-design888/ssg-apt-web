'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdPlaceholder from '@/components/AdPlaceholder';

export default function OnnuriCalculatorPage() {
  const [chargeAmount, setChargeAmount] = useState<number>(1200000);
  const [spendAmount, setSpendAmount] = useState<number>(100000);

  // 1. 충전 선할인 계산 (기본 100만 원까지 7%, 100만~120만 원 10% 특별할인)
  const calculateChargeDiscount = (charge: number) => {
    if (charge <= 1000000) {
      return Math.round(charge * 0.07);
    }
    const baseDiscount = 1000000 * 0.07; // 70,000원
    const extraCharge = Math.min(charge - 1000000, 200000);
    const extraDiscount = extraCharge * 0.10; // 최대 20,000원
    return Math.round(baseDiscount + extraDiscount);
  };

  // 2. 전통시장 국산 농축수산물 현장 환급 (3.4만 원 이상 1만 원, 6.7만 원 이상 2만 원)
  const calculateMarketRefund = (spend: number) => {
    if (spend >= 67000) return 20000;
    if (spend >= 34000) return 10000;
    return 0;
  };

  const chargeDiscount = calculateChargeDiscount(chargeAmount);
  const actualPay = chargeAmount - chargeDiscount;
  const marketRefund = calculateMarketRefund(spendAmount);
  const totalDirectSave = chargeDiscount + marketRefund;
  const taxDeduction = Math.round(chargeAmount * 0.4); // 전통시장 40% 소득공제

  const fmt = (n: number) => n.toLocaleString('ko-KR');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />

      <main className="max-w-3xl mx-auto w-full px-4 py-8">
        {/* 상단 애드센스 */}
        <div className="mb-6">
          <AdPlaceholder slotType="header-banner" />
        </div>

        {/* 메인 계산기 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 py-7 text-center">
            <span className="inline-block bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-2 tracking-wider">
              2026 추석 명절 특별할인
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mb-2">
              온누리상품권 혜택 & 환급 계산기
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              최대 120만 원 충전 선할인 + 전통시장 2만 원 현장환급 3단 콤보 시뮬레이션
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* 1. 충전 금액 입력 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-base font-bold text-slate-900">
                  디지털 온누리상품권 충전액
                </label>
                <span className="text-xs text-slate-500">최대 한도 120만 원</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={fmt(chargeAmount)}
                  onChange={(e) => {
                    const num = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    setChargeAmount(Math.min(num, 1200000));
                  }}
                  className="w-full text-right font-bold text-xl pr-12 pl-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-4 font-bold text-slate-500">원</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[300000, 500000, 1000000, 1200000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setChargeAmount(amt)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      chargeAmount === amt
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {amt === 1200000 ? '한도(120만)' : `${amt / 10000}만`}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 장보기 지출 금액 입력 */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-base font-bold text-slate-900">
                  전통시장 국산 농축수산물 지출 예정액
                </label>
                <span className="text-xs text-slate-500">현장 환급 행사용</span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={fmt(spendAmount)}
                  onChange={(e) => {
                    const num = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                    setSpendAmount(num);
                  }}
                  className="w-full text-right font-bold text-xl pr-12 pl-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-4 font-bold text-slate-500">원</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[
                  { label: '3.4만(1만환급)', val: 34000 },
                  { label: '6.7만(2만환급)', val: 67000 },
                  { label: '10만', val: 100000 },
                  { label: '20만', val: 200000 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSpendAmount(item.val)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      spendAmount === item.val
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 결과 요약 카드 */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
              <div className="text-center bg-white rounded-xl p-5 border border-emerald-100 shadow-sm mb-5">
                <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">
                  총 직접 세이브 혜택 (선할인 + 현장 환급)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-600">
                  {fmt(totalDirectSave)}원
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-emerald-200/60">
                  <span className="text-slate-600">실제 계좌 결제액</span>
                  <span className="font-bold text-slate-900">{fmt(actualPay)}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-200/60">
                  <span className="text-slate-600">① 충전 선할인 (7% + 10% 특별할인)</span>
                  <span className="font-bold text-emerald-600">+{fmt(chargeDiscount)}원</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-emerald-200/60">
                  <span className="text-slate-600">② 전통시장 농축수산물 현장 환급</span>
                  <span className="font-bold text-emerald-600">+{fmt(marketRefund)}원</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">③ 연말정산 소득공제 (전통시장 40%)</span>
                  <span className="font-bold text-amber-700">약 {fmt(taxDeduction)}원 공제</span>
                </div>
              </div>
            </div>

            {/* 유의사항 박스 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 leading-relaxed space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-800">
                <span>⚠️ 2026 추석 온누리 혜택 핵심 체크포인트</span>
              </div>
              <ul className="list-disc list-inside space-y-1 pl-1 text-amber-950">
                <li>
                  <strong>할인율 차등:</strong> 100만 원까지는 7%, 추가 20만 원만 10%가 적용됩니다 (120만 전액 10% 아님).
                </li>
                <li>
                  <strong>국산 농축수산물 한정:</strong> 수입산 품목 영수증은 현장 환급 대상에서 제외됩니다.
                </li>
                <li>
                  <strong>명절 전날 충전 오류 주의:</strong> 연휴 직전 서버 트래픽이 폭주하므로 최소 2일 전 사전 충전하세요.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 애드센스 */}
        <div className="mt-8">
          <AdPlaceholder slotType="golden-result" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
