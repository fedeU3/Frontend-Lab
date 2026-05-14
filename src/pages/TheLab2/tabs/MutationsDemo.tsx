import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, IconButton, Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// ── Mock "database" ────────────────────────────────────────────────────────
type Item = { id: number; nombre: string; estado: 'activo' | 'inactivo' };

let nextId = 4;
const mockDB: Item[] = [
  { id: 1, nombre: 'Elemento Alpha', estado: 'activo' },
  { id: 2, nombre: 'Elemento Beta',  estado: 'activo' },
  { id: 3, nombre: 'Elemento Gamma', estado: 'inactivo' },
];

const delay = (ms = 800) => new Promise((res) => setTimeout(res, ms));

const api = {
  list: async (): Promise<Item[]> => { await delay(400); return [...mockDB]; },
  create: async (nombre: string): Promise<Item> => {
    await delay(700);
    const item: Item = { id: nextId++, nombre, estado: 'activo' };
    mockDB.push(item);
    return item;
  },
  update: async (id: number, nombre: string): Promise<Item> => {
    await delay(600);
    const i = mockDB.findIndex((x) => x.id === id);
    if (i === -1) throw new Error('Item no encontrado');
    mockDB[i] = { ...mockDB[i], nombre };
    return mockDB[i];
  },
  delete: async (id: number): Promise<void> => {
    await delay(700);
    if (id === 2) throw new Error('No se puede eliminar: tiene dependencias activas');
    const i = mockDB.findIndex((x) => x.id === id);
    if (i !== -1) mockDB.splice(i, 1);
  },
};

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── 1. Create ──────────────────────────────────────────────────────────────
function CreateDemo({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const [nombre, setNombre] = useState('');

  const mutation = useMutation({
    mutationFn: (n: string) => api.create(n),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lab2-items'] });
      setNombre('');
    },
  });

  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <TextField
        size="small"
        label="Nombre del nuevo elemento"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        sx={{ flex: 1, minWidth: 220 }}
        onKeyDown={(e) => { if (e.key === 'Enter' && nombre.trim()) mutation.mutate(nombre.trim()); }}
      />
      <Button
        variant="contained"
        startIcon={mutation.isPending ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
        disabled={mutation.isPending || !nombre.trim()}
        onClick={() => mutation.mutate(nombre.trim())}
      >
        {mutation.isPending ? 'Creando…' : 'Crear'}
      </Button>
      {mutation.isSuccess && (
        <Alert severity="success" sx={{ width: '100%' }}>
          Elemento "<strong>{mutation.data.nombre}</strong>" creado (ID: {mutation.data.id})
        </Alert>
      )}
    </Box>
  );
}

// ── 2. Update (inline edit) ────────────────────────────────────────────────
function UpdateDemo({ item, qc }: { item: Item; qc: ReturnType<typeof useQueryClient> }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.nombre);

  const mutation = useMutation({
    mutationFn: (nombre: string) => api.update(item.id, nombre),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lab2-items'] });
      setEditing(false);
    },
  });

  if (!editing) {
    return (
      <Tooltip title="Editar">
        <IconButton size="small" onClick={() => setEditing(true)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
        sx={{ width: 180 }}
      />
      <Button
        size="small"
        variant="contained"
        disabled={mutation.isPending || !value.trim()}
        onClick={() => mutation.mutate(value.trim())}
      >
        {mutation.isPending ? <CircularProgress size={14} color="inherit" /> : 'OK'}
      </Button>
      <IconButton size="small" onClick={() => { setEditing(false); setValue(item.nombre); }}>
        <UndoIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

// ── 3. Delete with optimistic update ──────────────────────────────────────
function DeleteDemo({ item, qc }: { item: Item; qc: ReturnType<typeof useQueryClient> }) {
  const mutation = useMutation({
    mutationFn: () => api.delete(item.id),
    onMutate: async () => {
      // Optimistic: remove immediately
      await qc.cancelQueries({ queryKey: ['lab2-items'] });
      const prev = qc.getQueryData<Item[]>(['lab2-items']);
      qc.setQueryData<Item[]>(['lab2-items'], (old) => old?.filter((x) => x.id !== item.id));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // Rollback
      if (ctx?.prev) qc.setQueryData(['lab2-items'], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['lab2-items'] });
    },
  });

  return (
    <Tooltip title={item.id === 2 ? 'Falla intencionalmente (demo rollback)' : 'Eliminar'}>
      <span>
        <IconButton
          size="small"
          color={item.id === 2 ? 'secondary' : 'default'}
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? <CircularProgress size={14} /> : <DeleteIcon fontSize="small" />}
        </IconButton>
      </span>
    </Tooltip>
  );
}

// ── Item list ──────────────────────────────────────────────────────────────
function ItemList({ qc }: { qc: ReturnType<typeof useQueryClient> }) {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['lab2-items'],
    queryFn: api.list,
  });

  if (isLoading) {
    return (
      <Stack alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={28} />
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.elevated',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', minWidth: 28 }}>
            #{item.id}
          </Typography>
          <Typography variant="body2" sx={{ flex: 1 }}>{item.nombre}</Typography>
          <Chip
            label={item.estado}
            size="small"
            color={item.estado === 'activo' ? 'success' : 'default'}
          />
          <UpdateDemo item={item} qc={qc} />
          <DeleteDemo item={item} qc={qc} />
        </Box>
      ))}
      {items.length === 0 && (
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
          Sin elementos. Creá uno arriba.
        </Typography>
      )}
    </Stack>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function MutationsDemo() {
  const qc = useQueryClient();

  return (
    <Box>
      <Section
        title="useMutation — Create / Update / Delete"
        subtitle="CRUD completo con React Query. El botón rojo (ID: 2) falla intencionalmente para demostrar el rollback optimista."
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {/* Left: Create */}
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Crear elemento
            </Typography>
            <CreateDemo qc={qc} />
          </Box>

          {/* Right: List with edit/delete */}
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
              Lista — editar y eliminar inline
            </Typography>
            <ItemList qc={qc} />
          </Box>
        </Box>
      </Section>

      {/* Pattern reference */}
      <Section
        title="Patrones de useMutation"
        subtitle="Referencia rápida de los tres patrones más comunes."
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {[
            {
              label: 'Básico',
              code: `const mutation = useMutation({
  mutationFn: (data) => api.create(data),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['items'] });
  },
  onError: (err) => {
    console.error(err.message);
  },
});`,
            },
            {
              label: 'Optimistic update',
              code: `const mutation = useMutation({
  mutationFn: (id) => api.delete(id),
  onMutate: async (id) => {
    await qc.cancelQueries({ queryKey: ['items'] });
    const prev = qc.getQueryData(['items']);
    qc.setQueryData(['items'], (old) =>
      old.filter((x) => x.id !== id)
    );
    return { prev };
  },
  onError: (_e, _v, ctx) => {
    qc.setQueryData(['items'], ctx?.prev);
  },
  onSettled: () => {
    qc.invalidateQueries({ queryKey: ['items'] });
  },
});`,
            },
            {
              label: 'Estados en UI',
              code: `// En el botón:
<Button
  disabled={mutation.isPending}
  startIcon={
    mutation.isPending
      ? <CircularProgress size={16} />
      : <SaveIcon />
  }
  onClick={() => mutation.mutate(data)}
>
  {mutation.isPending ? 'Guardando…' : 'Guardar'}
</Button>

// Feedback:
{mutation.isSuccess && <Alert severity="success">OK</Alert>}
{mutation.isError && (
  <Alert severity="error">
    {mutation.error.message}
  </Alert>
)}`,
            },
          ].map(({ label, code }) => (
            <Box key={label}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
              <Box
                component="pre"
                sx={{
                  mt: 0.5, p: 1.5,
                  backgroundColor: 'background.elevated',
                  borderRadius: 1, border: '1px solid', borderColor: 'divider',
                  fontSize: '0.7rem', fontFamily: 'monospace',
                  color: 'text.primary', overflow: 'auto', m: 0,
                }}
              >
                {code}
              </Box>
            </Box>
          ))}
        </Box>
      </Section>
    </Box>
  );
}
