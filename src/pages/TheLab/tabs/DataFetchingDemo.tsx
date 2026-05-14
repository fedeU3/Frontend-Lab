import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlined';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState, useRef } from 'react';

// ── Mock data ──────────────────────────────────────────────────────────────
type DemoItem = {
  id: number;
  nombre: string;
  estado: 'activo' | 'inactivo' | 'pendiente';
  fecha: string;
};

const MOCK_ITEMS: DemoItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  nombre: `Elemento ${String(i + 1).padStart(2, '0')}`,
  estado: (['activo', 'inactivo', 'pendiente'] as const)[i % 3],
  fecha: new Date(Date.now() - i * 86_400_000).toLocaleDateString('es-AR'),
}));

const ESTADO_COLOR: Record<DemoItem['estado'], 'success' | 'error' | 'warning'> = {
  activo: 'success',
  inactivo: 'error',
  pendiente: 'warning',
};

const PER_PAGE = 5;

async function mockFetch<T>(
  result: () => T,
  { delay = 1200, shouldFail = false }: { delay?: number; shouldFail?: boolean } = {}
): Promise<T> {
  await new Promise((res) => setTimeout(res, delay));
  if (shouldFail) throw new Error('Error 500: Internal Server Error');
  return result();
}

// ── Shared Section wrapper ─────────────────────────────────────────────────
const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {subtitle}
      </Typography>
    )}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── Section 1: Loading / Success / Error states ────────────────────────────
function QueryStatesDemo() {
  type Mode = 'success' | 'error';
  // Each button click generates a new key to force a fresh query
  const [queryKey, setQueryKey] = useState<readonly [string, Mode, number]>([
    'lab-states',
    'success',
    0,
  ]);
  const mode = queryKey[1];

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      mockFetch(
        () => ({
          mensaje: '¡Datos obtenidos exitosamente!',
          hora: new Date().toLocaleTimeString('es-AR'),
          items: ['Elemento Alpha', 'Elemento Beta', 'Elemento Gamma'],
        }),
        { shouldFail: mode === 'error' }
      ),
    enabled: queryKey[2] > 0,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });

  const fetch = (m: Mode) => setQueryKey(['lab-states', m, Date.now()]);

  return (
    <Box>
      {/* Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<CloudDownloadIcon />}
          onClick={() => fetch('success')}
          disabled={isFetching}
        >
          Simular éxito
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ErrorOutlineIcon />}
          onClick={() => fetch('error')}
          disabled={isFetching}
        >
          Simular error
        </Button>
      </Stack>

      {/* Result area */}
      <Box
        sx={{
          minHeight: 160,
          backgroundColor: 'background.elevated',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        {queryKey[2] === 0 && (
          <Typography sx={{ color: 'text.secondary' }}>
            Presioná un botón para disparar la query
          </Typography>
        )}

        {isFetching && (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress color="primary" />
            <Typography sx={{ color: 'text.secondary' }}>Fetching…</Typography>
          </Stack>
        )}

        {!isFetching && isError && (
          <Alert severity="error" sx={{ width: '100%' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {(error as Error).message}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              useQuery detectó el error y lo expone en <code>error</code> y{' '}
              <code>isError: true</code>
            </Typography>
          </Alert>
        )}

        {!isFetching && !isError && data && (
          <Box sx={{ width: '100%' }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              {data.mensaje} — <strong>{data.hora}</strong>
            </Alert>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {data.items.map((item) => (
                <Chip key={item} label={item} color="primary" size="small" />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {/* Query state metadata */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Estado del hook
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} flexWrap="wrap" useFlexGap>
          {[
            { label: `isLoading: ${isLoading}`, active: isLoading },
            { label: `isFetching: ${isFetching}`, active: isFetching },
            { label: `isError: ${isError}`, active: isError },
            { label: `data: ${data ? 'present' : 'undefined'}`, active: !!data },
          ].map(({ label, active }) => (
            <Chip
              key={label}
              label={label}
              size="small"
              variant="outlined"
              color={active ? 'primary' : 'default'}
              sx={{ fontFamily: 'monospace', fontSize: '0.72rem' }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

// ── Section 2: Pagination ──────────────────────────────────────────────────
function PaginationDemo() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['lab-pagination', page],
    queryFn: () =>
      mockFetch(
        () => ({
          items: MOCK_ITEMS.slice((page - 1) * PER_PAGE, page * PER_PAGE),
          totalPages: Math.ceil(MOCK_ITEMS.length / PER_PAGE),
          total: MOCK_ITEMS.length,
        }),
        { delay: 700 }
      ),
    placeholderData: keepPreviousData,
  });

  return (
    <Box>
      {/* List */}
      <Box sx={{ minHeight: 320, position: 'relative' }}>
        {(isLoading || isFetching) && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.default',
              opacity: 0.8,
              zIndex: 1,
              borderRadius: 1,
            }}
          >
            <CircularProgress size={32} />
          </Box>
        )}

        <Stack spacing={1.5}>
          {(data?.items ?? []).map((item) => (
            <Card key={item.id} sx={{ backgroundColor: 'background.elevated' }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      #{item.id} — {item.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {item.fecha}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.estado}
                    size="small"
                    color={ESTADO_COLOR[item.estado]}
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Pagination control */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={data?.totalPages ?? 1}
          page={page}
          onChange={(_, p) => setPage(p)}
          color="primary"
          disabled={isFetching}
        />
      </Box>

      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', mt: 1 }}>
        {data?.total} items totales — página {page} de {data?.totalPages} —{' '}
        <code>keepPreviousData</code> mantiene los datos visibles durante el fetch
      </Typography>
    </Box>
  );
}

// ── Section 3: Cache ───────────────────────────────────────────────────────
function CacheDemo() {
  const [fetchCount, setFetchCount] = useState(0);

  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['lab-cache'],
    queryFn: () =>
      mockFetch(
        () => ({
          valor: Math.round(Math.random() * 1000),
          hora: new Date().toLocaleTimeString('es-AR'),
        }),
        { delay: 1000 }
      ),
    staleTime: 10_000,   // 10 segundos antes de considerar stale
    gcTime: 30_000,      // 30 segundos en cache
    refetchOnWindowFocus: false,
  });

  const handleRefetch = () => setFetchCount((c) => c + 1);

  // Re-run query by changing key with fetchCount
  useQuery({
    queryKey: ['lab-cache', fetchCount],
    queryFn: () =>
      mockFetch(
        () => ({
          valor: Math.round(Math.random() * 1000),
          hora: new Date().toLocaleTimeString('es-AR'),
        }),
        { delay: 1000 }
      ),
    staleTime: 10_000,
    enabled: fetchCount > 0,
  });

  const lastFetched = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('es-AR')
    : '—';

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={isFetching ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
          onClick={handleRefetch}
          disabled={isFetching}
        >
          {isFetching ? 'Refetching…' : 'Forzar refetch'}
        </Button>
      </Stack>

      <Box
        sx={{
          backgroundColor: 'background.elevated',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          p: 3,
        }}
      >
        {isLoading ? (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress />
            <Typography sx={{ color: 'text.secondary' }}>Carga inicial…</Typography>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Typography variant="h4" align="center" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {data?.valor ?? '—'}
            </Typography>

            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
              <Chip
                label={`Último fetch: ${lastFetched}`}
                size="small"
                color="primary"
                sx={{ fontFamily: 'monospace' }}
              />
              <Chip
                label={`staleTime: 10s`}
                size="small"
                variant="outlined"
                sx={{ fontFamily: 'monospace' }}
              />
              <Chip
                label={`gcTime: 30s`}
                size="small"
                variant="outlined"
                sx={{ fontFamily: 'monospace' }}
              />
            </Stack>

            <Alert severity="info">
              Durante los primeros <strong>10 segundos</strong> el dato está{' '}
              <strong>fresh</strong> — React Query no refetchea aunque cambies de tab.
              Después pasa a <strong>stale</strong> y el próximo focus lo refetchea.
            </Alert>
          </Stack>
        )}
      </Box>

      {/* staleTime / gcTime reference */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          Configuración de cache
        </Typography>
        <Box
          component="pre"
          sx={{
            mt: 1,
            p: 2,
            backgroundColor: 'background.elevated',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            color: 'text.primary',
            overflow: 'auto',
          }}
        >
          {`useQuery({
  queryKey: ['datos'],
  queryFn: fetchData,
  staleTime: 10_000,   // ms antes de marcar como stale
  gcTime: 30_000,      // ms antes de eliminar del cache
  refetchOnWindowFocus: false,  // no refetch al volver al tab
  retry: 3,            // reintentos en caso de error
  retryDelay: 1000,    // ms entre reintentos
})`}
        </Box>
      </Box>
    </Box>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function DataFetchingDemo() {
  return (
    <Box>
      <Section
        title="Loading / Success / Error"
        subtitle="useQuery expone isLoading, isFetching, isError, data y error. Usá los botones para simular cada estado."
      >
        <QueryStatesDemo />
      </Section>

      <Section
        title="Paginación"
        subtitle="queryKey incluye la página — React Query refetchea automáticamente al cambiarla. keepPreviousData mantiene los datos durante la transición."
      >
        <PaginationDemo />
      </Section>

      <Section
        title="Cache y staleTime"
        subtitle="React Query cachea el resultado. staleTime controla cuándo se considera desactualizado. gcTime controla cuándo se elimina del cache."
      >
        <CacheDemo />
      </Section>
    </Box>
  );
}
