import { Box, Chip, Divider, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';
import { create } from 'zustand';
import { createSelector } from '@reduxjs/toolkit';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const CodeBox = ({ code }: { code: string }) => (
  <Box sx={{ p: 2, mb: 3, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
    <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
      {code}
    </Typography>
  </Box>
);

// ── 1. useMemo sobre Context ──────────────────────────────────────────────────
interface Product { id: number; name: string; category: string; price: number }
interface StoreCtx { products: Product[]; category: string }

const StoreContext = createContext<StoreCtx>({ products: [], category: 'all' });

const PRODUCTS: Product[] = [
  { id: 1, name: 'Teclado', category: 'periféricos', price: 120 },
  { id: 2, name: 'Monitor', category: 'pantallas', price: 450 },
  { id: 3, name: 'Mouse', category: 'periféricos', price: 60 },
  { id: 4, name: 'Auriculares', category: 'audio', price: 200 },
  { id: 5, name: 'Webcam', category: 'periféricos', price: 80 },
];

function useFilteredProducts() {
  const { products, category } = useContext(StoreContext);
  return useMemo(
    () => category === 'all' ? products : products.filter((p) => p.category === category),
    [products, category]
  );
}

function ContextSelectorDemo() {
  const [category, setCategory] = useState('all');
  const categories = ['all', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  return (
    <StoreContext.Provider value={{ products: PRODUCTS, category }}>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ minWidth: 200 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Categoría</Typography>
          <Select size="small" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth>
            {categories.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </Box>
        <ProductList />
      </Box>
    </StoreContext.Provider>
  );
}

function ProductList() {
  const products = useFilteredProducts();
  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      {products.map((p) => (
        <Box key={p.id} sx={{ display: 'flex', gap: 2, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
          <Typography variant="body2" sx={{ flex: 1 }}>{p.name}</Typography>
          <Chip label={p.category} size="small" variant="outlined" />
          <Typography variant="body2" sx={{ color: 'primary.main' }}>${p.price}</Typography>
        </Box>
      ))}
    </Stack>
  );
}

// ── 2. Zustand selector ───────────────────────────────────────────────────────
interface FilterState {
  items: { id: number; label: string; active: boolean }[];
  query: string;
  setQuery: (q: string) => void;
}

const useFilterStore = create<FilterState>()((set) => ({
  items: [
    { id: 1, label: 'React', active: true },
    { id: 2, label: 'TypeScript', active: true },
    { id: 3, label: 'Zustand', active: false },
    { id: 4, label: 'Vite', active: true },
    { id: 5, label: 'MUI', active: false },
  ],
  query: '',
  setQuery: (q) => set({ query: q }),
}));

function ZustandSelectorDemo() {
  const items = useFilterStore((s) => s.items);
  const query = useFilterStore((s) => s.query);
  const setQuery = useFilterStore((s) => s.setQuery);
  // useMemo para derivados que retornan nuevas referencias — evita snapshots inconsistentes con useSyncExternalStore
  const activeItems = useMemo(
    () => items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  return (
    <Box>
      <TextField
        size="small" value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filtrar..." sx={{ mb: 2 }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {activeItems.map((item) => (
          <Chip key={item.id} label={item.label} size="small" color={item.active ? 'primary' : 'default'} />
        ))}
      </Box>
    </Box>
  );
}

// ── 3. createSelector (reselect incluido en RTK) ──────────────────────────────
interface RTKState {
  todos: { id: number; text: string; done: boolean }[];
  filter: 'all' | 'done' | 'pending';
}

const selectFilteredTodos = createSelector(
  (state: RTKState) => state.todos,
  (state: RTKState) => state.filter,
  (todos, filter) => {
    if (filter === 'done') return todos.filter((t) => t.done);
    if (filter === 'pending') return todos.filter((t) => !t.done);
    return todos;
  }
);

function ReselectDemo() {
  const [state, setState] = useState<RTKState>({
    todos: [
      { id: 1, text: 'Aprender createSelector', done: true },
      { id: 2, text: 'Memoizar selectores', done: false },
      { id: 3, text: 'Escribir tests', done: false },
    ],
    filter: 'all',
  });

  const filtered = selectFilteredTodos(state);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {(['all', 'done', 'pending'] as const).map((f) => (
          <Chip key={f} label={f} size="small" clickable
            variant={state.filter === f ? 'filled' : 'outlined'}
            color={state.filter === f ? 'primary' : 'default'}
            onClick={() => setState((s) => ({ ...s, filter: f }))}
          />
        ))}
      </Box>
      <Stack spacing={1}>
        {filtered.map((t) => (
          <Box key={t.id} sx={{ display: 'flex', gap: 2, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
            <Chip label={t.done ? '✓' : '○'} size="small" color={t.done ? 'success' : 'default'} sx={{ minWidth: 32 }} />
            <Typography variant="body2" sx={{ color: t.done ? 'text.secondary' : 'text.primary', textDecoration: t.done ? 'line-through' : 'none' }}>
              {t.text}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
        El selector está memoizado — solo se recalcula cuando cambian `todos` o `filter`.
      </Typography>
    </Box>
  );
}

export default function SelectorPatterns() {
  return (
    <Box>
      <Section title="useMemo sobre Context" subtitle="Selector derivado dentro del contexto. Se recalcula solo cuando cambian las dependencias del useMemo.">
        <CodeBox code={`function useFilteredProducts() {
  const { products, category } = useContext(StoreContext);
  return useMemo(
    () => category === 'all'
      ? products
      : products.filter((p) => p.category === category),
    [products, category]
  );
}`} />
        <ContextSelectorDemo />
      </Section>

      <Section title="Zustand selector function" subtitle="Pasá una función de selección a useStore para suscribirte solo a la parte del estado que necesitás.">
        <CodeBox code={`// Selectores de primitivos/referencias estables → derivados con useMemo
function Component() {
  const items = useStore((s) => s.items);       // referencia estable
  const query = useStore((s) => s.query);       // primitivo estable
  const setQuery = useStore((s) => s.setQuery);

  // Array derivado con useMemo — evita inconsistencia de snapshot en React 19
  const filtered = useMemo(
    () => items.filter((i) => i.label.includes(query)),
    [items, query]
  );
}`} />
        <ZustandSelectorDemo />
      </Section>

      <Section title="createSelector (Reselect, incluido en RTK)" subtitle="Memoiza selectores compuestos. Solo recalcula cuando alguna de las entradas cambia.">
        <CodeBox code={`import { createSelector } from '@reduxjs/toolkit';

const selectFilteredTodos = createSelector(
  (state: State) => state.todos,   // input 1
  (state: State) => state.filter,  // input 2
  (todos, filter) => {             // resultado memoizado
    if (filter === 'done') return todos.filter((t) => t.done);
    if (filter === 'pending') return todos.filter((t) => !t.done);
    return todos;
  }
);`} />
        <ReselectDemo />
      </Section>
    </Box>
  );
}
