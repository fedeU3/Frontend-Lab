import {
  Avatar, Box, Button, Card, CardContent, CardHeader,
  Chip, Divider, Skeleton, Stack, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import { useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── Real content components ────────────────────────────────────────────────
function RealProfileCard() {
  return (
    <Card>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>AG</Avatar>}
        title="Ana García"
        subheader="Senior Developer · Buenos Aires, AR"
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Frontend engineer con 6 años de experiencia. Especializada en React, TypeScript y sistemas de diseño.
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label="React" size="small" color="primary" />
          <Chip label="TypeScript" size="small" color="primary" variant="outlined" />
          <Chip label="MUI" size="small" variant="outlined" />
          <Chip label="Design Systems" size="small" variant="outlined" />
        </Stack>
      </CardContent>
    </Card>
  );
}

function SkeletonProfileCard() {
  return (
    <Card>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton width="60%" />}
        subheader={<Skeleton width="40%" />}
      />
      <CardContent>
        <Skeleton variant="text" sx={{ mb: 0.5 }} />
        <Skeleton variant="text" sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width="70%" sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={50} height={24} />
        </Stack>
      </CardContent>
    </Card>
  );
}

// ── Article / Feed skeleton ────────────────────────────────────────────────
function RealArticleList() {
  const articles = [
    { title: 'Cómo usar React Query con TypeScript', time: 'hace 2 horas', reads: '1.2k' },
    { title: 'Design Tokens: el futuro del theming', time: 'hace 5 horas', reads: '847' },
    { title: 'useMemo vs useCallback: cuándo usar cada uno', time: 'hace 1 día', reads: '3.1k' },
  ];

  return (
    <Stack spacing={2}>
      {articles.map((a) => (
        <Box key={a.title} sx={{ display: 'flex', gap: 2, p: 2, borderRadius: 1, backgroundColor: 'background.elevated', border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 1, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{a.title}</Typography>
            <Stack direction="row" spacing={1.5}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{a.time}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>· {a.reads} lecturas</Typography>
            </Stack>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

function SkeletonArticleList() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, p: 2, borderRadius: 1, backgroundColor: 'background.elevated', border: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: 1, flexShrink: 0 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="50%" />
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

// ── Table skeleton ─────────────────────────────────────────────────────────
function RealTable() {
  const rows = [
    { id: 1, nombre: 'Pedido #001', monto: '$12.400', estado: 'activo' },
    { id: 2, nombre: 'Pedido #002', monto: '$3.800',  estado: 'pendiente' },
    { id: 3, nombre: 'Pedido #003', monto: '$27.100', estado: 'activo' },
    { id: 4, nombre: 'Pedido #004', monto: '$5.600',  estado: 'inactivo' },
  ];
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Pedido</TableCell>
          <TableCell align="right">Monto</TableCell>
          <TableCell>Estado</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.nombre}</TableCell>
            <TableCell align="right" sx={{ fontFamily: 'monospace' }}>{r.monto}</TableCell>
            <TableCell>
              <Chip
                label={r.estado}
                size="small"
                color={r.estado === 'activo' ? 'success' : r.estado === 'pendiente' ? 'warning' : 'default'}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SkeletonTable() {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell><Skeleton width={60} /></TableCell>
          <TableCell align="right"><Skeleton width={50} /></TableCell>
          <TableCell><Skeleton width={60} /></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {[1, 2, 3, 4].map((i) => (
          <TableRow key={i}>
            <TableCell><Skeleton width="70%" /></TableCell>
            <TableCell align="right"><Skeleton width={60} /></TableCell>
            <TableCell><Skeleton variant="rounded" width={70} height={22} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ── Stats / Dashboard skeleton ─────────────────────────────────────────────
function RealStats() {
  const stats = [
    { label: 'Pedidos totales', value: '1.284', delta: '+12%' },
    { label: 'Ingresos del mes', value: '$48.600', delta: '+8%' },
    { label: 'Usuarios activos', value: '342', delta: '-3%' },
  ];
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
      {stats.map((s) => (
        <Box key={s.label} sx={{ p: 2, borderRadius: 1, backgroundColor: 'background.elevated', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ my: 0.5 }}>{s.value}</Typography>
          <Chip label={s.delta} size="small" color={s.delta.startsWith('+') ? 'success' : 'error'} />
        </Box>
      ))}
    </Box>
  );
}

function SkeletonStats() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ p: 2, borderRadius: 1, backgroundColor: 'background.elevated', border: '1px solid', borderColor: 'divider' }}>
          <Skeleton width="60%" sx={{ mb: 0.5 }} />
          <Skeleton width="45%" height={40} />
          <Skeleton variant="rounded" width={50} height={22} />
        </Box>
      ))}
    </Box>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function SkeletonsDemo() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box>
      {/* Global toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          mb: 4,
          borderRadius: 1,
          backgroundColor: 'background.elevated',
          border: '1px solid',
          borderColor: loaded ? 'primary.main' : 'divider',
        }}
      >
        <Box>
          <Typography variant="subtitle2">Estado de carga</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Toggleá para ver el before/after de cada patrón
          </Typography>
        </Box>
        <FormControlLabel
          control={<Switch checked={loaded} onChange={(e) => setLoaded(e.target.checked)} />}
          label={loaded ? 'Cargado' : 'Cargando…'}
          labelPlacement="start"
        />
      </Box>

      <Section
        title="Profile Card"
        subtitle="Skeleton de tarjeta con avatar circular, título y chips. Variant circular para avatar, text para líneas, rounded para chips."
      >
        {loaded ? <RealProfileCard /> : <SkeletonProfileCard />}
      </Section>

      <Section
        title="Article / Feed list"
        subtitle="Skeleton de lista con imagen rectangular y dos líneas de texto. Ideal para feeds, notificaciones y timelines."
      >
        {loaded ? <RealArticleList /> : <SkeletonArticleList />}
      </Section>

      <Section
        title="Table"
        subtitle="Skeleton de tabla que preserva la estructura de columnas. Usar rounded para emular chips en celdas de estado."
      >
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', backgroundColor: 'background.elevated' }}>
          {loaded ? <RealTable /> : <SkeletonTable />}
        </Box>
      </Section>

      <Section
        title="Stats / Dashboard cards"
        subtitle="Skeleton para métricas. La altura del Skeleton de valor imita el tamaño del Typography h5."
      >
        {loaded ? <RealStats /> : <SkeletonStats />}
      </Section>

      {/* Reference */}
      <Section
        title="Variants de Skeleton"
        subtitle="MUI Skeleton tiene tres variantes visuales. Siempre pasá width y height para que el layout no salte al cargar."
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
          {[
            { variant: 'text',        label: 'text',        description: 'Para líneas de texto. Altura ≈ font-size × line-height.' },
            { variant: 'rectangular', label: 'rectangular',  description: 'Para imágenes, videos o áreas de contenido.' },
            { variant: 'circular',    label: 'circular',     description: 'Para avatares, íconos o indicadores circulares.' },
          ].map(({ variant, label, description }) => (
            <Box key={variant}>
              <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>{label}</Typography>
              <Skeleton variant={variant as any} width="100%" height={variant === 'circular' ? 48 : variant === 'rectangular' ? 80 : undefined} />
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>{description}</Typography>
            </Box>
          ))}
        </Box>
      </Section>
    </Box>
  );
}
