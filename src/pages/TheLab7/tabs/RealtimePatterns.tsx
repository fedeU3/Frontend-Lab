import { Box, Chip, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

type Support = 'yes' | 'no' | 'partial';
function Icon({ v }: { v: Support }) {
  if (v === 'yes') return <CheckIcon fontSize="small" sx={{ color: 'success.main' }} />;
  if (v === 'no') return <CloseIcon fontSize="small" sx={{ color: 'error.main' }} />;
  return <RemoveIcon fontSize="small" sx={{ color: 'warning.main' }} />;
}

const PATTERNS = [
  {
    name: 'WebSocket',
    latency: '~1ms',
    overhead: 'Bajo',
    bidirectional: 'yes' as Support,
    binary: 'yes' as Support,
    complexity: 'Media',
    scalability: 'partial' as Support,
    useCases: 'Chat, gaming, colaboración en tiempo real, trading',
    color: '#FF7043',
  },
  {
    name: 'SSE (EventSource)',
    latency: '~10ms',
    overhead: 'Muy bajo',
    bidirectional: 'no' as Support,
    binary: 'no' as Support,
    complexity: 'Baja',
    scalability: 'yes' as Support,
    useCases: 'Notificaciones, feeds en vivo, logs, progress updates',
    color: '#42A5F5',
  },
  {
    name: 'Polling corto',
    latency: 'Configurable',
    overhead: 'Alto',
    bidirectional: 'yes' as Support,
    binary: 'partial' as Support,
    complexity: 'Baja',
    scalability: 'no' as Support,
    useCases: 'Estado de jobs, dashboards lentos, compatibilidad máxima',
    color: '#66BB6A',
  },
  {
    name: 'Long Polling',
    latency: '~50ms',
    overhead: 'Medio',
    bidirectional: 'partial' as Support,
    binary: 'partial' as Support,
    complexity: 'Media',
    scalability: 'partial' as Support,
    useCases: 'Fallback para WebSocket, entornos proxy restrictivos',
    color: '#FFA726',
  },
];

const WHEN_TO_USE = [
  {
    title: 'WebSocket',
    items: [
      'Latencia sub-10ms crítica (gaming, trading)',
      'Comunicación bidireccional frecuente',
      'Transferencia de datos binarios (audio, video streams)',
    ],
  },
  {
    title: 'SSE (EventSource)',
    items: [
      'Server → cliente solamente (notificaciones, feed)',
      'HTTP/2 disponible (multiplexing gratis)',
      'Reconexión automática es importante',
    ],
  },
  {
    title: 'Polling corto',
    items: [
      'Datos que cambian cada pocos segundos',
      'Infraestructura serverless (no mantiene conexiones)',
      'Máxima compatibilidad sin dependencias extras',
    ],
  },
  {
    title: 'Long Polling',
    items: [
      'Redes corporativas con proxies que matan conexiones largas',
      'Fallback cuando WebSocket/SSE no están disponibles',
      'Sistemas legados que no soportan WebSocket',
    ],
  },
];

export default function RealtimePatterns() {
  return (
    <Box>
      <Section title="Comparativa de patrones en tiempo real">
        <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: 'background.elevated' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', color: 'text.primary', borderColor: 'divider' } }}>
                <TableCell>Patrón</TableCell>
                <TableCell>Latencia</TableCell>
                <TableCell>Overhead</TableCell>
                <TableCell align="center">Bidireccional</TableCell>
                <TableCell align="center">Binario</TableCell>
                <TableCell>Complejidad</TableCell>
                <TableCell align="center">Escalabilidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {PATTERNS.map((p) => (
                <TableRow key={p.name} sx={{ '& td': { borderColor: 'divider' }, '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color, flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{p.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{p.latency}</Typography></TableCell>
                  <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{p.overhead}</Typography></TableCell>
                  <TableCell align="center"><Icon v={p.bidirectional} /></TableCell>
                  <TableCell align="center"><Icon v={p.binary} /></TableCell>
                  <TableCell>
                    <Chip label={p.complexity} size="small" variant="outlined"
                      color={p.complexity === 'Alta' ? 'error' : p.complexity === 'Media' ? 'warning' : 'success'} />
                  </TableCell>
                  <TableCell align="center"><Icon v={p.scalability} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section title="¿Cuándo usar cada patrón?">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {WHEN_TO_USE.map(({ title, items }) => {
            const p = PATTERNS.find((x) => x.name === title)!;
            return (
              <Paper key={title} variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  {items.map((item) => (
                    <Box key={item} sx={{ display: 'flex', gap: 1 }}>
                      <CheckIcon fontSize="small" sx={{ color: 'success.main', fontSize: '0.9rem', mt: 0.25, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mt: 1.5, p: 1, borderRadius: 0.5, backgroundColor: 'background.paper' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Casos: {p.useCases}</Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Section>
    </Box>
  );
}
