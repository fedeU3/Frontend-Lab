import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── 1. Controlled pickers ──────────────────────────────────────────────────
function ControlledPickersDemo() {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [time, setTime] = useState<Dayjs | null>(dayjs());
  const [datetime, setDatetime] = useState<Dayjs | null>(dayjs());

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>DatePicker</Typography>
        <DatePicker
          label="Fecha"
          value={date}
          onChange={setDate}
          slotProps={{ textField: { fullWidth: true, size: 'small' } }}
        />
        {date && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            {date.format('dddd D [de] MMMM [de] YYYY')}
          </Typography>
        )}
      </Box>
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>TimePicker</Typography>
        <TimePicker
          label="Hora"
          value={time}
          onChange={setTime}
          slotProps={{ textField: { fullWidth: true, size: 'small' } }}
        />
        {time && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            {time.format('HH:mm [hs]')}
          </Typography>
        )}
      </Box>
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>DateTimePicker</Typography>
        <DateTimePicker
          label="Fecha y hora"
          value={datetime}
          onChange={setDatetime}
          slotProps={{ textField: { fullWidth: true, size: 'small' } }}
        />
        {datetime && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
            {datetime.format('DD/MM/YYYY HH:mm')}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// ── 2. React Hook Form integration ─────────────────────────────────────────
type ReservaForm = { fecha: Dayjs | null; horaInicio: Dayjs | null; horaFin: Dayjs | null };

function HookFormPickersDemo() {
  const { control, handleSubmit, formState: { errors } } = useForm<ReservaForm>({
    defaultValues: { fecha: null, horaInicio: null, horaFin: null },
  });
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const onSubmit = (data: ReservaForm) => {
    setResult({
      fecha: data.fecha?.format('YYYY-MM-DD') ?? '—',
      horaInicio: data.horaInicio?.format('HH:mm') ?? '—',
      horaFin: data.horaFin?.format('HH:mm') ?? '—',
    });
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          <Controller
            name="fecha"
            control={control}
            rules={{ required: 'La fecha es requerida' }}
            render={({ field }) => (
              <DatePicker
                label="Fecha del evento *"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.fecha,
                    helperText: errors.fecha?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="horaInicio"
            control={control}
            rules={{ required: 'La hora de inicio es requerida' }}
            render={({ field }) => (
              <TimePicker
                label="Hora de inicio *"
                value={field.value}
                onChange={field.onChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.horaInicio,
                    helperText: errors.horaInicio?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="horaFin"
            control={control}
            render={({ field }) => (
              <TimePicker
                label="Hora de fin (opcional)"
                value={field.value}
                onChange={field.onChange}
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            )}
          />
          <Button type="submit" variant="contained">Confirmar reserva</Button>
        </Stack>
      </Box>

      <Box>
        {result ? (
          <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'primary.main' }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Reserva confirmada</Typography>
            {Object.entries(result).map(([k, v]) => (
              <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{k}</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{v}</Typography>
              </Box>
            ))}
            <Button variant="text" sx={{ mt: 1, color: 'text.secondary', p: 0 }} onClick={() => setResult(null)}>
              Editar
            </Button>
          </Box>
        ) : (
          <Box
            component="pre"
            sx={{
              p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1,
              border: '1px solid', borderColor: 'divider', fontSize: '0.72rem',
              fontFamily: 'monospace', color: 'text.secondary', overflow: 'auto', m: 0,
            }}
          >
            {`<Controller
  name="fecha"
  control={control}
  rules={{ required: '...' }}
  render={({ field }) => (
    <DatePicker
      value={field.value}
      onChange={field.onChange}
      slotProps={{
        textField: {
          error: !!errors.fecha,
          helperText: errors.fecha?.message,
        }
      }}
    />
  )}
/>`}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── 3. dayjs format reference ──────────────────────────────────────────────
const FORMAT_EXAMPLES = [
  { token: 'YYYY-MM-DD', desc: 'ISO date' },
  { token: 'DD/MM/YYYY', desc: 'Argentina' },
  { token: 'HH:mm', desc: '24h' },
  { token: 'hh:mm A', desc: '12h AM/PM' },
  { token: 'DD MMM YYYY', desc: 'Abreviado' },
  { token: 'x', desc: 'Unix ms' },
];

function FormatReference() {
  const now = dayjs();
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: 1.5 }}>
      {FORMAT_EXAMPLES.map(({ token, desc }) => (
        <Box key={token} sx={{ p: 1.5, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', display: 'block' }}>{token}</Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', my: 0.5 }}>{now.format(token)}</Typography>
          <Chip label={desc} size="small" sx={{ height: 16, fontSize: '0.6rem' }} />
        </Box>
      ))}
    </Box>
  );
}

export default function DatePickersDemo() {
  return (
    <Box>
      <Section
        title="Pickers controlados"
        subtitle="DatePicker, TimePicker y DateTimePicker con useState(dayjs()). El valor es un objeto Dayjs — usá .format() para serializar."
      >
        <ControlledPickersDemo />
      </Section>
      <Section
        title="Integración con React Hook Form"
        subtitle="Usá Controller para conectar los pickers a RHF. El error y helperText se pasan vía slotProps.textField."
      >
        <HookFormPickersDemo />
      </Section>
      <Section
        title="dayjs format tokens"
        subtitle="Los tokens más comunes para formatear fechas. dayjs().format(token) → string."
      >
        <FormatReference />
      </Section>
    </Box>
  );
}
