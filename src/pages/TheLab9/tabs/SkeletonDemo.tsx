import { Avatar, Box, Button, Card, CardContent, CardHeader, Chip, CircularProgress, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

function PostCard({ loading }: { loading: boolean }) {
  return (
    <Card variant="outlined" sx={{ backgroundColor: 'background.elevated' }}>
      <CardHeader
        avatar={loading ? <Skeleton variant="circular" width={40} height={40} /> : <Avatar sx={{ backgroundColor: 'primary.main' }}>F</Avatar>}
        title={loading ? <Skeleton variant="text" width="60%" /> : 'Federico Huespe'}
        subheader={loading ? <Skeleton variant="text" width="40%" /> : 'hace 5 minutos'}
      />
      <CardContent>
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={120} sx={{ mb: 1, borderRadius: 1 }} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </>
        ) : (
          <>
            <Box sx={{ height: 120, backgroundColor: 'background.paper', borderRadius: 1, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>📸 Imagen del post</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Implementando React 19 en producción. Los cambios en useTransition y useOptimistic hacen que la UX sea mucho más fluida.
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TableSkeleton({ loading }: { loading: boolean }) {
  if (loading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 0.5, borderRadius: 1 }} />
        {Array.from({ length: 5 }, (_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 0.5, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Skeleton variant="text" width={40} />
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="20%" />
            <Skeleton variant="text" width="15%" />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        ))}
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, py: 1, px: 1, backgroundColor: 'background.paper', borderRadius: 1, mb: 0.5 }}>
        {['#', 'Nombre', 'Categoría', 'Precio', ''].map((h) => (
          <Typography key={h} variant="caption" fontWeight="bold" sx={{ flex: h === 'Nombre' ? 3 : 1, color: 'text.primary' }}>{h}</Typography>
        ))}
      </Box>
      {['Teclado', 'Monitor', 'Mouse', 'Auriculares', 'Webcam'].map((name, i) => (
        <Box key={name} sx={{ display: 'flex', gap: 2, py: 1, px: 1, borderBottom: '1px solid', borderColor: 'divider', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary', fontFamily: 'monospace' }}>{i + 1}</Typography>
          <Typography variant="caption" sx={{ flex: 3, color: 'text.primary' }}>{name}</Typography>
          <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary' }}>Electrónica</Typography>
          <Typography variant="caption" sx={{ flex: 1, color: 'primary.main' }}>${(i + 1) * 45}</Typography>
          <Chip label="activo" size="small" color="success" sx={{ height: 18, fontSize: '0.6rem' }} />
        </Box>
      ))}
    </Box>
  );
}

export default function SkeletonDemo() {
  const [loading, setLoading] = useState(true);

  return (
    <Box>
      <Section title="Control de simulación">
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button variant={loading ? 'contained' : 'outlined'} onClick={() => setLoading(true)} size="small">
            Mostrar Skeletons
          </Button>
          <Button variant={!loading ? 'contained' : 'outlined'} onClick={() => setLoading(false)} size="small">
            Mostrar contenido real
          </Button>
          <Chip label={loading ? 'Cargando…' : 'Contenido listo'} color={loading ? 'warning' : 'success'} size="small" />
        </Box>
      </Section>

      <Section title="Skeleton vs Spinner" subtitle="Skeleton muestra la forma del contenido (layout hint), reduciendo la percepción de espera. Spinner es agnóstico al contenido.">
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>Skeleton (layout-aware)</Typography>
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="50%" />
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
                <Avatar sx={{ backgroundColor: 'primary.main', width: 48, height: 48 }}>FH</Avatar>
                <Box>
                  <Typography variant="body2" fontWeight="bold">Federico Huespe</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Developer · Buenos Aires</Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>Spinner (layout-agnóstico)</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, height: 90, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
              {loading ? <CircularProgress size={32} /> : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Contenido cargado</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Section>

      <Section title="Variantes de Skeleton" subtitle="text, rectangular, circular — se adaptan a cualquier forma de contenido.">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>Cards de post</Typography>
            <PostCard loading={loading} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>Tabla de datos</Typography>
            <TableSkeleton loading={loading} />
          </Grid>
        </Grid>
      </Section>

      <Section title="Skeleton animation variants">
        <Stack spacing={2}>
          {(['pulse', 'wave', false] as const).map((animation) => (
            <Box key={String(animation)} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 80, fontFamily: 'monospace' }}>
                {animation === false ? 'false' : animation}
              </Typography>
              <Skeleton variant="rectangular" width={200} height={20} animation={animation} sx={{ borderRadius: 1 }} />
              <Skeleton variant="circular" width={20} height={20} animation={animation} />
            </Box>
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
