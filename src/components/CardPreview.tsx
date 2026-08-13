import React, { useState } from 'react';
import { Student, CourseTeacher, SchoolConfig, PageConfig } from '../types';
import { ChevronLeft, ChevronRight, Eye, LayoutGrid, Layers, UserCheck } from 'lucide-react';

interface CardPreviewProps {
  students: Student[];
  teachers: CourseTeacher[];
  schoolConfig: SchoolConfig;
  pageConfig: PageConfig;
  selectedStudentIndex: number;
  onSelectStudentIndex: (idx: number) => void;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  students,
  teachers,
  schoolConfig,
  pageConfig,
  selectedStudentIndex,
  onSelectStudentIndex,
}) => {
  const [viewMode, setViewMode] = useState<'single' | 'sheet'>('sheet');
  const [activePageIndex, setActivePageIndex] = useState(0);

  const teacherMap: Record<string, string> = {};
  teachers.forEach((t) => {
    if (t.curso) {
      teacherMap[t.curso.trim().toUpperCase()] = t.profesor;
    }
  });

  const cardsPerPage = pageConfig.columnas * pageConfig.filas; // e.g. 10
  const totalPages = Math.ceil(students.length / cardsPerPage) || 1;

  // Make sure page index is valid
  const currentPage = Math.min(activePageIndex, totalPages - 1);
  const pageStudents = students.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  const currentStudent = students[selectedStudentIndex] || students[0];

  const getTeacherForStudent = (st: Student) => {
    if (!st) return 'Profesor no definido';
    const key = st.curso.trim().toUpperCase();
    return teacherMap[key] || 'Profesor no definido';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* View Mode Header */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800">Vista Previa Real</h2>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
          <button
            onClick={() => setViewMode('sheet')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
              viewMode === 'sheet'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Hoja Completa ({cardsPerPage}/pág)</span>
          </button>
          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
              viewMode === 'single'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tarjeta Individual</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-4 sm:p-6 bg-slate-100/70 flex-1 flex flex-col items-center justify-center min-h-[440px] overflow-auto">
        {students.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-sm">No hay estudiantes cargados para previsualizar.</p>
          </div>
        ) : viewMode === 'single' ? (
          /* SINGLE CARD DETAILED VIEW */
          <div className="flex flex-col items-center space-y-4 w-full max-w-md">
            {/* Navigation selector */}
            <div className="flex items-center justify-between w-full bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 shadow-2xs">
              <button
                disabled={selectedStudentIndex <= 0}
                onClick={() => onSelectStudentIndex(selectedStudentIndex - 1)}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-800">
                Estudiante {selectedStudentIndex + 1} de {students.length}
              </span>
              <button
                disabled={selectedStudentIndex >= students.length - 1}
                onClick={() => onSelectStudentIndex(selectedStudentIndex + 1)}
                className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Rendered Single Card (Aspect 85/55) */}
            <div className="w-full flex justify-center py-2">
              <RenderSingleCard
                student={currentStudent}
                teacher={getTeacherForStudent(currentStudent)}
                schoolConfig={schoolConfig}
                pageConfig={pageConfig}
              />
            </div>
          </div>
        ) : (
          /* SHEET GRID VIEW */
          <div className="flex flex-col items-center space-y-4 w-full">
            {/* Sheet Page Navigator */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-3 bg-white px-4 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 shadow-2xs">
                <button
                  disabled={currentPage <= 0}
                  onClick={() => setActivePageIndex(currentPage - 1)}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Página <strong className="text-indigo-600">{currentPage + 1}</strong> de{' '}
                  {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setActivePageIndex(currentPage + 1)}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Folio / Page Representation Container */}
            <div className="relative bg-white text-slate-900 rounded-lg shadow-xl p-4 sm:p-6 border border-slate-300 max-w-full overflow-x-auto">
              <div className="text-[10px] text-slate-400 font-mono mb-2 text-center select-none font-medium">
                Papel: {pageConfig.anchoPaginaMm} x {pageConfig.altoPaginaMm} mm (Cuadrícula{' '}
                {pageConfig.columnas}x{pageConfig.filas})
              </div>

              {/* Grid of Cards */}
              <div
                className="grid gap-2 border border-dashed border-slate-300 p-2 bg-slate-50/50"
                style={{
                  gridTemplateColumns: `repeat(${pageConfig.columnas}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: cardsPerPage }).map((_, cellIdx) => {
                  const student = pageStudents[cellIdx];
                  const globalIdx = currentPage * cardsPerPage + cellIdx;
                  const isSelected = globalIdx === selectedStudentIndex;

                  if (!student) {
                    return (
                      <div
                        key={cellIdx}
                        className="w-[200px] h-[130px] sm:w-[220px] sm:h-[142px] border border-dashed border-slate-200 bg-white/40 rounded flex items-center justify-center text-[10px] text-slate-300 select-none"
                      >
                        [Vacío]
                      </div>
                    );
                  }

                  return (
                    <div
                      key={student.id}
                      onClick={() => onSelectStudentIndex(globalIdx)}
                      className={`cursor-pointer transition-all transform hover:scale-[1.02] ${
                        isSelected ? 'ring-2 ring-indigo-600 shadow-md' : ''
                      }`}
                    >
                      <RenderSingleCard
                        student={student}
                        teacher={getTeacherForStudent(student)}
                        schoolConfig={schoolConfig}
                        pageConfig={pageConfig}
                        compact
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* INNER COMPONENT FOR EXACT VISUAL RENDERING OF A SINGLE CARD */
interface RenderSingleCardProps {
  student: Student;
  teacher: string;
  schoolConfig: SchoolConfig;
  pageConfig: PageConfig;
  compact?: boolean;
}

const RenderSingleCard: React.FC<RenderSingleCardProps> = ({
  student,
  teacher,
  schoolConfig,
  compact = false,
}) => {
  // Card proportion width = 85mm, height = 55mm (ratio ~ 1.545)
  const widthClass = compact ? 'w-[200px] h-[130px] sm:w-[220px] sm:h-[142px]' : 'w-[320px] h-[207px] sm:w-[380px] sm:h-[246px]';

  return (
    <div
      className={`relative bg-white text-black font-sans border border-black shadow-md select-none overflow-hidden flex flex-col justify-between ${widthClass}`}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Watermark Logo in center */}
      {schoolConfig.logoDataUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img
            src={schoolConfig.logoDataUrl}
            alt="Watermark"
            className="h-[85%] object-contain"
            style={{
              opacity: schoolConfig.watermarkOpacity ?? 0.09,
            }}
          />
        </div>
      )}

      {/* TOP HALF */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-2 pt-1 pb-1">
        {/* Student Name */}
        <h3
          className={`font-bold leading-tight text-slate-900 tracking-tight text-balance ${
            compact ? 'text-[11px] sm:text-[12px]' : 'text-[15px] sm:text-[17px]'
          }`}
        >
          {student.nombre}
        </h3>

        {/* Course */}
        <p
          className={`text-slate-800 ${
            compact ? 'text-[9px] sm:text-[10px] mt-0.5' : 'text-[12px] sm:text-[13px] mt-1'
          }`}
        >
          Curso: <span className="font-semibold">{student.curso}</span>
        </p>

        {/* Teacher */}
        <p
          className={`text-slate-800 ${
            compact ? 'text-[8.5px] sm:text-[9px] mt-0.5' : 'text-[11px] sm:text-[12px] mt-0.5'
          }`}
        >
          Prof. a cargo: <span className="font-semibold">{teacher}</span>
        </p>
      </div>

      {/* CENTER DIVIDING LINE */}
      <div className="w-full border-t border-black relative z-10"></div>

      {/* BOTTOM HALF */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-2 py-1 bg-white/40">
        {/* School Name */}
        <p
          className={`font-bold text-slate-950 uppercase tracking-tight leading-tight ${
            compact ? 'text-[8.5px] sm:text-[9px]' : 'text-[11px] sm:text-[12px]'
          }`}
        >
          {schoolConfig.nombreColegio || 'COLEGIO CARMELA ROMERO DE ESPINOSA'}
        </p>

        {/* Phone */}
        <p
          className={`font-bold text-slate-900 ${
            compact ? 'text-[8px] sm:text-[8.5px] mt-0.5' : 'text-[10px] sm:text-[11px] mt-0.5'
          }`}
        >
          {schoolConfig.telefono || '41-2224011'}
        </p>

        {/* Address */}
        <p
          className={`font-bold text-slate-900 ${
            compact ? 'text-[8px] sm:text-[8.5px]' : 'text-[10px] sm:text-[11px]'
          }`}
        >
          {schoolConfig.direccion || 'Freire 114, Concepción'}
        </p>
      </div>
    </div>
  );
};
