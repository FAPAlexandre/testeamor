/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { CoupleProfile } from '../types';

interface WifeProfileCardProps {
  couple: CoupleProfile;
}

export const WifeProfileCard: React.FC<WifeProfileCardProps> = ({ couple }) => {
  return (
    <section id="esposa" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="relative bg-gradient-to-r from-rose-900 via-rose-950 to-stone-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 sm:gap-12">
          {/* Portrait Frame */}
          <div className="relative shrink-0">
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-4 ring-rose-400/40 shadow-2xl bg-stone-800">
              <img
                src={couple.partnerPhoto}
                alt={couple.partnerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 p-2 bg-rose-600 rounded-full text-white shadow-md border-2 border-white/40">
              <Heart className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* Emotional biography */}
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rose-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Minha Esposa & Meu Amor</span>
            </div>

            <div>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {couple.partnerName}
              </h3>
              {couple.partnerNickname && (
                <p className="font-serif italic text-lg sm:text-xl text-rose-200 mt-0.5">
                  &ldquo;{couple.partnerNickname}&rdquo;
                </p>
              )}
            </div>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {couple.partnerBio}
            </p>

            <div className="pt-2 text-xs text-rose-300/80 font-medium">
              Eternamente apaixonado por você · {couple.husbandName}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
