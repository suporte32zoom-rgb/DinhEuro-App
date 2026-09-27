import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { IOSInstallModal } from './PWAInstallButton';
import { Download, Smartphone, X, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('dinheuro_pwa_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('dinheuro_pwa_dismissed', 'true');
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#003399]/40 via-[#0e1117] to-[#009c3b]/40 border-b border-[#30363d] px-4 py-2.5 text-xs text-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                Instale o App DinhEuro Finanças
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              </span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span className="text-slate-300 text-[11px]">
                Acompanhe cotações em tempo real e use a IA financeira offline
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95 text-[11px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar Agora</span>
            </button>
            <button
              onClick={handleDismiss}
              title="Fechar aviso"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showIOSModal && (
        <IOSInstallModal onClose={() => setShowIOSModal(false)} />
      )}
    </>
  );
};
