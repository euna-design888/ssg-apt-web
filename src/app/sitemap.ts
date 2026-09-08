import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fundmoney8.com";
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
    ...complexUrls,
  ];
}
