import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const CodeBlock = ({ code }: { code: string }) => (
  <Box sx={{ p: 2, mb: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
    <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
      {code}
    </Typography>
  </Box>
);

const Tip = ({ label, desc }: { label: string; desc: string }) => (
  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
    <CheckCircleIcon fontSize="small" sx={{ color: 'success.main', mt: 0.25, flexShrink: 0 }} />
    <Box>
      <Typography variant="body2" fontWeight="bold">{label}</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{desc}</Typography>
    </Box>
  </Box>
);

export default function BundleOptimization() {
  return (
    <Box>
      <Section title="Dynamic import" subtitle="Cargá módulos pesados solo cuando se necesitan. Funciona con cualquier módulo ES.">
        <CodeBlock code={`// ❌ Se incluye en el bundle principal
import { Chart } from 'recharts';

// ✅ Se carga solo cuando el usuario navega a esa ruta
const HeavyPage = lazy(() => import('./pages/HeavyPage'));

// ✅ Import dinámico imperativo (util en event handlers)
async function loadPDF() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.save('file.pdf');
}`} />
        <Stack spacing={1.5}>
          <Tip label="Barrel exports matan el tree shaking" desc='Evitá reexportar todo desde un index.ts con "export *". Importá directamente desde el módulo.' />
          <Tip label="Lazy + Suspense para rutas" desc="Envolvé cada <Route> en lazy(). El código de la ruta solo se descarga al navegar hacia ella." />
        </Stack>
      </Section>

      <Section title="Tree shaking" subtitle="El bundler elimina el código no utilizado. Necesita módulos ES (import/export) y side-effect-free code.">
        <CodeBlock code={`// package.json de tu librería:
{ "sideEffects": false }   // declara que no hay side effects

// ❌ Importar toda la librería
import _ from 'lodash';          // ~70kB
import * as R from 'ramda';      // ~50kB

// ✅ Importar solo lo necesario
import debounce from 'lodash/debounce';   // ~2kB
import { filter } from 'lodash-es';      // tree-shakeable

// ✅ Con MUI — siempre importar por path o named export
import Button from '@mui/material/Button';
// OR
import { Button } from '@mui/material'; // tree-shaked en Vite/webpack`} />
      </Section>

      <Section title="Preload / Prefetch" subtitle="Insinuá al browser qué recursos cargar antes de que el usuario los pida.">
        <CodeBlock code={`// En Vite — el comentario /* @vite-prefetch */ o /* @vite-preload */
// activa hints automáticos en los lazy chunks.

// Manual: link en el <head>
<link rel="prefetch" href="/chunk-heavypage.js" as="script" />
<link rel="preload" href="/fonts/Inter.woff2" as="font" crossOrigin />

// Con React Router — preload en onMouseEnter
<Link
  to="/dashboard"
  onMouseEnter={() => import('./pages/Dashboard')} // precarga al hover
>
  Dashboard
</Link>`} />
        <Stack spacing={1.5}>
          <Tip label="preload vs prefetch" desc="preload: necesario para esta página (alta prioridad). prefetch: podría necesitarse en la navegación siguiente (baja prioridad)." />
          <Tip label="modulepreload" desc='rel="modulepreload" precarga módulos ES (incluyendo sus dependencias) con mayor eficiencia que prefetch.' />
        </Stack>
      </Section>

      <Section title="Análisis del bundle">
        <CodeBlock code={`// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      open: true,         // abre el reporte al buildear
      gzipSize: true,     // muestra tamaño comprimido
      brotliSize: true,
      filename: 'stats.html',
    }),
  ],
};

// Correr:  npm run build  → se abre stats.html automáticamente`} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
          {[
            { label: 'rollup-plugin-visualizer', desc: 'Treemap interactivo de módulos por tamaño', tag: 'Vite/Rollup' },
            { label: 'webpack-bundle-analyzer', desc: 'Análisis visual para proyectos webpack', tag: 'Webpack' },
            { label: 'source-map-explorer', desc: 'Analiza desde el source map, agnóstico al bundler', tag: 'Universal' },
          ].map(({ label, desc, tag }) => (
            <Paper key={label} variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="caption" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>{label}</Typography>
                <Chip label={tag} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{desc}</Typography>
            </Paper>
          ))}
        </Box>
      </Section>

      <Section title="Checklist rápido">
        <Stack spacing={1.5}>
          {[
            ['Habilitar gzip/brotli en el servidor', 'Reduce el tamaño transferido un 60-80% sin cambiar código.'],
            ['Dividir vendor chunk', 'Separar react, react-dom y librerías estables del código de la app.'],
            ['Lazy load imágenes', 'Usar loading="lazy" en <img> o IntersectionObserver para cargar al scroll.'],
            ['Auditar dependencias pesadas', 'bundlephobia.com muestra el costo de cada paquete npm antes de instalarlo.'],
            ['Evitar polyfills innecesarios', 'Definir browserslist acorde al target real para no incluir polyfills extras.'],
          ].map(([label, desc]) => (
            <Tip key={label} label={label} desc={desc} />
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
