import { Box, Tab, Tabs, Typography } from '@mui/material';
import BiotechIcon from '@mui/icons-material/Biotech';
import WidgetsIcon from '@mui/icons-material/Widgets';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DataObjectIcon from '@mui/icons-material/DataObject';
import StorageIcon from '@mui/icons-material/Storage';
import PaletteIcon from '@mui/icons-material/Palette';
import { useState } from 'react';

import UIComponentsDemo from './tabs/UIComponentsDemo';
import FormsDemo from './tabs/FormsDemo';
import DataFetchingDemo from './tabs/DataFetchingDemo';
import LayoutPatternsDemo from './tabs/LayoutPatternsDemo';

// ── Color palette overview ─────────────────────────────────────────────────
const COLOR_TOKENS = [
  { label: 'Background', token: 'background.default' as const, hex: '#080808' },
  { label: 'Surface', token: 'background.paper' as const, hex: '#2C3E50' },
  { label: 'Elevated', token: 'background.elevated' as const, hex: '#151E26' },
  { label: 'Primary', token: 'primary.main' as const, hex: '#FF7043' },
  { label: 'Primary Dark', token: 'primary.dark' as const, hex: '#E64A19' },
  { label: 'Text', token: 'text.primary' as const, hex: '#B0BEC5' },
  { label: 'Text secondary', token: 'text.secondary' as const, hex: '#78909C' },
];

function OverviewTab() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 640 }}>
          Espacio de demos, playgrounds y componentes experimentales para proyectos futuros.
          Cada tab contiene demos funcionales y código de referencia listo para copiar.
        </Typography>
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Design System — Paleta de Colores
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Tokens centralizados en <code>theme.ts</code>. Usables en sx como{' '}
        <code>backgroundColor: 'background.paper'</code>.
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {COLOR_TOKENS.map(({ label, token, hex }) => (
          <Box key={label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 1,
                backgroundColor: token,
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 500 }}>
              {label}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
              {hex}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Demos disponibles</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {[
            {
              Icon: WidgetsIcon,
              title: 'UI Components',
              description: 'Botones, chips, badges, alerts y escala tipográfica completa con todas las variantes del design system.',
            },
            {
              Icon: EditNoteIcon,
              title: 'Forms & Validation',
              description: 'React Hook Form con validación inline, Controller para inputs controlados y estado de submit.',
            },
            {
              Icon: DataObjectIcon,
              title: 'Data Fetching',
              description: 'React Query con estados loading/error/success, paginación y cache con staleTime/gcTime.',
            },
            {
              Icon: StorageIcon,
              title: 'Layout Patterns',
              description: 'AppLayout, BaseLayout, SideDrawer y AppBar — diagramas, props y patrones de uso.',
            },
          ].map(({ Icon, title, description }) => (
            <Box
              key={title}
              sx={{
                p: 2.5,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.elevated',
                display: 'flex',
                gap: 2,
              }}
            >
              <Icon sx={{ color: 'primary.main', flexShrink: 0, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ── Tab panel ──────────────────────────────────────────────────────────────
function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

// ── Main export ────────────────────────────────────────────────────────────
export default function TheLab() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <BiotechIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Typography variant="h4" fontWeight="bold">
          The Lab
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<PaletteIcon fontSize="small" />} iconPosition="start" label="Overview" />
          <Tab icon={<WidgetsIcon fontSize="small" />} iconPosition="start" label="UI Components" />
          <Tab icon={<EditNoteIcon fontSize="small" />} iconPosition="start" label="Forms" />
          <Tab icon={<DataObjectIcon fontSize="small" />} iconPosition="start" label="Data Fetching" />
          <Tab icon={<StorageIcon fontSize="small" />} iconPosition="start" label="Layouts" />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={0}><OverviewTab /></TabPanel>
      <TabPanel value={tab} index={1}><UIComponentsDemo /></TabPanel>
      <TabPanel value={tab} index={2}><FormsDemo /></TabPanel>
      <TabPanel value={tab} index={3}><DataFetchingDemo /></TabPanel>
      <TabPanel value={tab} index={4}><LayoutPatternsDemo /></TabPanel>
    </Box>
  );
}
