import { NextRequest } from "next/server";
import { byId, Cheongyak } from "@/lib/cheongyak";

// 관심 단지 일정 → .ics (2026-10-12). 개인정보 없음, 단지 ID만. 달력 앱에 구독 주소로 넣으면 매일 빌드된 데이터로 갱신됨.
const esc = (s: string) => s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
const d8 = (d: string) => d.replace(/-/g, "");
const next = (d: string) => { const x = new Date(d + "T00:00:00Z"); x.setUTCDate(x.getUTCDate() + 1); return x.toISOString().slice(0, 10).replace(/-/g, ""); };

function events(c: Cheongyak) {
  const rows: [string, string, string][] = [];
  const add = (label: string, r: [string, string] | null | string) => {
    if (!r) return;
    const [b, e] = typeof r === "string" ? [r, r] : r;
    if (b) rows.push([label, b, e || b]);
  };
  add("특별공급 접수", c.schedule.special); add("1순위 접수", c.schedule.rank1); add("2순위 접수", c.schedule.rank2);
  add("당첨자 발표", c.schedule.announce); add("계약 체결", c.schedule.contract);
  return rows.map(([label, b, e]) => [
    "BEGIN:VEVENT", `UID:${c.id}-${d8(b)}-${label.length}@fundmoney8.com`, `DTSTAMP:${d8(b)}T000000Z`,
    `DTSTART;VALUE=DATE:${d8(b)}`, `DTEND;VALUE=DATE:${next(e)}`,
    `SUMMARY:${esc(`[청약] ${c.name} ${label}`)}`, `DESCRIPTION:${esc(`${c.name} (${c.sido}) ${label}\n청약홈: ${c.pblancUrl}\n단지 정보: https://apt.bluepalpal.com/cheongyak/${c.id}`)}`,
    `URL:https://apt.bluepalpal.com/cheongyak/${c.id}`, "END:VEVENT",
  ].join("\r\n"));
}

export function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 50);
  const list = ids.map(byId).filter((c): c is Cheongyak => !!c);
  if (!list.length) return new Response("ids 필요", { status: 400 });
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//fundmoney8//cheongyak//KO", "CALSCALE:GREGORIAN", "X-WR-CALNAME:청약 일정 (펀드머니)", ...list.flatMap(events), "END:VCALENDAR"].join("\r\n");
  return new Response(body, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": `attachment; filename="cheongyak-${ids.length === 1 ? ids[0] : "list"}.ics"`, "Cache-Control": "public, max-age=3600" } });
}
