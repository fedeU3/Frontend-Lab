import { Box, Chip, CircularProgress, Divider, TextField, Typography } from '@mui/material';
import { useState, useTransition, useMemo } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const ITEMS = Array.from({ length: 50_000 }, (_, i) => `Item #${i + 1} — valor ${Math.floor(Math.random() * 1000)}`);

function FilteredList({ query }: { query: string }) {
  const filtered = useMemo(
    () => query ? ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase())) : ITEMS,
    [query]
  );
  return (
    <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'background.elevated' }}>
      {filtered.slice(0, 200).map((item, i) => (
        <Box key={i} sx={{ px: 1.5, py: 0.75, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { border: 0 } }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item}</Typography>
        </Box>
      ))}
      {filtered.length > 200 && (
        <Box sx={{ px: 1.5, py: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>… y {filtered.length - 200} más</Typography>
        </Box>
      )}
    </Box>
  );
}

function WithoutTransition() {
  const [query, setQuery] = useState('');
  return (
    <Box>
      <TextField
        size="small" fullWidth label="Filtrar (sin useTransition)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 2 }}
        helperText="El input se traba mientras filtra los 50k ítems"
      />
      <FilteredList query={query} />
    </Box>
  );
}

function WithTransition() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <Box>
      <TextField
        size="small" fullWidth label="Filtrar (con useTransition)"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          startTransition(() => {
            setQuery(e.target.value);
          });
        }}
        sx={{ mb: 1 }}
        helperText="El input permanece fluido — la actualización de la lista es una transición no urgente"
        InputProps={{
          endAdornment: isPending ? <CircularProgress size={16} /> : null,
        }}
      />
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip
          label={isPending ? 'Actualizando lista…' : 'Lista actualizada'}
          size="small"
          color={isPending ? 'warning' : 'success'}
          variant="outlined"
        />
      </Box>
      <FilteredList query={query} />
    </Box>
  );
}

export default function UseTransitionDemo() {
  return (
    <Box>
      <Section
        title="Sin useTransition"
        subtitle="Cada keystroke actualiza el query y fuerza el filtrado de 50 000 ítems en el mismo ciclo de render. El input se congela."
      >
        <WithoutTransition />
      </Section>

      <Section
        title="Con useTransition"
        subtitle="startTransition marca la actualización del query como 'no urgente'. React puede interrumpirla para procesar el input primero. isPending indica que hay trabajo pendiente."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const [isPending, startTransition] = useTransition();

onChange={(e) => {
  setInput(e.target.value);           // urgente: actualiza el input
  startTransition(() => {
    setQuery(e.target.value);         // no urgente: filtra la lista
  });
}}`}
          </Typography>
        </Box>
        <WithTransition />
      </Section>
    </Box>
  );
}
