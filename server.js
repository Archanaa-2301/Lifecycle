import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3000);
const API_PORT = Number(process.env.API_PORT || 3001);
const DATA_DIR = path.join(__dirname, 'repository-data');
const ALLOWED = new Set(['Know-How', 'Project Management', 'Change Management', 'Warranty / Field Return / Failure']);
app.use(express.json({ limit: '20mb' }));
const safe = value => String(value || '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100);
async function listReports() {
  const result = [];
  for (const repository of ALLOWED) {
    const dir = path.join(DATA_DIR, safe(repository));
    try {
      const files = await fs.readdir(dir);
      for (const file of files.filter(name => name.endsWith('.json'))) {
        try {
          const meta = JSON.parse(await fs.readFile(path.join(dir, file), 'utf8'));
          const pdfBase64 = (await fs.readFile(path.join(dir, `${safe(meta.id)}.pdf`))).toString('base64');
          result.push({ ...meta, pdfBase64 });
        } catch { /* ignore incomplete records */ }
      }
    } catch { /* repository not created yet */ }
  }
  return result.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
}
app.get('/api/repository-documents', async (req, res) => {
  try {
    const repository = String(req.query.repository || 'Know-How');
    if (!ALLOWED.has(repository)) return res.status(400).json({ error: 'Unknown repository.' });
    const dirName = safe(repository);
    const dir = path.join(DATA_DIR, dirName);
    const prefix = repository === 'Know-How' ? /^RB-KH-\d{3}$/ : repository === 'Project Management' ? /^PM-\d{3}$/ : repository === 'Change Management' ? /^CM-\d{3}$/ : /^WF-\d{3}$/;
    const files = await fs.readdir(dir);
    const rows = [];
    for (const file of files.filter(name => name.endsWith('.json'))) {
      try {
        const meta = JSON.parse(await fs.readFile(path.join(dir, file), 'utf8'));
        if (!prefix.test(String(meta.id || ''))) continue;
        const pdfName = `${safe(meta.id)}.pdf`;
        await fs.access(path.join(dir, pdfName));
        rows.push({ ...meta, pdfUrl: `/api/repository-document?repository=${encodeURIComponent(repository)}&id=${encodeURIComponent(meta.id)}` });
      } catch { /* skip incomplete metadata/PDF pairs */ }
    }
    rows.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
    res.json(rows.slice(0, 15));
  } catch (error) { res.status(500).json({ error: 'Could not load repository documents.', detail: String(error) }); }
});
app.get('/api/repository-document', async (req, res) => {
  try {
    const repository = String(req.query.repository || '');
    const id = safe(String(req.query.id || ''));
    if (!ALLOWED.has(repository) || !/^(RB-KH|PM|CM|WF)-\d{3}$/.test(id)) return res.status(404).end();
    const filePath = path.join(DATA_DIR, safe(repository), `${id}.pdf`);
    await fs.access(filePath);
    res.type('application/pdf').set('Content-Disposition', `inline; filename="${id}.pdf"`).sendFile(filePath);
  } catch { res.status(404).end(); }
});

app.get('/api/reports', async (_req, res) => {
  try { res.json(await listReports()); } catch { res.status(500).json({ error: 'Could not read repository records.' }); }
});
app.post('/api/reports', async (req, res) => {
  try {
    const record = req.body;
    if (!record?.id || !record?.title || !ALLOWED.has(record.repository) || !record.pdfBase64) return res.status(400).json({ error: 'A report ID, title, valid repository and PDF are required.' });
    const dir = path.join(DATA_DIR, safe(record.repository));
    await fs.mkdir(dir, { recursive: true });
    const id = safe(record.id);
    for (const repository of ALLOWED) {
      const oldDir = path.join(DATA_DIR, safe(repository));
      await fs.rm(path.join(oldDir, `${id}.pdf`), { force: true }).catch(() => {});
      await fs.rm(path.join(oldDir, `${id}.json`), { force: true }).catch(() => {});
    }
    const { pdfBase64, ...meta } = record;
    await fs.writeFile(path.join(dir, `${id}.pdf`), Buffer.from(pdfBase64, 'base64'));
    await fs.writeFile(path.join(dir, `${id}.json`), JSON.stringify({ ...meta, id }, null, 2), 'utf8');
    res.json(await listReports());
  } catch (error) { res.status(500).json({ error: 'Could not save report to repository.', detail: String(error) }); }
});
app.delete('/api/reports/:id', async (req, res) => {
  const id = safe(req.params.id);
  for (const repository of ALLOWED) {
    const dir = path.join(DATA_DIR, safe(repository));
    await fs.rm(path.join(dir, `${id}.pdf`), { force: true }).catch(() => {});
    await fs.rm(path.join(dir, `${id}.json`), { force: true }).catch(() => {});
  }
  res.json(await listReports());
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
  app.listen(PORT, '0.0.0.0', () => console.log(`LIFEX running at http://localhost:${PORT}`));
} else {
  app.listen(API_PORT, '0.0.0.0', () => console.log(`LIFEX repository API running at http://localhost:${API_PORT}`));
  const viteCli = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  const vite = spawn(process.execPath, [viteCli, '--host', '0.0.0.0', '--port', String(PORT)], { cwd: __dirname, stdio: 'inherit' });
  vite.on('exit', code => process.exit(code ?? 0));
}
