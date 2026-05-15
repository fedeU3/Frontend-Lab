import { Box, Button, Chip, Divider, LinearProgress, Paper, Stack, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface UploadFile {
  id: string;
  name: string;
  size: number;
  totalChunks: number;
  uploadedChunks: number;
  status: 'queued' | 'uploading' | 'paused' | 'done' | 'error';
  error?: string;
}

const CHUNK_SIZE = 256 * 1024;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fmt = (bytes: number) =>
  bytes < 1024 ? `${bytes}B` : bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(1)}KB` : `${(bytes / 1024 ** 2).toFixed(1)}MB`;

const STATUS_COLOR: Record<UploadFile['status'], 'default' | 'warning' | 'success' | 'error' | 'primary'> = {
  queued: 'default', uploading: 'primary', paused: 'warning', done: 'success', error: 'error',
};

export default function InfiniteUploadDemo() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const pausedRef = useRef<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (id: string, patch: Partial<UploadFile>) =>
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, ...patch } : f));

  const uploadFile = async (file: UploadFile) => {
    const totalChunks = file.totalChunks;
    update(file.id, { status: 'uploading' });

    for (let chunk = file.uploadedChunks; chunk < totalChunks; chunk++) {
      if (pausedRef.current.has(file.id)) {
        update(file.id, { status: 'paused', uploadedChunks: chunk });
        return;
      }
      await delay(200 + Math.random() * 300);
      if (Math.random() < 0.08) {
        update(file.id, { status: 'error', uploadedChunks: chunk, error: `Chunk ${chunk + 1} fallido` });
        return;
      }
      update(file.id, { uploadedChunks: chunk + 1 });
    }
    update(file.id, { status: 'done' });
  };

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const newFiles: UploadFile[] = selected.map((f) => ({
      id: `${f.name}-${Date.now()}`,
      name: f.name,
      size: f.size,
      totalChunks: Math.max(1, Math.ceil(f.size / CHUNK_SIZE)),
      uploadedChunks: 0,
      status: 'queued',
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const startAll = () => {
    setFiles((prev) => {
      const toStart = prev.filter((f) => f.status === 'queued' || f.status === 'error' || f.status === 'paused');
      toStart.forEach((f) => {
        pausedRef.current.delete(f.id);
        const copy = { ...f, status: 'uploading' as const, uploadedChunks: f.status === 'error' ? 0 : f.uploadedChunks };
        uploadFile(copy);
      });
      return prev.map((f) => f.status === 'queued' ? { ...f, status: 'uploading' } : f);
    });
  };

  const pause = (id: string) => {
    pausedRef.current.add(id);
  };

  const resume = (f: UploadFile) => {
    pausedRef.current.delete(f.id);
    uploadFile({ ...f, uploadedChunks: f.uploadedChunks });
  };

  const retry = (f: UploadFile) => {
    pausedRef.current.delete(f.id);
    const reset = { ...f, uploadedChunks: 0, status: 'uploading' as const, error: undefined };
    update(f.id, reset);
    uploadFile(reset);
  };

  const remove = (id: string) => {
    pausedRef.current.delete(id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearDone = () => setFiles((prev) => prev.filter((f) => f.status !== 'done'));

  const addDummyFiles = () => {
    const dummies: UploadFile[] = [
      { id: `img-${Date.now()}`, name: 'foto-vacaciones.jpg', size: 3.2 * 1024 ** 2, totalChunks: 13, uploadedChunks: 0, status: 'queued' },
      { id: `vid-${Date.now()}`, name: 'presentacion.mp4', size: 45 * 1024 ** 2, totalChunks: 180, uploadedChunks: 0, status: 'queued' },
      { id: `doc-${Date.now()}`, name: 'informe.pdf', size: 512 * 1024, totalChunks: 2, uploadedChunks: 0, status: 'queued' },
    ];
    setFiles((prev) => [...prev, ...dummies]);
  };

  return (
    <Box>
      <Section
        title="Subida por chunks simulada"
        subtitle="Cada archivo se divide en chunks de 256KB. Se pueden pausar, reanudar y reintentar individualmente. Cola de múltiples archivos con estado independiente."
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => fileRef.current?.click()}>
            Seleccionar archivos
          </Button>
          <Button variant="outlined" onClick={addDummyFiles}>
            Agregar archivos demo
          </Button>
          <Button variant="outlined" onClick={startAll} disabled={!files.some((f) => ['queued', 'paused', 'error'].includes(f.status))}>
            Iniciar todos
          </Button>
          <Button variant="text" onClick={clearDone} sx={{ color: 'text.secondary' }} disabled={!files.some((f) => f.status === 'done')}>
            Limpiar completados
          </Button>
          <input ref={fileRef} type="file" multiple hidden onChange={addFiles} />
        </Box>

        {files.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center', border: '2px dashed', borderColor: 'divider', borderRadius: 1 }}>
            <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Agregá archivos para ver la cola de subida</Typography>
          </Box>
        )}

        <Stack spacing={1.5}>
          {files.map((f) => {
            const progress = f.totalChunks > 0 ? Math.round((f.uploadedChunks / f.totalChunks) * 100) : 0;
            return (
              <Paper key={f.id} variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>{fmt(f.size)}</Typography>
                  <Chip label={f.status} size="small" color={STATUS_COLOR[f.status]} sx={{ height: 20, fontSize: '0.65rem', flexShrink: 0 }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress
                    variant="determinate" value={progress}
                    sx={{ flex: 1, height: 6, borderRadius: 3 }}
                    color={f.status === 'error' ? 'error' : f.status === 'done' ? 'success' : 'primary'}
                  />
                  <Typography variant="caption" sx={{ minWidth: 36, color: 'text.secondary', fontFamily: 'monospace' }}>
                    {progress}%
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {f.status === 'error' ? f.error : `${f.uploadedChunks} / ${f.totalChunks} chunks`}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {f.status === 'uploading' && (
                      <Button size="small" startIcon={<PauseIcon />} onClick={() => pause(f.id)} sx={{ minWidth: 0, fontSize: '0.7rem' }}>Pausar</Button>
                    )}
                    {f.status === 'paused' && (
                      <Button size="small" startIcon={<PlayArrowIcon />} onClick={() => resume(f)} sx={{ minWidth: 0, fontSize: '0.7rem' }}>Reanudar</Button>
                    )}
                    {f.status === 'error' && (
                      <Button size="small" color="warning" startIcon={<ReplayIcon />} onClick={() => retry(f)} sx={{ minWidth: 0, fontSize: '0.7rem' }}>Reintentar</Button>
                    )}
                    <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => remove(f.id)} sx={{ minWidth: 0, fontSize: '0.7rem' }}>
                      Quitar
                    </Button>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      </Section>
    </Box>
  );
}
