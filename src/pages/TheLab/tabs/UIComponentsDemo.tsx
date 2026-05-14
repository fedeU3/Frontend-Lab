import {
  Alert, Avatar, Badge, Box, Button, Chip, CircularProgress,
  Divider, Stack, Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {subtitle}
      </Typography>
    )}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
      {label}
    </Typography>
    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
      {children}
    </Stack>
  </Box>
);

export default function UIComponentsDemo() {
  const [loading, setLoading] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Box>
      {/* ── BUTTONS ── */}
      <Section
        title="Buttons"
        subtitle="Tres variantes principales: contained (acción primaria), outlined (acción secundaria), text (navegación/links)."
      >
        <Row label="Variants">
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text" sx={{ color: 'text.primary' }}>
            Text
          </Button>
        </Row>

        <Row label="Colors">
          <Button variant="contained" color="primary">
            Primary
          </Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Button variant="outlined" color="primary">
            Primary
          </Button>
          <Button variant="outlined" color="secondary">
            Secondary
          </Button>
        </Row>

        <Row label="Sizes">
          <Button variant="contained" size="small">
            Small
          </Button>
          <Button variant="contained" size="medium">
            Medium
          </Button>
          <Button variant="contained" size="large">
            Large
          </Button>
        </Row>

        <Row label="Con iconos">
          <Button variant="contained" startIcon={<SendIcon />}>
            Enviar
          </Button>
          <Button variant="outlined" startIcon={<FavoriteIcon />}>
            Favorito
          </Button>
          <Button variant="contained" endIcon={<DeleteIcon />} color="secondary">
            Eliminar
          </Button>
        </Row>

        <Row label="Estados">
          <Button variant="contained" disabled>
            Disabled
          </Button>
          <Button
            variant="contained"
            disabled={loading}
            onClick={handleLoadingDemo}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {loading ? 'Cargando…' : 'Simular carga (2s)'}
          </Button>
        </Row>
      </Section>

      {/* ── CHIPS ── */}
      <Section
        title="Chips"
        subtitle="Para etiquetas, filtros, estados y selección múltiple."
      >
        <Row label="Variants">
          <Chip label="Filled" />
          <Chip label="Outlined" variant="outlined" />
          <Chip label="Con color" color="primary" />
          <Chip label="Secondary" color="secondary" />
        </Row>

        <Row label="Con acción">
          <Chip label="Eliminar" onDelete={() => {}} />
          <Chip label="Clickable" onClick={() => {}} color="primary" />
          <Chip label="Delete + click" color="primary" onClick={() => {}} onDelete={() => {}} />
        </Row>

        <Row label="Con icono / avatar">
          <Chip icon={<StarIcon />} label="Destacado" color="primary" />
          <Chip icon={<CheckCircleIcon />} label="Verificado" variant="outlined" />
          <Chip
            avatar={<Avatar>F</Avatar>}
            label="Federico"
            variant="outlined"
          />
        </Row>

        <Row label="Estados">
          <Chip label="Activo" color="primary" />
          <Chip label="Inactivo" sx={{ opacity: 0.5 }} />
          <Chip label="Pendiente" color="secondary" variant="outlined" />
          <Chip label="Error" color="error" />
          <Chip label="Éxito" color="success" />
          <Chip label="Warning" color="warning" />
        </Row>
      </Section>

      {/* ── BADGES ── */}
      <Section
        title="Badges"
        subtitle="Para notificaciones, contadores y estados visuales sobre otros elementos."
      >
        <Row label="Con contador">
          <Badge badgeContent={4} color="primary">
            <MailIcon fontSize="large" />
          </Badge>
          <Badge badgeContent={99} color="secondary">
            <NotificationsIcon fontSize="large" />
          </Badge>
          <Badge badgeContent={999} max={99} color="primary">
            <MailIcon fontSize="large" />
          </Badge>
        </Row>

        <Row label="Dot (sin número)">
          <Badge variant="dot" color="primary">
            <MailIcon fontSize="large" />
          </Badge>
          <Badge variant="dot" color="error">
            <NotificationsIcon fontSize="large" />
          </Badge>
          <Badge variant="dot" color="success">
            <CheckCircleIcon fontSize="large" />
          </Badge>
        </Row>

        <Row label="Posición">
          <Badge badgeContent={1} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MailIcon fontSize="large" />
          </Badge>
          <Badge badgeContent={2} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
            <MailIcon fontSize="large" />
          </Badge>
          <Badge badgeContent={3} color="primary" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <MailIcon fontSize="large" />
          </Badge>
          <Badge badgeContent={4} color="primary" anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
            <MailIcon fontSize="large" />
          </Badge>
        </Row>
      </Section>

      {/* ── ALERTS ── */}
      <Section
        title="Alerts"
        subtitle="Para feedback del sistema: éxito, error, advertencia e información."
      >
        <Stack spacing={2}>
          <Alert severity="success">Operación exitosa — los datos fueron guardados.</Alert>
          <Alert severity="error">Error al procesar la solicitud — intente nuevamente.</Alert>
          <Alert severity="warning">Atención — esta acción no se puede deshacer.</Alert>
          <Alert severity="info">Información — el sistema estará en mantenimiento mañana.</Alert>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Con título y acciones
          </Typography>
          <Stack spacing={2}>
            <Alert
              severity="success"
              onClose={() => {}}
            >
              ¡Formulario enviado correctamente!
            </Alert>
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small">
                  Reintentar
                </Button>
              }
            >
              No se pudo conectar con el servidor.
            </Alert>
          </Stack>
        </Box>
      </Section>

      {/* ── TYPOGRAPHY ── */}
      <Section
        title="Typography"
        subtitle="Escala tipográfica del design system. Todos los variants de MUI Typography."
      >
        <Stack spacing={1.5}>
          {(
            [
              ['h1', 'Heading 1 — h1'],
              ['h2', 'Heading 2 — h2'],
              ['h3', 'Heading 3 — h3'],
              ['h4', 'Heading 4 — h4'],
              ['h5', 'Heading 5 — h5'],
              ['h6', 'Heading 6 — h6'],
              ['subtitle1', 'Subtitle 1 — subtitle1'],
              ['subtitle2', 'Subtitle 2 — subtitle2'],
              ['body1', 'Body 1 — body1 (texto principal de párrafo)'],
              ['body2', 'Body 2 — body2 (texto secundario, más pequeño)'],
              ['caption', 'Caption — caption (etiquetas, metadata)'],
              ['overline', 'Overline — overline (sección labels)'],
            ] as const
          ).map(([variant, text]) => (
            <Box key={variant} sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <Chip
                label={variant}
                size="small"
                variant="outlined"
                sx={{ fontFamily: 'monospace', minWidth: 90, fontSize: '0.7rem' }}
              />
              <Typography variant={variant}>{text}</Typography>
            </Box>
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
