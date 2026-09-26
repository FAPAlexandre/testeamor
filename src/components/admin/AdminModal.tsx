/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Lock,
  LogOut,
  LayoutDashboard,
  User,
  Image as ImageIcon,
  Clock,
  Mail,
  Music,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Check,
  Calendar,
  Heart,
  Save,
  RefreshCw,
  Download,
  AlertCircle,
  Gem,
  Plane,
  Home,
  Sparkles,
  Star,
  Gift,
  Camera,
  Coffee,
} from 'lucide-react';
import {
  CoupleProfile,
  FullAppData,
  LoveLetter,
  MusicSettings,
  PhotoCategory,
  PhotoItem,
  TimelineIconType,
  TimelineMilestone,
} from '../../types';
import {
  exportDataToJson,
  importDataFromJson,
  readFileAsDataUrl,
  resetAppDataToDefaults,
} from '../../services/storage';
import { extractYouTubeVideoId } from '../../utils/youtube';
import { formatPortugueseDate } from '../../utils/date';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  appData: FullAppData;
  onSaveData: (newData: FullAppData) => void;
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'perfil'
  | 'fotos'
  | 'momentos'
  | 'mensagens'
  | 'musica'
  | 'configuracoes';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  appData,
  onSaveData,
  isLoggedIn,
  onLoginSuccess,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable local state for the forms
  const [coupleForm, setCoupleForm] = useState<CoupleProfile>(appData.couple);
  const [musicForm, setMusicForm] = useState<MusicSettings>(appData.music);

  // Photo form modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [photoForm, setPhotoForm] = useState<Partial<PhotoItem>>({
    title: '',
    caption: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Momentos Marcantes',
    image: '',
    isFeatured: false,
  });

  // Timeline form modal state
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<TimelineMilestone | null>(null);
  const [milestoneForm, setMilestoneForm] = useState<Partial<TimelineMilestone>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear().toString(),
    icon: 'heart',
    image: '',
  });

  // Message form modal state
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<LoveLetter | null>(null);
  const [messageForm, setMessageForm] = useState<Partial<LoveLetter>>({
    title: '',
    message: '',
    author: `Com amor, ${appData.couple.husbandName || 'Seu amor'}`,
    date: new Date().toISOString().split('T')[0],
    isFeatured: false,
  });

  // Password change state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Custom confirmation dialog state (avoiding window.confirm)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Excluir',
    onConfirm: () => {},
  });

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === appData.settings.adminPin) {
      setPinError('');
      onLoginSuccess();
      showToast('Bem-vindo à área administrativa!');
    } else {
      setPinError('Senha incorreta. Tente novamente.');
    }
  };

  // Save couple profile changes
  const handleSaveCoupleProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...appData,
      couple: coupleForm,
    };
    onSaveData(updated);
    showToast('Perfil do casal atualizado com sucesso!');
  };

  // Save music changes
  const handleSaveMusic = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractYouTubeVideoId(musicForm.youtubeUrl);
    const updatedMusic = {
      ...musicForm,
      youtubeVideoId: videoId || musicForm.youtubeVideoId,
    };
    const updated = {
      ...appData,
      music: updatedMusic,
    };
    onSaveData(updated);
    setMusicForm(updatedMusic);
    showToast('Configurações de música atualizadas!');
  };

  // Image file handler for photo uploads
  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploaded: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onUploaded(dataUrl);
      showToast('Imagem carregada com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('Não foi possível carregar a imagem selecionada.');
    }
  };

  // Photos CRUD
  const handleOpenAddPhoto = () => {
    setEditingPhoto(null);
    setPhotoForm({
      title: '',
      caption: '',
      date: new Date().toISOString().split('T')[0],
      category: 'Momentos Marcantes',
      image: '',
      isFeatured: false,
    });
    setIsPhotoModalOpen(true);
  };

  const handleOpenEditPhoto = (photo: PhotoItem) => {
    setEditingPhoto(photo);
    setPhotoForm({ ...photo });
    setIsPhotoModalOpen(true);
  };

  const handleDeletePhoto = (id: string, title?: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Fotografia',
      description: `Tem certeza que deseja excluir permanentemente a foto "${title || 'selecionada'}" do álbum?`,
      confirmText: 'Sim, excluir foto',
      onConfirm: () => {
        const updatedPhotos = appData.photos.filter((p) => p.id !== id);
        onSaveData({ ...appData, photos: updatedPhotos });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Foto excluída com sucesso.');
      },
    });
  };

  const handleTogglePhotoFeatured = (photo: PhotoItem) => {
    const updatedPhotos = appData.photos.map((p) =>
      p.id === photo.id ? { ...p, isFeatured: !p.isFeatured } : p
    );
    onSaveData({ ...appData, photos: updatedPhotos });
    showToast('Status de destaque atualizado.');
  };

  const handleSavePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.image) {
      showToast('Preencha o título e forneça uma imagem para a foto.');
      return;
    }

    let updatedPhotos: PhotoItem[];
    if (editingPhoto) {
      updatedPhotos = appData.photos.map((p) =>
        p.id === editingPhoto.id
          ? ({ ...p, ...photoForm } as PhotoItem)
          : p
      );
    } else {
      const newPhotoItem: PhotoItem = {
        id: `photo-${Date.now()}`,
        title: photoForm.title!,
        caption: photoForm.caption || '',
        date: photoForm.date || new Date().toISOString().split('T')[0],
        category: photoForm.category || 'Momentos Marcantes',
        image: photoForm.image!,
        isFeatured: Boolean(photoForm.isFeatured),
        objectPosition: photoForm.objectPosition || 'top',
        createdAt: new Date().toISOString(),
      };
      updatedPhotos = [newPhotoItem, ...appData.photos];
    }

    onSaveData({ ...appData, photos: updatedPhotos });
    setIsPhotoModalOpen(false);
    showToast(editingPhoto ? 'Foto editada!' : 'Nova foto adicionada ao álbum!');
  };

  // Timeline CRUD
  const handleOpenAddMilestone = () => {
    setEditingMilestone(null);
    setMilestoneForm({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear().toString(),
      icon: 'heart',
      image: '',
    });
    setIsMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (m: TimelineMilestone) => {
    setEditingMilestone(m);
    setMilestoneForm({ ...m });
    setIsMilestoneModalOpen(true);
  };

  const handleDeleteMilestone = (id: string, title?: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Momento Histórico',
      description: `Tem certeza que deseja excluir o momento "${title || 'selecionado'}" da linha do tempo?`,
      confirmText: 'Sim, excluir momento',
      onConfirm: () => {
        const updated = appData.timeline.filter((m) => m.id !== id);
        onSaveData({ ...appData, timeline: updated });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Momento excluído.');
      },
    });
  };

  const handleSaveMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.title || !milestoneForm.description) {
      showToast('Preencha o título e a descrição do momento.');
      return;
    }

    const yr = milestoneForm.date ? milestoneForm.date.split('-')[0] : '2024';

    let updatedTimeline: TimelineMilestone[];
    if (editingMilestone) {
      updatedTimeline = appData.timeline.map((m) =>
        m.id === editingMilestone.id
          ? ({ ...m, ...milestoneForm, year: yr } as TimelineMilestone)
          : m
      );
    } else {
      const newM: TimelineMilestone = {
        id: `event-${Date.now()}`,
        title: milestoneForm.title!,
        description: milestoneForm.description!,
        date: milestoneForm.date || new Date().toISOString().split('T')[0],
        year: yr,
        icon: (milestoneForm.icon as TimelineIconType) || 'heart',
        image: milestoneForm.image || '',
        order: appData.timeline.length + 1,
      };
      updatedTimeline = [...appData.timeline, newM];
    }

    onSaveData({ ...appData, timeline: updatedTimeline });
    setIsMilestoneModalOpen(false);
    showToast(editingMilestone ? 'Momento atualizado!' : 'Novo marco histórico adicionado!');
  };

  // Messages CRUD
  const handleOpenAddMessage = () => {
    setEditingMessage(null);
    setMessageForm({
      title: '',
      message: '',
      author: `Com amor, ${appData.couple.husbandName || 'Seu amor'}`,
      date: new Date().toISOString().split('T')[0],
      isFeatured: false,
    });
    setIsMessageModalOpen(true);
  };

  const handleOpenEditMessage = (msg: LoveLetter) => {
    setEditingMessage(msg);
    setMessageForm({ ...msg });
    setIsMessageModalOpen(true);
  };

  const handleDeleteMessage = (id: string, title?: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Excluir Carta de Amor',
      description: `Tem certeza que deseja apagar a carta "${title || 'selecionada'}"?`,
      confirmText: 'Sim, apagar carta',
      onConfirm: () => {
        const updated = appData.messages.filter((m) => m.id !== id);
        onSaveData({ ...appData, messages: updated });
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Carta de amor excluída.');
      },
    });
  };

  const handleSaveMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.title || !messageForm.message) {
      showToast('Preencha o título e o texto da carta.');
      return;
    }

    let updatedMessages: LoveLetter[];
    if (editingMessage) {
      updatedMessages = appData.messages.map((m) =>
        m.id === editingMessage.id
          ? ({ ...m, ...messageForm } as LoveLetter)
          : m
      );
    } else {
      const newMsg: LoveLetter = {
        id: `msg-${Date.now()}`,
        title: messageForm.title!,
        message: messageForm.message!,
        author: messageForm.author || 'Seu eterno amor',
        date: messageForm.date || new Date().toISOString().split('T')[0],
        isFeatured: Boolean(messageForm.isFeatured),
        createdAt: new Date().toISOString(),
      };
      updatedMessages = [newMsg, ...appData.messages];
    }

    onSaveData({ ...appData, messages: updatedMessages });
    setIsMessageModalOpen(false);
    showToast(editingMessage ? 'Carta atualizada!' : 'Nova carta de amor guardada!');
  };

  // Change Admin Pin
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      showToast('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPin !== confirmPin) {
      showToast('A confirmação da nova senha não confere.');
      return;
    }
    const updated = {
      ...appData,
      settings: {
        ...appData.settings,
        adminPin: newPin,
      },
    };
    onSaveData(updated);
    setNewPin('');
    setConfirmPin('');
    showToast('Senha administrativa alterada com sucesso!');
  };

  // Export JSON
  const handleExportBackup = () => {
    const jsonStr = exportDataToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_nossa_historia_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Arquivo de backup exportado!');
  };

  // Import JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = importDataFromJson(text);
        onSaveData(imported);
        setCoupleForm(imported.couple);
        setMusicForm(imported.music);
        showToast('Backup restaurado com sucesso!');
      } catch (err) {
        showToast('Falha ao restaurar backup: formato JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Restaurar Dados Padrão',
      description: 'Tem certeza que deseja restaurar as informações padrão do sistema? Todas as alterações serão substituídas pelos dados de exemplo.',
      confirmText: 'Restaurar Padrão',
      onConfirm: () => {
        const def = resetAppDataToDefaults();
        onSaveData(def);
        setCoupleForm(def.couple);
        setMusicForm(def.music);
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showToast('Dados restaurados para o padrão.');
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative bg-[#FAF7F5] w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-rose-400" />
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold">
                Painel Administrativo do Casal
              </h2>
              <p className="text-xs text-stone-400">
                Gerencie fotos, momentos, cartas e detalhes da história
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-full transition-colors"
                title="Sair do painel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full transition-colors"
              aria-label="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast feedback */}
        {toastMessage && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 bg-rose-700 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Area */}
        {!isLoggedIn ? (
          /* Authentication Screen */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-100 shadow-lg text-center space-y-6">
              <div className="w-14 h-14 bg-rose-50 text-rose-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Acesso Restrito
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  Digite sua senha para editar os momentos e fotos do casal.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Digite a senha..."
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-center font-mono tracking-widest text-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-[#FAF7F5]"
                  />
                  {pinError && (
                    <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {pinError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-medium rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Entrar no Painel
                </button>
              </form>

              {/* Demo Hint & Quick Fill */}
              <div className="pt-2 border-t border-stone-100 text-xs text-stone-400">
                <span>Senha padrão: </span>
                <button
                  type="button"
                  onClick={() => setPinInput('amor123')}
                  className="text-rose-600 hover:underline font-mono font-bold"
                >
                  amor123 (clique para preencher)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard Tabs View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-left w-full ${
                  activeTab === 'dashboard'
                    ? 'bg-rose-50 text-rose-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('perfil')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-left w-full ${
                  activeTab === 'perfil'
                    ? 'bg-rose-50 text-rose-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <User className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Nosso Perfil</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fotos')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-left w-full ${
                  activeTab === 'fotos'
                    ? 'bg-rose-50 text-rose-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Fotos ({appData.photos.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('momentos')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-left w-full ${
                  activeTab === 'momentos'
                    ? 'bg-rose-50 text-rose-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Momentos ({appData.timeline.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mensagens')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-left w-full ${
                  activeTab === 'mensagens'
                    ? 'bg-rose-50 text-rose-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Mail className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Mensagens ({appData.messages.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('musica')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-left w-full ${
                  activeTab === 'musica'
                    ? 'bg-rose-50 text-rose-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Music className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Música de Fundo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('configuracoes')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap text-left w-full ${
                  activeTab === 'configuracoes'
                    ? 'bg-rose-50 text-rose-800 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0 text-rose-600" />
                <span>Configurações</span>
              </button>
            </aside>

            {/* Main Tab Panel */}
            <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Visão Geral do Álbum
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Aqui você tem o panorama de tudo o que foi guardado na história de vocês.
                    </p>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                      <p className="text-xs text-stone-500 font-medium">Fotos</p>
                      <p className="font-serif text-3xl font-bold text-stone-900 mt-1">
                        {appData.photos.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('fotos')}
                        className="text-xs text-rose-600 hover:underline mt-2 inline-block font-medium"
                      >
                        Gerenciar fotos →
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                      <p className="text-xs text-stone-500 font-medium">Momentos</p>
                      <p className="font-serif text-3xl font-bold text-stone-900 mt-1">
                        {appData.timeline.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('momentos')}
                        className="text-xs text-rose-600 hover:underline mt-2 inline-block font-medium"
                      >
                        Ver momentos →
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                      <p className="text-xs text-stone-500 font-medium">Cartas</p>
                      <p className="font-serif text-3xl font-bold text-stone-900 mt-1">
                        {appData.messages.length}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('mensagens')}
                        className="text-xs text-rose-600 hover:underline mt-2 inline-block font-medium"
                      >
                        Ver cartas →
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-2xs">
                      <p className="text-xs text-stone-500 font-medium">Trilha Sonora</p>
                      <p className="font-serif text-lg font-bold text-stone-900 mt-1 truncate">
                        {appData.music.songTitle || 'Ativa'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('musica')}
                        className="text-xs text-rose-600 hover:underline mt-2 inline-block font-medium"
                      >
                        Alterar música →
                      </button>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="bg-white p-6 rounded-3xl border border-rose-100 space-y-4">
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      Ações Rápidas
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleOpenAddPhoto}
                        className="flex items-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-xs transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Nova Foto</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddMilestone}
                        className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-xs transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Novo Momento</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenAddMessage}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Escrever Carta de Amor</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PERFIL DO CASAL & GERENCIAMENTO DA ESPOSA */}
              {activeTab === 'perfil' && (
                <form onSubmit={handleSaveCoupleProfile} className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Nosso Perfil & Informações do Casal
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Personalize os nomes, apelido da sua esposa, biografia, datas e foto principal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nome da Esposa
                      </label>
                      <input
                        type="text"
                        value={coupleForm.partnerName}
                        onChange={(e) =>
                          setCoupleForm({ ...coupleForm, partnerName: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Apelido Carinhoso Dela
                      </label>
                      <input
                        type="text"
                        value={coupleForm.partnerNickname}
                        onChange={(e) =>
                          setCoupleForm({ ...coupleForm, partnerNickname: e.target.value })
                        }
                        placeholder="Ex: Minha vida, Princesa"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Seu Nome (Marido)
                      </label>
                      <input
                        type="text"
                        value={coupleForm.husbandName}
                        onChange={(e) =>
                          setCoupleForm({ ...coupleForm, husbandName: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nome do Casal no Cabeçalho
                      </label>
                      <input
                        type="text"
                        value={coupleForm.coupleDisplayName}
                        onChange={(e) =>
                          setCoupleForm({
                            ...coupleForm,
                            coupleDisplayName: e.target.value,
                          })
                        }
                        placeholder="Ex: Lucas & Isabella"
                        required
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Foto de Perfil da Esposa */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                    <label className="block text-xs font-semibold text-stone-700">
                      Foto de Perfil da Esposa
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-100 ring-2 ring-rose-200 shrink-0">
                        <img
                          src={coupleForm.partnerPhoto}
                          alt="Prévia da esposa"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Carregar Foto do Computador / Celular</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileUpload(e, (dataUrl) =>
                                setCoupleForm({ ...coupleForm, partnerPhoto: dataUrl })
                              )
                            }
                          />
                        </label>
                        <input
                          type="text"
                          value={coupleForm.partnerPhoto}
                          onChange={(e) =>
                            setCoupleForm({ ...coupleForm, partnerPhoto: e.target.value })
                          }
                          placeholder="Ou cole o link da foto..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-[#FAF7F5]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descrição carinhosa dela */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Pequena Descrição / Homenagem a Ela
                    </label>
                    <textarea
                      rows={3}
                      value={coupleForm.partnerBio}
                      onChange={(e) =>
                        setCoupleForm({ ...coupleForm, partnerBio: e.target.value })
                      }
                      placeholder="Descreva o quanto ela é especial para você..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Data de início do relacionamento */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Data em que o relacionamento começou
                    </label>
                    <input
                      type="datetime-local"
                      value={
                        coupleForm.relationshipStartDate
                          ? coupleForm.relationshipStartDate.slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        setCoupleForm({
                          ...coupleForm,
                          relationshipStartDate: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Essa data alimenta o contador em tempo real na página inicial.
                    </p>
                  </div>

                  {/* Frase e foto principal */}
                  <div className="space-y-4 pt-2 border-t border-stone-200">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Frase de Destaque da Home
                      </label>
                      <input
                        type="text"
                        value={coupleForm.heroQuote}
                        onChange={(e) =>
                          setCoupleForm({ ...coupleForm, heroQuote: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                      />
                    </div>

                    {/* Foto Principal */}
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                      <label className="block text-xs font-semibold text-stone-700">
                        Foto Principal do Casal (Destaque da Home)
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-stone-100 ring-1 ring-stone-200 shrink-0">
                          <img
                            src={coupleForm.mainPhoto}
                            alt="Prévia principal"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Carregar Nova Foto Principal</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e, (dataUrl) =>
                                  setCoupleForm({ ...coupleForm, mainPhoto: dataUrl })
                                )
                              }
                            />
                          </label>
                          <input
                            type="text"
                            value={coupleForm.mainPhoto}
                            onChange={(e) =>
                              setCoupleForm({ ...coupleForm, mainPhoto: e.target.value })
                            }
                            placeholder="Ou cole o link da imagem..."
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-[#FAF7F5]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-rose-700 hover:bg-rose-800 text-white font-medium text-sm rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações do Perfil</span>
                  </button>
                </form>
              )}

              {/* TAB 3: GERENCIAMENTO DE FOTOS */}
              {activeTab === 'fotos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        Gerenciamento de Fotos
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500">
                        Adicione, edite e organize todas as imagens do casal.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddPhoto}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Foto</span>
                    </button>
                  </div>

                  {/* Photos Grid list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {appData.photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs flex flex-col justify-between"
                      >
                        <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                          <img
                            src={photo.image}
                            alt={photo.title}
                            className="w-full h-full object-cover"
                          />
                          {photo.isFeatured && (
                            <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Heart className="w-2.5 h-2.5 fill-white" />
                              <span>Destaque</span>
                            </div>
                          )}
                        </div>

                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-stone-400">
                              <span>{formatPortugueseDate(photo.date)}</span>
                              <span>{photo.category}</span>
                            </div>
                            <h4 className="font-serif font-bold text-stone-900 text-base mt-1 line-clamp-1">
                              {photo.title}
                            </h4>
                            {photo.caption && (
                              <p className="text-xs text-stone-500 italic line-clamp-2 mt-1">
                                &ldquo;{photo.caption}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                            <button
                              type="button"
                              onClick={() => handleTogglePhotoFeatured(photo)}
                              className={`text-[11px] font-medium transition-colors ${
                                photo.isFeatured
                                  ? 'text-rose-600'
                                  : 'text-stone-400 hover:text-stone-700'
                              }`}
                            >
                              {photo.isFeatured ? '★ Em destaque' : '☆ Destacar'}
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditPhoto(photo)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Editar foto"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(photo.id, photo.title)}
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Excluir foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: GERENCIAMENTO DE MOMENTOS (TIMELINE) */}
              {activeTab === 'momentos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        Linha do Tempo & Momentos Marcantes
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500">
                        Adicione novos capítulos e viagens à história do casal.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddMilestone}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Momento</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {appData.timeline.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 flex items-center justify-between gap-4 shadow-2xs"
                      >
                        <div className="flex items-center gap-4">
                          {m.image ? (
                            <img
                              src={m.image}
                              alt={m.title}
                              className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                              <Heart className="w-6 h-6" />
                            </div>
                          )}

                          <div className="space-y-0.5">
                            <span className="text-xs text-rose-800 font-semibold">
                              {formatPortugueseDate(m.date)} {m.year ? `(${m.year})` : ''}
                            </span>
                            <h4 className="font-serif font-bold text-stone-900 text-lg">
                              {m.title}
                            </h4>
                            <p className="text-xs text-stone-500 line-clamp-1 max-w-lg">
                              {m.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditMilestone(m)}
                            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            title="Editar momento"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMilestone(m.id, m.title)}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir momento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: GERENCIAMENTO DE MENSAGENS */}
              {activeTab === 'mensagens' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">
                        Cartas & Mensagens Românticas
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-500">
                        Escreva declarações e cartas para sua esposa ler no site.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddMessage}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Carta de Amor</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {appData.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-lg font-bold text-stone-900">
                              {msg.title}
                            </span>
                            {msg.isFeatured && (
                              <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                                Destaque
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-stone-400">
                            {formatPortugueseDate(msg.date)}
                          </span>
                        </div>

                        <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed">
                          {msg.message}
                        </p>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="italic text-stone-400">
                            {msg.author || 'Seu amor'}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMessage(msg)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id, msg.title)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: GERENCIAMENTO DE MÚSICA */}
              {activeTab === 'musica' && (
                <form onSubmit={handleSaveMusic} className="space-y-6 max-w-xl">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Trilha Sonora (YouTube)
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Insira o link de uma música do YouTube para tocar como fundo romântico.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-stone-800">
                        Ativar Música de Fundo
                      </span>
                      <input
                        type="checkbox"
                        checked={musicForm.isActive}
                        onChange={(e) =>
                          setMusicForm({ ...musicForm, isActive: e.target.checked })
                        }
                        className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Link do YouTube
                      </label>
                      <input
                        type="text"
                        value={musicForm.youtubeUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          const id = extractYouTubeVideoId(val);
                          setMusicForm({
                            ...musicForm,
                            youtubeUrl: val,
                            youtubeVideoId: id || musicForm.youtubeVideoId,
                          });
                        }}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-[#FAF7F5] focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
                      />
                      <p className="text-[11px] text-stone-400 mt-1">
                        ID do vídeo detectado:{' '}
                        <strong className="font-mono text-stone-700">
                          {musicForm.youtubeVideoId || 'Nenhum'}
                        </strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Título da Canção
                        </label>
                        <input
                          type="text"
                          value={musicForm.songTitle}
                          onChange={(e) =>
                            setMusicForm({ ...musicForm, songTitle: e.target.value })
                          }
                          placeholder="Ex: Thinking Out Loud"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Artista / Legenda
                        </label>
                        <input
                          type="text"
                          value={musicForm.artist}
                          onChange={(e) =>
                            setMusicForm({ ...musicForm, artist: e.target.value })
                          }
                          placeholder="Ex: Ed Sheeran"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Volume Inicial ({musicForm.volume}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={musicForm.volume}
                        onChange={(e) =>
                          setMusicForm({ ...musicForm, volume: Number(e.target.value) })
                        }
                        className="w-full accent-rose-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-rose-700 hover:bg-rose-800 text-white font-medium text-sm rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Configurações de Música</span>
                  </button>
                </form>
              )}

              {/* TAB 7: CONFIGURAÇÕES & BACKUP */}
              {activeTab === 'configuracoes' && (
                <div className="space-y-8 max-w-xl">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      Configurações do Álbum
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500">
                      Gerencie a segurança da sua conta e faça backup de todas as fotos e memórias.
                    </p>
                  </div>

                  {/* Alterar Senha */}
                  <form
                    onSubmit={handleChangePin}
                    className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4"
                  >
                    <h4 className="font-serif font-bold text-stone-900 text-base">
                      Alterar Senha do Painel
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          value={newPin}
                          onChange={(e) => setNewPin(e.target.value)}
                          placeholder="Mínimo 4 caracteres"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value)}
                          placeholder="Repita a nova senha"
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      Atualizar Senha
                    </button>
                  </form>

                  {/* Backup & Restore */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
                    <h4 className="font-serif font-bold text-stone-900 text-base">
                      Backup & Restauração dos Dados
                    </h4>
                    <p className="text-xs text-stone-500">
                      Baixe uma cópia de segurança em formato JSON para garantir que suas fotos,
                      mensagens e momentos fiquem salvos para sempre.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleExportBackup}
                        className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Exportar Backup (Download)</span>
                      </button>

                      <label className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Restaurar Backup (Upload JSON)</span>
                        <input
                          type="file"
                          accept=".json,application/json"
                          className="hidden"
                          onChange={handleImportBackup}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Reset Defaults */}
                  <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-100 space-y-3">
                    <h4 className="font-serif font-bold text-rose-950 text-base">
                      Restaurar Dados de Exemplo
                    </h4>
                    <p className="text-xs text-rose-800/80">
                      Caso queira resetar o álbum para o conteúdo demonstrativo inicial.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restaurar Padrões Iniciais</span>
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* MODAL: Adicionar / Editar Foto */}
      {isPhotoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-stone-950/70 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif text-xl font-bold text-stone-900">
                {editingPhoto ? 'Editar Fotografia' : 'Adicionar Nova Foto ao Álbum'}
              </h4>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhotoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Título da Foto *
                </label>
                <input
                  type="text"
                  value={photoForm.title || ''}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="Ex: Nossa primeira viagem juntos"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-[#FAF7F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Legenda / História do Momento
                </label>
                <textarea
                  rows={2}
                  value={photoForm.caption || ''}
                  onChange={(e) =>
                    setPhotoForm({ ...photoForm, caption: e.target.value })
                  }
                  placeholder="Ex: Um dos dias que eu nunca vou esquecer..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-[#FAF7F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={photoForm.date || ''}
                    onChange={(e) =>
                      setPhotoForm({ ...photoForm, date: e.target.value })
                    }
                    required
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={photoForm.category || 'Momentos Marcantes'}
                    onChange={(e) =>
                      setPhotoForm({ ...photoForm, category: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                  >
                    <option value="Momentos Marcantes">Momentos Marcantes</option>
                    <option value="Viagens">Viagens</option>
                    <option value="Celebrações">Celebrações</option>
                    <option value="Dia a Dia">Dia a Dia</option>
                    <option value="Encontros">Encontros</option>
                  </select>
                </div>
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Imagem *
                </label>

                {photoForm.image && (
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-900 ring-1 ring-stone-200 mb-2 flex items-center justify-center">
                    <img
                      src={photoForm.image}
                      alt="Prévia da foto"
                      className={`max-h-full max-w-full object-contain ${
                        photoForm.objectPosition === 'top'
                          ? 'object-top'
                          : photoForm.objectPosition === 'bottom'
                          ? 'object-bottom'
                          : 'object-center'
                      }`}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload do Arquivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (dataUrl) =>
                          setPhotoForm({ ...photoForm, image: dataUrl })
                        )
                      }
                    />
                  </label>

                  <input
                    type="text"
                    value={photoForm.image || ''}
                    onChange={(e) =>
                      setPhotoForm({ ...photoForm, image: e.target.value })
                    }
                    placeholder="Ou cole a URL da imagem..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                  />
                </div>
              </div>

              {/* Ajuste de Enquadramento e Foco para Evitar Cortes */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Enquadramento na Grade (Foco do Corte)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPhotoForm({ ...photoForm, objectPosition: 'top' })}
                    className={`py-1.5 px-2 text-xs rounded-xl font-medium border transition-colors cursor-pointer ${
                      photoForm.objectPosition === 'top' || !photoForm.objectPosition
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Topo / Rostos (Ideal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoForm({ ...photoForm, objectPosition: 'center' })}
                    className={`py-1.5 px-2 text-xs rounded-xl font-medium border transition-colors cursor-pointer ${
                      photoForm.objectPosition === 'center'
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Centro
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoForm({ ...photoForm, objectPosition: 'bottom' })}
                    className={`py-1.5 px-2 text-xs rounded-xl font-medium border transition-colors cursor-pointer ${
                      photoForm.objectPosition === 'bottom'
                        ? 'bg-rose-700 text-white border-rose-700'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Base
                  </button>
                </div>
                <p className="text-[11px] text-stone-500">
                  Definir o foco no topo garante que as cabeças e os sorrisos nunca sejam cortados.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={Boolean(photoForm.isFeatured)}
                  onChange={(e) =>
                    setPhotoForm({ ...photoForm, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <label
                  htmlFor="featured-checkbox"
                  className="text-xs font-medium text-stone-700 cursor-pointer"
                >
                  Destacar esta foto na galeria
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Salvar Fotografia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Adicionar / Editar Momento (Timeline) */}
      {isMilestoneModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-stone-950/70 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif text-xl font-bold text-stone-900">
                {editingMilestone ? 'Editar Momento Histórico' : 'Adicionar Novo Momento'}
              </h4>
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Título do Momento *
                </label>
                <input
                  type="text"
                  value={milestoneForm.title || ''}
                  onChange={(e) =>
                    setMilestoneForm({ ...milestoneForm, title: e.target.value })
                  }
                  placeholder="Ex: Nossa primeira viagem"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-[#FAF7F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descrição do Marco *
                </label>
                <textarea
                  rows={3}
                  value={milestoneForm.description || ''}
                  onChange={(e) =>
                    setMilestoneForm({ ...milestoneForm, description: e.target.value })
                  }
                  placeholder="Conte o que aconteceu nesse dia..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-[#FAF7F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={milestoneForm.date || ''}
                    onChange={(e) =>
                      setMilestoneForm({ ...milestoneForm, date: e.target.value })
                    }
                    required
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ícone Representativo
                  </label>
                  <select
                    value={milestoneForm.icon || 'heart'}
                    onChange={(e) =>
                      setMilestoneForm({
                        ...milestoneForm,
                        icon: e.target.value as TimelineIconType,
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                  >
                    <option value="heart">❤️ Coração (Começo / Amor)</option>
                    <option value="plane">✈️ Avião (Viagem)</option>
                    <option value="ring">💍 Aliança (Noivado / Casamento)</option>
                    <option value="home">🏡 Casa (Nosso Lar)</option>
                    <option value="sparkles">✨ Brilhos (Momento Mágico)</option>
                    <option value="star">⭐ Estrela (Conquista)</option>
                    <option value="gift">🎁 Presente (Aniversário)</option>
                    <option value="coffee">☕ Café (Primeiro Encontro)</option>
                  </select>
                </div>
              </div>

              {/* Imagem do Momento */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">
                  Foto Opcional do Momento
                </label>

                {milestoneForm.image && (
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-100 ring-1 ring-stone-200 mb-2">
                    <img
                      src={milestoneForm.image}
                      alt="Prévia do momento"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-medium cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFileUpload(e, (dataUrl) =>
                          setMilestoneForm({ ...milestoneForm, image: dataUrl })
                        )
                      }
                    />
                  </label>

                  <input
                    type="text"
                    value={milestoneForm.image || ''}
                    onChange={(e) =>
                      setMilestoneForm({ ...milestoneForm, image: e.target.value })
                    }
                    placeholder="Ou cole o link da foto..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Salvar Momento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Adicionar / Editar Carta (Mensagem) */}
      {isMessageModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-60 bg-stone-950/70 flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-serif text-xl font-bold text-stone-900">
                {editingMessage ? 'Editar Carta de Amor' : 'Escrever Carta de Amor'}
              </h4>
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMessageSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Título da Mensagem *
                </label>
                <input
                  type="text"
                  value={messageForm.title || ''}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, title: e.target.value })
                  }
                  placeholder="Ex: Para o Amor da Minha Vida"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-[#FAF7F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Texto da Declaração *
                </label>
                <textarea
                  rows={5}
                  value={messageForm.message || ''}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, message: e.target.value })
                  }
                  placeholder="Escreva tudo o que seu coração sente..."
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm bg-[#FAF7F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Assinatura
                  </label>
                  <input
                    type="text"
                    value={messageForm.author || ''}
                    onChange={(e) =>
                      setMessageForm({ ...messageForm, author: e.target.value })
                    }
                    placeholder="Ex: Com todo meu amor"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Data da Carta
                  </label>
                  <input
                    type="date"
                    value={messageForm.date || ''}
                    onChange={(e) =>
                      setMessageForm({ ...messageForm, date: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-[#FAF7F5]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-msg"
                  checked={Boolean(messageForm.isFeatured)}
                  onChange={(e) =>
                    setMessageForm({ ...messageForm, isFeatured: e.target.checked })
                  }
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <label
                  htmlFor="featured-msg"
                  className="text-xs font-medium text-stone-700 cursor-pointer"
                >
                  Destacar como Carta Principal (fundo escuro e luxuoso)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Guardar Carta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: Confirmação Customizada (Sem usar window.confirm) */}
      {confirmDialog.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-70 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h4 className="font-serif text-xl font-bold text-stone-900">
                {confirmDialog.title}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {confirmDialog.description}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
                className="flex-1 py-2.5 px-4 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
