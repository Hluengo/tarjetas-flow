import { Student, CourseTeacher, SchoolConfig, PageConfig } from '../types';

export const DEFAULT_STUDENTS: Student[] = [
  { id: '1', nombre: 'Sofía Antonia Araya Gómez', curso: '3°MA' },
  { id: '2', nombre: 'Benjamín Ignacio Castro Morales', curso: '3°MA' },
  { id: '3', nombre: 'Valentina Paz Díaz Fernández', curso: '3°MA' },
  { id: '4', nombre: 'Mateo Alejandro Espinoza Silva', curso: '3°MA' },
  { id: '5', nombre: 'Camila Francisca Fuentes Rojas', curso: '3°MA' },
  { id: '6', nombre: 'Lucas Gabriel González Tapia', curso: '3°MB' },
  { id: '7', nombre: 'Martina Isidora Hernández Vega', curso: '3°MB' },
  { id: '8', nombre: 'Joaquín Alonso Muñoz Parra', curso: '3°MB' },
  { id: '9', nombre: 'Florence Catalina Navarro Soto', curso: '3°MB' },
  { id: '10', nombre: 'Tomás Eduardo Orellana Vera', curso: '3°MB' },
  { id: '11', nombre: 'Isabella Trinidad Reyes Lara', curso: '3°MB' },
  { id: '12', nombre: 'Maximiliano Nicolás Valenzuela Riquelme', curso: '3°MA' },
];

export const DEFAULT_TEACHERS: CourseTeacher[] = [
  { curso: '3°MA', profesor: 'Ángelo Freire' },
  { curso: '3°MB', profesor: 'Ester Contreras' },
];

export const DEFAULT_SCHOOL_CONFIG: SchoolConfig = {
  nombreColegio: 'COLEGIO CARMELA ROMERO DE ESPINOSA',
  telefono: '41-2224011',
  direccion: 'Freire 114, Concepción',
  logoDataUrl: '/logo.svg',
  watermarkOpacity: 0.09,
};

export const DEFAULT_PAGE_CONFIG: PageConfig = {
  paperKey: 'oficio',
  anchoPaginaMm: 216,
  altoPaginaMm: 330,
  anchoTarjetaMm: 85,
  altoTarjetaMm: 55,
  columnas: 2,
  filas: 5,
};

export const PAPER_PRESETS = {
  oficio: { name: 'Oficio (216 x 330 mm)', width: 216, height: 330 },
};
