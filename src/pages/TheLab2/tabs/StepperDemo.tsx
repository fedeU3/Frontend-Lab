import {
  Alert, Box, Button, Checkbox, CircularProgress, Divider,
  FormControl, FormControlLabel, FormHelperText, InputLabel,
  MenuItem, Select, Step, StepLabel, Stepper, TextField,
  Typography, Stack, Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

// ── Types ──────────────────────────────────────────────────────────────────
type WizardData = {
  // Step 1 — Cuenta
  nombre: string;
  email: string;
  password: string;
  // Step 2 — Perfil
  empresa: string;
  rol: 'developer' | 'designer' | 'manager' | 'other' | '';
  experiencia: 'junior' | 'semi' | 'senior' | '';
  // Step 3 — Preferencias
  newsletter: boolean;
  terminos: boolean;
};

const STEPS = ['Cuenta', 'Perfil', 'Preferencias'];

// ── Step forms ─────────────────────────────────────────────────────────────
function Step1({ register, errors }: { register: any; errors: any }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Creá tu cuenta. Todos los campos son requeridos.
      </Typography>
      <TextField
        label="Nombre completo"
        fullWidth
        {...register('nombre', { required: 'Requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
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
        label="Contraseña"
        type="password"
        fullWidth
        {...register('password', {
          required: 'Requerida',
          minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          validate: (v: string) => /\d/.test(v) || 'Debe contener al menos un número',
        })}
        error={!!errors.password}
        helperText={errors.password?.message ?? 'Mínimo 8 caracteres, incluir un número'}
      />
    </Box>
  );
}

function Step2({ register, control, errors }: { register: any; control: any; errors: any }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Contanos un poco sobre vos y tu entorno de trabajo.
      </Typography>
      <TextField
        label="Empresa u organización"
        fullWidth
        {...register('empresa')}
      />
      <Controller
        name="rol"
        control={control}
        rules={{ required: 'Seleccioná un rol' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.rol}>
            <InputLabel>Rol actual</InputLabel>
            <Select {...field} label="Rol actual">
              <MenuItem value="developer">Developer</MenuItem>
              <MenuItem value="designer">Designer</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="other">Otro</MenuItem>
            </Select>
            {errors.rol && <FormHelperText>{errors.rol.message}</FormHelperText>}
          </FormControl>
        )}
      />
      <Controller
        name="experiencia"
        control={control}
        rules={{ required: 'Seleccioná un nivel' }}
        render={({ field }) => (
          <FormControl fullWidth error={!!errors.experiencia}>
            <InputLabel>Nivel de experiencia</InputLabel>
            <Select {...field} label="Nivel de experiencia">
              <MenuItem value="junior">Junior (0–2 años)</MenuItem>
              <MenuItem value="semi">Semi-senior (2–5 años)</MenuItem>
              <MenuItem value="senior">Senior (5+ años)</MenuItem>
            </Select>
            {errors.experiencia && <FormHelperText>{errors.experiencia.message}</FormHelperText>}
          </FormControl>
        )}
      />
    </Box>
  );
}

function Step3({ control, errors }: { control: any; errors: any }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Últimos detalles antes de finalizar.
      </Typography>
      <Controller
        name="newsletter"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox checked={field.value} onChange={field.onChange} />}
            label="Recibir novedades y actualizaciones por email"
          />
        )}
      />
      <Controller
        name="terminos"
        control={control}
        rules={{ required: 'Debés aceptar los términos' }}
        render={({ field }) => (
          <FormControl error={!!errors.terminos}>
            <FormControlLabel
              control={<Checkbox checked={field.value} onChange={field.onChange} />}
              label="Acepto los términos y condiciones de uso"
            />
            {errors.terminos && <FormHelperText>{errors.terminos.message}</FormHelperText>}
          </FormControl>
        )}
      />
    </Box>
  );
}

// ── Step-fields to validate per step ──────────────────────────────────────
const STEP_FIELDS: (keyof WizardData)[][] = [
  ['nombre', 'email', 'password'],
  ['rol', 'experiencia'],
  ['terminos'],
];

// ── Main component ─────────────────────────────────────────────────────────
export default function StepperDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [finalData, setFinalData] = useState<WizardData | null>(null);

  const {
    register, control, trigger, handleSubmit, getValues,
    formState: { errors },
  } = useForm<WizardData>({
    defaultValues: {
      nombre: '', email: '', password: '',
      empresa: '', rol: '', experiencia: '',
      newsletter: false, terminos: false,
    },
    mode: 'onTouched',
  });

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[activeStep] as any);
    if (valid) setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const onSubmit = async (data: WizardData) => {
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 1800));
    setSubmitting(false);
    setFinalData(data);
    setDone(true);
  };

  const handleReset = () => {
    setDone(false);
    setActiveStep(0);
    setFinalData(null);
  };

  if (done && finalData) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Stepper — Formulario multi-paso</Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ maxWidth: 540, mx: 'auto', textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>¡Registro completado!</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Los datos fueron procesados correctamente.
          </Typography>
          <Box sx={{ textAlign: 'left', backgroundColor: 'background.elevated', borderRadius: 1, p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Stack spacing={1}>
              {(Object.entries(finalData) as [string, string | boolean][]).map(([k, v]) => (
                <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{k}</Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', textAlign: 'right' }}>
                    {String(v) || '—'}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          <Button variant="outlined" onClick={handleReset}>Nuevo registro</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>Stepper — Formulario multi-paso</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Validación por step con React Hook Form's <code>trigger()</code>. No avanza si el step actual tiene errores.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ maxWidth: 540, mx: 'auto' }}>
        {/* Stepper header */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {STEPS.map((label, i) => (
            <Step key={label} completed={i < activeStep}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step content */}
        <Box sx={{ mb: 4 }}>
          {activeStep === 0 && <Step1 register={register} errors={errors} />}
          {activeStep === 1 && <Step2 register={register} control={control} errors={errors} />}
          {activeStep === 2 && <Step3 control={control} errors={errors} />}
        </Box>

        {/* Navigation */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            variant="text"
            sx={{ color: 'text.primary' }}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Atrás
          </Button>

          <Stack direction="row" spacing={1} alignItems="center">
            {STEPS.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: i === activeStep ? 24 : 8,
                  height: 8,
                  borderRadius: 1,
                  backgroundColor: i <= activeStep ? 'primary.main' : 'divider',
                  transition: 'all 0.25s ease',
                }}
              />
            ))}
          </Stack>

          {activeStep < STEPS.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Siguiente
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {submitting ? 'Enviando…' : 'Finalizar'}
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
