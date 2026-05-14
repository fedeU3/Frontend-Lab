import {
  Autocomplete, Avatar, Box,
  Divider, TextField, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const Preview = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', minHeight: 48 }}>
    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{children}</Typography>
  </Box>
);

const FRAMEWORKS = ['React', 'Vue', 'Angular', 'Svelte', 'Solid', 'Next.js', 'Nuxt', 'Remix', 'Astro', 'Qwik'];

const TECH_OPTIONS = [
  { label: 'React',      category: 'Frontend' },
  { label: 'Vue',        category: 'Frontend' },
  { label: 'Angular',    category: 'Frontend' },
  { label: 'Next.js',    category: 'Meta-framework' },
  { label: 'Nuxt',       category: 'Meta-framework' },
  { label: 'Remix',      category: 'Meta-framework' },
  { label: 'Node.js',    category: 'Backend' },
  { label: 'Express',    category: 'Backend' },
  { label: 'NestJS',     category: 'Backend' },
  { label: 'PostgreSQL', category: 'Database' },
  { label: 'MongoDB',    category: 'Database' },
  { label: 'Redis',      category: 'Database' },
];

type User = { id: number; name: string; email: string; role: string };
const USERS: User[] = [
  { id: 1, name: 'Ana García',   email: 'ana@example.com',    role: 'Developer' },
  { id: 2, name: 'Luis Torres',  email: 'luis@example.com',   role: 'Designer' },
  { id: 3, name: 'María López',  email: 'maria@example.com',  role: 'Manager' },
  { id: 4, name: 'Carlos Ruiz',  email: 'carlos@example.com', role: 'Developer' },
  { id: 5, name: 'Sofia Chen',   email: 'sofia@example.com',  role: 'Developer' },
  { id: 6, name: 'Juan Pérez',   email: 'juan@example.com',   role: 'Designer' },
];

// ── 1. Basic ────────────────────────────────────────────────────────────────
function BasicDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Autocomplete
        options={FRAMEWORKS}
        value={value}
        onChange={(_, v) => setValue(v)}
        renderInput={(params) => <TextField {...params} label="Framework" size="small" />}
      />
      <Preview>value: {value ? `"${value}"` : 'null'}</Preview>
    </Box>
  );
}

// ── 2. Multiple ─────────────────────────────────────────────────────────────
function MultipleDemo() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Autocomplete
        multiple
        options={FRAMEWORKS}
        value={values}
        onChange={(_, v) => setValues(v)}
        renderInput={(params) => <TextField {...params} label="Frameworks (múltiple)" size="small" />}
      />
      <Preview>{JSON.stringify(values)}</Preview>
    </Box>
  );
}

// ── 3. Grouped ──────────────────────────────────────────────────────────────
function GroupedDemo() {
  const [value, setValue] = useState<typeof TECH_OPTIONS[0] | null>(null);
  const sorted = [...TECH_OPTIONS].sort((a, b) => a.category.localeCompare(b.category));
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Autocomplete
        options={sorted}
        groupBy={(opt) => opt.category}
        getOptionLabel={(opt) => opt?.label ?? ''}
        value={value}
        onChange={(_, v) => setValue(v)}
        isOptionEqualToValue={(opt, val) => opt.label === val?.label}
        renderInput={(params) => <TextField {...params} label="Tecnología (agrupada)" size="small" />}
      />
      <Box sx={{ p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', display: 'block' }}>
          {'// groupBy={(opt) => opt.category}'}
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
          {value ? `{ label: "${value.label}", category: "${value.category}" }` : 'null'}
        </Typography>
      </Box>
    </Box>
  );
}

// ── 4. Async search ─────────────────────────────────────────────────────────
function AsyncDemo() {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<User | null>(null);

  useEffect(() => {
    if (!inputValue) { setOptions([]); return; }
    setLoading(true);
    const id = setTimeout(() => {
      setOptions(
        USERS.filter(
          (u) =>
            u.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            u.email.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
      setLoading(false);
    }, 400);
    return () => clearTimeout(id);
  }, [inputValue]);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Autocomplete
        options={options}
        getOptionLabel={(opt) => opt?.name ?? ''}
        value={value}
        onChange={(_, v) => setValue(v)}
        inputValue={inputValue}
        onInputChange={(_, v) => setInputValue(v)}
        loading={loading}
        filterOptions={(x) => x}
        isOptionEqualToValue={(opt, val) => opt.id === val?.id}
        noOptionsText={inputValue ? 'Sin resultados' : 'Escribí para buscar…'}
        loadingText="Buscando…"
        openText="Abrir"
        clearText="Limpiar"
        closeText="Cerrar"
        renderOption={(props, opt) => {
          const { key, ...rest } = props as typeof props & { key?: string };
          return (
            <li key={key ?? opt.id} {...rest}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 0.25 }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  {opt.name.split(' ').map((n) => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.3 }}>{opt.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{opt.email} · {opt.role}</Typography>
                </Box>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="Buscar usuario" size="small" />
        )}
      />
      <Box sx={{ p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          Busca en <strong>nombre</strong> y <strong>email</strong> · Debounce 400ms
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          {'filterOptions={(x) => x}'} desactiva el filtro local
        </Typography>
        {value && (
          <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
              {value.id} · "{value.name}" · {value.role}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── 5. Free solo ────────────────────────────────────────────────────────────
function FreeSoloDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Autocomplete
        freeSolo
        options={FRAMEWORKS}
        value={value}
        onChange={(_, v) => setValue(v as string | null)}
        onInputChange={(_, v, reason) => { if (reason === 'input') setValue(v); }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Framework (free-solo)"
            size="small"
            helperText="Podés escribir uno que no esté en la lista"
          />
        )}
      />
      <Preview>
        {`freeSolo: true → acepta cualquier string\nvalue: ${value ? `"${value}"` : 'null'}`}
      </Preview>
    </Box>
  );
}

export default function AutocompleteDemo() {
  return (
    <Box>
      <Section title="Básico" subtitle="Autocomplete controlado con lista de opciones estática.">
        <BasicDemo />
      </Section>
      <Section title="Selección múltiple" subtitle="Con prop multiple. Los chips se renderizan automáticamente con estilos de MUI.">
        <MultipleDemo />
      </Section>
      <Section title="Opciones agrupadas" subtitle="groupBy agrupa visualmente las opciones. Las opciones deben estar ordenadas por la misma clave.">
        <GroupedDemo />
      </Section>
      <Section title="Búsqueda async + debounce" subtitle="filterOptions={(x) => x} desactiva el filtrado local. El debounce evita llamadas innecesarias.">
        <AsyncDemo />
      </Section>
      <Section title="Free Solo" subtitle="freeSolo permite ingresar valores que no están en la lista de opciones.">
        <FreeSoloDemo />
      </Section>
    </Box>
  );
}
