import jsPDF from 'jspdf';
import { ScanItem } from '../types';

export const generateReportPDF = (scan: ScanItem) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Set fonts
  const setFont = (size: number, weight: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(size);
    doc.setFont('helvetica', weight);
  };

  const addText = (text: string, size: number = 12, weight: 'normal' | 'bold' = 'normal') => {
    setFont(size, weight);
    if (yPosition > pageHeight - margin - 10) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(text, margin, yPosition);
    yPosition += 8;
  };

  const addMultilineText = (text: string, size: number = 11, weight: 'normal' | 'bold' = 'normal') => {
    setFont(size, weight);
    const lines = doc.splitTextToSize(text, contentWidth);
    if (yPosition + lines.length * 5 > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * 5 + 3;
  };

  // Header
  setFont(20, 'bold');
  doc.setTextColor(128, 131, 255); // #8083ff
  doc.text('ResuMetrics AI', margin, yPosition);
  yPosition += 10;

  doc.setTextColor(192, 193, 255); // #c0c1ff
  addText('ATS Scan Analysis Report', 14, 'bold');
  yPosition += 2;

  doc.setTextColor(100, 100, 100);
  setFont(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
  yPosition += 8;

  // Document Info
  doc.setTextColor(50, 50, 50);
  addText('Document Information', 12, 'bold');
  setFont(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`File: ${scan.documentName}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Scanned: ${scan.date}`, margin, yPosition);
  yPosition += 8;

  // Overall Score
  doc.setTextColor(50, 50, 50);
  addText('ATS Compatibility Score', 12, 'bold');
  setFont(10);
  doc.setTextColor(100, 100, 100);

  const scoreColor = scan.atsScore >= 80 ? [78, 222, 163] : scan.atsScore >= 70 ? [208, 188, 255] : [255, 180, 171];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  setFont(16, 'bold');
  doc.text(`${scan.atsScore}% - ${scan.status}`, margin, yPosition);
  yPosition += 8;

  doc.setTextColor(100, 100, 100);
  setFont(10);
  addMultilineText(scan.summary || 'Analysis summary not available.');
  yPosition += 3;

  // Scores Breakdown
  doc.setTextColor(50, 50, 50);
  addText('Score Breakdown', 12, 'bold');
  setFont(10);
  doc.setTextColor(100, 100, 100);

  const scores = [
    { label: 'Formatting & Structure', value: scan.formattingScore },
    { label: 'Keyword Alignment', value: scan.keywordScore },
    { label: 'Action Impact Rating', value: scan.experienceImpactScore }
  ];

  scores.forEach(score => {
    doc.text(`${score.label}: ${score.value}%`, margin, yPosition);
    yPosition += 5;
  });
  yPosition += 3;

  // Keywords
  doc.setTextColor(50, 50, 50);
  addText('Keyword Analysis', 12, 'bold');

  doc.setTextColor(78, 222, 163);
  setFont(10, 'bold');
  doc.text('Matched Keywords:', margin, yPosition);
  yPosition += 4;
  doc.setTextColor(100, 100, 100);
  setFont(9);
  const matchedText = scan.matchedKeywords.join(', ');
  const matchedLines = doc.splitTextToSize(matchedText, contentWidth);
  doc.text(matchedLines, margin, yPosition);
  yPosition += matchedLines.length * 4 + 3;

  doc.setTextColor(255, 180, 171);
  setFont(10, 'bold');
  doc.text('Missing Keywords:', margin, yPosition);
  yPosition += 4;
  doc.setTextColor(100, 100, 100);
  setFont(9);
  const missingText = scan.missingKeywords.join(', ');
  const missingLines = doc.splitTextToSize(missingText, contentWidth);
  doc.text(missingLines, margin, yPosition);
  yPosition += missingLines.length * 4 + 5;

  // Bullet Point Optimizations
  if (scan.bulletPoints && scan.bulletPoints.length > 0) {
    doc.setTextColor(50, 50, 50);
    addText('Bullet Point Optimizations', 12, 'bold');

    scan.bulletPoints.slice(0, 5).forEach((bullet, idx) => {
      if (yPosition > pageHeight - margin - 20) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setTextColor(100, 100, 100);
      setFont(9, 'bold');
      doc.text(`${idx + 1}. ${bullet.section}`, margin, yPosition);
      yPosition += 4;

      setFont(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Original:`, margin + 3, yPosition);
      yPosition += 3;
      const origLines = doc.splitTextToSize(bullet.original, contentWidth - 6);
      doc.text(origLines, margin + 6, yPosition);
      yPosition += origLines.length * 3 + 2;

      doc.setTextColor(78, 222, 163);
      doc.text(`Optimized:`, margin + 3, yPosition);
      yPosition += 3;
      const optLines = doc.splitTextToSize(bullet.optimized, contentWidth - 6);
      doc.text(optLines, margin + 6, yPosition);
      yPosition += optLines.length * 3 + 5;
    });
  }

  // Footer
  doc.setTextColor(200, 200, 200);
  setFont(8);
  doc.text('© 2026 ResuMetrics AI - Powered by Gemini 2.5 Flash', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save
  const fileName = `ResuMetrics_Report_${scan.documentName.replace(/\.[^/.]+$/, '')}_${Date.now()}.pdf`;
  doc.save(fileName);
};
