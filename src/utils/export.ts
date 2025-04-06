import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

interface ExportData {
  headers: string[];
  rows: (string | number)[][];
}

export const exportToPDF = (data: ExportData, title: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 25);
  
  // Add table
  (doc as any).autoTable({
    head: [data.headers],
    body: data.rows,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 87, 183] },
  });
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportToCSV = (data: ExportData, title: string) => {
  const csv = Papa.unparse({
    fields: data.headers,
    data: data.rows,
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  link.href = URL.createObjectURL(blob);
  link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`;
  link.click();
  
  URL.revokeObjectURL(link.href);
};