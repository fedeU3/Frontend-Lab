import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  nombre: string;
  email: string;
  password: string;
  rol: 'viewer' | 'editor' | 'admin' | '';
  activo: boolean;
  terminos: boolean;
};

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

export default function FormsDemo() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      email: '',
      password: '',
      rol: '',
      activo: true,
      terminos: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1500));
    setSubmitting(false);
    setSubmitted(true);
    setSubmittedData(data);
  };

  const handleReset = () => {
    reset();
    setSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <Box>
      {/* ── FORMULARIO CON VALIDACIÓN ── */}
      <Section
        title="Formulario con validación"
        subtitle="React Hook Form + MUI. Validación en tiempo real con mensajes de error inline. Submit con estado de carga simulado."
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 4,
            alignItems: 'start',
          }}
        >
          {/* Form */}
          <Box>
            {submitted ? (
              <Card>
                <CardContent>
                  <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />
                    <Typography variant="h6" align="center">
                      ¡Formulario enviado!
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} align="center">
                      Los datos fueron procesados correctamente.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<RestartAltIcon />}
                      onClick={handleReset}
                    >
                      Nuevo envío
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
              >
                {/* Nombre */}
                <TextField
                  label="Nombre completo"
                  fullWidth
                  {...register('nombre', {
                    required: 'El nombre es requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                    maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                  })}
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />

                {/* Email */}
                <TextField
                  label="Email"
                  fullWidth
                  type="email"
                  {...register('email', {
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Email inválido',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                {/* Password */}
                <TextField
                  label="Contraseña"
                  fullWidth
                  type="password"
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                    validate: (v) =>
                      /\d/.test(v) || 'Debe contener al menos un número',
                  })}
                  error={!!errors.password}
                  helperText={
                    errors.password?.message ?? 'Mínimo 8 caracteres, debe incluir un número'
                  }
                />

                {/* Rol (Select con Controller) */}
                <Controller
                  name="rol"
                  control={control}
                  rules={{ required: 'El rol es requerido' }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.rol}>
                      <InputLabel>Rol</InputLabel>
                      <Select {...field} label="Rol">
                        <MenuItem value="viewer">Viewer — solo lectura</MenuItem>
                        <MenuItem value="editor">Editor — lectura y escritura</MenuItem>
                        <MenuItem value="admin">Admin — acceso completo</MenuItem>
                      </Select>
                      {errors.rol && (
                        <FormHelperText>{errors.rol.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                {/* Activo (Switch) */}
                <Controller
                  name="activo"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                          color="primary"
                        />
                      }
                      label="Usuario activo"
                    />
                  )}
                />

                {/* Términos (Checkbox requerido) */}
                <Controller
                  name="terminos"
                  control={control}
                  rules={{ required: 'Debés aceptar los términos para continuar' }}
                  render={({ field }) => (
                    <FormControl error={!!errors.terminos}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        }
                        label="Acepto los términos y condiciones"
                      />
                      {errors.terminos && (
                        <FormHelperText>{errors.terminos.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  sx={{ fontWeight: 'bold', mt: 1 }}
                  startIcon={
                    submitting ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : undefined
                  }
                >
                  {submitting ? 'Enviando…' : 'Enviar formulario'}
                </Button>
              </Box>
            )}
          </Box>

          {/* Live state panel */}
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Estado del formulario en vivo
            </Typography>
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 2,
                backgroundColor: 'background.elevated',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflow: 'auto',
                color: 'text.primary',
                minHeight: 200,
              }}
            >
              {JSON.stringify(
                submitted ? submittedData : watchedValues,
                null,
                2
              )}
            </Box>

            {/* Resumen de errores */}
            {Object.keys(errors).length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  Errores activos:
                </Typography>
                <Stack component="ul" spacing={0.5} sx={{ pl: 2, m: 0 }}>
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>
                      <Typography variant="body2">
                        <strong>{field}:</strong> {(error as { message?: string })?.message}
                      </Typography>
                    </li>
                  ))}
                </Stack>
              </Alert>
            )}
          </Box>
        </Box>
      </Section>

      {/* ── PATRONES DE VALIDACIÓN ── */}
      <Section
        title="Patrones de validación comunes"
        subtitle="Referencia rápida de reglas de validación con React Hook Form."
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          {[
            {
              label: 'Campo requerido',
              code: `register('campo', {\n  required: 'Este campo es requerido'\n})`,
            },
            {
              label: 'Min / Max longitud',
              code: `register('nombre', {\n  minLength: { value: 2, message: 'Mínimo 2' },\n  maxLength: { value: 50, message: 'Máximo 50' }\n})`,
            },
            {
              label: 'Patrón / Regex',
              code: `register('email', {\n  pattern: {\n    value: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,\n    message: 'Email inválido'\n  }\n})`,
            },
            {
              label: 'Validación custom',
              code: `register('password', {\n  validate: (v) =>\n    /\\d/.test(v) ||\n    'Debe contener un número'\n})`,
            },
            {
              label: 'Select con Controller',
              code: `<Controller\n  name="rol"\n  control={control}\n  rules={{ required: 'Requerido' }}\n  render={({ field }) => (\n    <Select {...field}>\n      <MenuItem value="a">A</MenuItem>\n    </Select>\n  )}\n/>`,
            },
            {
              label: 'Checkbox / Switch',
              code: `<Controller\n  name="activo"\n  control={control}\n  render={({ field }) => (\n    <Switch\n      checked={field.value}\n      onChange={field.onChange}\n    />\n  )}\n/>`,
            },
          ].map(({ label, code }) => (
            <Box key={label}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {label}
              </Typography>
              <Box
                component="pre"
                sx={{
                  mt: 0.5,
                  p: 1.5,
                  backgroundColor: 'background.elevated',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  overflow: 'auto',
                  color: 'primary.main',
                  m: 0,
                }}
              >
                {code}
              </Box>
            </Box>
          ))}
        </Box>
      </Section>
    </Box>
  );
}
