/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calendar,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
} from 'lucide-react';
import { PhotoItem } from '../types';
import { formatPortugueseDate } from '../utils/date';

interface GallerySectionProps {
  photos: PhotoItem[];
}

type GalleryViewMode = 'natural' | 'standard';

export const GallerySection: React.FC<GallerySectionProps> = ({ photos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<GalleryViewMode>('natural');

  // Extract unique categories
  const categories = useMemo(() => {
    const list = new Set<string>();
    list.add('Todas');
    photos.forEach((p) => {
      if (p.category) list.add(p.category);
    });
    return Array.from(list);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'Todas') return photos;
    return photos.filter((p) => p.category === selectedCategory);
  }, [photos, selectedCategory]);

  const currentLightboxPhoto =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const handleNextPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filteredPhotos.length : null
    );
  }, [lightboxIndex, filteredPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        : null
    );
  }, [lightboxIndex, filteredPhotos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNextPhoto, handlePrevPhoto]);

  return (
    <section id="galeria" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold">
          Nossas Memórias
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 text-balance">
          Galeria de Fotos
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed text-balance">
          Pedaços congelados do tempo que contam quem somos quando estamos juntos.
          Cada imagem guarda um sentimento eterno e completo.
        </p>

        {/* Categories Tabs & Layout Mode Switcher */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {categories.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-rose-800 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  {cat} {cat === 'Todas' ? `(${photos.length})` : ''}
                </button>
              ))}
            </div>
          )}

          {/* View mode toggle */}
          <div className="inline-flex items-center bg-white/80 border border-stone-200 rounded-full p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('natural')}
              title="Exibir fotos inteiras sem nenhum corte"
              className={`px-3.5 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                viewMode === 'natural'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Foto Inteira (Sem Cortes)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('standard')}
              title="Exibir fotos no formato de grade uniforme"
              className={`px-3.5 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                viewMode === 'standard'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Grade Padrão
            </button>
          </div>
        </div>
      </div>

      {/* Photography Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl border border-stone-200">
          <Heart className="w-8 h-8 text-rose-300 mx-auto mb-3" />
          <p className="text-stone-600 text-sm font-medium">
            Nenhuma foto encontrada nesta categoria.
          </p>
        </div>
      ) : viewMode === 'natural' ? (
        /* Modo 1: Foto Inteira Sem Cortes (Mostra 100% da imagem, com fundo suave elegante para fotos verticais e horizontais) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          {filteredPhotos.map((photo, index) => {
            const posClass =
              photo.objectPosition === 'top'
                ? 'object-top'
                : photo.objectPosition === 'bottom'
                ? 'object-bottom'
                : 'object-center';

            return (
              <article
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Frame com foto inteira nítida e fundo suave acolhedor para fotos verticais ou horizontais */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-950 flex items-center justify-center">
                  {/* Fundo desfocado artístico elegante da própria foto */}
                  <img
                    src={photo.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110 pointer-events-none"
                  />

                  {/* Foto principal inteira sem cortar rostos nem bordas */}
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className={`relative z-10 max-h-full max-w-full object-contain ${posClass} transition-transform duration-500 group-hover:scale-102`}
                  />

                  <div className="absolute inset-0 z-20 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 bg-white/90 rounded-full text-stone-900 shadow-md">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>

                  {photo.isFeatured && (
                    <div className="absolute top-3 right-3 z-30 bg-rose-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-white" />
                      <span>Destaque</span>
                    </div>
                  )}
                </div>

                {/* Photo Card Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <span className="flex items-center gap-1 text-rose-800">
                        <Calendar className="w-3 h-3 text-rose-600" />
                        {formatPortugueseDate(photo.date)}
                      </span>
                      {photo.category && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-600">{photo.category}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-rose-800 transition-colors">
                      {photo.title}
                    </h3>

                    {photo.caption && (
                      <p className="text-stone-600 text-sm italic leading-relaxed line-clamp-2">
                        &ldquo;{photo.caption}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="pt-2 text-xs font-medium text-rose-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Ampliar fotografia</span>
                    <span>→</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Modo 2: Grade Padrão com foco inteligente no topo/rosto para não cortar cabeças */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPhotos.map((photo, index) => {
            const posClass =
              photo.objectPosition === 'bottom'
                ? 'object-bottom'
                : photo.objectPosition === 'center'
                ? 'object-center'
                : 'object-top'; // Default top-centered so faces and heads are never cropped

            const fitClass =
              photo.fitMode === 'contain' ? 'object-contain bg-stone-900' : 'object-cover';

            return (
              <article
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image Frame */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full ${fitClass} ${posClass} transition-transform duration-700 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 bg-white/90 rounded-full text-stone-900 shadow-md">
                      <Maximize2 className="w-5 h-5" />
                    </span>
                  </div>

                  {photo.isFeatured && (
                    <div className="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-white" />
                      <span>Destaque</span>
                    </div>
                  )}
                </div>

                {/* Photo Card Details */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                      <span className="flex items-center gap-1 text-rose-800">
                        <Calendar className="w-3 h-3 text-rose-600" />
                        {formatPortugueseDate(photo.date)}
                      </span>
                      {photo.category && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-600">{photo.category}</span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-rose-800 transition-colors">
                      {photo.title}
                    </h3>

                    {photo.caption && (
                      <p className="text-stone-600 text-sm italic leading-relaxed line-clamp-2">
                        &ldquo;{photo.caption}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="pt-2 text-xs font-medium text-rose-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Ampliar fotografia</span>
                    <span>→</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {currentLightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top action bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 text-white">
            <span className="text-xs sm:text-sm font-medium text-stone-300">
              {lightboxIndex! + 1} de {filteredPhotos.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fechar tela cheia"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main image container (Sempre inteira e 100% visível em tela cheia) */}
          <div
            className="relative max-w-5xl max-h-[75vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentLightboxPhoto.image}
              alt={currentLightboxPhoto.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {/* Previous button */}
            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-2 sm:-left-12 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-xs cursor-pointer"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button */}
            {filteredPhotos.length > 1 && (
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2 sm:-right-12 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors backdrop-blur-xs cursor-pointer"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom caption details */}
          <div
            className="mt-4 max-w-2xl w-full text-center text-white space-y-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2 text-xs text-rose-300 font-medium">
              <span>{formatPortugueseDate(currentLightboxPhoto.date)}</span>
              {currentLightboxPhoto.category && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{currentLightboxPhoto.category}</span>
                </>
              )}
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold">
              {currentLightboxPhoto.title}
            </h4>
            {currentLightboxPhoto.caption && (
              <p className="text-sm sm:text-base text-stone-300 italic max-w-xl mx-auto">
                &ldquo;{currentLightboxPhoto.caption}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
