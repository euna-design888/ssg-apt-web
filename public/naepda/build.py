"""냅다 담기 상품 허브 — products.json → index.html (정적 1장). 사용: python build.py → bash ../deploy.sh WEB_냅다담기 naepda "msg"
규칙(WEB_수익사이트/CLAUDE.md): 본문 17px·최소 14px, 누르는 곳 52px, 경로는 절대경로(/naepda/...), 광고는 결과 화면에만 → 이 허브는 광고 0칸이라 애드센스 스크립트를 넣지 않는다.
"""
import json, html, pathlib
from datetime import date

HERE = pathlib.Path(__file__).parent
D = json.loads((HERE / "products.json").read_text("utf-8"))
BASE = "https://www.fundmoney8.com/naepda"
CH = D["channel"]
e = html.escape

CSS = """
*{box-sizing:border-box;min-width:0}
body{margin:0;background:#f6f7f9;color:#111;font:17px/1.5 "Pretendard Variable",Pretendard,-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;word-break:keep-all;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:560px;margin:0 auto;padding:0 16px 48px}
.top{padding:26px 0 14px;display:flex;align-items:center;gap:12px}
.top .yt{width:48px;height:48px;border-radius:14px;background:#ff0000;display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.top .yt i{display:block;width:0;height:0;border-left:16px solid #fff;border-top:10px solid transparent;border-bottom:10px solid transparent;margin-left:4px}
.top h1{font-size:24px;margin:0;line-height:1.2;font-weight:800}
.top p{margin:2px 0 0;font-size:14px;color:#4b5563}
.disc{font-size:14px;color:#4b5563;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:10px 14px;margin:0 0 14px}
.card{display:block;background:#fff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;margin-bottom:14px;box-shadow:0 1px 0 rgba(17,24,39,.04)}
.ph{position:relative;background:#fff;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;border-bottom:1px solid #f0f1f3}
.ph img{width:100%;height:100%;object-fit:contain;display:block}
.ph .no{position:absolute;left:14px;top:14px;background:#111;color:#fff;font-weight:800;font-size:15px;padding:6px 11px;border-radius:999px}
.ph .no small{font-weight:600;opacity:.8;margin-left:2px}
.ph .rk{position:absolute;right:14px;top:14px;background:#2457f5;color:#fff;font-size:13px;font-weight:800;padding:5px 10px;border-radius:999px}
.ph .nophoto{color:#9ca3af;font-size:15px;font-weight:700}
.bd{padding:14px 16px 16px}
.hook{font-size:14px;color:#2457f5;font-weight:800;margin:0 0 4px}
.nm{font-size:18px;font-weight:800;line-height:1.3;margin:0 0 8px}
.pr{display:flex;align-items:baseline;gap:8px;margin:0 0 6px}
.pr b{font-size:26px;letter-spacing:-.5px}
.pr small{font-size:13px;color:#6b7280}
.note{font-size:14px;color:#4b5563;margin:0 0 12px;line-height:1.45}
.btn{display:flex;align-items:center;justify-content:center;min-height:54px;border-radius:14px;background:#111;color:#fff;font-size:17px;font-weight:800}
.btn:active{transform:translateY(1px)}
.foot{font-size:13px;color:#6b7280;text-align:center;padding:18px 0 0;line-height:1.7}
.foot a{text-decoration:underline}
"""

def card(it):
    img = f'<img src="{e(it["image"])}" alt="{e(it["name"])}" loading="lazy">' if it.get("image") else '<span class="nophoto">사진 준비 중</span>'
    rk = '<span class="rk">로켓배송</span>' if it.get("rocket") else ""
    note = f'<p class="note">{e(it["note"])}</p>' if it.get("note") else ""
    return f'''<article class="card" id="n{it["no"]}">
<a class="ph" href="{e(it["link"])}" rel="nofollow sponsored noopener" target="_blank" onclick="ev('buy_click',{{no:{it["no"]},where:'image'}})"><span class="no">{it["no"]}<small>편</small></span>{rk}{img}</a>
<div class="bd"><p class="hook">{e(it.get("hook",""))}</p><h2 class="nm">{e(it["name"])}</h2>
<p class="pr"><b>{e(it["price"])}</b><small>{e(it["price_date"])} 기준 · 바뀔 수 있음</small></p>{note}
<a class="btn" href="{e(it["link"])}" rel="nofollow sponsored noopener" target="_blank" onclick="ev('buy_click',{{no:{it["no"]},where:'button'}})">쿠팡에서 구매하러 가기</a></div>
</article>'''

items = sorted(D["items"], key=lambda x: -x["no"])
cards = "\n".join(card(i) for i in items)
title = f"{CH['name']} 영상 속 제품 — 번호 그대로"
desc = f"유튜브 {CH['name']} 쇼핑쇼츠에 나온 제품을 영상 번호 그대로 모았습니다. 가격은 확인일 기준, 쿠팡 파트너스 링크."
page = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{BASE}">
<meta property="og:type" content="website"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{BASE}"><meta property="og:image" content="{BASE}/og.png"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23111'/><text x='50' y='70' font-size='56' text-anchor='middle' fill='%23fff' font-weight='800'>담</text></svg>">
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<style>{CSS}</style>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-78JGV6PB8S"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','G-78JGV6PB8S');function ev(n,p){{try{{gtag('event',n,p||{{}})}}catch(_){{}}}}</script>
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"ItemList","name":title,"url":BASE,"itemListElement":[{"@type":"ListItem","position":i+1,"name":it["name"],"url":f"{BASE}#n{it['no']}"} for i,it in enumerate(items)]},ensure_ascii=False)}</script>
</head><body><main class="wrap">
<header class="top"><a class="yt" href="{e(CH['url'])}" target="_blank" rel="noopener" aria-label="유튜브 채널"><i></i></a><div><h1>{e(CH['name'])} 영상 속 제품</h1><p>영상 번호 = 제품 번호 · {e(D['updated'])} 확인</p></div></header>
<p class="disc">이 페이지의 링크는 쿠팡 파트너스 활동의 일환으로, 구매 시 일정액의 수수료를 받습니다. 가격은 각 제품의 확인일 기준이며 바뀔 수 있습니다.</p>
{cards}
<footer class="foot">영상에서 번호를 보고 같은 번호를 누르면 됩니다.<br><a href="{e(CH['url'])}" target="_blank" rel="noopener">유튜브 {e(CH['handle'])}</a> · <a href="https://bluepalpal.com/about/">운영자</a> · <a href="https://bluepalpal.com/privacy/">개인정보처리방침</a></footer>
</main></body></html>'''
(HERE / "index.html").write_text(page, "utf-8")
print("index.html", len(page), "bytes ·", len(items), "items ·", sum(1 for i in items if not i.get("image")), "without image")
