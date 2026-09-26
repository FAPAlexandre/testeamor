/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Heart,
  Plane,
  Home,
  Sparkles,
  Star,
  Gift,
  Camera,
  Music,
  Coffee,
  Calendar,
  Gem,
} from 'lucide-react';
import { TimelineMilestone, TimelineIconType } from '../types';
import { formatPortugueseDate } from '../utils/date';

interface TimelineSectionProps {
  timeline: TimelineMilestone[];
  onOpenPhoto?: (imageUrl: string, title: string, caption?: string) => void;
}

const ICON_MAP: Record<TimelineIconType, React.ElementType> = {
  heart: Heart,
  plane: Plane,
  ring: Gem,
  home: Home,
  sparkles: Sparkles,
  star: Star,
  gift: Gift,
  camera: Camera,
  music: Music,
  coffee: Coffee,
};

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  timeline,
  onOpenPhoto,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Sort milestones chronologically by date
  const sortedTimeline = useMemo(() => {
    return [...timeline].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  }, [timeline]);

  // Extract distinct years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    sortedTimeline.forEach((t) => {
      if (t.year) years.add(t.year);
      else if (t.date) {
        const y = t.date.split('-')[0];
        if (y) years.add(y);
      }
    });
    return Array.from(years).sort();
  }, [sortedTimeline]);

  const filteredTimeline = useMemo(() => {
    if (selectedYear === 'all') return sortedTimeline;
    return sortedTimeline.filter((t) => {
      const yr = t.year || t.date?.split('-')[0];
      return yr === selectedYear;
    });
  }, [sortedTimeline, selectedYear]);

  return (
    <section id="historia" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold">
          Linha do Tempo
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 text-balance">
          Nossa História
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
          Cada passo que demos nos trouxe até aqui. Relembrando os capítulos, viagens,
          conquistas e juras de amor que construíram nossa vida.
        </p>

        {/* Year Filter Buttons (interactive controls allowed with clean segmented design) */}
        {availableYears.length > 1 && (
          <div className="pt-4 flex items-center justify-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedYear('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
                selectedYear === 'all'
                  ? 'bg-rose-800 text-white shadow-xs'
                  : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white border border-stone-200'
              }`}
            >
              Todos os Anos ({sortedTimeline.length})
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  selectedYear === year
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white border border-stone-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Road/Tree */}
      <div className="relative">
        {/* Central hairline line on desktop, left line on mobile */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-px bg-rose-200 -translate-x-1/2 pointer-events-none" />

        <div className="space-y-12">
          {filteredTimeline.map((item, index) => {
            const isEven = index % 2 === 0;
            const IconComponent = ICON_MAP[item.icon] || Heart;

            return (
              <div
                key={item.id}
                className="relative flex flex-col md:flex-row items-start md:items-center group"
              >
                {/* Node marker with icon */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 w-11 h-11 rounded-full bg-white border-2 border-rose-300 shadow-md flex items-center justify-center text-rose-700 group-hover:scale-110 group-hover:border-rose-600 transition-all duration-300">
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Content card left/right positioning */}
                <div
                  className={`w-full md:w-1/2 pl-14 md:pl-0 ${
                    isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto md:text-left'
                  }`}
                >
                  <div className="bg-white/90 backdrop-blur-xs p-6 sm:p-7 rounded-3xl border border-rose-100 shadow-xs hover:shadow-md transition-shadow duration-300 space-y-3">
                    {/* Unboxed date metadata */}
                    <div
                      className={`flex items-center gap-2 text-xs font-medium text-rose-800 ${
                        isEven ? 'md:justify-end' : 'md:justify-start'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      <span>{formatPortugueseDate(item.date)}</span>
                      {item.year && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-rose-950">{item.year}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                      {item.title}
                    </h3>

                    <p className="text-stone-600 text-sm leading-relaxed">
                      {item.description}
                    </p>

                    {/* Milestone Image if available */}
                    {item.image && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => onOpenPhoto?.(item.image!, item.title, item.description)}
                          className="relative rounded-2xl overflow-hidden aspect-16/9 w-full group/img focus-visible:outline-rose-400 block text-left"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-stone-900/10 group-hover/img:bg-transparent transition-colors" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
