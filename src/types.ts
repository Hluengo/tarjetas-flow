export interface Student {
  id: string;
  nombre: string;
  curso: string;
}

export interface CourseTeacher {
  curso: string;
  profesor: string;
}

export interface SchoolConfig {
  nombreColegio: string;
  telefono: string;
  direccion: string;
  logoDataUrl: string;
  watermarkOpacity: number; // e.g. 0.09
}

export type PaperSizeKey = 'oficio' | 'custom';

export interface PageConfig {
  paperKey: PaperSizeKey;
  anchoPaginaMm: number; // e.g. 216
  altoPaginaMm: number;  // e.g. 330
  anchoTarjetaMm: number; // e.g. 85
  altoTarjetaMm: number;  // e.g. 55
  columnas: number;        // e.g. 2
  filas: number;           // e.g. 5
}
