import {
  Alert, Box, Button, Chip, Divider, Slider, Stack,
  Switch, FormControlLabel, TextField, Typography,
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import {
  useCallback, useEffect, useRef, useState,
  type Dispatch, type SetStateAction,
} from 'react';

// ══════════════════════════════════════════════════════════════════════════
// HOOKS
// ══════════════════════════════════════════════════════════════════════════

/** Returns the previous value of any state/prop */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

/** Debounces a value — only updates after `delay` ms of no changes */
function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Persists state in localStorage */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set: Dispatch<SetStateAction<T>> = useCallback(
    (action) => {
      setValue((prev) => {
        const next = typeof action === 'function' ? (action as (p: T) => T)(prev) : action;
        try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
        return next;
      });
    },
    [key]
  );

  return [value, set];
}

/** Calls handler when click happens outside the ref element */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

/** Tracks browser online/offline status */
function useOnline(): boolean {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

/** Tracks scroll position */
function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return y;
}

// ══════════════════════════════════════════════════════════════════════════
// DEMO COMPONENTS
// ══════════════════════════════════════════════════════════════════════════

const Section = ({ title, hook, description, children }: {
  title: string; hook: string; description: string; children: React.ReactNode;
}) => (
  <Box sx={{ mb: 5 }}>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 0.5 }}>
      <Typography variant="h6">{title}</Typography>
      <Chip label={hook} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.72rem' }} />
    </Box>
    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{description}</Typography>
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const Code = ({ children }: { children: string }) => (
  <Box
    component="pre"
    sx={{
      p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1,
      border: '1px solid', borderColor: 'divider', fontSize: '0.75rem',
      fontFamily: 'monospace', color: 'text.primary', overflow: 'auto', m: 0,
    }}
  >
    {children}
  </Box>
);

// ── usePrevious ────────────────────────────────────────────────────────────
function PreviousDemo() {
  const [count, setCount] = useState(0);
  const prev = usePrevious(count);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={() => setCount((c) => c - 1)}>−</Button>
          <Typography variant="h5" sx={{ minWidth: 40, textAlign: 'center' }}>{count}</Typography>
          <Button variant="contained" onClick={() => setCount((c) => c + 1)}>+</Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Actual</Typography>
            <Typography variant="h6" sx={{ color: 'primary.main' }}>{count}</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Anterior</Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>{prev ?? '—'}</Typography>
          </Box>
        </Stack>
      </Box>
      <Code>{`function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}

// Uso:
const prev = usePrevious(count);`}</Code>
    </Box>
  );
}

// ── useDebounce ────────────────────────────────────────────────────────────
function DebounceDemo() {
  const [text, setText] = useState('');
  const [delay, setDelay] = useState(400);
  const debounced = useDebounce(text, delay);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (debounced) setLog((l) => [`[${new Date().toLocaleTimeString()}] "${debounced}"`, ...l.slice(0, 4)]);
  }, [debounced]);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <TextField
          fullWidth
          label="Escribí algo…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          helperText={`Debounce: ${delay}ms`}
          sx={{ mb: 2 }}
        />
        <Box sx={{ px: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Delay: {delay}ms</Typography>
          <Slider
            value={delay}
            onChange={(_, v) => setDelay(v as number)}
            min={100} max={2000} step={100}
            marks={[{ value: 400, label: '400ms' }, { value: 1000, label: '1s' }]}
            size="small"
          />
        </Box>
        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', minHeight: 80 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Queries enviadas (después del delay):</Typography>
          {log.length === 0
            ? <Typography variant="caption" sx={{ color: 'text.secondary' }}>—</Typography>
            : log.map((entry, i) => (
                <Typography key={i} variant="caption" sx={{ display: 'block', fontFamily: 'monospace', color: i === 0 ? 'primary.main' : 'text.secondary' }}>
                  {entry}
                </Typography>
              ))}
        </Box>
      </Box>
      <Code>{`function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(
      () => setDebounced(value),
      delay
    );
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// Uso (buscador sin spam):
const query = useDebounce(inputValue, 400);
useEffect(() => { search(query); }, [query]);`}</Code>
    </Box>
  );
}

// ── useLocalStorage ────────────────────────────────────────────────────────
function LocalStorageDemo() {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('lab2-theme', 'dark');
  const [name, setName] = useLocalStorage<string>('lab2-username', '');

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Stack spacing={2}>
          <TextField
            label="Tu nombre (persiste en localStorage)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={theme === 'dark'}
                onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
              />
            }
            label={`Tema: ${theme}`}
          />
          <Alert severity="info">
            Recargá la página — los valores persisten en localStorage.
          </Alert>
          <Box sx={{ p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
              localStorage['lab2-username'] = "{name}"<br />
              localStorage['lab2-theme'] = "{theme}"
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Code>{`function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });

  const set = (action) => {
    setValue((prev) => {
      const next = typeof action === 'function'
        ? action(prev)
        : action;
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  return [value, set];
}`}</Code>
    </Box>
  );
}

// ── useClickOutside ────────────────────────────────────────────────────────
function ClickOutsideDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box>
        <Button variant="outlined" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
          Abrir menú
        </Button>
        <Box sx={{ position: 'relative' }}>
          {open && (
            <Box
              ref={ref}
              sx={{
                position: 'absolute', top: 0, left: 0,
                backgroundColor: 'background.paper',
                border: '1px solid', borderColor: 'primary.main',
                borderRadius: 1, p: 2, zIndex: 10, width: 200,
              }}
            >
              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 'bold' }}>Menú</Typography>
              {['Perfil', 'Configuración', 'Cerrar sesión'].map((item) => (
                <Typography key={item} variant="body2" sx={{ py: 0.5, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                  {item}
                </Typography>
              ))}
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Click fuera para cerrar
              </Typography>
            </Box>
          )}
          {!open && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              El menú está cerrado. Abrilo y hacé click fuera.
            </Typography>
          )}
        </Box>
      </Box>
      <Code>{`function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// Uso:
const menuRef = useRef(null);
useClickOutside(menuRef, () => setOpen(false));`}</Code>
    </Box>
  );
}

// ── useOnline + useScrollY ─────────────────────────────────────────────────
function BrowserEventsDemo() {
  const online = useOnline();
  const scrollY = useScrollY();

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {online
            ? <WifiIcon sx={{ color: 'success.main' }} />
            : <WifiOffIcon sx={{ color: 'error.main' }} />}
          <Box>
            <Typography variant="body2">
              Estado de red: <strong style={{ color: online ? 'inherit' : 'var(--palette-error-main)' }}>
                {online ? 'Online' : 'Offline'}
              </strong>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Desactivá el WiFi para ver el cambio en tiempo real
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box>
          <Typography variant="body2">
            Scroll Y: <strong>{scrollY}px</strong>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Scrolleá la página para ver el valor actualizar
          </Typography>
        </Box>
      </Stack>
      <Code>{`function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on  = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online',  on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return y;
}`}</Code>
    </Box>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function CustomHooksDemo() {
  return (
    <Box>
      <Section title="usePrevious" hook="usePrevious<T>(value)" description="Devuelve el valor anterior de cualquier state o prop. Útil para comparar contra el valor previo en useEffect.">
        <PreviousDemo />
      </Section>

      <Section title="useDebounce" hook="useDebounce<T>(value, delay)" description="Retrasa la actualización de un valor hasta que deja de cambiar por N milisegundos. Ideal para búsquedas y filtros.">
        <DebounceDemo />
      </Section>

      <Section title="useLocalStorage" hook="useLocalStorage<T>(key, initial)" description="Sincroniza state con localStorage. Misma API que useState, persiste entre recargas.">
        <LocalStorageDemo />
      </Section>

      <Section title="useClickOutside" hook="useClickOutside(ref, handler)" description="Ejecuta un callback cuando el usuario hace click fuera de un elemento. Usado en menús, dropdowns y tooltips.">
        <ClickOutsideDemo />
      </Section>

      <Section title="useOnline + useScrollY" hook="browser events" description="Hooks que wrappean eventos del navegador en reactive state. Limpian sus listeners automáticamente.">
        <BrowserEventsDemo />
      </Section>
    </Box>
  );
}
