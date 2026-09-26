/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Heart, Sparkles, X, Quote } from 'lucide-react';
import { LoveLetter } from '../types';
import { formatPortugueseDate } from '../utils/date';

interface LoveMessagesSectionProps {
  messages: LoveLetter[];
  partnerName: string;
}

export const LoveMessagesSection: React.FC<LoveMessagesSectionProps> = ({
  messages,
  partnerName,
}) => {
  const [activeLetter, setActiveLetter] = useState<LoveLetter | null>(null);

  return (
    <section id="mensagens" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold">
          Declarações Sinceras
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 text-balance">
          Para Você, {partnerName} ❤️
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
          Cartas escritas do fundo da minha alma para lembrar todos os dias o quanto
          você é amada, admirada e essencial em tudo o que sou.
        </p>
      </div>

      {/* Love Letters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {messages.map((letter) => (
          <div
            key={letter.id}
            onClick={() => setActiveLetter(letter)}
            className={`relative group cursor-pointer p-7 rounded-3xl transition-all duration-300 flex flex-col justify-between ${
              letter.isFeatured
                ? 'bg-gradient-to-br from-rose-900 to-stone-950 text-white shadow-xl hover:-translate-y-1'
                : 'bg-white border border-rose-100 text-stone-800 shadow-xs hover:shadow-lg hover:-translate-y-1'
            }`}
          >
            {/* Top indicator */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-2.5 rounded-full ${
                  letter.isFeatured
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                <Mail className="w-5 h-5" />
              </div>
              <span
                className={`text-xs ${
                  letter.isFeatured ? 'text-rose-200' : 'text-stone-500'
                }`}
              >
                {formatPortugueseDate(letter.date)}
              </span>
            </div>

            {/* Letter content preview */}
            <div className="space-y-2 mb-6">
              <h3
                className={`font-serif text-xl sm:text-2xl font-bold ${
                  letter.isFeatured ? 'text-white' : 'text-stone-900'
                }`}
              >
                {letter.title}
              </h3>
              <p
                className={`text-sm leading-relaxed line-clamp-4 ${
                  letter.isFeatured ? 'text-rose-100/90' : 'text-stone-600'
                }`}
              >
                {letter.message}
              </p>
            </div>

            {/* Footer / Read more */}
            <div className="pt-4 border-t border-rose-100/20 flex items-center justify-between text-xs font-semibold">
              <span className={letter.isFeatured ? 'text-rose-200' : 'text-rose-800'}>
                {letter.author || 'Seu eterno amor'}
              </span>
              <span
                className={`inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform ${
                  letter.isFeatured ? 'text-rose-300' : 'text-rose-600'
                }`}
              >
                Abrir carta <Heart className="w-3.5 h-3.5 fill-current" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Letter Reading Modal */}
      {activeLetter && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setActiveLetter(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#FAF7F2] rounded-3xl p-8 sm:p-10 shadow-2xl border border-amber-900/10 text-stone-800 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActiveLetter(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
              aria-label="Fechar carta"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="border-b border-rose-200/60 pb-5 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Carta de Amor</span>
                <span aria-hidden="true">·</span>
                <span>{formatPortugueseDate(activeLetter.date)}</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {activeLetter.title}
              </h3>
            </div>

            {/* Full Letter Body */}
            <div className="relative py-2">
              <Quote className="w-10 h-10 text-rose-200 absolute -top-4 -left-3 pointer-events-none opacity-50" />
              <p className="font-serif text-lg sm:text-xl text-stone-800 leading-relaxed whitespace-pre-line relative z-10 pl-3">
                {activeLetter.message}
              </p>
            </div>

            {/* Signature & Seal */}
            <div className="pt-6 border-t border-rose-200/60 flex items-center justify-between">
              <div>
                <p className="font-serif italic text-base sm:text-lg text-rose-900 font-semibold">
                  {activeLetter.author || 'Com todo meu amor'}
                </p>
                <p className="text-xs text-stone-500">Para sempre ao seu lado</p>
              </div>

              {/* Romantic Seal Icon */}
              <div className="w-12 h-12 rounded-full bg-rose-700 text-white flex items-center justify-center shadow-md border-2 border-rose-300">
                <Heart className="w-6 h-6 fill-white" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
