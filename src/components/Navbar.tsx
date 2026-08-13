import React from 'react';
import { Download, RefreshCw, Settings, CreditCard } from 'lucide-react';

interface NavbarProps {
  totalStudents: number;
  logoDataUrl?: string;
  onDownloadPdf: () => void;
  onResetData: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalStudents,
  logoDataUrl,
  onDownloadPdf,
  onResetData,
  onOpenSettings,
}) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 flex items-center justify-center shrink-0 bg-indigo-50 rounded-xl border border-indigo-100">
            {logoDataUrl ? (
              <img
                src={logoDataUrl}
                alt="Logo Colegio"
                className="h-8 w-auto object-contain filter drop-shadow-xs"
              />
            ) : (
              <CreditCard className="w-5 h-5 text-indigo-600" />
            )}
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              Tarjetas Escolares
            </h1>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Generador automático de credenciales en PDF
            </p>
          </div>
        </div>

        {/* Action Buttons: Config & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenSettings}
            title="Configuración de Colegio, Logo y Hoja"
            className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold bg-slate-100/80 hover:bg-slate-200/80 text-slate-800 rounded-lg border border-slate-200 transition-all cursor-pointer active:scale-98"
          >
            <Settings className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Configuración</span>
          </button>

          <button
            onClick={onResetData}
            title="Restablecer datos por defecto"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onDownloadPdf}
            disabled={totalStudents === 0}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-lg shadow-sm shadow-indigo-200 transition-all cursor-pointer active:scale-98"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Generar PDF ({totalStudents})</span>
          </button>
        </div>
      </div>
    </header>
  );
};

