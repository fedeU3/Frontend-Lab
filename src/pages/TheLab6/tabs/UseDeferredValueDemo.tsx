import { Box, Chip, Divider, TextField, Typography } from '@mui/material';
import { memo, useDeferredValue, useMemo, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const ALL_WORDS = Array.from({ length: 20_000 }, (_, i) => {
  const words = ['react', 'typescript', 'vite', 'zustand', 'redux', 'jotai', 'mui', 'hooks', 'context', 'memo'];
  return `${words[i % words.length]}-${i}`;
});

const ExpensiveList = memo(function ExpensiveList({ query, isStale }: { query: string; isStale: boolean }) {
  const results = useMemo(
    () => query ? ALL_WORDS.filter((w) => w.includes(query.toLowerCase())) : ALL_WORDS,
    [query]
  );

  return (
    <Box sx={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
      <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        {isStale && <Chip label="Stale — actualizando…" size="small" color="warning" variant="outlined" />}
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{results.length} resultados</Typography>
      </Box>
      <Box sx={{ maxHeight: 280, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'background.elevated' }}>
        {results.slice(0, 100).map((w, i) => (
          <Box key={i} sx={{ px: 1.5, py: 0.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { border: 0 } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{w}</Typography>
          </Box>
        ))}
        {results.length > 100 && (
          <Box sx={{ px: 1.5, py: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>… y {results.length - 100} más</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

function DirectSearch() {
  const [query, setQuery] = useState('');
  return (
    <Box>
      <TextField
        size="small" fullWidth label="Búsqueda directa"
        value={query} onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
        helperText="Cada letra re-renderiza la lista completa de forma síncrona"
      />
      <ExpensiveList query={query} isStale={false} />
    </Box>
  );
}

function DeferredSearch() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const isStale = query !== deferred;

  return (
    <Box>
      <TextField
        size="small" fullWidth label="Búsqueda diferida (useDeferredValue)"
        value={query} onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
        helperText="El input es siempre inmediato. La lista se actualiza cuando el browser tiene tiempo libre."
      />
      <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
        <Chip label={`Input: "${query}"`} size="small" color="primary" variant="outlined" />
        <Chip label={`Deferred: "${deferred}"`} size="small" color={isStale ? 'warning' : 'success'} variant="outlined" />
      </Box>
      <ExpensiveList query={deferred} isStale={isStale} />
    </Box>
  );
}

export default function UseDeferredValueDemo() {
  return (
    <Box>
      <Section
        title="Búsqueda directa"
        subtitle="Sin diferir el valor, la actualización del estado provoca un re-render completo de la lista en cada keystroke."
      >
        <DirectSearch />
      </Section>

      <Section
        title="useDeferredValue"
        subtitle="El valor diferido se queda 'viejo' mientras el usuario tipea. React actualiza la lista sin bloquear el input. El contenido stale se muestra con opacidad reducida."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const [query, setQuery] = useState('');
const deferred = useDeferredValue(query);
const isStale = query !== deferred; // true mientras React actualiza

// El input usa 'query' (siempre fresco)
// La lista usa 'deferred' (puede ser stale)
<input value={query} onChange={(e) => setQuery(e.target.value)} />
<ExpensiveList query={deferred} style={{ opacity: isStale ? 0.5 : 1 }} />`}
          </Typography>
        </Box>
        <DeferredSearch />
      </Section>

      <Section title="useTransition vs useDeferredValue">
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            {
              title: 'useTransition',
              desc: 'Controlás vos cuándo empieza la transición. Ideal cuando tenés acceso al setter de estado.',
              code: 'startTransition(() => setQuery(value))',
            },
            {
              title: 'useDeferredValue',
              desc: 'Diferís un valor que viene de una prop o de un estado que no podés controlar directamente.',
              code: 'const deferred = useDeferredValue(propValue)',
            },
          ].map(({ title, desc, code }) => (
            <Box key={title} sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>{title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>{desc}</Typography>
              <Box sx={{ p: 1, borderRadius: 0.5, backgroundColor: 'background.paper' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{code}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Section>
    </Box>
  );
}
