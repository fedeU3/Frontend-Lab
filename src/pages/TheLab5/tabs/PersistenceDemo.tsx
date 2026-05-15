import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── Zustand persist ───────────────────────────────────────────────────────────
interface PersistedState {
  score: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const usePersistedStore = create<PersistedState>()(
  persist(
    (set) => ({
      score: 0,
      increment: () => set((s) => ({ score: s.score + 1 })),
      decrement: () => set((s) => ({ score: Math.max(0, s.score - 1) })),
      reset: () => set({ score: 0 }),
    }),
    {
      name: 'zustand-score',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

function ZustandPersistDemo() {
  const { score, increment, decrement, reset } = usePersistedStore();
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button variant="outlined" startIcon={<RemoveIcon />} onClick={decrement}>-1</Button>
        <Typography variant="h3" fontWeight="bold" sx={{ minWidth: 80, textAlign: 'center', color: 'primary.main' }}>
          {score}
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={increment}>+1</Button>
        <Button variant="text" onClick={reset} startIcon={<DeleteSweepIcon />} sx={{ color: 'text.secondary' }}>Reset</Button>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Key en localStorage: <code style={{ fontFamily: 'monospace' }}>zustand-score</code> — recargá la página para ver que persiste.
      </Typography>
    </Box>
  );
}

// ── Jotai atomWithStorage ─────────────────────────────────────────────────────
const visitCountAtom = atomWithStorage('jotai-visits', 0);
const notesAtom = atomWithStorage<string[]>('jotai-notes', []);
const inputAtom = atom('');

function JotaiPersistDemo() {
  const [visits, setVisits] = useAtom(visitCountAtom);
  const [notes, setNotes] = useAtom(notesAtom);
  const [input, setInput] = useAtom(inputAtom);

  useEffect(() => {
    setVisits((v) => v + 1);
  }, [setVisits]);

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Visitas a esta tab:</Typography>
        <Chip label={visits} color="primary" />
      </Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Box
          component="input"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && input.trim()) {
              setNotes((prev) => [...prev, input.trim()]);
              setInput('');
            }
          }}
          placeholder="Nota rápida (Enter para guardar)..."
          sx={{
            flex: 1, p: 1, backgroundColor: 'background.elevated',
            border: '1px solid', borderColor: 'divider', borderRadius: 1,
            color: 'text.primary', outline: 'none', fontSize: '0.875rem',
            '&:focus': { borderColor: 'primary.main' },
          }}
        />
        <Button variant="outlined" onClick={() => setNotes([])} size="small">Limpiar</Button>
      </Box>
      <Stack spacing={0.5}>
        {notes.map((note, i) => (
          <Typography key={i} variant="body2" sx={{
            p: 1, borderRadius: 1, backgroundColor: 'background.elevated',
            border: '1px solid', borderColor: 'divider', color: 'text.secondary',
          }}>
            {note}
          </Typography>
        ))}
      </Stack>
      {notes.length === 0 && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Las notas persisten en <code style={{ fontFamily: 'monospace' }}>jotai-notes</code> — recargá la página.
        </Typography>
      )}
    </Box>
  );
}

// ── Storage inspector ─────────────────────────────────────────────────────────
function StorageInspector() {
  const [entries, setEntries] = useState<{ key: string; value: string }[]>([]);

  const refresh = () => {
    const keys = ['zustand-score', 'jotai-visits', 'jotai-notes', 'jotai-theme'];
    setEntries(
      keys
        .map((key) => ({ key, value: localStorage.getItem(key) ?? '(no existe)' }))
        .filter((e) => e.value !== '(no existe)')
    );
  };

  useEffect(() => { refresh(); }, []);

  return (
    <Box>
      <Button variant="outlined" size="small" onClick={refresh} sx={{ mb: 2 }}>Actualizar</Button>
      <Stack spacing={1}>
        {entries.length === 0 && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Interactuá con los demos de arriba para ver las claves.
          </Typography>
        )}
        {entries.map(({ key, value }) => (
          <Paper key={key} variant="outlined" sx={{ p: 1.5, backgroundColor: 'background.elevated' }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontFamily: 'monospace', display: 'block' }}>{key}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', wordBreak: 'break-all' }}>{value}</Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}

export default function PersistenceDemo() {
  return (
    <Box>
      <Section title="Zustand persist middleware" subtitle="Envolvé el store con persist() y pasale el storage. La rehidratación ocurre automáticamente en el primer render.">
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const useStore = create<State>()(
  persist(
    (set) => ({ score: 0, increment: () => set((s) => ({ score: s.score + 1 })) }),
    {
      name: 'zustand-score',             // key en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);`}
          </Typography>
        </Box>
        <ZustandPersistDemo />
      </Section>

      <Section title="Jotai atomWithStorage" subtitle="Cada atom puede persistir independientemente. La sincronización entre tabs también funciona out-of-the-box.">
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 480 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`import { atomWithStorage } from 'jotai/utils';

const visitCountAtom = atomWithStorage('jotai-visits', 0);
const notesAtom = atomWithStorage<string[]>('jotai-notes', []);`}
          </Typography>
        </Box>
        <JotaiPersistDemo />
      </Section>

      <Section title="Inspector de localStorage" subtitle="Inspeccioná en tiempo real qué claves están guardadas por los demos de arriba.">
        <StorageInspector />
      </Section>
    </Box>
  );
}
