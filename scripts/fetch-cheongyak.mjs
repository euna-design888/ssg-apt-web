// 청약홈 공공데이터 → src/data/cheongyak.json (2026-10-12)
// 실행: DATA_GO_KR_KEY=... node scripts/fetch-cheongyak.mjs
// 접수 시작일이 오늘-45일 ~ 오늘+75일인 APT 분양 공고 + 주택형별 분양가·특공 세대. 실패하면 기존 파일을 건드리지 않는다.
// ponytail: 무순위·오피스텔·임대는 2단에서. 지금은 APT 분양주택만.
import { writeFile, readFile } from "node:fs/promises";

const KEY = (process.env.DATA_GO_KR_KEY || "").trim();
if (!KEY) { console.error("DATA_GO_KR_KEY 없음"); process.exit(1); }

const BASE = "https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/";
const OUT = new URL("../src/data/cheongyak.json", import.meta.url);
const today = new Date(Date.now() + 9 * 3600 * 1000); // 한국 날짜 기준 (Actions는 UTC라 06:00 KST = 전날 21:00 UTC)
const iso = (d) => d.toISOString().slice(0, 10);
const shift = (days) => { const d = new Date(today); d.setDate(d.getDate() + days); return d; };

async function get(path, params) {
  const u = new URL(BASE + path);
  for (const [k, v] of Object.entries({ serviceKey: KEY, ...params })) u.searchParams.set(k, String(v));
  const r = await fetch(u, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(`${path} ${r.status} ${(await r.text()).slice(0, 120)}`);
  return r.json();
}

async function all(path, cond) {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const j = await get(path, { page, perPage: 100, ...cond });
    const rows = j.data || [];
    out.push(...rows);
    if (rows.length < 100) break;
  }
  return out;
}

const range = (b, e) => (b ? [b, e || b] : null);
const yes = (v) => v === "Y";

function pick(d, types) {
  const prices = types.map((t) => t.price).filter((p) => p > 0);
  return {
    id: d.HOUSE_MANAGE_NO,
    pblancNo: d.PBLANC_NO,
    name: (d.HOUSE_NM || "").trim(),
    sido: d.SUBSCRPT_AREA_CODE_NM || "",
    address: d.HSSPLY_ADRES || "",
    saleType: d.HOUSE_DTL_SECD_NM || "",           // 민영 / 국민
    supply: Number(d.TOT_SUPLY_HSHLDCO) || 0,
    developer: d.BSNS_MBY_NM || "",
    builder: d.CNSTRCT_ENTRPS_NM || "",
    homepage: d.HMPG_ADRES || "",
    pblancUrl: d.PBLANC_URL || "",
    tel: d.MDHS_TELNO || "",
    noticeDate: d.RCRIT_PBLANC_DE || "",
    moveIn: d.MVN_PREARNGE_YM ? `${d.MVN_PREARNGE_YM.slice(0, 4)}-${d.MVN_PREARNGE_YM.slice(4, 6)}` : "",
    flags: {
      speculation: yes(d.SPECLT_RDN_EARTH_AT),      // 투기과열지구
      adjust: yes(d.MDAT_TRGET_AREA_SECD),          // 조정대상지역
      priceCap: yes(d.PARCPRC_ULS_AT),              // 분양가상한제
      publicHousing: yes(d.PUBLIC_HOUSE_EARTH_AT),  // 공공주택지구
      largeSite: yes(d.LRSCL_BLDLND_AT),            // 대규모 택지개발지구
      redevelopment: yes(d.IMPRMN_BSNS_AT),         // 정비사업
      publicSpecial: yes(d.PUBLIC_HOUSE_SPCLW_APPLC_AT),
    },
    schedule: {
      special: range(d.SPSPLY_RCEPT_BGNDE, d.SPSPLY_RCEPT_ENDDE),
      rank1: range(d.GNRL_RNK1_CRSPAREA_RCPTDE, d.GNRL_RNK1_ETC_AREA_ENDDE || d.GNRL_RNK1_CRSPAREA_ENDDE),
      rank2: range(d.GNRL_RNK2_CRSPAREA_RCPTDE, d.GNRL_RNK2_ETC_AREA_ENDDE || d.GNRL_RNK2_CRSPAREA_ENDDE),
      receipt: range(d.RCEPT_BGNDE, d.RCEPT_ENDDE),
      announce: d.PRZWNER_PRESNATN_DE || "",
      contract: range(d.CNTRCT_CNCLS_BGNDE, d.CNTRCT_CNCLS_ENDDE),
    },
    types,
    priceMin: prices.length ? Math.min(...prices) : 0,
    priceMax: prices.length ? Math.max(...prices) : 0,
  };
}

function pickType(m) {
  return {
    no: m.MODEL_NO,
    type: m.HOUSE_TY || "",
    supplyArea: Number(m.SUPLY_AR) || 0,
    households: Number(m.SUPLY_HSHLDCO) || 0,
    special: Number(m.SPSPLY_HSHLDCO) || 0,
    price: Number(m.LTTOT_TOP_AMOUNT) || 0,          // 만원, 최고 분양가
    specialBreakdown: {
      multiChild: Number(m.MNYCH_HSHLDCO) || 0,
      newlywed: Number(m.NWWDS_HSHLDCO) || 0,
      firstLife: Number(m.LFE_FRST_HSHLDCO) || 0,
      elderly: Number(m.OLD_PARNTS_SUPORT_HSHLDCO) || 0,
      institution: Number(m.INSTT_RECOMEND_HSHLDCO) || 0,
      newborn: Number(m.NWBB_HSHLDCO) || 0,
      youth: Number(m.YGMN_HSHLDCO) || 0,
      relocation: Number(m.TRANSR_INSTT_ENFSN_HSHLDCO) || 0,
    },
  };
}

async function main() {
  const details = await all("getAPTLttotPblancDetail", {
    "cond[RCEPT_BGNDE::GTE]": iso(shift(-45)),
    "cond[RCEPT_BGNDE::LTE]": iso(shift(75)),
  });
  const apt = details.filter((d) => d.HOUSE_NM && d.RENT_SECD === "0"); // 분양주택만
  if (!apt.length) throw new Error("단지 0건 — 기존 파일 유지");
  const items = [];
  for (const d of apt) {
    const models = await all("getAPTLttotPblancMdl", { "cond[HOUSE_MANAGE_NO::EQ]": d.HOUSE_MANAGE_NO });
    items.push(pick(d, models.filter((m) => m.PBLANC_NO === d.PBLANC_NO).map(pickType)));
    await new Promise((r) => setTimeout(r, 120)); // 호출 간격 — 공공 API 예의
  }
  items.sort((a, b) => (a.schedule.receipt?.[0] || "").localeCompare(b.schedule.receipt?.[0] || ""));
  const prev = await readFile(OUT, "utf8").catch(() => "");
  const next = JSON.stringify({ basis: iso(today), source: "한국부동산원 청약홈 (공공데이터포털)", items }, null, 1);
  if (prev && JSON.parse(prev).items?.length === items.length && JSON.parse(prev).items.every((p, i) => JSON.stringify(p) === JSON.stringify(items[i]))) {
    console.log(`변경 없음 (${items.length}단지)`); return;
  }
  await writeFile(OUT, next);
  console.log(`저장 ${items.length}단지, 기준일 ${iso(today)}`);
}

main().catch((e) => { console.error("실패:", e.message); process.exit(1); });
