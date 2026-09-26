/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Camera, BookmarkCheck, Mail } from 'lucide-react';

interface StatsCounterProps {
  totalDays: number;
  totalPhotos: number;
  totalMoments: number;
  totalMessages: number;
}

export const StatsCounter: React.FC<StatsCounterProps> = ({
  totalDays,
  totalPhotos,
  totalMoments,
  totalMessages,
}) => {
  const stats = [
    {
      icon: Heart,
      value: totalDays.toLocaleString('pt-BR'),
      label: 'Dias Juntos',
      description: 'E cada um vale por uma vida',
    },
    {
      icon: Camera,
      value: totalPhotos.toString(),
      label: 'Fotos Registradas',
      description: 'Congelando nossos sorrisos',
    },
    {
      icon: BookmarkCheck,
      value: totalMoments.toString(),
      label: 'Marcos Históricos',
      description: 'Capítulos inesquecíveis',
    },
    {
      icon: Mail,
      value: totalMessages.toString(),
      label: 'Cartas de Amor',
      description: 'Palavras sinceras do coração',
    },
  ];

  return (
    <section className="py-12 bg-[#F5ECE8]/40 border-y border-rose-100/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/60 border border-rose-100/60 shadow-2xs hover:bg-white transition-colors duration-200"
              >
                <div className="p-2.5 rounded-full bg-rose-50 text-rose-700 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tabular-nums">
                  {item.value}
                </span>
                <span className="text-sm font-semibold text-rose-950 mt-1">
                  {item.label}
                </span>
                <span className="text-xs text-stone-500 mt-0.5">
                  {item.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
