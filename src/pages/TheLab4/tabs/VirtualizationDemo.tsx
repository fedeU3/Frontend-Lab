import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

type Row = { id: number; name: string; email: string; role: string; status: 'activo' | 'inactivo' };

const ROLES   = ['Developer', 'Designer', 'Manager', 'QA', 'DevOps'];
const NAMES   = ['Ana', 'Luis', 'María', 'Carlos', 'Sofia', 'Juan', 'Laura', 'Pedro', 'Valeria', 'Diego'];

function buildRows(count: number): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id:     i + 1,
    name:   `${NAMES[i % NAMES.length]} ${['García', 'Torres', 'López', 'Ruiz', 'Chen'][i % 5]}`,
    email:  `user${i + 1}@company.com`,
    role:   ROLES[i % ROLES.length],
    status: i % 7 === 0 ? 'inactivo' : 'activo',
  }));
}

const ROW_HEIGHT = 48;

function VirtualList({ rows }: { rows: Row[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  const items = virtualizer.getVirtualItems();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 120px 80px',
        gap: 2, px: 2, py: 1, backgroundColor: 'background.paper', borderRadius: '4px 4px 0 0',
        border: '1px solid', borderColor: 'divider' }}>
        {['#', 'Nombre', 'Email', 'Rol', 'Estado'].map((h) => (
          <Typography key={h} variant="caption" fontWeight="bold" sx={{ color: 'text.secondary' }}>{h}</Typography>
        ))}
      </Box>

      {/* Viewport */}
      <Box ref={parentRef} sx={{ height: 360, overflowY: 'auto', border: '1px solid', borderTop: 0,
        borderColor: 'divider', borderRadius: '0 0 4px 4px', backgroundColor: 'background.elevated' }}>
        {/* Total height container */}
        <Box sx={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {items.map((vRow) => {
            const row = rows[vRow.index];
            return (
              <Box key={vRow.key} data-index={vRow.index} ref={virtualizer.measureElement}
                sx={{ position: 'absolute', top: 0, left: 0, width: '100%',
                  transform: `translateY(${vRow.start}px)`,
                  display: 'grid', gridTemplateColumns: '60px 1fr 1fr 120px 80px',
                  gap: 2, px: 2, alignItems: 'center', height: ROW_HEIGHT,
                  borderBottom: '1px solid', borderColor: 'divider',
                  '&:hover': { backgroundColor: 'rgba(255,112,67,0.04)' },
                }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                  {row.id}
                </Typography>
                <Typography variant="body2">{row.name}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.email}</Typography>
                <Typography variant="caption">{row.role}</Typography>
                <Chip label={row.status} size="small"
                  color={row.status === 'activo' ? 'success' : 'default'} variant="outlined"
                  sx={{ height: 20, fontSize: '0.65rem' }} />
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 3, mt: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Total: <strong>{rows.length.toLocaleString()}</strong> filas
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Renderizadas: <strong>{items.length}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          DOM nodes: <strong>~{items.length * 6}</strong> (vs {rows.length * 6} sin virtualización)
        </Typography>
      </Box>
    </Box>
  );
}

export default function VirtualizationDemo() {
  const rows10k  = useMemo(() => buildRows(10_000), []);
  const rows100k = useMemo(() => buildRows(100_000), []);

  return (
    <Box>
      <Section
        title="10 000 filas"
        subtitle="useVirtualizer solo renderiza las filas visibles (~8 a la vez). El scroll es instantáneo sin importar el tamaño del dataset."
      >
        <VirtualList rows={rows10k} />
      </Section>
      <Section
        title="100 000 filas"
        subtitle="El mismo componente, mismo rendimiento. La virtualización escala linealmente — agregar más datos no agrega más DOM nodes."
      >
        <VirtualList rows={rows100k} />
      </Section>
      <Section title="Cómo funciona" subtitle="">
        <Stack spacing={1.5}>
          {[
            { label: 'getScrollElement', desc: 'Ref al contenedor scrolleable — useVirtualizer necesita medir su altura.' },
            { label: 'estimateSize',     desc: 'Altura estimada por fila. Con filas de altura fija es exacta; con altura variable useVirtualizer la mide en runtime.' },
            { label: 'overscan',         desc: 'Cuántas filas extra renderizar fuera del viewport para suavizar el scroll.' },
            { label: 'getTotalSize()',   desc: 'Altura total del contenedor interno — crea el espacio del scrollbar correcto.' },
            { label: 'getVirtualItems()', desc: 'Array de las filas actualmente visibles, con index, start y size para posicionarlas con transform.' },
          ].map(({ label, desc }) => (
            <Box key={label} sx={{ display: 'flex', gap: 1.5 }}>
              <Chip label={label} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.68rem', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>{desc}</Typography>
            </Box>
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
