export interface ApartmentSchedule {
  specialSupply?: string;   // 특별공급 접수일
  firstRank?: string;       // 1순위 접수일
  secondRank?: string;      // 2순위 접수일
  announcement?: string;    // 당첨자 발표일
  contract?: string;        // 계약 체결일
}

export interface BareumFact {
  sourceName: string;       // 1차 공공 출처 (예: LH 청약플러스 공고문)
  officialUrl: string;      // 공식 확인 URL
  announcementDate: string; // 공고일자
  regulations: string[];    // 전매제한, 거주의무, 재당첨제한 등 규제
  verifiedDate: string;     // 바름 팩트 검증일시
}

export interface DanhoRisk {
  profitSharingRate?: string; // 신혼희망타운 등 기금 환수율
  dsrWarning: string;         // 스트레스 DSR 2단계 및 기존 부채 시 대출 삭감 맹점
  disqualificationTrap: string; // 부적격 당첨 킬러 조항 (통장 박탈 주의)
  criticSummary: string;      // 단호의 냉철한 1줄 총평
}

export interface FinancialPlan {
  downPaymentPercent: number;   // 계약금 비율 (10 또는 20%)
  middlePaymentPercent: number; // 중도금 비율 (60%)
  balancePaymentPercent: number; // 잔금 비율 (20 또는 30%)
  middleLoanInterest: '무이자' | '이자후불제' | '직접납부';
  estimatedAcquisitionTax: number; // 취득세 예상 (만원 단위)
  estimatedOptionCost: number;     // 발코니 확장 및 필수 옵션비 (만원 단위)
}

export interface Apartment {
  id: string;
  name: string;
  region: string;           // 시/도 시/군/구
  locationDetail: string;   // 상세 주소
  status: 'applying' | 'upcoming' | 'closed'; // 접수중, 예정, 마감
  category: '공공분양' | '민간분양' | '신혼희망타운' | '재건축/재개발' | '토지임대부';
  priceMin: number;         // 만원 단위 (예: 58500)
  priceMax: number;         // 만원 단위 (예: 62300)
  estimatedMarketPrice: number; // 주변 5년 내 준신축 실거래가 (만원 단위)
  safetyMargin: number;     // 예상 안전마진 (만원 단위)
  supplyScale: string;      // 공급 규모 (예: 총 1,026세대 중 615세대)
  exclusiveArea: string;    // 전용 면적 (예: 55㎡ A/B)
  schedule: ApartmentSchedule;
  bareumFact: BareumFact;
  danhoRisk: DanhoRisk;
  financialPlan?: FinancialPlan;
  tags: string[];           // '분양가상한제', '초품아', '역세권', '안전마진3억' 등
}
