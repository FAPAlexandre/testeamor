/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music as MusicIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MusicSettings } from '../types';

interface BackgroundMusicProps {
  music: MusicSettings;
  isPlaying: boolean;
  onTogglePlay: () => void;
  showAutoplayBanner: boolean;
  onDismissAutoplayBanner: () => void;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  music,
  isPlaying,
  onTogglePlay,
  showAutoplayBanner,
  onDismissAutoplayBanner,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(music.volume || 50);
  const [isExpanded, setIsExpanded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Send control command to YouTube iframe via standard postMessage
  const sendPlayerCommand = useCallback((func: string, args: any[] = []) => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      }
    } catch (e) {
      // Cross-origin safe ignore
    }
  }, []);

  // Handle play / pause changes
  useEffect(() => {
    if (!iframeLoaded) return;
    if (isPlaying) {
      sendPlayerCommand('playVideo');
    } else {
      sendPlayerCommand('pauseVideo');
    }
  }, [isPlaying, iframeLoaded, sendPlayerCommand]);

  // Handle volume changes
  useEffect(() => {
    if (!iframeLoaded) return;
    sendPlayerCommand('setVolume', [isMuted ? 0 : volume]);
    if (isMuted) {
      sendPlayerCommand('mute');
    } else {
      sendPlayerCommand('unMute');
    }
  }, [volume, isMuted, iframeLoaded, sendPlayerCommand]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    // Tell YouTube iframe to listen for postMessage
    sendPlayerCommand('listening');
    sendPlayerCommand('setVolume', [volume]);
    if (isPlaying) {
      sendPlayerCommand('playVideo');
    }
  };

  if (!music.isActive || !music.youtubeVideoId) {
    return null;
  }

  const handleStartMusic = () => {
    onDismissAutoplayBanner();
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  // Embed URL with jsapi enabled for postMessage
  const embedUrl = `https://www.youtube.com/embed/${music.youtubeVideoId}?enablejsapi=1&version=3&loop=1&playlist=${music.youtubeVideoId}&controls=0&modestbranding=1&rel=0`;

  return (
    <>
      {/* Hidden YouTube Iframe - uses postMessage API without injecting scripts into host window */}
      <div
        className="fixed -left-[9999px] -top-[9999px] w-1 h-1 pointer-events-none opacity-0 overflow-hidden"
        aria-hidden="true"
      >
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="Trilha Sonora do Casal"
          onLoad={handleIframeLoad}
          allow="autoplay; encrypted-media"
          className="w-1 h-1"
        />
      </div>

      {/* Autoplay Invitation Prompt (Compliant with browser autoplay policy) */}
      {showAutoplayBanner && !isPlaying && (
        <aside
          role="complementary"
          aria-label="Convite para trilha sonora"
          className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-stone-900/95 text-white p-4 rounded-2xl shadow-2xl border border-rose-500/30 backdrop-blur-md animate-bounce"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
                <MusicIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-rose-300 font-semibold tracking-wide">
                  Trilha Sonora do Casal
                </p>
                <p className="text-sm font-medium line-clamp-1">
                  Clique para começar nossa música ❤️
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleStartMusic}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
              >
                Tocar
              </button>
              <button
                type="button"
                onClick={onDismissAutoplayBanner}
                className="text-stone-400 hover:text-white text-xs p-1 cursor-pointer"
                aria-label="Dispensar aviso de música"
              >
                ✕
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Modern Music Widget */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-rose-100 shadow-xl overflow-hidden transition-all duration-300">
          <div className="flex items-center gap-2.5 p-2.5">
            {/* Spinning disc / Visualizer icon */}
            <button
              type="button"
              onClick={onTogglePlay}
              className="relative w-10 h-10 rounded-full bg-rose-700 text-white flex items-center justify-center shadow-xs hover:bg-rose-800 transition-colors shrink-0 group cursor-pointer"
              aria-label={isPlaying ? 'Pausar música' : 'Iniciar música'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
              )}
            </button>

            {/* Title & Soundwave */}
            <div
              className="cursor-pointer select-none max-w-[150px] sm:max-w-[200px]"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-stone-900 truncate">
                  {music.songTitle || 'Nossa Canção'}
                </p>
              </div>

              {/* Soundwave bars */}
              <div className="flex items-center gap-0.5 h-3.5 mt-0.5">
                {isPlaying ? (
                  <>
                    <span className="w-0.5 bg-rose-600 rounded-full animate-wave-1" />
                    <span className="w-0.5 bg-rose-600 rounded-full animate-wave-2" />
                    <span className="w-0.5 bg-rose-600 rounded-full animate-wave-3" />
                    <span className="w-0.5 bg-rose-600 rounded-full animate-wave-4" />
                    <span className="text-[10px] text-stone-500 ml-1.5 truncate">
                      Tocando
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-stone-400">Pausada</span>
                )}
              </div>
            </div>

            {/* Expand / Minimize toggle button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
              aria-label="Expandir controles"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Expanded controls pane (Volume slider & Mute) */}
          {isExpanded && (
            <div className="px-3.5 pb-3 pt-1 border-t border-rose-50 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="text-stone-500 hover:text-rose-700 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Desmutar' : 'Mutar'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                  if (isMuted && val > 0) setIsMuted(false);
                }}
                className="w-24 h-1.5 bg-stone-200 accent-rose-600 rounded-lg cursor-pointer"
                aria-label="Volume da música"
              />

              <span className="text-[10px] tabular-nums text-stone-500 font-medium">
                {isMuted ? '0%' : `${volume}%`}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
