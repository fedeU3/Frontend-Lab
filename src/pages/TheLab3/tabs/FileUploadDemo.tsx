import {
  Alert, Box, Button, Chip, Divider, IconButton,
  LinearProgress, Stack, Tooltip, Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { useCallback, useRef, useState } from 'react';

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

type FileEntry = {
  id: string;
  file: File;
  preview: string | null;
  progress: number;
  done: boolean;
  error: string | null;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return 'Tipo no permitido. Solo imágenes y PDF.';
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return `Excede el límite de ${MAX_SIZE_MB} MB.`;
  return null;
}

function simulateUpload(id: string, setFiles: React.Dispatch<React.SetStateAction<FileEntry[]>>) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20 + 5;
    if (progress >= 100) {
      clearInterval(interval);
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress: 100, done: true } : f)));
    } else {
      setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)));
    }
  }, 150);
}

export default function FileUploadDemo() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: File[]) => {
    const entries: FileEntry[] = incoming.map((file) => {
      const error = validateFile(file);
      const preview = !error && file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const entry: FileEntry = { id, file, preview, progress: 0, done: false, error };
      if (!error) simulateUpload(id, setFiles);
      return entry;
    });
    setFiles((prev) => [...prev, ...entries]);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const entry = prev.find((f) => f.id === id);
      if (entry?.preview) URL.revokeObjectURL(entry.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
    setFiles([]);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        Drag & drop nativo + input de respaldo. Valida tipo y tamaño al instante. Simula progreso de upload con setInterval.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Drop zone */}
        <Box>
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            sx={{
              border: '2px dashed',
              borderColor: dragging ? 'primary.main' : 'divider',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: dragging ? 'rgba(255,112,67,0.05)' : 'background.elevated',
              transition: 'all 0.2s ease',
              mb: 2,
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(255,112,67,0.05)',
              },
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 42, color: dragging ? 'primary.main' : 'text.secondary', mb: 1 }} />
            <Typography variant="body2" fontWeight="bold">
              {dragging ? 'Soltá los archivos aquí' : 'Arrastrá archivos o hacé click'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Imágenes y PDF · Máx. {MAX_SIZE_MB} MB por archivo
            </Typography>
          </Box>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(',')}
            style={{ display: 'none' }}
            onChange={onInputChange}
          />

          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            {['JPG', 'PNG', 'GIF', 'WEBP', 'PDF'].map((t) => (
              <Chip key={t} label={t} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: 20 }} />
            ))}
          </Stack>
        </Box>

        {/* File list */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Archivos{files.length > 0 && ` (${files.length})`}
            </Typography>
            {files.length > 0 && (
              <Button size="small" variant="text" sx={{ color: 'text.secondary' }} onClick={clearAll}>
                Limpiar todo
              </Button>
            )}
          </Box>

          {files.length === 0 ? (
            <Box
              sx={{
                p: 3, textAlign: 'center', border: '1px solid',
                borderColor: 'divider', borderRadius: 1, backgroundColor: 'background.elevated',
              }}
            >
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sin archivos cargados</Typography>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {files.map((entry) => (
                <Box
                  key={entry.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: entry.error ? 'error.main' : entry.done ? 'success.main' : 'divider',
                    backgroundColor: 'background.elevated',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        flexShrink: 0, width: 48, height: 48, borderRadius: 1,
                        overflow: 'hidden', backgroundColor: 'background.paper',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {entry.preview ? (
                        <img src={entry.preview} alt={entry.file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : entry.file.type === 'application/pdf' ? (
                        <ArticleIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
                      ) : (
                        <ImageIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
                      )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" noWrap sx={{ mb: 0.25 }}>{entry.file.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{formatSize(entry.file.size)}</Typography>

                      {entry.error && (
                        <Alert severity="error" sx={{ mt: 0.5, py: 0, px: 1, '& .MuiAlert-message': { fontSize: '0.7rem' } }}>
                          {entry.error}
                        </Alert>
                      )}

                      {!entry.error && !entry.done && (
                        <LinearProgress
                          variant="determinate"
                          value={entry.progress}
                          sx={{ mt: 0.75, height: 4, borderRadius: 2 }}
                        />
                      )}

                      {entry.done && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                          <Typography variant="caption" sx={{ color: 'success.main' }}>Subido correctamente</Typography>
                        </Box>
                      )}
                    </Box>

                    <Tooltip title="Eliminar">
                      <IconButton size="small" onClick={() => removeFile(entry.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}
