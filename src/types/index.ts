/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CoupleProfile {
  id: string;
  partnerName: string; // Wife's name
  partnerNickname: string; // Sweet nickname (e.g. "Meu amor", "Princesa")
  partnerBio: string; // Small sweet description
  partnerPhoto: string; // Profile picture URL or data URL
  husbandName: string; // Husband's name
  coupleDisplayName: string; // e.g. "Lucas & Isabella"
  relationshipStartDate: string; // ISO date string e.g. "2021-06-12T20:00:00"
  mainPhoto: string; // Hero banner image
  heroQuote: string; // Main highlight quote
  heroSubtitle: string; // Emotional subtitle
}

export type PhotoCategory =
  | 'Todas'
  | 'Viagens'
  | 'Momentos Marcantes'
  | 'Encontros'
  | 'Celebrações'
  | 'Dia a Dia';

export interface PhotoItem {
  id: string;
  image: string; // URL, asset path or base64 data URL
  title: string;
  caption: string;
  date: string; // "YYYY-MM-DD"
  category: string;
  isFeatured: boolean;
  createdAt: string;
  objectPosition?: 'center' | 'top' | 'bottom' | 'custom';
  fitMode?: 'cover' | 'contain';
}

export type TimelineIconType =
  | 'heart'
  | 'plane'
  | 'ring'
  | 'home'
  | 'sparkles'
  | 'star'
  | 'gift'
  | 'camera'
  | 'music'
  | 'coffee';

export interface TimelineMilestone {
  id: string;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  year: string; // "2023"
  image?: string;
  icon: TimelineIconType;
  order: number;
}

export interface LoveLetter {
  id: string;
  title: string;
  message: string;
  author: string;
  date: string; // "YYYY-MM-DD"
  isFeatured: boolean;
  createdAt: string;
}

export interface MusicSettings {
  id: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  songTitle: string;
  artist: string;
  isActive: boolean;
  volume: number; // 0 to 100
}

export interface SiteSettings {
  adminPin: string; // default "amor123"
  floatingHeartsEnabled: boolean;
}

export interface FullAppData {
  couple: CoupleProfile;
  photos: PhotoItem[];
  timeline: TimelineMilestone[];
  messages: LoveLetter[];
  music: MusicSettings;
  settings: SiteSettings;
}
