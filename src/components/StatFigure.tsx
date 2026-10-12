'use client';

import React, { useEffect, useRef, useState } from 'react';

// Stat-Led 히어로 숫자 카운트 (0 → 값, 1.2초, ease-out). 움직임 줄이기 설정이면 바로 최종값.
export default function StatFigure({ value }: { value: number }) {
  const [n, setN] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches || value === 0) return;
    const start = performance.now(), dur = 1200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setN(0); raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span ref={ref} className="sb-tnum">{n}</span>;
}
