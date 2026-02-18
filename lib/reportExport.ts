/**
 * Report export utilities - Chart/section export (PNG with watermark) and KPI export (CSV with timestamp)
 * Use exportChartAsPNG with a section ref to export all charts in a module as a single image.
 */

import html2canvas from 'html2canvas';

export function getExportTimestamp(): string {
  return new Date().toISOString();
}

export function getFormattedTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });
}

/**
 * Export a chart/element as PNG with watermark (timestamp)
 */
export async function exportChartAsPNG(
  element: HTMLElement | null,
  filename: string,
  reportName?: string
): Promise<void> {
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
    });

    const ctx = canvas.getContext('2d');
    if (ctx) {
      const watermark = `${reportName || 'Report'} • Exported: ${getFormattedTimestamp()}`;
      ctx.save();
      ctx.font = '14px Arial';
      ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(watermark, canvas.width - 16, canvas.height - 12);
      ctx.restore();
    }

    const link = document.createElement('a');
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('Chart export failed:', err);
  }
}

/**
 * Export KPIs as CSV with timestamp watermark in header
 */
export function exportKPIsAsCSV(
  kpis: { label: string; value: string | number }[],
  filename: string,
  reportName?: string
): void {
  const timestamp = getFormattedTimestamp();
  const watermark = reportName
    ? `"${reportName} - Exported: ${timestamp}"`
    : `"Exported: ${timestamp}"`;

  const headerRow = ['Metric', 'Value'];
  const rows = kpis.map((k) => [k.label, String(k.value)]);

  const csvContent = [
    watermark,
    '',
    headerRow.join(','),
    ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-kpis-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
