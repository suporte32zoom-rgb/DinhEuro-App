import React from "react";
import { X, ArrowRightLeft } from "lucide-react";
import { CurrencyConverter } from "./CurrencyConverter";

interface ForexConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAi?: (prompt: string) => void;
  defaultFrom?: string;
  defaultTo?: string;
}

export const ForexConverterModal: React.FC<ForexConverterModalProps> = ({
  isOpen,
  onClose,
  onAskAi,
  defaultFrom = "EUR",
  defaultTo = "BRL",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#21262d] transition-colors"
          aria-label="Fechar conversor"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          <CurrencyConverter
            onAskAi={onAskAi}
            defaultFrom={defaultFrom}
            defaultTo={defaultTo}
          />
        </div>
      </div>
    </div>
  );
};
