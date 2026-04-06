'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo" onClick={closeMenu}>
          Midway Baptist Church
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          Menu
        </button>

        <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
          <Link href="/" onClick={closeMenu}>Home</Link>
          <Link href="/about" onClick={closeMenu}>About</Link>
          <Link href="/sermons" onClick={closeMenu}>Sermons</Link>
          <Link href="/events" onClick={closeMenu}>Events</Link>
          <Link href="/prayer" onClick={closeMenu}>Prayer</Link>
          <Link href="/visit" onClick={closeMenu}>Connect</Link>
          <Link href="/give" onClick={closeMenu}>Give</Link>
          <Link href="/live" onClick={closeMenu}>Live</Link>
          <Link href="/contact" onClick={closeMenu}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}