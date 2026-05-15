import { Box, Button, Chip, Divider, Slider, Typography } from '@mui/material';
import { memo, useCallback, useMemo, useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── React.memo ────────────────────────────────────────────────────────────────
const MemoChild = memo(function MemoChild({ label, onClick }: { label: string; onClick: () => void }) {
  const renders = useRef(0);
  renders.current++;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
      <Typography variant="body2">{label}</Typography>
      <Chip label={`Renders: ${renders.current}`} size="small" color={renders.current > 2 ? 'warning' : 'default'} />
      <Button size="small" onClick={onClick}>Acción</Button>
    </Box>
  );
});

const PlainChild = function PlainChild({ label, onClick }: { label: string; onClick: () => void }) {
  const renders = useRef(0);
  renders.current++;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'error.main', backgroundColor: 'background.elevated' }}>
      <Typography variant="body2">{label}</Typography>
      <Chip label={`Renders: ${renders.current}`} size="small" color="error" />
      <Button size="small" onClick={onClick}>Acción</Button>
    </Box>
  );
};

function MemoVsPlain() {
  const [parentCount, setParentCount] = useState(0);
  const stableCallback = useCallback(() => alert('Acción ejecutada'), []);
  const unstableCallback = () => alert('Acción ejecutada');

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Button variant="contained" onClick={() => setParentCount((c) => c + 1)}>
          Re-renderizar padre
        </Button>
        <Chip label={`Padre renders: ${parentCount + 1}`} color="primary" />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <MemoChild label="memo() + useCallback (estable)" onClick={stableCallback} />
        <MemoChild label="memo() + función nueva (inestable)" onClick={unstableCallback} />
        <PlainChild label="Sin memo — siempre re-renderiza" onClick={stableCallback} />
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block' }}>
        ⚠️ memo() + callback inestable = memo inútil. Siempre usar useCallback para los handlers que se pasan a hijos memorizados.
      </Typography>
    </Box>
  );
}

// ── useMemo ───────────────────────────────────────────────────────────────────
function slowFibonacci(n: number): number {
  if (n <= 1) return n;
  return slowFibonacci(n - 1) + slowFibonacci(n - 2);
}

function UseMemoDemo() {
  const [n, setN] = useState(30);
  const [unrelated, setUnrelated] = useState(0);

  const resultMemo = useMemo(() => slowFibonacci(n), [n]);
  const computeLabel = `fib(${n}) = ${resultMemo}`;

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>n = {n}</Typography>
          <Slider value={n} min={20} max={38} onChange={(_, v) => setN(v as number)} sx={{ mt: 1 }} />
        </Box>
        <Button variant="outlined" onClick={() => setUnrelated((c) => c + 1)}>
          Estado no relacionado ({unrelated})
        </Button>
      </Box>
      <Box sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{computeLabel}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          El cálculo solo se ejecuta cuando cambia `n`. Actualizar "Estado no relacionado" no lo retrigerea.
        </Typography>
      </Box>
    </Box>
  );
}

export default function MemoDemo() {
  return (
    <Box>
      <Section
        title="React.memo + useCallback"
        subtitle="React.memo evita re-renders si las props no cambiaron. useCallback estabiliza las funciones para que memo funcione correctamente."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const Child = memo(({ label, onClick }) => {
  // Solo re-renderiza si label u onClick cambian
});

// ✅ Referencia estable — memo funciona
const handler = useCallback(() => doSomething(), []);

// ❌ Nueva referencia en cada render — memo no sirve
const handler = () => doSomething();`}
          </Typography>
        </Box>
        <MemoVsPlain />
      </Section>

      <Section
        title="useMemo para computaciones costosas"
        subtitle="Memoiza el resultado de un cálculo caro. Solo se re-ejecuta cuando cambian las dependencias."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const result = useMemo(
  () => slowFibonacci(n),  // cálculo caro
  [n]                       // solo recalcula si n cambia
);`}
          </Typography>
        </Box>
        <UseMemoDemo />
      </Section>

      <Section title="¿Cuándo NO usar memo/useMemo?">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {[
            { title: '🚫 Sobre-optimización', desc: 'Si el componente es rápido y los re-renders son baratos, agregar memo solo agrega overhead.' },
            { title: '🚫 Props que siempre cambian', desc: 'Si las props cambian en cada render (ej: objetos literales inline), memo no ayuda.' },
            { title: '✅ Listas grandes', desc: 'Componentes con renderizado costoso en listas largas son candidatos perfectos para memo.' },
            { title: '✅ Cálculos O(n²) o más', desc: 'useMemo tiene sentido cuando el cálculo tarda más de ~1ms y las deps cambian con menos frecuencia.' },
          ].map(({ title, desc }) => (
            <Box key={title} sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>{title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{desc}</Typography>
            </Box>
          ))}
        </Box>
      </Section>
    </Box>
  );
}
