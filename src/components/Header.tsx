import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-logo">
          <span>🏢 쓱보는 청약</span>
          <span className="brand-badge">팩트·리스크 랩</span>
        </Link>
        <nav className="nav-links">
          <Link href="#calculator" className="nav-calc-btn">
            🧮 청약·DSR 계산기
          </Link>
        </nav>
      </div>
    </header>
  );
}
