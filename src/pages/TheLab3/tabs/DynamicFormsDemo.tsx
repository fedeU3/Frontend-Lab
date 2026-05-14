import {
  Alert, Box, Button, Chip, Divider, IconButton,
  Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useState } from 'react';

type ContactField = { nombre: string; email: string; rol: string };
type FormData = { equipo: string; contactos: ContactField[] };

const ROL_COLORS: Record<string, 'primary' | 'warning' | 'success' | 'default'> = {
  Developer: 'primary',
  Designer:  'warning',
  Manager:   'success',
};

export default function DynamicFormsDemo() {
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  const { control, register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      equipo: '',
      contactos: [{ nombre: '', email: '', rol: '' }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'contactos' });

  const onSubmit = (data: FormData) => setSubmitted(data);

  return (
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        <code>useFieldArray</code> gestiona listas de campos dinámicas: agregar, eliminar y reordenar sin perder el estado del formulario.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        {/* Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Nombre del equipo"
              size="small"
              fullWidth
              {...register('equipo', { required: 'Requerido' })}
              error={!!errors.equipo}
              helperText={errors.equipo?.message}
            />

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle2">
                  Contactos <Chip label={fields.length} size="small" sx={{ ml: 0.5 }} />
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => append({ nombre: '', email: '', rol: '' })}
                  disabled={fields.length >= 8}
                >
                  Agregar
                </Button>
              </Box>

              <Stack spacing={2}>
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.elevated',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                        contactos[{index}]
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Subir">
                          <span>
                            <IconButton size="small" onClick={() => move(index, index - 1)} disabled={index === 0}>
                              <ArrowUpwardIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Bajar">
                          <span>
                            <IconButton size="small" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
                              <ArrowDownwardIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <span>
                            <IconButton size="small" color="error" onClick={() => remove(index)} disabled={fields.length === 1}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </Box>

                    <Stack spacing={1.5}>
                      <TextField
                        label="Nombre"
                        size="small"
                        fullWidth
                        {...register(`contactos.${index}.nombre`, { required: 'Requerido' })}
                        error={!!errors.contactos?.[index]?.nombre}
                        helperText={errors.contactos?.[index]?.nombre?.message}
                      />
                      <TextField
                        label="Email"
                        size="small"
                        fullWidth
                        {...register(`contactos.${index}.email`, {
                          required: 'Requerido',
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
                        })}
                        error={!!errors.contactos?.[index]?.email}
                        helperText={errors.contactos?.[index]?.email?.message}
                      />
                      <Controller
                        name={`contactos.${index}.rol`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Rol"
                            size="small"
                            fullWidth
                            placeholder="Developer / Designer / Manager"
                          />
                        )}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Button type="submit" variant="contained" fullWidth>
              Guardar equipo
            </Button>
          </Stack>
        </Box>

        {/* Preview / reference */}
        <Box>
          {submitted ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>Equipo "{submitted.equipo}" guardado</Alert>
              <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={1}>
                  {submitted.contactos.map((c, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Chip label={i + 1} size="small" sx={{ width: 28, height: 28, fontSize: '0.75rem' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">{c.nombre || '—'}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.email}</Typography>
                      </Box>
                      {c.rol && (
                        <Chip
                          label={c.rol}
                          size="small"
                          color={ROL_COLORS[c.rol] ?? 'default'}
                          variant="outlined"
                        />
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Button variant="text" sx={{ mt: 1, color: 'text.secondary' }} onClick={() => setSubmitted(null)}>
                Editar
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                API de useFieldArray
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1,
                  border: '1px solid', borderColor: 'divider', fontSize: '0.72rem',
                  fontFamily: 'monospace', color: 'text.secondary', overflow: 'auto', m: 0,
                }}
              >
                {`const { fields, append, remove, move } =
  useFieldArray({ control, name: 'contactos' });

// Agregar al final:
append({ nombre: '', email: '' });

// Eliminar por índice:
remove(2);

// Reordenar:
move(from, to);

// Acceder en register:
register(\`contactos.\${index}.nombre\`)`}
              </Box>

              <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mt: 3, mb: 1 }}>
                Puntos clave
              </Typography>
              <Stack spacing={1}>
                {[
                  'Usá field.id como key, no el índice — es estable entre renders.',
                  'append / remove / move son referencias estables (no causan re-renders extra).',
                  'La validación funciona igual que en campos normales de RHF.',
                  'Soporta arrays anidados con useFieldArray recursivo.',
                ].map((tip) => (
                  <Box key={tip} sx={{ display: 'flex', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', mt: 0.1 }}>▸</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{tip}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
