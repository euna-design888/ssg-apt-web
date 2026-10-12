'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 쓱보는 청약 내비 (Hallmark N1b · 3링크, 10/12). 모바일은 브랜드 + 버튼만.
const LINKS: [string, string][] = [['/cheongyak/this-week', '이번 주 접수'], ['/cheongyak/region', '전국·지역별'], ['/#calculator', '가점 계산기']];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  useEffect(() => {
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24)); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <header className={`sb-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="sb-nav__inner">
        <Link href="/" className="sb-nav__brand" aria-label="쓱보는 청약 홈"><span className="sb-nav__mark" aria-hidden="true" />쓱보는 청약</Link>
        <nav className="sb-nav__center" aria-label="주요 메뉴">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="sb-nav__link" aria-current={path === href.split('#')[0] && !href.includes('#') ? 'page' : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="sb-nav__right">
          <a href="/#calculator" className="sb-btn sb-btn--primary">내 가점 계산</a>
        </div>
      </div>
    </header>
  );
}
