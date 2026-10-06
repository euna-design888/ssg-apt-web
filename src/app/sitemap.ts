import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.fundmoney8.com"; // 대표 주소는 www (루트는 www로 리다이렉트)
  const now = new Date();

  const complexes = [
    "복정역세권-B1",
    "인천계양-A6",
    "파주운정3-A20",
    "의왕월암-A1",
    "수원당수-A5",
    "고양장항-A1",
    "성남복정2-A1",
    "군포대야미-A2",
  ];

  const complexUrls = complexes.map((id) => ({
    url: `${baseUrl}/apt/${encodeURIComponent(id)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/onnuri`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/family`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...["/airport", "/airport/incheon.html", "/airport/gimpo.html"].map((p) => ({
      url: `${baseUrl}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // 축제 가는 법 (원본 festival-guide 레포, 목록은 WEB_축제길잡이/sitemap_경로.md) — 대표 주소 www로 직접
    ...["", "/geumsan-insam.html", "/baekje-culture.html", "/jinju-lantern.html", "/hoengseong-hanwoo.html",
      "/boeun-jujube.html", "/daejeon-bread.html", "/mungyeong-apple.html", "/sacheon-airshow.html",
      "/gimcheon-gimbap.html", "/cheongsong-apple.html", "/busan-fireworks.html",
      ...["seoul", "busan", "daegu", "incheon", "gwangju", "daejeon", "ulsan", "sejong", "gyeonggi", "gangwon",
        "chungbuk", "chungnam", "jeonbuk", "jeonnam", "gyeongbuk", "gyeongnam", "jeju"].map((r) => `/region/${r}.html`),
    ].map((p) => ({
      url: `https://www.fundmoney8.com/festival${p}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: p.startsWith("/region") ? 0.7 : 0.8,
    })),
    // 캠핑 길잡이 (원본 camping-guide 레포, 상세 목록은 WEB_캠핑길잡이/sitemap_경로.md)
    ...["", "/foresttrip-national-weekend-lottery-nov.html", "/foresttrip-yumyeongsan.html", "/foresttrip-cheongtaesan.html",
      "/foresttrip-saneum.html", "/foresttrip-daegwallyeong.html", "/foresttrip-jungmisan.html",
      "/knps-seoraksan-seorakdong.html", "/knps-jirisan-dalgung.html", "/knps-chiaksan-guryong.html",
      "/knps-taean-mongsanpo-hakampo.html", "/knps-bukhansan-sagimak.html",
      "/seoul-noeul-camping.html", "/seoul-jungnang-camping-forest.html",
      "/gapyeong-jaraseom-autocamping.html", "/yeoncheon-hantangang-autocamping.html"].map((p) => ({
      url: `https://www.fundmoney8.com/camping${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 },
    ...complexUrls,
  ];
}
