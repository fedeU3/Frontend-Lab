import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider, Drawer, IconButton,
  Stack, TextField, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── 1. Alert / Confirm dialog ──────────────────────────────────────────────
function ConfirmDialogDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<'confirmado' | 'cancelado' | null>(null);

  const handleConfirm = () => { setResult('confirmado'); setOpen(false); };
  const handleCancel  = () => { setResult('cancelado');  setOpen(false); };

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" color="secondary" startIcon={<DeleteForeverIcon />} onClick={() => setOpen(true)}>
          Eliminar registro
        </Button>
      </Stack>

      {result && (
        <Alert
          severity={result === 'confirmado' ? 'error' : 'info'}
          onClose={() => setResult(null)}
        >
          Acción <strong>{result}</strong> por el usuario.
        </Alert>
      )}

      <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteForeverIcon color="error" />
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción es <strong>irreversible</strong>. El registro será eliminado
            permanentemente del sistema.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="text" sx={{ color: 'text.primary' }} onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="contained" color="secondary" onClick={handleConfirm}>
            Sí, eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ── 2. Form inside dialog ──────────────────────────────────────────────────
type EditForm = { nombre: string; email: string; rol: string };

function FormDialogDemo() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<EditForm | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditForm>({
    defaultValues: { nombre: 'Ana García', email: 'ana@ejemplo.com', rol: 'admin' },
  });

  const onSubmit = (data: EditForm) => {
    setSaved(data);
    setOpen(false);
    reset(data);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setOpen(true)}>
          Editar usuario
        </Button>
        {saved && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Guardado: <strong>{saved.nombre}</strong> — {saved.email}
          </Typography>
        )}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Editar usuario
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            id="edit-user-form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}
          >
            <TextField
              label="Nombre completo"
              fullWidth
              {...register('nombre', { required: 'Requerido' })}
              error={!!errors.nombre}
              helperText={errors.nombre?.message}
            />
            <TextField
              label="Email"
              fullWidth
              {...register('email', {
                required: 'Requerido',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Rol"
              fullWidth
              {...register('rol', { required: 'Requerido' })}
              error={!!errors.rol}
              helperText={errors.rol?.message}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="text" sx={{ color: 'text.primary' }} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="contained" type="submit" form="edit-user-form">
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ── 3. Info dialog (no actions / scrollable) ───────────────────────────────
function InfoDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="outlined" startIcon={<InfoOutlinedIcon />} onClick={() => setOpen(true)}>
        Ver detalles
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle>
          Detalle del registro
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {Array.from({ length: 6 }, (_, i) => (
              <Box key={i}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Campo {i + 1}
                </Typography>
                <Typography>
                  Valor de ejemplo para el campo {i + 1}. Este contenido puede crecer
                  arbitrariamente — el Dialog scrollea internamente.
                </Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="contained" onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ── 4. Temporary Drawer (right) ────────────────────────────────────────────
function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Abrir panel lateral
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 }, backgroundColor: 'background.paper' },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">Panel de detalle</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Información general
              </Typography>
              {[['Nombre', 'Ana García'], ['Email', 'ana@ejemplo.com'], ['Rol', 'Admin'], ['Estado', 'Activo']].map(
                ([label, value]) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
                    <Typography variant="body2">{value}</Typography>
                  </Box>
                )
              )}
            </Box>

            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                Actividad reciente
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {['Creó pedido #142', 'Editó usuario #7', 'Generó reporte mensual'].map((action, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'primary.main', mt: 0.8, flexShrink: 0 }} />
                    <Box>
                      <Typography variant="body2">{action}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        hace {(i + 1) * 2} horas
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="contained" fullWidth onClick={() => setOpen(false)}>
              Confirmar
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function DialogsDrawersDemo() {
  return (
    <Box>
      <Section
        title="Confirm Dialog"
        subtitle="Para acciones destructivas. Bloquea la UI hasta recibir una decisión explícita del usuario."
      >
        <ConfirmDialogDemo />
      </Section>

      <Section
        title="Form en Dialog"
        subtitle="Formulario con validación React Hook Form dentro de un Dialog. El submit está vinculado por id de formulario."
      >
        <FormDialogDemo />
      </Section>

      <Section
        title="Info Dialog scrolleable"
        subtitle="scroll='paper' hace que el cuerpo del Dialog scrollee independientemente del header y footer."
      >
        <InfoDialogDemo />
      </Section>

      <Section
        title="Drawer temporal (derecha)"
        subtitle="Drawer de tipo 'temporary' — cierra al hacer click fuera. Útil para paneles de detalle, filtros avanzados o edición rápida."
      >
        <DrawerDemo />
      </Section>
    </Box>
  );
}
