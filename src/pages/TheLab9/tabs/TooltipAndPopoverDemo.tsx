import { Box, Button, Chip, Divider, Fab, Paper, Popover, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Tooltip, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const PLACEMENTS = ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end'] as const;

export default function TooltipAndPopoverDemo() {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [controlled, setControlled] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <Box>
      <Section title="MUI Tooltip — variantes" subtitle="delay, arrow, placement, controlled. El Tooltip acepta cualquier elemento hijo como trigger.">
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
          <Tooltip title="Tooltip básico">
            <Button variant="outlined" size="small">Hover</Button>
          </Tooltip>
          <Tooltip title="Con flecha" arrow>
            <Button variant="outlined" size="small">Arrow</Button>
          </Tooltip>
          <Tooltip title="Delay 800ms" enterDelay={800} arrow>
            <Button variant="outlined" size="small">Delay 800ms</Button>
          </Tooltip>
          <Tooltip title={<Box>Tooltip <strong>rico</strong> con JSX</Box>} arrow>
            <Button variant="outlined" size="small">JSX content</Button>
          </Tooltip>
          <Tooltip title={controlled ? 'Estoy abierto' : ''} open={controlled} arrow disableFocusListener disableHoverListener disableTouchListener>
            <Button variant={controlled ? 'contained' : 'outlined'} size="small" onClick={() => setControlled((c) => !c)}>
              Controlled ({controlled ? 'open' : 'closed'})
            </Button>
          </Tooltip>
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>Placements</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {PLACEMENTS.map((p) => (
            <Tooltip key={p} title={p} placement={p} arrow>
              <Chip label={p} size="small" clickable sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }} />
            </Tooltip>
          ))}
        </Box>
      </Section>

      <Section title="Popover con contenido rico" subtitle="Anclado a un elemento. Puede contener cualquier componente MUI. Se cierra al hacer click fuera.">
        <Button
          variant="outlined"
          startIcon={<InfoIcon />}
          onClick={(e) => setPopoverAnchor(e.currentTarget)}
        >
          Abrir Popover
        </Button>
        <Popover
          open={Boolean(popoverAnchor)}
          anchorEl={popoverAnchor}
          onClose={() => setPopoverAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Box sx={{ p: 2.5, maxWidth: 300, backgroundColor: 'background.paper' }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Información del elemento</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              El Popover puede contener cualquier contenido: formularios, imágenes, listas, acciones.
            </Typography>
            <Stack spacing={1}>
              {[
                { label: 'Versión', value: '3.2.1' },
                { label: 'Autor', value: 'Frontend Lab' },
                { label: 'Estado', value: 'Activo' },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
                  <Typography variant="caption" fontWeight="bold">{value}</Typography>
                </Box>
              ))}
            </Stack>
            <Button size="small" variant="text" onClick={() => setPopoverAnchor(null)} sx={{ mt: 1.5 }}>
              Cerrar
            </Button>
          </Box>
        </Popover>
      </Section>

      <Section title="SpeedDial — Floating Action Button expandible" subtitle="Muestra acciones secundarias al hacer hover o click en el FAB principal. Accesible con teclado.">
        <Box sx={{ position: 'relative', height: 200, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {lastAction && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Última acción: <strong style={{ color: '#FF7043' }}>{lastAction}</strong>
            </Typography>
          )}
          {!lastAction && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Hover sobre el botón ↘</Typography>
          )}
          <SpeedDial
            ariaLabel="Acciones"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
            open={speedDialOpen}
            onOpen={() => setSpeedDialOpen(true)}
            onClose={() => setSpeedDialOpen(false)}
          >
            {[
              { icon: <SaveIcon />, name: 'Guardar' },
              { icon: <PrintIcon />, name: 'Imprimir' },
              { icon: <ShareIcon />, name: 'Compartir' },
              { icon: <EditIcon />, name: 'Editar' },
            ].map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => { setLastAction(action.name); setSpeedDialOpen(false); }}
              />
            ))}
          </SpeedDial>
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`<SpeedDial ariaLabel="Acciones" icon={<SpeedDialIcon />}>
  <SpeedDialAction
    icon={<SaveIcon />}
    tooltipTitle="Guardar"
    onClick={handleSave}
  />
</SpeedDial>

// Tooltip API clave:
<Tooltip
  title="Contenido"
  placement="top"         // 12 opciones de posición
  arrow                   // flecha hacia el trigger
  enterDelay={500}        // delay de apertura (ms)
  leaveDelay={200}        // delay de cierre (ms)
  open={controlled}       // modo controlado
  disableHoverListener    // para modo controlado
>`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
