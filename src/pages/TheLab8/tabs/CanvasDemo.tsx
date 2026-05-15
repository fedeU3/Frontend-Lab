import { Box, Button, Chip, Divider, Slider, Typography } from '@mui/material';
import BrushIcon from '@mui/icons-material/Brush';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const COLORS = ['#FF7043', '#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC', '#ffffff', '#B0BEC5'];

export default function CanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#FF7043');
  const [size, setSize] = useState(4);
  const [eraser, setEraser] = useState(false);
  const [strokes, setStrokes] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#151E26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current || !lastPos.current) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = eraser ? '#151E26' : color;
    ctx.lineWidth = eraser ? size * 3 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    if (drawing.current) setStrokes((s) => s + 1);
    drawing.current = false;
    lastPos.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#151E26';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStrokes(0);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'dibujo.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Box>
      <Section
        title="Herramienta de dibujo libre"
        subtitle="Canvas 2D nativo. mousedown + mousemove para trazar líneas. touch events para dispositivos móviles."
      >
        <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {COLORS.map((c) => (
              <Box
                key={c}
                onClick={() => { setColor(c); setEraser(false); }}
                sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: c,
                  cursor: 'pointer',
                  border: '2px solid',
                  borderColor: color === c && !eraser ? 'white' : 'transparent',
                  boxShadow: color === c && !eraser ? '0 0 0 1px rgba(255,255,255,0.4)' : 'none',
                  transition: 'transform 0.1s',
                  '&:hover': { transform: 'scale(1.15)' },
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 60 }}>Tamaño: {size}px</Typography>
            <Slider value={size} min={1} max={30} onChange={(_, v) => setSize(v as number)} sx={{ width: 100 }} />
          </Box>

          <Button
            variant={eraser ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setEraser((e) => !e)}
            startIcon={<BrushIcon />}
          >
            {eraser ? 'Borrador (ON)' : 'Borrador'}
          </Button>

          <Button variant="outlined" size="small" onClick={clear} startIcon={<DeleteIcon />}>Limpiar</Button>
          <Button variant="outlined" size="small" onClick={download}>Descargar</Button>
          <Chip label={`Trazos: ${strokes}`} size="small" />
        </Box>

        <Box
          sx={{
            position: 'relative',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            cursor: eraser ? 'cell' : 'crosshair',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', height: 480, touchAction: 'none' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
          {strokes === 0 && (
            <Box sx={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.5 }}>
                Dibujá aquí…
              </Typography>
            </Box>
          )}
        </Box>
      </Section>

      <Section title="Referencia Canvas 2D">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const ctx = canvas.getContext('2d');

// Trazar línea
ctx.beginPath();
ctx.moveTo(x1, y1);
ctx.lineTo(x2, y2);
ctx.strokeStyle = '#FF7043';
ctx.lineWidth = 4;
ctx.lineCap = 'round';   // extremos redondeados
ctx.lineJoin = 'round';  // uniones redondeadas
ctx.stroke();

// Exportar como PNG
const dataUrl = canvas.toDataURL('image/png');`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
