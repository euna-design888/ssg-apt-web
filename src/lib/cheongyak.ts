// 청약홈 데이터 헬퍼 (2026-10-12). 원천은 scripts/fetch-cheongyak.mjs가 매일 만드는 src/data/cheongyak.json
import raw from "@/data/cheongyak.json";
import type { Apartment } from "@/types/apartment";

export type Range = [string, string] | null;
export interface CheongyakType {
  no: string; type: string; supplyArea: number; households: number; special: number; price: number;
  specialBreakdown: { multiChild: number; newlywed: number; firstLife: number; elderly: number; institution: number; newborn: number; youth: number; relocation: number };
}
export interface Cheongyak {
  id: string; pblancNo: string; name: string; sido: string; address: string; saleType: string; supply: number;
  developer: string; builder: string; homepage: string; pblancUrl: string; tel: string; noticeDate: string; moveIn: string;
  flags: { speculation: boolean; adjust: boolean; priceCap: boolean; publicHousing: boolean; largeSite: boolean; redevelopment: boolean; publicSpecial: boolean };
  schedule: { special: Range; rank1: Range; rank2: Range; receipt: Range; announce: string; contract: Range };
  types: CheongyakType[]; priceMin: number; priceMax: number;
}

const data = raw as { basis: string; source: string; items: Cheongyak[] };
export const BASIS = data.basis;
export const SOURCE = data.source;
export const ITEMS: Cheongyak[] = data.items;

export const SIDO_SLUG: Record<string, string> = {
  서울: "seoul", 경기: "gyeonggi", 인천: "incheon", 부산: "busan", 대구: "daegu", 광주: "gwangju", 대전: "daejeon", 울산: "ulsan",
  세종: "sejong", 강원: "gangwon", 충북: "chungbuk", 충남: "chungnam", 전북: "jeonbuk", 전남: "jeonnam", 경북: "gyeongbuk", 경남: "gyeongnam", 제주: "jeju",
};
export const SLUG_SIDO = Object.fromEntries(Object.entries(SIDO_SLUG).map(([k, v]) => [v, k]));

export type Status = "applying" | "upcoming" | "closed";
export function status(c: Cheongyak, today = BASIS): Status {
  const [b, e] = c.schedule.receipt || ["", ""];
  if (!b) return "upcoming";
  if (today < b) return "upcoming";
  if (today > e) return "closed";
  return "applying";
}
export const STATUS_LABEL: Record<Status, string> = { applying: "접수 중", upcoming: "접수 예정", closed: "접수 마감" };

export function byId(id: string) { return ITEMS.find((c) => c.id === id); }
export function upcoming(today = BASIS) { return ITEMS.filter((c) => status(c, today) !== "closed").sort((a, b) => (a.schedule.receipt?.[0] || "").localeCompare(b.schedule.receipt?.[0] || "")); }
export function thisWeek(today = BASIS) {
  const end = addDays(today, 7);
  return ITEMS.filter((c) => { const b = c.schedule.receipt?.[0] || ""; const e = c.schedule.receipt?.[1] || b; return e >= today && b <= end; })
    .sort((a, b) => b.supply - a.supply);
}
export function bySido(sido: string) { return ITEMS.filter((c) => c.sido === sido).sort((a, b) => (b.schedule.receipt?.[0] || "").localeCompare(a.schedule.receipt?.[0] || "")); }
export function sidoCounts() {
  const m: Record<string, number> = {};
  for (const c of ITEMS) m[c.sido] = (m[c.sido] || 0) + 1;
  return m;
}

export function addDays(d: string, n: number) { const x = new Date(d + "T00:00:00"); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); }
export function md(d?: string | null) { return d ? `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}` : "-"; }
export function ymd(d?: string | null) { return d ? d.replace(/-/g, ".") : "미정"; }
export function rangeText(r: Range) { return r ? (r[0] === r[1] ? ymd(r[0]) : `${ymd(r[0])} ~ ${ymd(r[1])}`) : "미정"; }
export function money(man: number) {
  if (!man) return "미정";
  const eok = Math.floor(man / 10000), rest = man % 10000;
  return rest ? `${eok}억 ${rest.toLocaleString()}만` : `${eok}억`;
}
export function pyeong(m2: number) { return m2 ? `${Math.round(m2 / 3.3058)}평` : ""; }
export function typeLabel(t: string) { const s = t.trim(); const m = s.match(/^(\d+)\.?(\d*)([A-Za-z]*)$/); return m ? `${Number(m[1])}${m[3] || ""}` : s; }
export const CAPITAL = new Set(["서울", "경기", "인천"]);

export function regulationTags(c: Cheongyak) {
  const f = c.flags, out: string[] = [];
  if (f.speculation) out.push("투기과열지구");
  if (f.adjust) out.push("조정대상지역");
  if (f.priceCap) out.push("분양가상한제");
  if (f.publicHousing) out.push("공공주택지구");
  if (f.largeSite) out.push("대규모택지");
  if (f.redevelopment) out.push("정비사업");
  if (!out.length) out.push("비규제지역");
  return out;
}

// 기존 화면(달력·가점 계산기)이 쓰는 옛 타입으로 변환 — 수동 필드(안전마진 등)는 0/빈값
export function toLegacy(c: Cheongyak): Apartment {
  return {
    id: c.id, name: c.name, region: `${c.sido} ${c.address.split(" ").slice(1, 3).join(" ")}`.trim(), locationDetail: c.address,
    status: status(c), category: c.saleType === "국민" ? "공공분양" : "민간분양",
    priceMin: c.priceMin, priceMax: c.priceMax, estimatedMarketPrice: 0, safetyMargin: 0,
    supplyScale: `총 ${c.supply.toLocaleString()}세대`, exclusiveArea: c.types.map((t) => typeLabel(t.type)).slice(0, 3).join("·") + "㎡",
    schedule: { specialSupply: c.schedule.special?.[0], firstRank: c.schedule.rank1?.[0] || c.schedule.receipt?.[0], secondRank: c.schedule.rank2?.[0], announcement: c.schedule.announce, contract: c.schedule.contract?.[0] },
    bareumFact: { sourceName: "한국부동산원 청약홈 입주자모집공고", officialUrl: c.pblancUrl, announcementDate: c.noticeDate, regulations: regulationTags(c), verifiedDate: BASIS },
    danhoRisk: { dsrWarning: "", disqualificationTrap: "", criticSummary: "" },
    tags: regulationTags(c),
  };
}
