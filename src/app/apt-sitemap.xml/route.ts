import { ITEMS, BASIS, SIDO_SLUG, sidoCounts } from "@/lib/cheongyak";

// apt.bluepalpal.com 전용 사이트맵 (next.config.ts가 이 호스트의 /sitemap.xml을 여기로 연결). 2026-10-16 도메인 개편
const BASE = "https://apt.bluepalpal.com";
const COMPLEXES = ["복정역세권-B1", "인천계양-A6", "파주운정3-A20", "의왕월암-A1", "수원당수-A5", "고양장항-A1", "성남복정2-A1", "군포대야미-A2"];

export const dynamic = "force-static";

export function GET() {
  const day = new Date(BASIS).toISOString().slice(0, 10);
  const counts = sidoCounts();
  const paths = [
    "/",
    "/cheongyak/this-week",
    "/cheongyak/region",
    ...Object.entries(SIDO_SLUG).filter(([name]) => (counts[name] || 0) > 0).map(([, s]) => `/cheongyak/region/${s}`),
    ...ITEMS.map((c) => `/cheongyak/${c.id}`),
    "/onnuri",
    ...COMPLEXES.map((id) => `/apt/${encodeURIComponent(id)}`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `<url><loc>${BASE}${p === "/" ? "" : p}${p === "/" ? "/" : ""}</loc><lastmod>${day}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
