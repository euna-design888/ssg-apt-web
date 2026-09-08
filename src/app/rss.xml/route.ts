import rawApartments from '@/data/apartments.json';
import { Apartment } from '@/types/apartment';

export async function GET() {
  const baseUrl = 'https://www.fundmoney8.com';
  const apartments = rawApartments as Apartment[];

  const itemsXml = apartments
    .map((apt) => {
      return `
    <item>
      <title><![CDATA[${apt.name} 분양가·안전마진 & 실시간 청약 정보]]></title>
      <link>${baseUrl}/apt/${encodeURIComponent(apt.id)}</link>
      <description><![CDATA[${apt.name} 분양가 ${apt.priceMin}만원, 안전마진 약 ${(apt.safetyMargin / 10000).toFixed(1)}억 원, 실질 DSR 주담대 한도 및 팩트체크 분석 리포트]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid>${baseUrl}/apt/${encodeURIComponent(apt.id)}</guid>
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>쓱보는 청약 (AptFact)</title>
    <link>${baseUrl}</link>
    <description>2026 수도권 핫 아파트 분양가 안전마진 및 청약 가점 계산기 포털</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
