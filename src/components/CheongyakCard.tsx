import React from "react";
import { Cheongyak, status, STATUS_LABEL, rangeText, money, md } from "@/lib/cheongyak";

// 청약홈 데이터 카드 (2026-10-12). 어르신 규칙: 본문 18px·누르는 곳 52px+
export default function CheongyakCard({ c }: { c: Cheongyak }) {
  const st = status(c);
  return (
    <a href={`/cheongyak/${c.id}`} className="feed-card-link" style={{ display: "block", minHeight: 52 }}>
      <div className="feed-card">
        <div className="card-top-row">
          <div className="card-badges">
            <span className={`status-pill ${st === "applying" ? "status-live" : "status-soon"}`}>{st === "applying" ? "● " : ""}{STATUS_LABEL[st]}</span>
            <span className="category-pill">{c.saleType === "국민" ? "공공분양" : "민영분양"}</span>
          </div>
          <span className="schedule-pill">발표 {md(c.schedule.announce)}</span>
        </div>
        <div className="card-header-block">
          <h3 className="card-complex-name">{c.name}</h3>
          <p className="card-location-text">{c.sido} · 총 {c.supply.toLocaleString()}세대 · 접수 {rangeText(c.schedule.receipt)}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0 4px", fontSize: 18 }}>
          <span style={{ color: "#6b7684" }}>분양가(최고가 기준)</span>
          <b style={{ fontSize: 20 }}>{money(c.priceMin)}{c.priceMax > c.priceMin ? ` ~ ${money(c.priceMax)}` : ""}</b>
        </div>
        <div className="card-footer-action"><span>일정·분양가·특공 세대 보기</span><span className="arrow-icon">→</span></div>
      </div>
    </a>
  );
}
