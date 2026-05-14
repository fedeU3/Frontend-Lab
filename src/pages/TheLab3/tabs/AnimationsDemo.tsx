import {
  Box, Button, Card, CardContent, Chip, Collapse, Divider,
  Fade, Grow, Slide, Stack, Typography, Zoom,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const CodeBlock = ({ children }: { children: string }) => (
  <Box
    component="pre"
    sx={{
      p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1,
      border: '1px solid', borderColor: 'divider', fontSize: '0.73rem',
      fontFamily: 'monospace', color: 'text.secondary', overflow: 'auto', m: 0,
    }}
  >
    {children}
  </Box>
);

// ── Collapse ────────────────────────────────────────────────────────────────
function CollapseDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Button
          variant="outlined"
          onClick={() => setOpen((p) => !p)}
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{ mb: 2 }}
        >
          {open ? 'Cerrar sección' : 'Ver detalles'}
        </Button>
        <Collapse in={open}>
          <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'primary.main' }}>
            <Typography variant="body2" gutterBottom>Este contenido se expande y colapsa suavemente.</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ideal para acordeones, secciones expandibles y filtros avanzados.
            </Typography>
          </Box>
        </Collapse>
      </Box>
      <CodeBlock>{`<Collapse in={open}>
  {/* content */}
</Collapse>

// Props clave:
// in: boolean — muestra u oculta
// timeout: number | { enter, exit }
// unmountOnExit: boolean`}</CodeBlock>
    </Box>
  );
}

// ── Fade ────────────────────────────────────────────────────────────────────
function FadeDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Button variant="outlined" onClick={() => setVisible((p) => !p)} sx={{ mb: 2 }}>
          {visible ? 'Ocultar' : 'Mostrar'}
        </Button>
        <Box sx={{ minHeight: 80 }}>
          <Fade in={visible} timeout={600}>
            <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2">Fade cambia la opacidad de 0 → 1.</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>timeout: 600ms</Typography>
            </Box>
          </Fade>
        </Box>
      </Box>
      <CodeBlock>{`<Fade in={visible} timeout={600}>
  {/* single child */}
</Fade>

// Fade NO desmonta el hijo al ocultar.
// El elemento mantiene su espacio en el layout.
// Para desmontar: usá Collapse con unmountOnExit.`}</CodeBlock>
    </Box>
  );
}

// ── Slide ───────────────────────────────────────────────────────────────────
type SlideDirection = 'left' | 'right' | 'up' | 'down';

function SlideDemo() {
  const [show, setShow] = useState(false);
  const [direction, setDirection] = useState<SlideDirection>('right');
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
          {(['left', 'right', 'up', 'down'] as SlideDirection[]).map((d) => (
            <Chip
              key={d}
              label={d}
              size="small"
              onClick={() => { setDirection(d); setShow(true); }}
              color={direction === d && show ? 'primary' : 'default'}
              variant={direction === d && show ? 'filled' : 'outlined'}
              clickable
            />
          ))}
          <Button size="small" variant="text" sx={{ color: 'text.secondary' }} onClick={() => setShow(false)}>
            Reset
          </Button>
        </Stack>
        <Box
          ref={containerRef}
          sx={{ overflow: 'hidden', minHeight: 80, borderRadius: 1, border: '1px solid', borderColor: 'divider', p: 1 }}
        >
          <Slide in={show} direction={direction} container={containerRef.current}>
            <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1 }}>
              <Typography variant="body2">Slide desde: <strong>{direction}</strong></Typography>
            </Box>
          </Slide>
        </Box>
      </Box>
      <CodeBlock>{`<Slide in={show} direction="right">
  {/* child */}
</Slide>

// direction: 'left' | 'right' | 'up' | 'down'
// container: ref al contenedor (opcional)
// Muy usado en Drawers y notificaciones.`}</CodeBlock>
    </Box>
  );
}

// ── Zoom ────────────────────────────────────────────────────────────────────
function ZoomDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Button variant="outlined" onClick={() => setOpen((p) => !p)} sx={{ mb: 2 }}>
          {open ? 'Cerrar' : 'Abrir'}
        </Button>
        <Box sx={{ minHeight: 100, display: 'flex', alignItems: 'center' }}>
          <Zoom in={open} timeout={400}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="body2">Zoom escala desde el centro (transform: scale).</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Ideal para FABs y dialogs.</Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Box>
      </Box>
      <CodeBlock>{`<Zoom in={open} timeout={400}>
  {/* child */}
</Zoom>

// Similar a Fade pero agrega escala.
// MUI lo usa internamente en FAB
// y SpeedDial.`}</CodeBlock>
    </Box>
  );
}

// ── Grow ────────────────────────────────────────────────────────────────────
function GrowDemo() {
  const [show, setShow] = useState(false);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Button variant="outlined" onClick={() => setShow((p) => !p)} sx={{ mb: 2 }}>
          {show ? 'Colapsar' : 'Crecer'}
        </Button>
        <Box sx={{ minHeight: 80 }}>
          <Grow in={show}>
            <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2">Grow combina Fade + escala desde el origen.</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Usado en Popovers, Tooltips y Menus.</Typography>
            </Box>
          </Grow>
        </Box>
      </Box>
      <CodeBlock>{`<Grow in={show}>
  {/* child */}
</Grow>

// Combina Fade + scale(0→1)
// transformOrigin por defecto: top center
// MUI lo usa en Tooltip, Popover, Menu.`}</CodeBlock>
    </Box>
  );
}

// ── Reference table ─────────────────────────────────────────────────────────
const ANIMATION_REFERENCE = [
  { name: 'Collapse', effect: 'Altura 0 → auto',  use: 'Acordeones, filtros' },
  { name: 'Fade',     effect: 'Opacidad 0 → 1',   use: 'Imágenes, overlays' },
  { name: 'Slide',    effect: 'Traslación X/Y',    use: 'Drawers, notificaciones' },
  { name: 'Zoom',     effect: 'Escala desde centro', use: 'FABs, dialogs' },
  { name: 'Grow',     effect: 'Fade + escala',     use: 'Tooltips, Popovers, Menus' },
];

export default function AnimationsDemo() {
  return (
    <Box>
      <Section title="Collapse" subtitle="Anima la altura del contenido. El hijo permanece en el DOM.">
        <CollapseDemo />
      </Section>
      <Section title="Fade" subtitle="Anima la opacidad. El elemento mantiene su espacio en el layout.">
        <FadeDemo />
      </Section>
      <Section title="Slide" subtitle="Anima la posición (translateX/Y). Seleccioná la dirección con los chips.">
        <SlideDemo />
      </Section>
      <Section title="Zoom" subtitle="Escala el elemento desde el centro. Usado en FABs y acciones flotantes.">
        <ZoomDemo />
      </Section>
      <Section title="Grow" subtitle="Combina Fade y escala. El origen del transform se puede configurar.">
        <GrowDemo />
      </Section>
      <Section title="Cuándo usar cada una" subtitle="Referencia rápida de las 5 animaciones de MUI.">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' }, gap: 1.5 }}>
          {ANIMATION_REFERENCE.map(({ name, effect, use }) => (
            <Box key={name} sx={{ p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 0.5 }}>{name}</Typography>
              <Typography variant="caption" sx={{ display: 'block' }}>{effect}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{use}</Typography>
            </Box>
          ))}
        </Box>
      </Section>
    </Box>
  );
}
