import { Box, Button, Chip, Divider, Slider, Stack, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreIcon from '@mui/icons-material/Restore';
import { useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface Filters { brightness: number; contrast: number; saturate: number; hueRotate: number; blur: number }

const DEFAULTS: Filters = { brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, blur: 0 };

const SAMPLE_URL = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80';

export default function ImageEditorDemo() {
  const [src, setSrc] = useState<string>(SAMPLE_URL);
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filterStr = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) hue-rotate(${filters.hueRotate}deg) blur(${filters.blur}px)`;

  const set = (k: keyof Filters) => (_: Event, v: number | number[]) =>
    setFilters((f) => ({ ...f, [k]: v as number }));

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSrc(url);
  };

  const download = () => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d')!;
    ctx.filter = filterStr;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = 'edited.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const isModified = JSON.stringify(filters) !== JSON.stringify(DEFAULTS);

  const SLIDERS: { key: keyof Filters; label: string; min: number; max: number; unit: string }[] = [
    { key: 'brightness', label: 'Brillo', min: 0, max: 200, unit: '%' },
    { key: 'contrast', label: 'Contraste', min: 0, max: 200, unit: '%' },
    { key: 'saturate', label: 'Saturación', min: 0, max: 300, unit: '%' },
    { key: 'hueRotate', label: 'Hue rotate', min: 0, max: 360, unit: '°' },
    { key: 'blur', label: 'Desenfoque', min: 0, max: 10, unit: 'px' },
  ];

  return (
    <Box>
      <Section
        title="Editor de imagen con filtros CSS"
        subtitle="Los filtros se aplican con la propiedad CSS filter. Para descargar, se replica el filtro en el Canvas 2D context.filter."
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, gap: 3 }}>
          <Box>
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" size="small" startIcon={<UploadIcon />} onClick={() => fileRef.current?.click()} sx={{ flex: 1 }}>
                  Subir foto
                </Button>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={upload} />
                <Button variant="outlined" size="small" startIcon={<RestoreIcon />} onClick={() => setFilters(DEFAULTS)} disabled={!isModified}>
                  Reset
                </Button>
              </Box>

              {SLIDERS.map(({ key, label, min, max, unit }) => (
                <Box key={key}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
                    <Chip
                      label={`${filters[key]}${unit}`}
                      size="small"
                      color={filters[key] !== DEFAULTS[key] ? 'primary' : 'default'}
                      sx={{ height: 18, fontSize: '0.65rem' }}
                    />
                  </Box>
                  <Slider
                    value={filters[key]} min={min} max={max}
                    onChange={set(key) as (event: Event, value: number | number[]) => void}
                  />
                </Box>
              ))}

              <Button variant="contained" startIcon={<DownloadIcon />} onClick={download}>
                Descargar PNG
              </Button>
            </Stack>
          </Box>

          <Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                filter: <code style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#FF7043' }}>{filterStr}</code>
              </Typography>
            </Box>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', backgroundColor: 'background.elevated' }}>
              <img
                ref={imgRef}
                src={src}
                alt="Imagen editada"
                crossOrigin="anonymous"
                style={{
                  display: 'block',
                  width: '100%',
                  maxHeight: 420,
                  objectFit: 'cover',
                  filter: filterStr,
                  transition: 'filter 0.1s',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              Foto de ejemplo: Unsplash. Podés subir tu propia imagen con el botón de arriba.
            </Typography>
          </Box>
        </Box>
      </Section>

      <Section title="Aplicar filtro en Canvas para descarga">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const download = () => {
  const img = imgRef.current;
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;

  // Aplicar el mismo filtro CSS en el Canvas 2D
  ctx.filter = 'brightness(120%) contrast(90%) saturate(150%)';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const link = document.createElement('a');
  link.download = 'edited.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
