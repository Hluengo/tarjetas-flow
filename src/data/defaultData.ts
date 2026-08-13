import { Student, CourseTeacher, SchoolConfig, PageConfig } from '../types';

// Veritas logo SVG as data URL
export const DEFAULT_VERITAS_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" width="200" height="280"><rect x="4" y="4" width="192" height="272" fill="none" stroke="black" stroke-width="4"/><rect x="8" y="8" width="184" height="264" fill="none" stroke="black" stroke-width="2"/><rect x="8" y="8" width="184" height="42" fill="white" stroke="black" stroke-width="2"/><text x="100" y="38" font-family="'Arial Black', 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="28" text-anchor="middle" fill="black" letter-spacing="2">VERITAS</text><g stroke="black" stroke-width="1.5"><polygon points="100,165 8,50 100,50" fill="white"/><polygon points="100,165 100,50 192,50" fill="black"/><polygon points="100,165 192,50 192,165" fill="white"/><polygon points="100,165 192,165 100,272" fill="black"/><polygon points="100,165 100,272 8,165" fill="white"/><polygon points="100,165 8,165 8,50" fill="black"/></g><g fill="black" stroke="white" stroke-width="2"><rect x="91" y="60" width="18" height="195"/><rect x="22" y="156" width="156" height="18"/><path d="M 100,50 C 90,62 82,56 90,70 C 97,70 100,65 100,65 C 100,65 103,70 110,70 C 118,56 110,62 100,50 Z"/><path d="M 100,265 C 90,253 82,259 90,245 C 97,245 100,250 100,250 C 100,250 103,245 110,245 C 118,259 110,253 100,265 Z"/><path d="M 15,165 C 27,155 21,147 35,155 C 35,162 30,165 30,165 C 30,165 35,168 35,175 C 21,183 27,175 15,165 Z"/><path d="M 185,165 C 173,155 179,147 165,155 C 165,162 170,165 170,165 C 170,165 165,168 165,175 C 179,183 173,175 185,165 Z"/></g><line x1="100" y1="58" x2="100" y2="258" stroke="white" stroke-width="2.5"/><line x1="20" y1="165" x2="180" y2="165" stroke="white" stroke-width="2.5"/></svg>`;

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
  logoDataUrl: DEFAULT_VERITAS_LOGO,
  watermarkOpacity: 0.09,
};

export const DEFAULT_PAGE_CONFIG: PageConfig = {
  paperKey: 'folio',
  anchoPaginaMm: 216,
  altoPaginaMm: 330,
  anchoTarjetaMm: 85,
  altoTarjetaMm: 55,
  columnas: 2,
  filas: 5,
};

export const PAPER_PRESETS = {
  folio: { name: 'Folio / Oficio (216 x 330 mm)', width: 216, height: 330 },
  carta: { name: 'Carta / Letter (216 x 279 mm)', width: 216, height: 279 },
  a4: { name: 'A4 (210 x 297 mm)', width: 210, height: 297 },
};
