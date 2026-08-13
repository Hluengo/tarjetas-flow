import React, { useState, useRef } from 'react';
import { Student, CourseTeacher } from '../types';
import {
  Upload,
  Plus,
  Trash2,
  Search,
  Filter,
  UserPlus,
  FileSpreadsheet,
  Edit2,
  Check,
  X,
  AlertCircle,
  Download,
} from 'lucide-react';
import { parseExcelFile, exportStudentsToExcel } from '../utils/excelParser';

interface StudentManagerProps {
  students: Student[];
  teachers: CourseTeacher[];
  onUpdateStudents: (students: Student[]) => void;
  selectedStudentIndex: number;
  onSelectStudentIndex: (idx: number) => void;
  onDownloadTemplate?: () => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  teachers,
  onUpdateStudents,
  selectedStudentIndex,
  onSelectStudentIndex,
  onDownloadTemplate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');

  // New Student Form State
  const [newNombre, setNewNombre] = useState('');
  const [newCurso, setNewCurso] = useState('3°MA');
  const [showAddForm, setShowAddForm] = useState(false);

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCurso, setEditCurso] = useState('');

  // Upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map courses to teachers
  const teacherMap: Record<string, string> = {};
  teachers.forEach((t) => {
    if (t.curso) {
      teacherMap[t.curso.trim().toUpperCase()] = t.profesor;
    }
  });

  // Extract all unique courses
  const uniqueCourses = Array.from(
    new Set(students.map((s) => s.curso.trim().toUpperCase()))
  ).sort();

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.curso.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse =
      selectedCourseFilter === 'ALL' ||
      s.curso.trim().toUpperCase() === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  // Handle Excel Upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const parsed = await parseExcelFile(file);
      if (parsed.length === 0) {
        setUploadError('El archivo no contiene filas válidas de estudiantes.');
      } else {
        onUpdateStudents(parsed);
        onSelectStudentIndex(0);
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(
        'Error al procesar el archivo Excel. Asegúrate que tenga columnas NOMBRE y CURSO.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Add new student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre.trim() || !newCurso.trim()) return;

    const newStudent: Student = {
      id: String(Date.now()),
      nombre: newNombre.trim(),
      curso: newCurso.trim().toUpperCase(),
    };

    onUpdateStudents([newStudent, ...students]);
    setNewNombre('');
    setShowAddForm(false);
    onSelectStudentIndex(0);
  };

  // Start editing
  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditNombre(student.nombre);
    setEditCurso(student.curso);
  };

  // Save edit
  const handleSaveEdit = (id: string) => {
    if (!editNombre.trim() || !editCurso.trim()) return;

    const updated = students.map((s) =>
      s.id === id
        ? {
            ...s,
            nombre: editNombre.trim(),
            curso: editCurso.trim().toUpperCase(),
          }
        : s
    );
    onUpdateStudents(updated);
    setEditingId(null);
  };

  // Delete student
  const handleDeleteStudent = (id: string) => {
    const updated = students.filter((s) => s.id !== id);
    onUpdateStudents(updated);
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de vaciar toda la lista de estudiantes?')) {
      onUpdateStudents([]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header & Excel Dropzone */}
      <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Lista de Estudiantes</span>
            </h2>
            <p className="text-xs text-slate-500">
              Sube tu archivo .xlsx o .csv con columnas [NOMBRE, CURSO]
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {onDownloadTemplate && (
              <button
                onClick={onDownloadTemplate}
                title="Descargar archivo Excel con formato de ejemplo"
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Plantilla Excel</span>
              </button>
            )}

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Alumno</span>
            </button>

            {students.length > 0 && (
              <button
                onClick={() => exportStudentsToExcel(students)}
                title="Exportar esta lista a Excel"
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            )}
          </div>
        </div>

        {/* Drag & Drop File Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/30 p-4 rounded-lg text-center cursor-pointer transition-all group"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx, .xls, .csv"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <Upload className="w-6 h-6 mx-auto text-slate-400 group-hover:text-indigo-600 transition-colors mb-1.5" />
          <p className="text-xs font-medium text-slate-700 group-hover:text-indigo-900">
            {isUploading ? (
              <span className="text-indigo-600 font-semibold animate-pulse">
                Procesando archivo Excel...
              </span>
            ) : (
              <>
                <span className="text-indigo-600 font-semibold">
                  Haz clic para subir Excel
                </span>{' '}
                o arrastra el archivo aquí
              </>
            )}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Formatos soportados: .XLSX, .XLS, .CSV
          </p>
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Add Student Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddStudent}
            className="mt-4 p-3 bg-white rounded-lg border border-slate-200 flex flex-wrap items-center gap-2 shadow-xs"
          >
            <div className="flex-1 min-w-[180px]">
              <input
                type="text"
                placeholder="Nombre Completo del Estudiante"
                value={newNombre}
                onChange={(e) => setNewNombre(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <div className="w-28">
              <input
                type="text"
                placeholder="Curso (ej: 3°MA)"
                value={newCurso}
                onChange={(e) => setNewCurso(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded hover:bg-indigo-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2 py-1.5 bg-slate-100 text-slate-600 hover:text-slate-800 text-xs rounded"
            >
              Cancelar
            </button>
          </form>
        )}
      </div>

      {/* Search and Course Filter Controls */}
      <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[150px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por alumno o curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-slate-800 pl-8 pr-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Course Filter */}
        <div className="flex items-center space-x-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="bg-white text-slate-700 px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Todos los Cursos ({students.length})</option>
            {uniqueCourses.map((c) => (
              <option key={c} value={c}>
                Curso {c} (
                {students.filter((s) => s.curso.trim().toUpperCase() === c).length})
              </option>
            ))}
          </select>
        </div>

        {students.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1 hover:bg-rose-50 rounded transition-colors font-medium"
          >
            Vaciar Lista
          </button>
        )}
      </div>

      {/* Students Table */}
      <div className="flex-1 overflow-auto max-h-[360px]">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No se encontraron estudiantes en la lista.
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3 w-10">#</th>
                <th className="py-2.5 px-3">Estudiante</th>
                <th className="py-2.5 px-3 w-24">Curso</th>
                <th className="py-2.5 px-3">Prof. a Cargo</th>
                <th className="py-2.5 px-3 text-right w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student, idx) => {
                const globalIndex = students.findIndex((s) => s.id === student.id);
                const isSelected = globalIndex === selectedStudentIndex;
                const isEditing = editingId === student.id;
                const teacherName =
                  teacherMap[student.curso.trim().toUpperCase()] ||
                  'Sin asignar';

                return (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudentIndex(globalIndex)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-950 font-medium'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">
                      {globalIndex + 1}
                    </td>

                    {/* NOMBRE */}
                    <td className="py-2 px-3 font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editNombre}
                          onChange={(e) => setEditNombre(e.target.value)}
                          className="bg-white text-slate-800 px-2 py-1 rounded border border-slate-300 w-full focus:outline-none focus:border-indigo-500"
                        />
                      ) : (
                        student.nombre
                      )}
                    </td>

                    {/* CURSO */}
                    <td className="py-2 px-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editCurso}
                          onChange={(e) => setEditCurso(e.target.value)}
                          className="bg-white text-slate-800 px-2 py-1 rounded border border-slate-300 w-20 focus:outline-none focus:border-indigo-500"
                        />
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-bold text-indigo-700 border border-slate-200 text-[11px]">
                          {student.curso}
                        </span>
                      )}
                    </td>

                    {/* PROFESOR */}
                    <td className="py-2 px-3 text-slate-500 truncate max-w-[140px]">
                      {teacherName}
                    </td>

                    {/* ACTIONS */}
                    <td
                      className="py-2 px-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isEditing ? (
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleSaveEdit(student.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-700"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleStartEdit(student)}
                            title="Editar estudiante"
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            title="Eliminar estudiante"
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
