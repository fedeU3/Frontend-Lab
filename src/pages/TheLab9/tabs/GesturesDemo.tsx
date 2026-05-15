import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import SwipeLeftIcon from '@mui/icons-material/SwipeLeft';
import SwipeRightIcon from '@mui/icons-material/SwipeRight';
import { useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const CARDS = [
  { title: 'React 19', desc: 'useTransition, useOptimistic, Server Actions y mejoras en Suspense.', color: '#FF7043' },
  { title: 'TypeScript 6', desc: 'Inferencia mejorada, tipos condicionales más potentes, performance del compilador.', color: '#42A5F5' },
  { title: 'Vite 8', desc: 'Rolldown como bundler, HMR más rápido, soporte nativo de environments.', color: '#66BB6A' },
  { title: 'MUI v9', desc: 'Pigment CSS, mejor tree-shaking, nuevo sistema de theming estático.', color: '#FFA726' },
  { title: 'TanStack v5', desc: 'React Query v5, Router v1, Table v8. API unificada y mejor tipado.', color: '#AB47BC' },
];

function SwipeCards() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const THRESHOLD = 50;

  const go = (dir: 'left' | 'right') => {
    setDirection(dir);
    setTimeout(() => {
      setIndex((i) => dir === 'right' ? Math.min(i + 1, CARDS.length - 1) : Math.max(i - 1, 0));
      setDirection(null);
    }, 180);
  };

  const onStart = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onEnd = (e: React.PointerEvent) => {
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > THRESHOLD) go(delta < 0 ? 'right' : 'left');
  };

  const card = CARDS[index];

  return (
    <Box>
      <Box sx={{ position: 'relative', mb: 3, display: 'flex', justifyContent: 'center' }}>
        {CARDS.map((c, i) => {
          const offset = i - index;
          const visible = Math.abs(offset) <= 1;
          if (!visible) return null;
          return (
            <Box
              key={c.title}
              sx={{
                position: i === index ? 'relative' : 'absolute',
                top: 0, left: '50%',
                transform: i === index
                  ? `translateX(-50%) translateX(${direction === 'right' ? 60 : direction === 'left' ? -60 : 0}px)`
                  : `translateX(calc(-50% + ${offset * 12}px))`,
                opacity: i === index ? 1 : 0.4,
                scale: i === index ? '1' : '0.92',
                transition: 'all 0.18s ease',
                zIndex: i === index ? 2 : 1,
              }}
            >
              <Box
                onPointerDown={i === index ? onStart : undefined}
                onPointerUp={i === index ? onEnd : undefined}
                sx={{
                  width: { xs: 280, sm: 320 },
                  p: 3,
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: c.color,
                  backgroundColor: 'background.elevated',
                  cursor: i === index ? 'grab' : 'default',
                  userSelect: 'none',
                  touchAction: 'none',
                  '&:active': { cursor: 'grabbing' },
                }}
              >
                <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: c.color }}>🚀</Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: c.color, mb: 1 }}>{c.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{c.desc}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button variant="outlined" size="small" startIcon={<SwipeLeftIcon />} onClick={() => go('left')} disabled={index === 0}>
          Anterior
        </Button>
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          {CARDS.map((_, i) => (
            <Box key={i} sx={{ width: i === index ? 20 : 8, height: 8, borderRadius: 4, backgroundColor: i === index ? 'primary.main' : 'divider', transition: 'all 0.2s' }} />
          ))}
        </Box>
        <Button variant="outlined" size="small" endIcon={<SwipeRightIcon />} onClick={() => go('right')} disabled={index === CARDS.length - 1}>
          Siguiente
        </Button>
      </Box>

      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', mt: 1 }}>
        Arrastrá la tarjeta o usá los botones · {index + 1}/{CARDS.length}
      </Typography>
    </Box>
  );
}

function PullToRefreshDemo() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());
  const startY = useRef(0);
  const [pullDist, setPullDist] = useState(0);
  const THRESHOLD = 80;

  const onStart = (e: React.TouchEvent) => { startY.current = e.touches[0].clientY; };
  const onMove = (e: React.TouchEvent) => {
    const dist = Math.max(0, e.touches[0].clientY - startY.current);
    setPullDist(Math.min(dist, THRESHOLD + 20));
  };
  const onEnd = () => {
    if (pullDist >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        setLastRefresh(new Date().toLocaleTimeString());
        setPullDist(0);
      }, 1500);
    } else {
      setPullDist(0);
    }
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', maxWidth: 360, mx: 'auto' }}>
      <Box
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        sx={{ userSelect: 'none' }}
      >
        <Box sx={{
          height: Math.max(pullDist, refreshing ? 50 : 0),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: refreshing ? 'none' : 'height 0.2s',
          backgroundColor: 'background.elevated',
          borderBottom: pullDist > 0 || refreshing ? '1px solid' : 'none',
          borderColor: 'divider',
          overflow: 'hidden',
        }}>
          {(pullDist > 0 || refreshing) && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {refreshing ? '🔄 Actualizando…' : pullDist >= THRESHOLD ? '↑ Soltá para actualizar' : '↓ Tirá para actualizar'}
            </Typography>
          )}
        </Box>
        <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Última actualización: {lastRefresh}
          </Typography>
          {['Evento 1', 'Evento 2', 'Evento 3'].map((e, i) => (
            <Box key={i} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { border: 0 } }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{e}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box sx={{ p: 1.5, backgroundColor: 'background.elevated', borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>En mobile: tirá hacia abajo para actualizar</Typography>
      </Box>
    </Box>
  );
}

export default function GesturesDemo() {
  return (
    <Box>
      <Section
        title="Swipe de tarjetas"
        subtitle="Pointer Events para detectar swipe. setPointerCapture() mantiene el tracking aunque el puntero salga del elemento. Umbral de 50px para confirmar el gesto."
      >
        <SwipeCards />
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const onPointerDown = (e: React.PointerEvent) => {
  startX.current = e.clientX;
  // Captura el puntero — sigue funcionando fuera del elemento
  e.currentTarget.setPointerCapture(e.pointerId);
};

const onPointerUp = (e: React.PointerEvent) => {
  const delta = e.clientX - startX.current;
  if (Math.abs(delta) > THRESHOLD) {
    navigate(delta < 0 ? 'next' : 'prev');
  }
};`}
          </Typography>
        </Box>
      </Section>

      <Section title="Pull-to-refresh" subtitle="Touch events para detectar el gesto de arrastre hacia abajo. Solo funciona en dispositivos táctiles.">
        <Box sx={{ mb: 2 }}>
          <Chip label="Solo táctil" size="small" variant="outlined" />
        </Box>
        <PullToRefreshDemo />
      </Section>
    </Box>
  );
}
