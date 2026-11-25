export type RepositoryName = 'Know-How' | 'Project Management' | 'Change Management' | 'Warranty / Field Return / Failure';
export type RepositoryPDF = {
  id: string; title: string; sourceType: 'Email' | 'Meeting' | 'Manual Entry'; component: string;
  repository: RepositoryName; savedAt: string; sourceDate: string; pdfBase64?: string; pdfUrl?: string;
};
export const LIFEX_REPOSITORY_KEY = 'lifex_repository_pdfs_v1';

export function readRepositoryPDFs(): RepositoryPDF[] {
  try { return JSON.parse(localStorage.getItem(LIFEX_REPOSITORY_KEY) || '[]') as RepositoryPDF[]; }
  catch { return []; }
}
export async function syncRepositoryPDFs(): Promise<RepositoryPDF[]> {
  // Static repository index is shipped with the Vite build, so the original
  // repository documents work on static hosts such as Vercel without Express.
  let staticRecords: RepositoryPDF[] = [];
  try {
    const response = await fetch('/repository-data-index.json', { cache: 'no-cache' });
    if (response.ok) staticRecords = await response.json() as RepositoryPDF[];
  } catch {
    // Continue with API/local records for localhost or older deployments.
  }

  let apiRecords: RepositoryPDF[] = [];
  try {
    const response = await fetch('/api/reports');
    if (response.ok) apiRecords = await response.json() as RepositoryPDF[];
  } catch {
    // Vercel static deployments do not run the local Express API.
  }

  const localRecords = readRepositoryPDFs();
  const merged = new Map<string, RepositoryPDF>();
  for (const record of [...localRecords, ...staticRecords, ...apiRecords]) {
    if (record?.id) merged.set(record.id, record);
  }
  const records = Array.from(merged.values());
  localStorage.setItem(LIFEX_REPOSITORY_KEY, JSON.stringify(records));
  window.dispatchEvent(new CustomEvent('lifex-repository-updated'));
  return records;
}
export async function writeRepositoryPDF(record: RepositoryPDF): Promise<RepositoryPDF[]> {
  const response = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record) });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Could not save report to the repository server.');
  }
  const next = await response.json() as RepositoryPDF[];
  localStorage.setItem(LIFEX_REPOSITORY_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('lifex-repository-updated'));
  return next;
}
function ascii(value: string) {
  return value.normalize('NFKD').replace(/[^\x20-\x7E]/g, ' ').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}
export function createPDFBase64(title: string, lines: string[]): string {
  const wrapped: string[] = [];
  for (const raw of [title, '', ...lines]) {
    const words = String(raw).split(/\s+/); let line = '';
    for (const word of words) {
      if (!word && !line) { wrapped.push(''); continue; }
      const candidate = line ? `${line} ${word}` : word;
      if (candidate.length > 92 && line) { wrapped.push(line); line = word; } else line = candidate;
    }
    if (line) wrapped.push(line);
  }
  const pages: string[][] = [];
  for (let i = 0; i < wrapped.length; i += 48) pages.push(wrapped.slice(i, i + 48));
  if (!pages.length) pages.push([]);
  const objects: string[] = [];
  const pageIds = pages.map((_, i) => 4 + i * 2);
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  pages.forEach((page, index) => {
    const pageId = pageIds[index], contentId = pageId + 1;
    const commands = ['BT', '/F1 10 Tf', '48 794 Td', '14 TL'];
    page.forEach((line, lineIndex) => { if (lineIndex) commands.push('T*'); commands.push(`(${ascii(line)}) Tj`); });
    commands.push('ET');
    const stream = commands.join('\n');
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  for (let id = 1; id < objects.length; id++) { offsets[id] = pdf.length; pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`; }
  const xref = pdf.length; pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return btoa(pdf);
}
export function openPDF(source: string | undefined, filename: string) {
  if (!source) return;
  if (source.startsWith('/') || /^https?:\/\//i.test(source)) {
    const link = document.createElement('a');
    link.href = source;
    link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link); link.click(); link.remove();
    return;
  }
  const binary = atob(source); const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const link = document.createElement('a'); link.href = url; link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  document.body.appendChild(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export function viewPDF(source: string | undefined) {
  if (!source) return;
  if (source.startsWith('/') || /^https?:\/\//i.test(source)) {
    window.open(source, '_blank', 'noopener,noreferrer');
    return;
  }
  const binary = atob(source); const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  window.open(url, '_blank', 'noopener,noreferrer');
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
