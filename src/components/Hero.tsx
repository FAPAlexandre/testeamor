/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Calendar, ArrowDown } from 'lucide-react';
import { CoupleProfile } from '../types';
import {
  calculateRelationshipDuration,
  formatPortugueseDate,
  TimeDuration,
} from '../utils/date';

interface HeroProps {
  couple: CoupleProfile;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ couple, onExploreClick }) => {
  const [duration, setDuration] = useState<TimeDuration>(() =>
    calculateRelationshipDuration(couple.relationshipStartDate)
  );

  useEffect(() => {
    // Tick every second to update hours, minutes, seconds dynamically
    const interval = setInterval(() => {
      setDuration(calculateRelationshipDuration(couple.relationshipStartDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [couple.relationshipStartDate]);

  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Soft warm romantic background ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto w-full text-center space-y-10 z-20">
        {/* Editorial relationship start date line (unboxed metadata) */}
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm tracking-wide text-rose-800/80 font-medium">
          <Calendar className="w-3.5 h-3.5 text-rose-600" />
          <span>
            Nossa história começou em{' '}
            <strong className="font-semibold text-rose-950">
              {formatPortugueseDate(couple.relationshipStartDate)}
            </strong>
          </span>
        </div>

        {/* Couple title & romantic highlight quote */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-900 leading-[1.08] text-balance">
            {couple.coupleDisplayName}
          </h1>
          <p className="font-serif italic text-lg sm:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed text-balance">
            &ldquo;{couple.heroQuote}&rdquo;
          </p>
        </div>

        {/* Featured romantic main photograph with luxury framing */}
        <div className="relative max-w-3xl mx-auto group">
          <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-stone-900/5 aspect-16/9 bg-stone-950 flex items-center justify-center">
            {/* Soft blurred background for vertical photos */}
            <img
              src={couple.mainPhoto}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
            />
            <img
              src={couple.mainPhoto}
              alt={couple.coupleDisplayName}
              referrerPolicy="no-referrer"
              className="relative z-10 max-h-full max-w-full object-contain md:object-cover md:w-full md:h-full object-top transition-transform duration-700 ease-out group-hover:scale-102"
            />
            {/* Subtle atmospheric gradient scrim for depth */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 left-6 right-6 z-30 text-left text-white drop-shadow-sm flex items-end justify-between">
              <div>
                <p className="font-serif text-lg sm:text-xl font-medium tracking-wide">
                  {couple.partnerNickname || couple.partnerName}
                </p>
                <p className="text-xs sm:text-sm text-stone-200 line-clamp-1 max-w-md">
                  {couple.heroSubtitle}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-rose-200 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Amor Eterno</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live dynamic relationship timer */}
        <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-center gap-2 mb-5 text-stone-700">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-600/50 animate-pulse" />
            <h2 className="text-sm font-semibold tracking-wider uppercase text-rose-900">
              Estamos juntos há exatamente
            </h2>
          </div>

          {/* Time units grid with tabular figures */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-[#FAF7F5] border border-rose-50/80">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tabular-nums">
                {duration.years}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium mt-1">
                {duration.years === 1 ? 'Ano' : 'Anos'}
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-[#FAF7F5] border border-rose-50/80">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tabular-nums">
                {duration.months}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium mt-1">
                {duration.months === 1 ? 'Mês' : 'Meses'}
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-[#FAF7F5] border border-rose-50/80">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tabular-nums">
                {duration.days}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium mt-1">
                {duration.days === 1 ? 'Dia' : 'Dias'}
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-[#FAF7F5] border border-rose-50/80">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tabular-nums">
                {String(duration.hours).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium mt-1">
                Horas
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-[#FAF7F5] border border-rose-50/80">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tabular-nums">
                {String(duration.minutes).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-500 font-medium mt-1">
                Minutos
              </span>
            </div>

            <div className="flex flex-col items-center p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
              <span className="font-serif text-2xl sm:text-4xl font-bold text-rose-700 tabular-nums">
                {String(duration.seconds).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs text-rose-800 font-medium mt-1">
                Segundos
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-stone-400 font-medium">
            Total de {duration.totalDays.toLocaleString('pt-BR')} dias repletos
            de amor, risos e memórias inesquecíveis.
          </p>
        </div>

        {/* Primary CTA button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onExploreClick}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-rose-700 text-white font-medium text-sm sm:text-base hover:bg-rose-800 active:scale-98 transition-all duration-200 shadow-md hover:shadow-lg shadow-rose-900/10 cursor-pointer"
          >
            <span>Ver nossa história</span>
            <Heart className="w-4 h-4 fill-white text-white" />
            <ArrowDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
