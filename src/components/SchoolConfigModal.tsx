import React, { useRef } from 'react';
import { SchoolConfig, PageConfig, PaperSizeKey } from '../types';
import { PAPER_PRESETS } from '../data/defaultData';
import {
  X,
  Building,
  Image as ImageIcon,
  Upload,
  Check,
  Trash2,
} from 'lucide-react';

interface SchoolConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolConfig: SchoolConfig;
  pageConfig: PageConfig;
  onUpdateSchoolConfig: (config: SchoolConfig) => void;
  onUpdatePageConfig: (config: PageConfig) => void;
}

export const SchoolConfigModal: React.FC<SchoolConfigModalProps> = ({
  isOpen,
  onClose,
  schoolConfig,
  pageConfig,
  onUpdateSchoolConfig,
  onUpdatePageConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processLogoFile = (file: File) => {
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text && text.includes('<svg')) {
          // Convert raw SVG text to clean data URL
          const encodedSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text);
          onUpdateSchoolConfig({
            ...schoolConfig,
            logoDataUrl: encodedSvg,
          });
        } else {
          // Fallback to dataURL
          const readerData = new FileReader();
          readerData.onload = (ev) => {
            if (ev.target?.result) {
              onUpdateSchoolConfig({
                ...schoolConfig,
                logoDataUrl: ev.target.result as string,
              });
            }
          };
          readerData.readAsDataURL(file);
        }
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          onUpdateSchoolConfig({
            ...schoolConfig,
            logoDataUrl: dataUrl,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPaper = (key: PaperSizeKey) => {
    if (key === 'custom') return;
    const preset = PAPER_PRESETS[key as keyof typeof PAPER_PRESETS];
    if (preset) {
      onUpdatePageConfig({
        ...pageConfig,
        paperKey: key,
        anchoPaginaMm: preset.width,
        altoPaginaMm: preset.height,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800">
              Configuración de Colegio, Logo y Página
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          {/* SECTION 1: DATOS DEL COLEGIO */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Información del Establecimiento (Pie de Tarjeta)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-semibold">
                  Nombre del Colegio
                </label>
                <input
                  type="text"
                  value={schoolConfig.nombreColegio}
                  onChange={(e) =>
                    onUpdateSchoolConfig({
                      ...schoolConfig,
                      nombreColegio: e.target.value,
                    })
                  }
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">
                  Teléfono / Contacto
                </label>
                <input
                  type="text"
                  value={schoolConfig.telefono}
                  onChange={(e) =>
                    onUpdateSchoolConfig({
                      ...schoolConfig,
                      telefono: e.target.value,
                    })
                  }
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">
                  Dirección / Ciudad
                </label>
                <input
                  type="text"
                  value={schoolConfig.direccion}
                  onChange={(e) =>
                    onUpdateSchoolConfig({
                      ...schoolConfig,
                      direccion: e.target.value,
                    })
                  }
                  className="w-full bg-white text-slate-800 text-xs px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: LOGO Y MARCA DE AGUA */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Logo Institucional y Marca de Agua</span>
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center space-x-4">
                {/* Logo Thumbnail */}
                <div className="w-20 h-24 bg-white rounded border border-slate-200 flex items-center justify-center p-2 shrink-0 shadow-2xs">
                  {schoolConfig.logoDataUrl ? (
                    <img
                      src={schoolConfig.logoDataUrl}
                      alt="Logo preview"
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <p className="text-slate-800 font-bold">
                    Insignia o Escudo de la Institución
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Se dibuja como marca de agua semitransparente al centro de cada tarjeta.
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".svg, .png, .jpg, .jpeg, .webp, image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processLogoFile(e.target.files[0]);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold transition-colors shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Imagen / SVG</span>
                    </button>

                    {schoolConfig.logoDataUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateSchoolConfig({
                            ...schoolConfig,
                            logoDataUrl: '',
                          })
                        }
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 transition-colors font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Quitar Logo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Watermark Opacity Slider */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-700 font-semibold">
                    Transparencia Marca de Agua:
                  </label>
                  <span className="font-mono text-indigo-600 font-bold">
                    {Math.round((schoolConfig.watermarkOpacity ?? 0.09) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="0.30"
                  step="0.01"
                  value={schoolConfig.watermarkOpacity ?? 0.09}
                  onChange={(e) =>
                    onUpdateSchoolConfig({
                      ...schoolConfig,
                      watermarkOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: FORMATO DE HOJA Y CUADRÍCULA */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Formato de Papel e Impresión</span>
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <label className="block text-slate-600 mb-1.5 font-semibold">
                  Tamaño de Papel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(PAPER_PRESETS) as PaperSizeKey[]).map((key) => {
                    const isSelected = pageConfig.paperKey === key;
                    const preset = PAPER_PRESETS[key as keyof typeof PAPER_PRESETS];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectPaper(key)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold text-[12px] capitalize">{preset.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {preset.width} x {preset.height} mm
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grid columns & rows */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">
                    Columnas por Hoja
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={pageConfig.columnas}
                    onChange={(e) =>
                      onUpdatePageConfig({
                        ...pageConfig,
                        columnas: parseInt(e.target.value) || 2,
                      })
                    }
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">
                    Filas por Hoja
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={pageConfig.filas}
                    onChange={(e) =>
                      onUpdatePageConfig({
                        ...pageConfig,
                        filas: parseInt(e.target.value) || 5,
                      })
                    }
                    className="w-full bg-white text-slate-800 text-xs px-3 py-2 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Aceptar y Aplicar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
