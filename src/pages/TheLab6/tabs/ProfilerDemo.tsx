import { Box, Button, Chip, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { memo, Profiler, type ProfilerOnRenderCallback, useCallback, useEffect, useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface RenderRecord {
  id: string;
  phase: string;
  actual: number;
  base: number;
  start: number;
}

// ── Componentes demo ──────────────────────────────────────────────────────────
function SlowComponent({ label }: { label: string }) {
  // Simula trabajo pesado
  const start = performance.now();
  while (performance.now() - start < 5) { /* busy wait 5ms */ }
  return (
    <Box sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}

const FastComponent = memo(function FastComponent({ label }: { label: string }) {
  return (
    <Box sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'primary.main', backgroundColor: 'background.elevated' }}>
      <Typography variant="body2" sx={{ color: 'primary.main' }}>{label} (memo)</Typography>
    </Box>
  );
});

// memo evita que onRender dispare setRecords que vuelva a renderizar ComponentTree → loop infinito
const ComponentTree = memo(function ComponentTree({ counter }: { counter: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <SlowComponent label={`Lento A (counter: ${counter})`} />
      <SlowComponent label="Lento B (no depende del counter)" />
      <FastComponent label={`Rápido memo (counter: ${counter})`} />
      <FastComponent label="Rápido memo (sin props del counter)" />
    </Box>
  );
});

export default function ProfilerDemo() {
  const [counter, setCounter] = useState(0);
  const [records, setRecords] = useState<RenderRecord[]>([]);
  const pendingRef = useRef<RenderRecord | null>(null);

  // Never call setState inside onRender — it re-renders the parent which re-runs the Profiler → infinite loop.
  // Store to ref here; flush to state via useEffect keyed on counter.
  const onRender = useCallback<ProfilerOnRenderCallback>((id, phase, actual, base, start) => {
    pendingRef.current = { id, phase, actual: +actual.toFixed(2), base: +base.toFixed(2), start: +start.toFixed(0) };
  }, []);

  useEffect(() => {
    if (pendingRef.current) {
      const r = pendingRef.current;
      pendingRef.current = null;
      setRecords((prev) => [r, ...prev.slice(0, 9)]);
    }
  }, [counter]);

  return (
    <Box>
      <Section
        title="React.Profiler"
        subtitle="El componente <Profiler> llama a onRender con métricas de cada commit. No tiene costo en producción (se omite en el build)."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`<Profiler
  id="ComponentTree"
  onRender={(id, phase, actualDuration, baseDuration) => {
    // actualDuration: tiempo de este commit
    // baseDuration:   tiempo sin memoización (worst case)
    console.log({ id, phase, actualDuration, baseDuration });
  }}
>
  <ComponentTree />
</Profiler>`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={() => setCounter((c) => c + 1)}>
            Trigger render (counter: {counter})
          </Button>
          <Button variant="outlined" onClick={() => { setRecords([]); pendingRef.current = null; }}>Limpiar</Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Árbol perfilado</Typography>
            <Profiler id="ComponentTree" onRender={onRender}>
              <ComponentTree counter={counter} />
            </Profiler>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Estadísticas en tiempo real
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`Commits: ${records.length}`} size="small" />
              {records[0] && (
                <>
                  <Chip label={`Último actual: ${records[0].actual}ms`} size="small" color={records[0].actual > 10 ? 'error' : 'success'} />
                  <Chip label={`Base: ${records[0].base}ms`} size="small" variant="outlined" />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Section>

      <Section title="Historial de renders">
        {records.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hacé click en "Trigger render" para ver datos.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: 'background.elevated' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 'bold', color: 'text.primary', borderColor: 'divider' } }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Fase</TableCell>
                  <TableCell align="right">Actual (ms)</TableCell>
                  <TableCell align="right">Base (ms)</TableCell>
                  <TableCell align="right">Ahorro memo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((r, i) => {
                  const saving = r.base - r.actual;
                  return (
                    <TableRow key={i} sx={{ '& td': { borderColor: 'divider' }, '&:last-child td': { border: 0 } }}>
                      <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{r.id}</Typography></TableCell>
                      <TableCell>
                        <Chip label={r.phase} size="small" color={r.phase === 'mount' ? 'primary' : 'default'} variant="outlined" sx={{ fontSize: '0.65rem', height: 18 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ color: r.actual > 10 ? 'error.main' : 'success.main', fontFamily: 'monospace' }}>{r.actual}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{r.base}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: saving > 0 ? 'success.main' : 'text.secondary' }}>
                          {saving > 0 ? `−${saving.toFixed(2)}ms` : '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Section>
    </Box>
  );
}
