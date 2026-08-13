import * as XLSX from 'xlsx';
import { Student } from '../types';

export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function parseExcelFile(file: File): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert worksheet to JSON rows
        const rawRows = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

        if (!rawRows || rawRows.length === 0) {
          resolve([]);
          return;
        }

        const students: Student[] = [];
        let startIndex = 0;

        // Check if first row is header
        const firstRow = rawRows[0] as any[];
        if (firstRow && firstRow.length >= 2) {
          const col0Str = String(firstRow[0] || '').toUpperCase();
          const col1Str = String(firstRow[1] || '').toUpperCase();
          if (col0Str.includes('NOMB') || col0Str.includes('ALUMN') || col0Str.includes('ESTUDI') || col1Str.includes('CURS')) {
            startIndex = 1; // skip header row
          }
        }

        for (let i = startIndex; i < rawRows.length; i++) {
          const row = rawRows[i] as any[];
          if (!row || row.length === 0) continue;

          const rawNombre = String(row[0] || '').trim();
          const rawCurso = String(row[1] || '').trim();

          if (!rawNombre || rawNombre === 'undefined' || rawNombre === 'null') continue;

          students.push({
            id: String(Date.now() + i + Math.random()),
            nombre: capitalizeWords(rawNombre),
            curso: rawCurso.toUpperCase() || '3°MA',
          });
        }

        resolve(students);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function downloadExcelTemplate() {
  const templateData = [
    ['NOMBRE', 'CURSO'],
    ['Sofía Antonia Araya Gómez', '3°MA'],
    ['Benjamín Ignacio Castro Morales', '3°MA'],
    ['Lucas Gabriel González Tapia', '3°MB'],
    ['Martina Isidora Hernández Vega', '3°MB'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(templateData);
  // Set column widths
  ws['!cols'] = [{ wch: 35 }, { wch: 15 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');

  XLSX.writeFile(wb, 'LISTA_EJEMPLO.xlsx');
}

export function exportStudentsToExcel(students: Student[], filename = 'LISTA_ESTUDIANTES.xlsx') {
  const exportData = [
    ['NOMBRE', 'CURSO'],
    ...students.map(s => [s.nombre, s.curso]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(exportData);
  ws['!cols'] = [{ wch: 35 }, { wch: 15 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');

  XLSX.writeFile(wb, filename);
}
