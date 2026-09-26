/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Lock } from 'lucide-react';

interface FooterProps {
  coupleName: string;
  onOpenAdmin: () => void;
  floatingHeartsEnabled: boolean;
  onToggleFloatingHearts: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  coupleName,
  onOpenAdmin,
  floatingHeartsEnabled,
  onToggleFloatingHearts,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Brand & romantic quote */}
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/40" />
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              {coupleName}
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-sm">
            Um refúgio digital de todas as memórias, sorrisos e juras de amor que
            marcam nossa vida a dois.
          </p>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
          <a href="#inicio" className="hover:text-rose-400 transition-colors">
            Início
          </a>
          <a href="#historia" className="hover:text-rose-400 transition-colors">
            Nossa História
          </a>
          <a href="#galeria" className="hover:text-rose-400 transition-colors">
            Galeria
          </a>
          <a href="#mensagens" className="hover:text-rose-400 transition-colors">
            Para Você
          </a>
          <a href="#esposa" className="hover:text-rose-400 transition-colors">
            Ela
          </a>

          {/* Toggle floating hearts */}
          <button
            type="button"
            onClick={onToggleFloatingHearts}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {floatingHeartsEnabled ? 'Ocultar corações' : 'Mostrar corações'}
          </button>
        </div>

        {/* Admin trigger button & copyright */}
        <div className="space-y-2 text-center md:text-right">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-full transition-colors border border-stone-700 cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>Gerenciar Álbum</span>
          </button>
          <p className="text-[11px] text-stone-500">
            Feito com amor eterno ❤️ {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};
