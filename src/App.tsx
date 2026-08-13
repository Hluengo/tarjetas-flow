import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StudentManager } from './components/StudentManager';
import { TeacherManager } from './components/TeacherManager';
import { CardPreview } from './components/CardPreview';
import { SchoolConfigModal } from './components/SchoolConfigModal';
import {
  DEFAULT_STUDENTS,
  DEFAULT_TEACHERS,
  DEFAULT_SCHOOL_CONFIG,
  DEFAULT_PAGE_CONFIG,
} from './data/defaultData';
import { Student, CourseTeacher, SchoolConfig, PageConfig } from './types';
import { downloadExcelTemplate } from './utils/excelParser';
import { downloadPdf } from './utils/pdfGenerator';
import { FileSpreadsheet, GraduationCap, LayoutDashboard, Layers } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState<Student[]>(DEFAULT_STUDENTS);
  const [teachers, setTeachers] = useState<CourseTeacher[]>(DEFAULT_TEACHERS);
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>(DEFAULT_SCHOOL_CONFIG);
  const [pageConfig, setPageConfig] = useState<PageConfig>(DEFAULT_PAGE_CONFIG);

  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Stats
  const totalStudents = students.length;
  const uniqueCourses = Array.from(
    new Set(students.map((s) => s.curso.trim().toUpperCase()))
  ).filter(Boolean).length;

  const cardsPerPage = pageConfig.columnas * pageConfig.filas;
  const totalPages = Math.ceil(totalStudents / cardsPerPage) || 1;

  // Actions
  const handleDownloadPdf = () => {
    if (students.length === 0) return;
    downloadPdf(students, teachers, schoolConfig, pageConfig, 'Tarjetas.pdf');
  };

  const handleDownloadTemplate = () => {
    downloadExcelTemplate();
  };

  const handleResetData = () => {
    if (
      window.confirm(
        '¿Deseas restablecer los estudiantes, profesores y la configuración por defecto?'
      )
    ) {
      setStudents(DEFAULT_STUDENTS);
      setTeachers(DEFAULT_TEACHERS);
      setSchoolConfig(DEFAULT_SCHOOL_CONFIG);
      setPageConfig(DEFAULT_PAGE_CONFIG);
      setSelectedStudentIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        totalStudents={totalStudents}
        logoDataUrl={schoolConfig.logoDataUrl}
        onDownloadPdf={handleDownloadPdf}
        onResetData={handleResetData}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* LEFT COLUMN: Data Controls & Editors */}
        <div className="flex-1 flex flex-col space-y-4 min-w-0">
          {/* Section Navigation Tabs */}
          <div className="bg-slate-100/80 p-1 rounded-xl flex items-center space-x-1 border border-slate-200/80 w-fit">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Estudiantes</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === 'students' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {totalStudents}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'teachers'
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Profesores</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                activeTab === 'teachers' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200/70 text-slate-600'
              }`}>
                {teachers.length}
              </span>
            </button>
          </div>

          {/* Active Tab Panel */}
          <div className="flex-1">
            {activeTab === 'students' ? (
              <StudentManager
                students={students}
                teachers={teachers}
                onUpdateStudents={setStudents}
                selectedStudentIndex={selectedStudentIndex}
                onSelectStudentIndex={setSelectedStudentIndex}
                onDownloadTemplate={handleDownloadTemplate}
              />
            ) : (
              <TeacherManager
                students={students}
                teachers={teachers}
                onUpdateTeachers={setTeachers}
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Card Preview */}
        <div className="w-full lg:w-[480px] xl:w-[540px] shrink-0 flex flex-col space-y-4">
          <CardPreview
            students={students}
            teachers={teachers}
            schoolConfig={schoolConfig}
            pageConfig={pageConfig}
            selectedStudentIndex={selectedStudentIndex}
            onSelectStudentIndex={setSelectedStudentIndex}
          />
        </div>
      </main>

      {/* Settings Modal */}
      <SchoolConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        schoolConfig={schoolConfig}
        pageConfig={pageConfig}
        onUpdateSchoolConfig={setSchoolConfig}
        onUpdatePageConfig={setPageConfig}
      />
    </div>
  );
}
