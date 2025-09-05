import type { CabinTrip } from '../types';

// Security: Helper function to escape HTML characters and prevent XSS.
const escapeHTML = (str: string | undefined | null): string => {
  if (!str) return '';
  // Basic escaping for common XSS vectors.
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Generates a simplified, email-client-friendly HTML body for the mailto link.
const generateEmailHTMLBody = (trip: CabinTrip): string => {
  const anomaliesTableRows = trip.anomalies.map(a => `
    <tr style="border-bottom: 1px solid #ddd; page-break-inside: avoid;">
      <td style="padding: 8px; vertical-align: top;">${escapeHTML(a.element)}</td>
      <td style="padding: 8px; vertical-align: top;">${escapeHTML(a.defect)}</td>
      <td style="padding: 8px; vertical-align: top;">${escapeHTML(a.level)}</td>
      <td style="padding: 8px; vertical-align: top;">${escapeHTML(a.pk)}</td>
      <td style="padding: 8px; vertical-align: top;">${escapeHTML(a.notes) || '---'}</td>
    </tr>
  `).join('');

  const photoNote = trip.anomalies.some(a => a.photo) 
    ? `<p style="font-size: 12px; color: #555555; margin-top: 15px;"><i>Nota: Este informe contiene fotografías. Para verlas, por favor, genere el informe completo desde la aplicación y guárdelo como PDF.</i></p>` 
    : '';

  return `
    <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333333; line-height: 1.5;">
      <h2 style="color: #1A4488; border-bottom: 2px solid #1A4488; padding-bottom: 5px;">Informe de Viaje en Cabina</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr><td style="padding: 4px 0;"><strong>Código:</strong></td><td style="padding: 4px 0;">${escapeHTML(trip.code)}</td></tr>
        <tr><td style="padding: 4px 0;"><strong>Línea:</strong></td><td style="padding: 4px 0;">${escapeHTML(trip.line)} (${escapeHTML(trip.track)})</td></tr>
        <tr><td style="padding: 4px 0;"><strong>Fecha:</strong></td><td style="padding: 4px 0;">${escapeHTML(new Date(trip.date).toLocaleDateString())}</td></tr>
        <tr><td style="padding: 4px 0;"><strong>Técnico:</strong></td><td style="padding: 4px 0;">${escapeHTML(trip.technician)}</td></tr>
      </table>
      <h3 style="color: #1A4488; margin-top: 25px;">Anomalías Registradas</h3>
      ${trip.anomalies.length > 0 ? `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">Elemento</th>
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">Defecto</th>
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">Nivel</th>
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">PK</th>
              <th style="padding: 8px; border-bottom: 1px solid #ddd;">Notas</th>
            </tr>
          </thead>
          <tbody>
            ${anomaliesTableRows}
          </tbody>
        </table>
      ` : `<p>No se registraron anomalías en este viaje.</p>`}
      ${trip.aiSummary ? `
        <h3 style="color: #1A4488; margin-top: 25px;">Resumen (IA)</h3>
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 5px;">
          <p style="white-space: pre-wrap; margin: 0;">${escapeHTML(trip.aiSummary)}</p>
        </div>
      ` : ''}
      ${photoNote}
    </div>
  `;
};


const LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAABkCAYAAABaQU4DAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF1ElEQVR4nO3dy27bSBhAYVbrG/01/ms1Ww8S3IMkKJ8iXQmSN+p1sN4SIAEkU1Wd7v/2+Xw+v//u1gMAAPhft5ud7R8+fPj+/v75/v37Z+vV3lT2T7e7f/z44cW//3/vP/3004e3h3t7e8E/Wz/b2tqqXq+vXq/3t8uP2vC3T09Pe3t7m/kLAAAA+D93W83u+PHj5/P5/OnTp89///vft35v+V3x9/f3X5/O+51+7ePj49e/xP1qZ2dntVrtdnZ2frp7ZAAAAIB/cjf//Oc/v/zyyy+lP/3pT59+fP1r3+f0x8fH09PTe/ny5Xy+j/V3Nz88uXLD2/yAQAAAP5t787u5cuXz+fzO5+v5efn58uXL9+/f//p+bNnz56fP39++fLlx+lPHz58+PTp08vLy6u9vf369esvb+YDAADAb9zNbv/888+l4Z9++ulL/bPf7/dPT08PZ87z5s2bp6ens/u3s7Pz8vLy6enp8/n86elptVrte+cDAADAb9htdnZ2loZ/v9/vV6vV/X5/tVqtVqvd3d21t7c/n8/VajXzAwAAAD/LXXZ2dmY22/P5vNlsfvi/F+03AAAYoG/c2W+3L9gNAACGBbjfAAAAhgG43wAAAIYBONYdAAAAwzBg/y0AAIaFm91dAAAAw7BwezsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdncDAAAAw7BwdzsAAAAA79xtdnc-8f+1c0l5QAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDktMDZUMTY6NTI6MTMtMDQ6MDAmg1HPAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIQ0LTA5LTA2VDE2OjUyOjEzLTA0OjAwHdy5EAAAAABJRU5ErkJggg==';

// Generates the full HTML for the report opened in a new tab.
export const generateReportHTML = (trip: CabinTrip): string => {
  // Use the sanitizer for all user-provided data in the visual report as well.
  const anomaliesTableRows = trip.anomalies.map(a => `
    <tr>
      <td>${escapeHTML(a.element)}</td>
      <td>${escapeHTML(a.defect)}</td>
      <td>${escapeHTML(a.level)}</td>
      <td>${escapeHTML(a.pk)}</td>
      <td>${a.location ? `${a.location.lat.toFixed(5)}, ${a.location.lng.toFixed(5)}` : 'N/A'}</td>
      <td>${escapeHTML(a.notes) || '---'}</td>
    </tr>
  `).join('');

  const photosSection = trip.anomalies
    .filter(a => a.photo)
    .map(a => `
      <div class="photo-container">
        <img src="${a.photo}" alt="Fotografía de la anomalía">
        <p><b>${escapeHTML(a.defect)}</b> (${escapeHTML(a.element)}) en PK ${escapeHTML(a.pk)}</p>
      </div>
    `).join('');

  // Generate the HTML body for the email and create the mailto link
  const mailtoSubject = encodeURIComponent(`Informe de Viaje en Cabina - ${escapeHTML(trip.code)}`);
  const emailBodyHTML = generateEmailHTMLBody(trip);
  const mailtoHref = `mailto:?subject=${mailtoSubject}&body=${encodeURIComponent(emailBodyHTML)}`;

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Informe de Viaje en Cabina - ${escapeHTML(trip.code)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
          margin: 0;
          padding: 2.5rem;
          color: #333333;
          background-color: #ffffff;
          padding-top: 6rem; /* Space for the controls bar */
        }
        .controls {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background-color: #f1f5f9;
          padding: 0.75rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          justify-content: center;
          gap: 1rem;
          z-index: 100;
          border-bottom: 1px solid #e2e8f0;
        }
        .controls button, .controls a {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          border: 1px solid transparent;
          border-radius: 0.375rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          background-color: #1A4488;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s;
        }
        .controls button:hover, .controls a:hover {
          background-color: #14366d;
        }
        .controls svg {
          height: 1.25rem;
          width: 1.25rem;
          margin-right: 0.5rem;
        }
        .report-container {
          max-width: 1000px;
          margin: auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 4px solid #1A4488;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }
        .header img {
          height: 40px;
        }
        .header h1 {
          font-size: 2rem;
          color: #1A4488;
          margin: 0;
          text-align: right;
        }
        .section-title {
          font-size: 1.5rem;
          color: #1A4488;
          margin-top: 2rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }
        .trip-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          background-color: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
        }
        .detail-item p {
          margin: 0;
          font-weight: 600;
        }
        .detail-item span {
          color: #64748b;
          font-weight: 400;
          font-size: 0.875rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        th, td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          text-align: left;
          font-size: 0.875rem;
        }
        th {
          background-color: #f1f5f9;
          font-weight: 600;
        }
        .summary-box {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 1.5rem;
          border-radius: 0.5rem;
          white-space: pre-wrap;
        }
        .photos-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-top: 1rem;
        }
        .photo-container {
            page-break-inside: avoid;
            border: 1px solid #e2e8f0;
            border-radius: 0.5rem;
            padding: 1rem;
            text-align: center;
        }
        .photo-container img {
            max-width: 100%;
            border-radius: 0.25rem;
            margin-bottom: 0.5rem;
        }
        .photo-container p {
            font-size: 0.8rem;
            color: #475569;
            margin: 0;
        }
        @media print {
            body { 
              padding-top: 2.5rem;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .controls {
              display: none;
            }
            .trip-details, table, .summary-box, .photo-container {
                page-break-inside: avoid;
            }
        }
      </style>
    </head>
    <body>
      <div class="controls">
        <button onclick="window.print()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
            Imprimir
        </button>
        <a href="${mailtoHref}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Enviar por Correo
        </a>
      </div>

      <div class="report-container">
        <div class="header">
          <img src="${LOGO_BASE64}" alt="Ineco Logo">
          <h1>Informe de Viaje<br>en Cabina</h1>
        </div>

        <h2 class="section-title">Detalles del Viaje</h2>
        <div class="trip-details">
          <div class="detail-item"><span>Código</span><p>${escapeHTML(trip.code)}</p></div>
          <div class="detail-item"><span>Línea</span><p>${escapeHTML(trip.line)}</p></div>
          <div class="detail-item"><span>Vía</span><p>${escapeHTML(trip.track)}</p></div>
          <div class="detail-item"><span>Fecha</span><p>${escapeHTML(new Date(trip.date).toLocaleDateString())}</p></div>
          <div class="detail-item"><span>Técnico</span><p>${escapeHTML(trip.technician)}</p></div>
          <div class="detail-item"><span>Tramo (PK)</span><p>${escapeHTML(trip.pkStart)} - ${escapeHTML(trip.pkEnd)}</p></div>
        </div>
        
        <h2 class="section-title">Anomalías Registradas (${trip.anomalies.length})</h2>
        ${trip.anomalies.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Elemento</th>
                <th>Defecto</th>
                <th>Nivel</th>
                <th>PK</th>
                <th>Coords.</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              ${anomaliesTableRows}
            </tbody>
          </table>
        ` : '<p>No se registraron anomalías en este viaje.</p>'}

        ${trip.aiSummary ? `
          <h2 class="section-title">Resumen (IA)</h2>
          <div class="summary-box">
            <p>${escapeHTML(trip.aiSummary)}</p>
          </div>
        ` : ''}

        ${photosSection ? `
          <h2 class="section-title">Fotografías Adjuntas</h2>
          <div class="photos-grid">
            ${photosSection}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};
