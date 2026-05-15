import { Box, Button, Chip, Divider, MenuItem, Select, Slider, Stack, TextField, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const PRESETS = [
  { label: 'URL', value: 'https://github.com/federico-hue' },
  { label: 'Email', value: 'mailto:contacto@frontendlab.com' },
  { label: 'Tel', value: 'tel:+54911234567' },
  { label: 'WiFi', value: 'WIFI:T:WPA;S:MiRed;P:MiContraseña;;' },
  { label: 'Texto', value: 'Frontend Lab — React 19 + TypeScript' },
];

const FG_COLORS = ['#FF7043', '#42A5F5', '#66BB6A', '#1a1a1a', '#EF5350', '#AB47BC'];
const BG_COLORS = ['#ffffff', '#1a1a1a', '#151E26', '#2C3E50', '#f5f5f5'];

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

export default function QRCodeDemo() {
  const [value, setValue] = useState('https://github.com');
  const [size, setSize] = useState(200);
  const [fg, setFg] = useState('#1a1a1a');
  const [bg, setBg] = useState('#ffffff');
  const [level, setLevel] = useState<ErrorLevel>('M');
  const canvasRef = useRef<HTMLDivElement>(null);

  const download = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Box>
      <Section title="Generador de QR" subtitle="qrcode.react renderiza el QR como <canvas> (QRCodeCanvas) o <svg> (QRCodeSVG). El canvas permite descarga directa como PNG.">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Contenido</Typography>
                <TextField
                  size="small" fullWidth multiline rows={2}
                  value={value} onChange={(e) => setValue(e.target.value)}
                  placeholder="URL, texto, datos de contacto…"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {PRESETS.map((p) => (
                  <Chip key={p.label} label={p.label} size="small" clickable onClick={() => setValue(p.value)} />
                ))}
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Tamaño: {size}px</Typography>
                <Slider value={size} min={100} max={400} step={10} onChange={(_, v) => setSize(v as number)} />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Color del código</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {FG_COLORS.map((c) => (
                    <Box
                      key={c} onClick={() => setFg(c)}
                      sx={{
                        width: 28, height: 28, borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                        border: '2px solid', borderColor: fg === c ? 'primary.main' : 'divider',
                        boxShadow: fg === c ? `0 0 0 2px ${c}44` : 'none',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Color de fondo</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {BG_COLORS.map((c) => (
                    <Box
                      key={c} onClick={() => setBg(c)}
                      sx={{
                        width: 28, height: 28, borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                        border: '2px solid', borderColor: bg === c ? 'primary.main' : 'divider',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Nivel de corrección de errores</Typography>
                <Select size="small" value={level} onChange={(e) => setLevel(e.target.value as ErrorLevel)}>
                  <MenuItem value="L">L — Bajo (~7%)</MenuItem>
                  <MenuItem value="M">M — Medio (~15%)</MenuItem>
                  <MenuItem value="Q">Q — Cuartil (~25%)</MenuItem>
                  <MenuItem value="H">H — Alto (~30%)</MenuItem>
                </Select>
              </Box>

              <Button variant="contained" startIcon={<DownloadIcon />} onClick={download}>
                Descargar PNG
              </Button>
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              ref={canvasRef}
              sx={{ p: 3, borderRadius: 2, backgroundColor: bg, display: 'inline-block', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              <QRCodeCanvas value={value || ' '} size={size} fgColor={fg} bgColor={bg} level={level} />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, maxWidth: 240, textAlign: 'center' }}>
              {value.length} caracteres · {size}×{size}px · EC: {level}
            </Typography>
          </Box>
        </Box>
      </Section>

      <Section title="Uso básico">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

// Canvas — permite descargar como PNG via canvas.toDataURL()
<QRCodeCanvas
  value="https://example.com"
  size={200}
  fgColor="#1a1a1a"
  bgColor="#ffffff"
  level="M"           // 'L' | 'M' | 'Q' | 'H'
  includeMargin={true}
/>

// SVG — escalable, ideal para impresión
<QRCodeSVG value="https://example.com" size={200} />`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
