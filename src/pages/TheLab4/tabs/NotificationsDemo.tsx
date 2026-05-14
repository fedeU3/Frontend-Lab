import {
  Box, Button, Divider, FormControlLabel, Stack,
  Switch, TextField, Typography,
} from '@mui/material';
import { useSnackbar, SnackbarProvider } from 'notistack';
import { useState } from 'react';

const VARIANTS = ['default', 'success', 'error', 'warning', 'info'] as const;
type Variant = typeof VARIANTS[number];

const POSITIONS = [
  { label: 'Top Left',      vertical: 'top',    horizontal: 'left'   },
  { label: 'Top Center',    vertical: 'top',    horizontal: 'center' },
  { label: 'Top Right',     vertical: 'top',    horizontal: 'right'  },
  { label: 'Bottom Left',   vertical: 'bottom', horizontal: 'left'   },
  { label: 'Bottom Center', vertical: 'bottom', horizontal: 'center' },
  { label: 'Bottom Right',  vertical: 'bottom', horizontal: 'right'  },
] as const;

const VARIANT_COLORS: Record<Variant, string> = {
  default: '#78909C',
  success: '#66BB6A',
  error:   '#EF5350',
  warning: '#FFA726',
  info:    '#42A5F5',
};

function NotificationsContent() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [message, setMessage]     = useState('¡Operación completada!');
  const [autoHide, setAutoHide]   = useState(true);
  const [persist, setPersist]     = useState(false);
  const [position, setPosition]   = useState<typeof POSITIONS[number]>(POSITIONS[2]);

  const fire = (variant: Variant) => {
    enqueueSnackbar(message || 'Notificación de prueba', {
      variant,
      anchorOrigin: { vertical: position.vertical, horizontal: position.horizontal },
      autoHideDuration: persist ? null : autoHide ? 3000 : null,
      action: persist
        ? (key) => (
          <Button size="small" sx={{ color: '#fff', fontSize: '0.7rem' }}
            onClick={() => closeSnackbar(key)}>
            Cerrar
          </Button>
        )
        : undefined,
    });
  };

  return (
    <Box>
      {/* Variant buttons */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Variantes</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          notistack extiende el sistema de snackbars de MUI con variantes tipadas y una API simple.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {VARIANTS.map((v) => (
            <Button key={v} variant="contained" onClick={() => fire(v)}
              sx={{ backgroundColor: VARIANT_COLORS[v], color: '#080808',
                '&:hover': { backgroundColor: VARIANT_COLORS[v], filter: 'brightness(0.85)' } }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Button>
          ))}
        </Stack>
      </Box>

      {/* Config */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Configuración</Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Message */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Mensaje</Typography>
            <TextField
              fullWidth size="small" label="Texto de la notificación"
              value={message} onChange={(e) => setMessage(e.target.value)} />
          </Box>

          {/* Options */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Opciones</Typography>
            <Stack spacing={0.5}>
              <FormControlLabel control={<Switch size="small" checked={autoHide} onChange={(e) => setAutoHide(e.target.checked)} />}
                label={<Typography variant="caption">Auto-hide (3s)</Typography>} />
              <FormControlLabel control={<Switch size="small" checked={persist} onChange={(e) => setPersist(e.target.checked)} />}
                label={<Typography variant="caption">Persistente (botón cerrar)</Typography>} />
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Position */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Posición</Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, maxWidth: 480 }}>
          {POSITIONS.map((p) => (
            <Button key={p.label} size="small"
              variant={position.label === p.label ? 'contained' : 'outlined'}
              onClick={() => setPosition(p)}
              sx={{ fontSize: '0.7rem', py: 0.5 }}>
              {p.label}
            </Button>
          ))}
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" onClick={() => fire('info')}>
            Probar posición
          </Button>
        </Box>
      </Box>

      {/* API reference */}
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>API rápida</Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={1.5}>
          {[
            { label: 'enqueueSnackbar(msg, opts)', desc: 'Muestra una notificación. Retorna una key para cerrarla programáticamente.' },
            { label: 'closeSnackbar(key?)',        desc: 'Cierra una notificación por key. Sin key, cierra todas.' },
            { label: 'variant',                    desc: "'default' | 'success' | 'error' | 'warning' | 'info'" },
            { label: 'autoHideDuration',           desc: 'Ms antes de cerrar automáticamente. null = no cierra.' },
            { label: 'anchorOrigin',               desc: '{ vertical: top|bottom, horizontal: left|center|right }' },
            { label: 'action',                     desc: 'ReactNode o función (key) => ReactNode — para botones de acción.' },
            { label: 'maxSnack',                   desc: 'Prop en <SnackbarProvider> — máximo de notificaciones simultáneas.' },
          ].map(({ label, desc }) => (
            <Box key={label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main',
                backgroundColor: 'background.elevated', px: 1, py: 0.25, borderRadius: 0.5,
                flexShrink: 0, whiteSpace: 'nowrap' }}>
                {label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>{desc}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default function NotificationsDemo() {
  return (
    <SnackbarProvider maxSnack={4}>
      <NotificationsContent />
    </SnackbarProvider>
  );
}
