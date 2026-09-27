import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, CheckCircle, Smartphone, X } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'drawer' | 'banner' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already in standalone mode / installed, hide button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      await install();
      setIsInstalling(false);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback for browsers that don't dispatch beforeinstallprompt yet
      setShowIOSModal(true);
    }
  };

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          title="Instalar App DinhEuro no seu celular ou computador"
          className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600/90 to-emerald-600/90 text-white hover:from-blue-500 hover:to-emerald-500 border border-blue-400/30 shadow-sm transition-all duration-200 active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5 group-hover:animate-bounce" />
          <span className="hidden md:inline">Instalar App</span>
          <span className="md:hidden">PWA</span>
        </button>

        {showIOSModal && (
          <IOSInstallModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  if (variant === 'drawer') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/30 to-emerald-900/30 border border-emerald-500/30 hover:border-emerald-500/60 text-slate-200 transition-all ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white">Instalar App DinhEuro</div>
              <div className="text-[11px] text-slate-400">Acesso rápido offline & tela cheia</div>
            </div>
          </div>
          <Download className="w-4 h-4 text-emerald-400" />
        </button>

        {showIOSModal && (
          <IOSInstallModal onClose={() => setShowIOSModal(false)} />
        )}
      </>
    );
  }

  // Generic / Default
  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg transition active:scale-95 ${className}`}
      >
        <Download className="w-4 h-4" />
        <span>Instalar DinhEuro PWA</span>
      </button>

      {showIOSModal && (
        <IOSInstallModal onClose={() => setShowIOSModal(false)} />
      )}
    </>
  );
};

// Modal for iOS Safari and Desktop instructions
export const IOSInstallModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl text-slate-100 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003399] to-[#009c3b] flex items-center justify-center text-white font-black text-sm shadow-md">
            D€
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Instalar DinhEuro</h3>
            <p className="text-xs text-slate-400">Aplicativo Web Progressivo Oficial</p>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0e1117] border border-[#21262d]">
            <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Share className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-white">1. Toque em Compartilhar</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">No Safari (iOS) ou Chrome, toque no botão de opções/compartilhar.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0e1117] border border-[#21262d]">
            <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <PlusSquare className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-white">2. Adicionar à Tela de Início</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Selecione &quot;Adicionar à Tela Inicial&quot; ou &quot;Instalar Aplicativo&quot;.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0e1117] border border-[#21262d]">
            <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <strong className="text-white">3. Acesso Instantâneo</strong>
              <p className="text-slate-400 text-[11px] mt-0.5">Abra direto pelo ícone DinhEuro com navegação fluida em tela cheia.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-semibold text-xs transition active:scale-98 shadow-md"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
