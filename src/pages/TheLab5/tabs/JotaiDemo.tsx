import { Box, Button, Chip, Divider, IconButton, Slider, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── Atoms ────────────────────────────────────────────────────────────────────
const counterAtom = atom(0);
const doubleAtom = atom((get) => get(counterAtom) * 2);

const themeAtom = atomWithStorage<'light' | 'dark'>('jotai-theme', 'dark');

interface CartItem { id: number; name: string; qty: number }
const cartAtom = atom<CartItem[]>([
  { id: 1, name: 'Teclado mecánico', qty: 1 },
  { id: 2, name: 'Monitor 4K', qty: 2 },
]);
const cartTotalAtom = atom((get) => get(cartAtom).reduce((sum, item) => sum + item.qty, 0));

// ── Counter demo ─────────────────────────────────────────────────────────────
function AtomCounter() {
  const [count, setCount] = useAtom(counterAtom);
  const double = useAtomValue(doubleAtom);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => setCount((c) => c - 1)}><RemoveIcon /></IconButton>
        <Typography variant="h4" fontWeight="bold" sx={{ minWidth: 60, textAlign: 'center' }}>{count}</Typography>
        <IconButton onClick={() => setCount((c) => c + 1)}><AddIcon /></IconButton>
      </Box>
      <Box sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'primary.main', backgroundColor: 'background.elevated' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Atom derivado (×2)</Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ color: 'primary.main' }}>{double}</Typography>
      </Box>
    </Box>
  );
}

// ── Theme demo ────────────────────────────────────────────────────────────────
function ThemeToggle() {
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button
        variant={theme === 'dark' ? 'contained' : 'outlined'}
        startIcon={<DarkModeIcon />}
        onClick={() => setTheme('dark')}
      >Dark</Button>
      <Button
        variant={theme === 'light' ? 'contained' : 'outlined'}
        startIcon={<LightModeIcon />}
        onClick={() => setTheme('light')}
      >Light</Button>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Valor persistido en localStorage: <code style={{ fontFamily: 'monospace' }}>jotai-theme = "{theme}"</code>
      </Typography>
    </Box>
  );
}

// ── Cart demo ─────────────────────────────────────────────────────────────────
function Cart() {
  const [cart, setCart] = useAtom(cartAtom);
  const total = useAtomValue(cartTotalAtom);
  const setQty = useSetAtom(cartAtom);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stack spacing={1.5}>
        {cart.map((item) => (
          <Box key={item.id} sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider',
            backgroundColor: 'background.elevated',
          }}>
            <Typography variant="body2" sx={{ flex: 1 }}>{item.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Slider
                size="small" value={item.qty} min={1} max={10}
                sx={{ width: 80 }}
                onChange={(_, v) =>
                  setQty((prev) => prev.map((i) => i.id === item.id ? { ...i, qty: v as number } : i))
                }
              />
              <Chip label={item.qty} size="small" />
            </Box>
            <IconButton size="small" onClick={() => setCart((prev) => prev.filter((i) => i.id !== item.id))}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total de ítems:</Typography>
        <Chip label={total} color="primary" />
      </Box>
    </Box>
  );
}

export default function JotaiDemo() {
  return (
    <Box>
      <Section title="atom + useAtom + átomo derivado" subtitle="Los átomos derivados (read-only) se recalculan automáticamente cuando sus dependencias cambian. Cero boilerplate.">
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 480 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const counterAtom = atom(0);
// Derivado: se actualiza solo cuando counterAtom cambia
const doubleAtom = atom((get) => get(counterAtom) * 2);

// En el componente:
const [count, setCount] = useAtom(counterAtom);
const double = useAtomValue(doubleAtom); // solo lectura`}
          </Typography>
        </Box>
        <AtomCounter />
      </Section>

      <Section title="atomWithStorage" subtitle="El valor se persiste automáticamente en localStorage. Al recargar la página, se restaura el último valor.">
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 480 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`import { atomWithStorage } from 'jotai/utils';
// 'jotai-theme' es la key en localStorage
const themeAtom = atomWithStorage<'light' | 'dark'>('jotai-theme', 'dark');`}
          </Typography>
        </Box>
        <ThemeToggle />
      </Section>

      <Section title="Carrito con atom de array" subtitle="useSetAtom devuelve solo el setter sin suscribir al valor — útil para componentes que solo escriben.">
        <Cart />
      </Section>
    </Box>
  );
}
