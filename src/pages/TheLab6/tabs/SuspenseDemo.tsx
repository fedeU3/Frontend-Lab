import { Box, Button, Chip, CircularProgress, Divider, Paper, Skeleton, Typography } from '@mui/material';
import { lazy, Suspense, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── Componentes cargados con lazy ─────────────────────────────────────────────
function HeavyChart() {
  return (
    <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'background.elevated' }}>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Chart cargado (simulado)</Typography>
      {Array.from({ length: 5 }, (_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1, alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 80 }}>Serie {i + 1}</Typography>
          <Box sx={{ flex: 1, height: 16, borderRadius: 1, backgroundColor: 'background.paper', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${30 + i * 15}%`, backgroundColor: 'primary.main', borderRadius: 1 }} />
          </Box>
          <Typography variant="caption" sx={{ color: 'primary.main' }}>{30 + i * 15}%</Typography>
        </Box>
      ))}
    </Paper>
  );
}

function HeavyTable() {
  return (
    <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'background.elevated' }}>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Tabla cargada (simulado)</Typography>
      {['Usuario', 'Email', 'Plan', 'Estado'].map((h) => (
        <Box key={h} sx={{ display: 'flex', gap: 2, mb: 1, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', minWidth: 80 }}>{h}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>valor ejemplo</Typography>
        </Box>
      ))}
    </Paper>
  );
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const LazyChart = lazy(() => delay(1500).then(() => ({ default: HeavyChart })));
const LazyTable = lazy(() => delay(2500).then(() => ({ default: HeavyTable })));

// ── Fallbacks ─────────────────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'background.elevated' }}>
      <Skeleton variant="text" width="50%" sx={{ mb: 2 }} />
      {Array.from({ length: 5 }, (_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1, alignItems: 'center' }}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="rectangular" height={16} sx={{ flex: 1, borderRadius: 1 }} />
          <Skeleton variant="text" width={32} />
        </Box>
      ))}
    </Paper>
  );
}

function TableSkeleton() {
  return (
    <Paper variant="outlined" sx={{ p: 3, backgroundColor: 'background.elevated' }}>
      <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
      {Array.from({ length: 4 }, (_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Skeleton variant="text" width={80} />
          <Skeleton variant="text" width={120} />
        </Box>
      ))}
    </Paper>
  );
}

// ── Spinner fallback ──────────────────────────────────────────────────────────
function SpinnerFallback({ label }: { label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
      <CircularProgress size={20} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
    </Box>
  );
}

export default function SuspenseDemo() {
  const [show, setShow] = useState(false);
  const [key, setKey] = useState(0);

  const reset = () => {
    setShow(false);
    setTimeout(() => { setKey((k) => k + 1); setShow(true); }, 50);
  };

  return (
    <Box>
      <Section
        title="React.lazy + Suspense"
        subtitle="React.lazy(() => import(...)) carga el componente solo cuando se necesita. Suspense muestra el fallback mientras se resuelve la promesa."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`// Simula un import() dinámico con 1.5s de delay
const LazyChart = lazy(() => delay(1500).then(() =>
  import('./HeavyChart')   // o ({ default: Component })
));

<Suspense fallback={<ChartSkeleton />}>
  <LazyChart />
</Suspense>`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={() => { setShow(true); }}>Cargar componentes</Button>
          <Button variant="outlined" onClick={reset}>Recargar</Button>
        </Box>

        {show && (
          <Box key={key} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Chart — 1.5s delay</Typography>
                <Chip label="lazy()" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
              </Box>
              <Suspense fallback={<ChartSkeleton />}>
                <LazyChart />
              </Suspense>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Table — 2.5s delay</Typography>
                <Chip label="lazy()" size="small" variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
              </Box>
              <Suspense fallback={<TableSkeleton />}>
                <LazyTable />
              </Suspense>
            </Box>
          </Box>
        )}
      </Section>

      <Section title="Suspense anidado vs único">
        {show && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                Suspense individual por componente → cada uno muestra su skeleton independientemente
              </Typography>
              <Suspense fallback={<SpinnerFallback label="Cargando chart…" />}>
                <LazyChart />
              </Suspense>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                Suspense único que envuelve ambos → espera al más lento (2.5s)
              </Typography>
              <Suspense fallback={<SpinnerFallback label="Cargando todo…" />}>
                <LazyChart />
                <Box sx={{ mt: 2 }}><LazyTable /></Box>
              </Suspense>
            </Box>
          </Box>
        )}
        {!show && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hacé click en "Cargar componentes" de la sección de arriba para ver el demo.
          </Typography>
        )}
      </Section>
    </Box>
  );
}
