import React, { useState } from 'react';
import { CourseTeacher, Student } from '../types';
import { UserCheck, Plus, Trash2, GraduationCap, CheckCircle2 } from 'lucide-react';

interface TeacherManagerProps {
  students: Student[];
  teachers: CourseTeacher[];
  onUpdateTeachers: (teachers: CourseTeacher[]) => void;
}

export const TeacherManager: React.FC<TeacherManagerProps> = ({
  students,
  teachers,
  onUpdateTeachers,
}) => {
  const [newCursoInput, setNewCursoInput] = useState('');
  const [newProfesorInput, setNewProfesorInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Get list of courses from students list
  const coursesFromStudents = Array.from(
    new Set(students.map((s) => s.curso.trim().toUpperCase()))
  ).filter(Boolean);

  // Combine courses from student list + custom teacher entries
  const allCoursesSet = new Set<string>([
    ...coursesFromStudents,
    ...teachers.map((t) => t.curso.trim().toUpperCase()),
  ]);

  const allCourses = Array.from(allCoursesSet).sort();

  const getProfesorForCourse = (courseKey: string) => {
    const found = teachers.find(
      (t) => t.curso.trim().toUpperCase() === courseKey
    );
    return found ? found.profesor : '';
  };

  const handleTeacherChange = (courseKey: string, newProfesorName: string) => {
    const updated = [...teachers];
    const idx = updated.findIndex(
      (t) => t.curso.trim().toUpperCase() === courseKey
    );

    if (idx >= 0) {
      updated[idx] = { curso: courseKey, profesor: newProfesorName };
    } else {
      updated.push({ curso: courseKey, profesor: newProfesorName });
    }

    onUpdateTeachers(updated);
  };

  const handleAddCourseTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCursoInput.trim() || !newProfesorInput.trim()) return;

    const courseKey = newCursoInput.trim().toUpperCase();
    handleTeacherChange(courseKey, newProfesorInput.trim());

    setNewCursoInput('');
    setNewProfesorInput('');
    setShowAddForm(false);
  };

  const handleDeleteTeacherMapping = (courseKey: string) => {
    const updated = teachers.filter(
      (t) => t.curso.trim().toUpperCase() !== courseKey
    );
    onUpdateTeachers(updated);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Profesores a Cargo por Curso</span>
          </h2>
          <p className="text-xs text-slate-500">
            Asigna el nombre del profesor(a) jefe o a cargo de cada curso
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Agregar Curso</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-auto">
        {/* Add Course Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddCourseTeacher}
            className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2"
          >
            <div className="w-28">
              <input
                type="text"
                placeholder="Curso (ej: 4°MA)"
                value={newCursoInput}
                onChange={(e) => setNewCursoInput(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs px-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <input
                type="text"
                placeholder="Nombre del Profesor A Cargo"
                value={newProfesorInput}
                onChange={(e) => setNewProfesorInput(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs px-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded hover:bg-indigo-700"
            >
              Guardar
            </button>
          </form>
        )}

        {/* List of Courses and Assigned Professors */}
        {allCourses.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No se han detectado cursos aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allCourses.map((courseKey) => {
              const currentProfesor = getProfesorForCourse(courseKey);
              const studentCount = students.filter(
                (s) => s.curso.trim().toUpperCase() === courseKey
              ).length;

              return (
                <div
                  key={courseKey}
                  className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors flex flex-col justify-between space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded">
                        {courseKey}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {studentCount} estudiante{studentCount !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteTeacherMapping(courseKey)}
                      title="Quitar asignación"
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1 font-semibold">
                      Profesor(a) a cargo:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ej: Ángelo Freire"
                        value={currentProfesor}
                        onChange={(e) =>
                          handleTeacherChange(courseKey, e.target.value)
                        }
                        className="w-full bg-white text-slate-800 text-xs px-3 py-1.5 rounded border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
                      />
                      {currentProfesor && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 absolute right-2.5 top-2" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
