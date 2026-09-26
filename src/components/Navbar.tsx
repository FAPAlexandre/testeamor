/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Lock, Menu, X, Music } from 'lucide-react';

interface NavbarProps {
  coupleName: string;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onToggleMusicPlay?: () => void;
  isMusicPlaying?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  coupleName,
  onOpenAdmin,
  isAdminLoggedIn,
  onToggleMusicPlay,
  isMusicPlaying,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF7F5]/90 backdrop-blur-md border-b border-rose-100/60 shadow-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#inicio"
            className="flex items-center gap-2 group focus-visible:outline-hidden"
          >
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600/30 transition-transform duration-300 group-hover:scale-110" />
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 group-hover:text-rose-900 transition-colors truncate max-w-[200px] sm:max-w-xs">
              {coupleName}
            </span>
          </a>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <a
              href="#inicio"
              className="hover:text-rose-700 transition-colors whitespace-nowrap"
            >
              Início
            </a>
            <a
              href="#historia"
              className="hover:text-rose-700 transition-colors whitespace-nowrap"
            >
              Nossa História
            </a>
            <a
              href="#galeria"
              className="hover:text-rose-700 transition-colors whitespace-nowrap"
            >
              Galeria
            </a>
            <a
              href="#mensagens"
              className="hover:text-rose-700 transition-colors whitespace-nowrap"
            >
              Para Você
            </a>
            <a
              href="#esposa"
              className="hover:text-rose-700 transition-colors whitespace-nowrap"
            >
              Ela
            </a>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {onToggleMusicPlay && (
              <button
                type="button"
                onClick={onToggleMusicPlay}
                title={isMusicPlaying ? 'Pausar música' : 'Tocar música'}
                className="p-2 text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors hidden sm:flex items-center justify-center focus-visible:outline-rose-400"
              >
                <Music
                  className={`w-4 h-4 ${
                    isMusicPlaying ? 'text-rose-600 animate-pulse' : ''
                  }`}
                />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAdmin}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap shadow-xs ${
                isAdminLoggedIn
                  ? 'bg-rose-700 text-white hover:bg-rose-800'
                  : 'bg-stone-900 text-stone-100 hover:bg-stone-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Painel do Casal' : 'Administrar'}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-rose-800 focus:outline-hidden"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F5] border-b border-rose-100 px-4 pt-3 pb-5 space-y-2 animate-fadeIn shadow-lg">
          <a
            href="#inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-rose-700"
          >
            Início
          </a>
          <a
            href="#historia"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-rose-700"
          >
            Nossa História
          </a>
          <a
            href="#galeria"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-rose-700"
          >
            Galeria de Fotos
          </a>
          <a
            href="#mensagens"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-rose-700"
          >
            Para Você ❤️
          </a>
          <a
            href="#esposa"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-stone-700 hover:text-rose-700"
          >
            Minha Esposa
          </a>
        </div>
      )}
    </header>
  );
};
