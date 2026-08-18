"use client";

import { ArrowDown, Flame, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Fire Map", href: "#fire-map" },
  { name: "Predict", href: "#predictor" },
  { name: "Impact", href: "#impact" },
  { name: "Organizations", href: "#organizations" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-4 pt-5 md:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-5 py-3 backdrop-blur-xl md:px-6">
        
        {/* Logo */}
        <a
          href="#home"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500">
            <Flame size={20} className="text-black" />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              Forest<span className="text-emerald-400">Guard</span>
            </p>
            <p className="hidden text-[9px] uppercase tracking-[0.2em] text-white/40 sm:block">
              Fire intelligence
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href="#predictor"
          className="hidden items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-300 md:flex"
        >
          Predict Risk
          <ArrowDown size={15} />
        </a>

        {/* Mobile button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl border border-white/10 p-2 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-black/80 p-3 backdrop-blur-xl md:hidden">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {item.name}
            </a>
          ))}

          <a
            href="#predictor"
            onClick={closeMenu}
            className="mt-2 block rounded-xl bg-emerald-400 px-4 py-3 text-center text-sm font-semibold text-black"
          >
            Predict Fire Risk
          </a>
        </div>
      )}
    </header>
  );
}