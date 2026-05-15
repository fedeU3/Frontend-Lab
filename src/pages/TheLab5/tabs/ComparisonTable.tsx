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

interface LibRow {
  lib: string;
  bundle: string;
  devtools: Support;
  typescript: Support;
  concurrent: Support;
  curve: 'Fácil' | 'Media' | 'Alta';
  bestFor: string;
  color: string;
}

const ROWS: LibRow[] = [
  {
    lib: 'Zustand',
    bundle: '~3 kB',
    devtools: 'yes',
    typescript: 'yes',
    concurrent: 'yes',
    curve: 'Fácil',
    bestFor: 'Apps pequeñas-medianas, estado global simple',
    color: '#FF9800',
  },
  {
    lib: 'Redux Toolkit',
    bundle: '~12 kB',
    devtools: 'yes',
    typescript: 'yes',
    concurrent: 'yes',
    curve: 'Media',
    bestFor: 'Apps grandes, equipos grandes, lógica compleja',
    color: '#7B68EE',
  },
  {
    lib: 'Jotai',
    bundle: '~4 kB',
    devtools: 'partial',
    typescript: 'yes',
    concurrent: 'yes',
    curve: 'Fácil',
    bestFor: 'Estado atómico, granular, Server Components',
    color: '#4CAF50',
  },
  {
    lib: 'Context + useReducer',
    bundle: '0 kB (built-in)',
    devtools: 'no',
    typescript: 'yes',
    concurrent: 'partial',
    curve: 'Fácil',
    bestFor: 'Árboles pequeños, theming, evitar dependencias',
    color: '#00BCD4',
  },
];

function SupportIcon({ value }: { value: Support }) {
  if (value === 'yes') return <CheckIcon fontSize="small" sx={{ color: 'success.main' }} />;
  if (value === 'no') return <CloseIcon fontSize="small" sx={{ color: 'error.main' }} />;
  return <RemoveIcon fontSize="small" sx={{ color: 'warning.main' }} />;
}

const WHEN_TO_USE = [
  { lib: 'Zustand', when: 'Querés estado global sin boilerplate. La API más pequeña del ecosistema.' },
  { lib: 'Redux Toolkit', when: 'El equipo ya conoce Redux, necesitás middleware robusto (thunks, RTK Query) o state muy estructurado.' },
  { lib: 'Jotai', when: 'Necesitás estado granular por componente, persistencia fácil con atomWithStorage, o estás explorando RSC.' },
  { lib: 'Context + useReducer', when: 'El estado es local a un subárbol, no querés dependencias extra, o estás prototipando.' },
];

export default function ComparisonTable() {
  return (
    <Box>
      <Section title="Tabla comparativa" subtitle="Comparación de las cuatro alternativas más comunes para manejo de estado en React 19.">
        <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: 'background.elevated' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', color: 'text.primary', borderColor: 'divider' } }}>
                <TableCell>Librería</TableCell>
                <TableCell>Bundle (gzip)</TableCell>
                <TableCell align="center">DevTools</TableCell>
                <TableCell align="center">TypeScript</TableCell>
                <TableCell align="center">Concurrent Mode</TableCell>
                <TableCell>Curva</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ROWS.map((row) => (
                <TableRow key={row.lib} sx={{ '& td': { borderColor: 'divider' }, '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: row.color, flexShrink: 0 }} />
                      <Typography variant="body2" fontWeight="bold">{row.lib}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>{row.bundle}</Typography>
                  </TableCell>
                  <TableCell align="center"><SupportIcon value={row.devtools} /></TableCell>
                  <TableCell align="center"><SupportIcon value={row.typescript} /></TableCell>
                  <TableCell align="center"><SupportIcon value={row.concurrent} /></TableCell>
                  <TableCell>
                    <Chip
                      label={row.curve} size="small" variant="outlined"
                      color={row.curve === 'Alta' ? 'error' : row.curve === 'Media' ? 'warning' : 'success'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckIcon fontSize="small" sx={{ color: 'success.main' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Soporte completo</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RemoveIcon fontSize="small" sx={{ color: 'warning.main' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Soporte parcial / plugin externo</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CloseIcon fontSize="small" sx={{ color: 'error.main' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sin soporte</Typography>
          </Box>
        </Box>
      </Section>

      <Section title="¿Cuándo usar cada uno?">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {WHEN_TO_USE.map(({ lib, when }) => {
            const row = ROWS.find((r) => r.lib === lib)!;
            return (
              <Paper key={lib} variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: row.color }} />
                  <Typography variant="subtitle2" fontWeight="bold">{lib}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{row.bundle}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{when}</Typography>
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>Mejor para: {row.bestFor}</Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Section>
    </Box>
  );
}
