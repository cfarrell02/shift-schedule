import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SCALE_INNER_ATTR, SCALE_OUTER_ATTR } from '../components/scale-to-fit';

// Capture at full size even when the on-screen preview is scaled down to fit
const capture = (element, { markToday }) =>
  html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    onclone: (doc) => {
      doc.querySelectorAll(`[${SCALE_INNER_ATTR}]`).forEach((el) => (el.style.transform = 'none'));
      doc.querySelectorAll(`[${SCALE_OUTER_ATTR}]`).forEach((el) => {
        el.style.height = 'auto';
        el.style.overflow = 'visible';
      });
      if (!markToday) {
        doc.querySelectorAll('[data-today]').forEach((cell) => {
          cell.style.boxShadow = 'none';
          // The first child is the date number, which is bold for today
          cell.firstElementChild.style.fontWeight = '400';
        });
      }
    },
  });

const triggerDownload = (href, filename) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = href;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadPdf = async (element, filename, options) => {
  const canvas = await capture(element, options);
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Fit inside the page margins in both directions, keeping the aspect ratio
  const ratio = Math.min((pageWidth - margin * 2) / canvas.width, (pageHeight - margin * 2) / canvas.height);
  const width = canvas.width * ratio;
  const height = canvas.height * ratio;

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pageWidth - width) / 2, margin, width, height);
  pdf.save(filename);
};

export const downloadPng = async (element, filename, options) => {
  const canvas = await capture(element, options);
  const margin = 100;
  const padded = document.createElement('canvas');
  padded.width = canvas.width + margin * 2;
  padded.height = canvas.height + margin * 2;

  const ctx = padded.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, padded.width, padded.height);
  ctx.drawImage(canvas, margin, margin);

  triggerDownload(padded.toDataURL('image/png'), filename);
};

export const downloadText = (text, filename, type) => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
