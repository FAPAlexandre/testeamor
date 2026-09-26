/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import heroImg from '../assets/images/hero_couple_sunset_1790451787778.jpg';
import tripImg from '../assets/images/couple_first_trip_1790451799341.jpg';
import dinnerImg from '../assets/images/couple_special_dinner_1790451810153.jpg';
import wifeImg from '../assets/images/wife_portrait_smile_1790451819529.jpg';
import proposalImg from '../assets/images/couple_ring_proposal_1790451830920.jpg';
import {
  CoupleProfile,
  FullAppData,
  LoveLetter,
  MusicSettings,
  PhotoItem,
  SiteSettings,
  TimelineMilestone,
} from '../types';

const STORAGE_KEY = 'nossa_historia_de_amor_data_v1';

export const DEFAULT_INITIAL_DATA: FullAppData = {
  couple: {
    id: 'couple-1',
    partnerName: 'Isabella',
    partnerNickname: 'Minha Vida',
    partnerBio:
      'A mulher dos meus sonhos, meu porto seguro, dona do sorriso mais lindo do mundo e a razão de todas as minhas melhores histórias.',
    partnerPhoto: wifeImg,
    husbandName: 'Lucas',
    coupleDisplayName: 'Lucas & Isabella',
    relationshipStartDate: '2021-06-12T19:30:00',
    mainPhoto: heroImg,
    heroQuote:
      'Nossa história não é apenas sobre o tempo que passou, mas sobre cada instante eterno que construímos juntos.',
    heroSubtitle:
      'Um amor que começou em um olhar e se fortalece a cada nascer do sol.',
  },
  photos: [
    {
      id: 'photo-1',
      image: heroImg,
      title: 'Nosso Pôr do Sol Inesquecível',
      caption:
        'Aquele final de tarde em que o mundo parou e só existíamos nós dois.',
      date: '2024-03-20',
      category: 'Momentos Marcantes',
      isFeatured: true,
      createdAt: '2024-03-20T18:00:00Z',
    },
    {
      id: 'photo-2',
      image: tripImg,
      title: 'Nossa Primeira Grande Viagem',
      caption:
        'Caminhando sem rumo pelas ruas históricas, descobrindo que qualquer lugar é perfeito ao seu lado.',
      date: '2023-08-15',
      category: 'Viagens',
      isFeatured: true,
      createdAt: '2023-08-15T21:00:00Z',
    },
    {
      id: 'photo-3',
      image: dinnerImg,
      title: 'Jantar à Luz de Velas',
      caption:
        'Celebrando nosso aniversário com o vinho que você mais ama e conversas que duraram até o restaurante fechar.',
      date: '2024-06-12',
      category: 'Celebrações',
      isFeatured: false,
      createdAt: '2024-06-12T20:30:00Z',
    },
    {
      id: 'photo-4',
      image: wifeImg,
      title: 'O Sorriso que Ilumina Minha Vida',
      caption:
        'Não há nada mais precioso para mim do que ver esse brilho nos seus olhos.',
      date: '2024-01-10',
      category: 'Dia a Dia',
      isFeatured: false,
      createdAt: '2024-01-10T15:00:00Z',
    },
    {
      id: 'photo-5',
      image: proposalImg,
      title: 'O Dia do Nosso "Sim"',
      caption:
        'O momento em que o meu coração encontrou a sua morada definitiva.',
      date: '2024-11-23',
      category: 'Momentos Marcantes',
      isFeatured: true,
      createdAt: '2024-11-23T17:45:00Z',
    },
  ],
  timeline: [
    {
      id: 'event-1',
      title: 'O Começo de Tudo',
      description:
        'O dia em que nossos caminhos se cruzaram pela primeira vez. Uma conversa despretensiosa que virou horas de risadas e a certeza instantânea de que algo especial estava nascendo.',
      date: '2021-06-12',
      year: '2021',
      image: heroImg,
      icon: 'heart',
      order: 1,
    },
    {
      id: 'event-2',
      title: 'Nossa Primeira Viagem Juntos',
      description:
        'Nossa primeira mala dividida, as risadas ao nos perdermos no caminho e a constatação de que somos a melhor dupla desse mundo.',
      date: '2022-09-18',
      year: '2022',
      image: tripImg,
      icon: 'plane',
      order: 2,
    },
    {
      id: 'event-3',
      title: 'Nosso Lar & Nossa Rotina',
      description:
        'O dia em que abrimos a porta da nossa casa pela primeira vez. Caixas pelo chão, café compartilhado e a paz de ter você ao meu lado todos os dias.',
      date: '2023-04-10',
      year: '2023',
      icon: 'home',
      order: 3,
    },
    {
      id: 'event-4',
      title: 'O Pedido Mais Esperado',
      description:
        'Sob a luz suave do entardecer, com o coração acelerado e a certeza mais profunda da minha vida, perguntei se você aceitaria ser minha para sempre. O seu abraço e o seu sim me fizeram o homem mais feliz da Terra.',
      date: '2024-11-23',
      year: '2024',
      image: proposalImg,
      icon: 'ring',
      order: 4,
    },
    {
      id: 'event-5',
      title: 'Construindo o Nosso Para Sempre',
      description:
        'Cada novo dia ao seu lado é uma renovação de votos. Planejando o futuro, sonhando juntos e cuidando um do outro com ternura, lealdade e carinho incondicional.',
      date: '2025-01-01',
      year: '2025',
      icon: 'sparkles',
      order: 5,
    },
  ],
  messages: [
    {
      id: 'msg-1',
      title: 'Para o Amor da Minha Vida',
      message:
        'Se eu tivesse que escolher novamente entre todas as pessoas do mundo, mil vezes escolheria você. Você transforma a minha rotina em poesia, acalma minhas tempestades e me ensina todos os dias o significado de amar com pureza e paciência. Obrigado por ser minha companheira leal, minha melhor confidente e minha eterna namorada.',
      author: 'Com todo meu amor, seu marido',
      date: '2024-06-12',
      isFeatured: true,
      createdAt: '2024-06-12T08:00:00Z',
    },
    {
      id: 'msg-2',
      title: 'Obrigado por Ser Exatamente Assim',
      message:
        'Amo o jeito como você ri das minhas piadas bobas, o carinho com que prepara o nosso café e a forma como segura minha mão quando estamos no carro. Nos detalhes mais simples mora a certeza de que a vida é bonita porque tenho você.',
      author: 'Para sempre seu',
      date: '2024-09-20',
      isFeatured: false,
      createdAt: '2024-09-20T10:00:00Z',
    },
    {
      id: 'msg-3',
      title: 'Nossa Promessa Diária',
      message:
        'Prometo estar ao seu lado não apenas nos dias fáceis e ensolarados, mas especialmente quando a vida exigir coragem. Meu abraço sempre será o seu refúgio, meu coração sempre será o seu lar.',
      author: 'Do seu eterno apaixonado',
      date: '2025-01-01',
      isFeatured: false,
      createdAt: '2025-01-01T00:00:00Z',
    },
  ],
  music: {
    id: 'music-1',
    youtubeUrl: 'https://www.youtube.com/watch?v=lp-EO5I60KA',
    youtubeVideoId: 'lp-EO5I60KA', // Ed Sheeran - Thinking Out Loud (Romantic classic)
    songTitle: 'Thinking Out Loud',
    artist: 'Nossa Trilha Sonora ❤️',
    isActive: true,
    volume: 50,
  },
  settings: {
    adminPin: 'amor123',
    floatingHeartsEnabled: true,
  },
};

/**
 * Load full application data from localStorage with graceful fallback to defaults
 */
export function loadAppData(): FullAppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAppData(DEFAULT_INITIAL_DATA);
      return DEFAULT_INITIAL_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      couple: { ...DEFAULT_INITIAL_DATA.couple, ...parsed.couple },
      photos: Array.isArray(parsed.photos) ? parsed.photos : DEFAULT_INITIAL_DATA.photos,
      timeline: Array.isArray(parsed.timeline) ? parsed.timeline : DEFAULT_INITIAL_DATA.timeline,
      messages: Array.isArray(parsed.messages) ? parsed.messages : DEFAULT_INITIAL_DATA.messages,
      music: { ...DEFAULT_INITIAL_DATA.music, ...parsed.music },
      settings: { ...DEFAULT_INITIAL_DATA.settings, ...parsed.settings },
    };
  } catch (err) {
    console.error('Error loading app data from localStorage:', err);
    return DEFAULT_INITIAL_DATA;
  }
}

/**
 * Save full application data to localStorage
 */
export function saveAppData(data: FullAppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save data to localStorage:', err);
  }
}

/**
 * Reset application data back to default demo state
 */
export function resetAppDataToDefaults(): FullAppData {
  saveAppData(DEFAULT_INITIAL_DATA);
  return DEFAULT_INITIAL_DATA;
}

/**
 * Export data to a JSON string for download
 */
export function exportDataToJson(): string {
  const data = loadAppData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import and validate JSON data
 */
export function importDataFromJson(jsonStr: string): FullAppData {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.couple || !Array.isArray(parsed.photos)) {
    throw new Error('Formato de arquivo inválido para backup de Nossa História.');
  }
  saveAppData(parsed);
  return parsed;
}

/**
 * Compress and convert file to data URL for seamless browser storage
 */
export function readFileAsDataUrl(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('Falha ao ler arquivo'));
        return;
      }

      // If svg or small image, return directly
      if (file.type === 'image/svg+xml' || file.size < 200 * 1024) {
        resolve(src);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
