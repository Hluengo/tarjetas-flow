import { jsPDF } from 'jspdf';
import { Student, CourseTeacher, SchoolConfig, PageConfig } from '../types';

export function getAdjustedFontSize(
  doc: jsPDF,
  text: string,
  maxAnchoMm: number,
  startSizePt: number
): number {
  let size = startSizePt;
  while (size > 5) {
    doc.setFontSize(size);
    const textWidthMm = doc.getTextWidth(text);
    if (textWidthMm <= maxAnchoMm) {
      return size;
    }
    size -= 0.5;
  }
  return 5;
}

export function generatePdfBlob(
  students: Student[],
  teachers: CourseTeacher[],
  schoolConfig: SchoolConfig,
  pageConfig: PageConfig
): jsPDF {
  const {
    anchoPaginaMm,
    altoPaginaMm,
    anchoTarjetaMm,
    altoTarjetaMm,
    columnas,
    filas,
  } = pageConfig;

  // Initialize jsPDF with exact custom page size in mm
  const doc = new jsPDF({
    orientation: anchoPaginaMm > altoPaginaMm ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [anchoPaginaMm, altoPaginaMm],
  });

  const teacherMap: Record<string, string> = {};
  teachers.forEach((t) => {
    if (t.curso) {
      teacherMap[t.curso.trim().toUpperCase()] = t.profesor;
    }
  });

  const anchoOcupado = columnas * anchoTarjetaMm;
  const altoOcupado = filas * altoTarjetaMm;

  const margenX = (anchoPaginaMm - anchoOcupado) / 2;
  const margenY = (altoPaginaMm - altoOcupado) / 2;

  const tarjetasPorPagina = columnas * filas;
  const anchoTextoMax = anchoTarjetaMm - 8; // 8mm margin total (4mm left, 4mm right)

  students.forEach((estudiante, indice) => {
    const posicion = indice % tarjetasPorPagina;

    if (indice > 0 && posicion === 0) {
      doc.addPage([anchoPaginaMm, altoPaginaMm]);
    }

    const fila = Math.floor(posicion / columnas);
    const columna = posicion % columnas;

    const x = margenX + columna * anchoTarjetaMm;
    const y = margenY + fila * altoTarjetaMm;

    const nombre = estudiante.nombre.trim();
    const curso = estudiante.curso.trim();
    const cursoKey = curso.toUpperCase();
    const profesor = teacherMap[cursoKey] || 'Profesor no definido';

    // 1. CARD OUTER RECTANGLE
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);
    doc.rect(x, y, anchoTarjetaMm, altoTarjetaMm);

    // 2. WATERMARK LOGO
    if (schoolConfig.logoDataUrl) {
      try {
        const anchoLogo = 45;
        const altoLogo = 55;
        const logoX = x + (anchoTarjetaMm - anchoLogo) / 2;
        const logoY = y + (altoTarjetaMm - altoLogo) / 2;

        const opacity = schoolConfig.watermarkOpacity ?? 0.09;

        // Set GState opacity in jsPDF
        // @ts-ignore
        if (doc.GState) {
          // @ts-ignore
          doc.setGState(new doc.GState({ opacity }));
        }

        doc.addImage(
          schoolConfig.logoDataUrl,
          'PNG',
          logoX,
          logoY,
          anchoLogo,
          altoLogo,
          undefined,
          'FAST'
        );

        // Reset opacity
        // @ts-ignore
        if (doc.GState) {
          // @ts-ignore
          doc.setGState(new doc.GState({ opacity: 1.0 }));
        }
      } catch (e) {
        console.warn('Could not render watermark image in PDF:', e);
      }
    }

    // 3. CENTER DIVIDING LINE
    doc.setLineWidth(0.2);
    doc.setDrawColor(0, 0, 0);
    doc.line(x, y + altoTarjetaMm / 2, x + anchoTarjetaMm, y + altoTarjetaMm / 2);

    const centerX = x + anchoTarjetaMm / 2;
    doc.setTextColor(0, 0, 0);

    // 4. TOP HALF CONTENT

    // NOMBRE (Helvetica-Bold, 16pt max)
    doc.setFont('helvetica', 'bold');
    const tamNombre = getAdjustedFontSize(doc, nombre, anchoTextoMax, 16);
    doc.setFontSize(tamNombre);
    doc.text(nombre, centerX, y + 8, { align: 'center' });

    // CURSO (Helvetica, 12pt max)
    const textoCurso = `Curso: ${curso}`;
    doc.setFont('helvetica', 'normal');
    const tamCurso = getAdjustedFontSize(doc, textoCurso, anchoTextoMax, 12);
    doc.setFontSize(tamCurso);
    doc.text(textoCurso, centerX, y + 17, { align: 'center' });

    // PROFESOR (Helvetica, 11pt max)
    const textoProfesor = `Prof. a cargo: ${profesor}`;
    doc.setFont('helvetica', 'normal');
    const tamProfesor = getAdjustedFontSize(doc, textoProfesor, anchoTextoMax, 11);
    doc.setFontSize(tamProfesor);
    doc.text(textoProfesor, centerX, y + 25, { align: 'center' });

    // 5. BOTTOM HALF CONTENT

    // COLEGIO (Helvetica-Bold, 10pt max)
    const textoColegio = schoolConfig.nombreColegio || 'COLEGIO CARMELA ROMERO DE ESPINOSA';
    doc.setFont('helvetica', 'bold');
    const tamColegio = getAdjustedFontSize(doc, textoColegio, anchoTextoMax, 10);
    doc.setFontSize(tamColegio);
    doc.text(textoColegio, centerX, y + 36, { align: 'center' });

    // TELEFONO
    const textoTelefono = schoolConfig.telefono || '41-2224011';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(tamColegio);
    doc.text(textoTelefono, centerX, y + 43, { align: 'center' });

    // DIRECCION
    const textoDireccion = schoolConfig.direccion || 'Freire 114, Concepción';
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(tamColegio);
    doc.text(textoDireccion, centerX, y + 49, { align: 'center' });
  });

  return doc;
}

export function downloadPdf(
  students: Student[],
  teachers: CourseTeacher[],
  schoolConfig: SchoolConfig,
  pageConfig: PageConfig,
  filename = 'Tarjetas.pdf'
) {
  const doc = generatePdfBlob(students, teachers, schoolConfig, pageConfig);
  doc.save(filename);
}
