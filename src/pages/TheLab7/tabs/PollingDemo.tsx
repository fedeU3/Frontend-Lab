import { Box, Button, Chip, CircularProgress, Divider, Paper, Slider, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface Metrics {
  cpu: number;
  memory: number;
  requests: number;
  errors: number;
  uptime: string;
  fetchedAt: string;
}

async function fetchMetrics(): Promise<Metrics> {
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));
  return {
    cpu: Math.round(20 + Math.random() * 60),
    memory: Math.round(40 + Math.random() * 40),
    requests: Math.round(100 + Math.random() * 900),
    errors: Math.round(Math.random() * 5),
    uptime: `${Math.floor(Date.now() / 1000 / 60)} min`,
    fetchedAt: new Date().toLocaleTimeString(),
  };
}

function MetricCard({ label, value, unit, color }: { label: string; value: number | string; unit?: string; color: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated', textAlign: 'center' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{label}</Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ color, lineHeight: 1.2, my: 0.5 }}>
        {value}{unit}
      </Typography>
    </Paper>
  );
}

export default function PollingDemo() {
  const [interval, setIntervalMs] = useState(3000);
  const [enabled, setEnabled] = useState(true);

  const { data, isFetching, dataUpdatedAt, refetch, isError, failureCount } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    refetchInterval: enabled ? interval : false,
    staleTime: interval - 500,
  });

  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

  return (
    <Box>
      <Section
        title="React Query refetchInterval"
        subtitle="La query se refresca automáticamente cada N ms. Cuando la tab pierde el foco, React Query pausa el polling (configurable con refetchIntervalInBackground)."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 480 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const { data, isFetching } = useQuery({
  queryKey: ['metrics'],
  queryFn: fetchMetrics,
  refetchInterval: 3000,        // cada 3s
  staleTime: 2500,              // datos frescos 2.5s
  refetchIntervalInBackground: false, // pausa sin foco
});`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 260 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 80 }}>
              Intervalo: {interval / 1000}s
            </Typography>
            <Slider
              value={interval} min={1000} max={10000} step={500}
              onChange={(_, v) => setIntervalMs(v as number)}
              sx={{ width: 160 }}
              disabled={!enabled}
            />
          </Box>
          <Button
            variant={enabled ? 'outlined' : 'contained'}
            onClick={() => setEnabled((e) => !e)}
            size="small"
          >
            {enabled ? 'Pausar polling' : 'Reanudar polling'}
          </Button>
          <Button variant="outlined" onClick={() => refetch()} size="small" startIcon={<RefreshIcon />}>
            Refrescar ahora
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip label={enabled ? 'Polling activo' : 'Polling pausado'} color={enabled ? 'success' : 'default'} size="small" />
          {isFetching && <CircularProgress size={14} />}
          {isFetching && <Typography variant="caption" sx={{ color: 'text.secondary' }}>Obteniendo datos…</Typography>}
          {!isFetching && <Typography variant="caption" sx={{ color: 'text.secondary' }}>Última actualización: {lastUpdate}</Typography>}
          {isError && <Chip label={`Error (${failureCount} intentos)`} color="error" size="small" />}
        </Box>

        {data && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            <MetricCard label="CPU" value={data.cpu} unit="%" color={data.cpu > 70 ? '#EF5350' : '#FF7043'} />
            <MetricCard label="Memoria" value={data.memory} unit="%" color={data.memory > 70 ? '#EF5350' : '#42A5F5'} />
            <MetricCard label="Requests/s" value={data.requests} color="#66BB6A" />
            <MetricCard label="Errores" value={data.errors} color={data.errors > 0 ? '#EF5350' : '#66BB6A'} />
          </Box>
        )}
      </Section>

      <Section title="Estrategias de polling">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {[
            { label: 'refetchInterval fijo', code: 'refetchInterval: 3000', desc: 'Polleja cada N ms sin importar si los datos cambiaron.' },
            { label: 'refetchInterval dinámico', code: 'refetchInterval: (data) => data?.hasMore ? 1000 : false', desc: 'Función que recibe los datos y decide el próximo intervalo.' },
            { label: 'staleTime + refetchOnWindowFocus', code: 'staleTime: 60_000, refetchOnWindowFocus: true', desc: 'Refresca al volver al foco si los datos tienen más de 60s.' },
            { label: 'keepPreviousData', code: 'placeholderData: keepPreviousData', desc: 'Muestra datos anteriores mientras llega la respuesta nueva.' },
          ].map(({ label, code, desc }) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>{label}</Typography>
              <Box sx={{ mb: 1, p: 0.75, borderRadius: 0.5, backgroundColor: 'background.paper' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>{code}</Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{desc}</Typography>
            </Paper>
          ))}
        </Box>
      </Section>
    </Box>
  );
}
