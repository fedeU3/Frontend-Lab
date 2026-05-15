import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface Step {
  title: string;
  description: string;
  targetId: string;
  placement: 'bottom' | 'right' | 'top';
}

const STEPS: Step[] = [
  { title: '1 · Panel de métricas', description: 'Este panel muestra el estado actual del sistema en tiempo real. Los colores indican el nivel de salud.', targetId: 'tour-metrics', placement: 'bottom' },
  { title: '2 · Barra de acciones', description: 'Desde aquí podés filtrar datos, exportar reportes y configurar alertas para los indicadores clave.', targetId: 'tour-actions', placement: 'bottom' },
  { title: '3 · Tabla de eventos', description: 'Log en tiempo real de todos los eventos del sistema. Hacé click en cualquier fila para ver los detalles.', targetId: 'tour-table', placement: 'top' },
];

function TourCard({ step, total, onNext, onPrev, onSkip }: { step: Step; total: number; index: number; onNext: () => void; onPrev: () => void; onSkip: () => void }) {
  return (
    <Paper elevation={8} sx={{
      position: 'absolute', zIndex: 10002,
      left: 0, bottom: 'calc(100% + 12px)',
      width: 280, p: 2,
      backgroundColor: 'background.paper',
      border: '1px solid', borderColor: 'primary.main',
      borderRadius: 2,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'primary.main' }}>{step.title}</Typography>
        <Button size="small" onClick={onSkip} sx={{ minWidth: 0, p: 0.5, color: 'text.secondary' }}><CloseIcon fontSize="small" /></Button>
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{step.description}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Paso {STEPS.indexOf(step) + 1} de {total}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" onClick={onPrev} disabled={STEPS.indexOf(step) === 0}>Anterior</Button>
          <Button size="small" variant="contained" onClick={onNext}>
            {STEPS.indexOf(step) === total - 1 ? 'Finalizar' : 'Siguiente'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

function DemoUI({ activeId, step, total, onNext, onPrev, onSkip }: {
  activeId: string | null;
  step: Step | null;
  total: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) {
  const highlight = (id: string) => ({
    position: 'relative' as const,
    zIndex: activeId === id ? 10001 : 1,
    outline: activeId === id ? '2px solid #FF7043' : 'none',
    outlineOffset: 4,
    borderRadius: 1,
    transition: 'outline 0.2s',
  });

  return (
    <Box sx={{ position: 'relative' }}>
      {activeId && (
        <Box sx={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000, pointerEvents: 'none' }} />
      )}

      <Box id="tour-metrics" sx={{ ...highlight('tour-metrics'), mb: 2, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {[{ label: 'CPU', value: '42%', color: '#FF7043' }, { label: 'Memoria', value: '68%', color: '#42A5F5' }, { label: 'Disco', value: '23%', color: '#66BB6A' }].map(({ label, value, color }) => (
          <Box key={label} sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color }}>{value}</Typography>
          </Box>
        ))}
        {activeId === 'tour-metrics' && step && (
          <TourCard step={step} total={total} index={0} onNext={onNext} onPrev={onPrev} onSkip={onSkip} />
        )}
      </Box>

      <Box id="tour-actions" sx={{ ...highlight('tour-actions'), mb: 2, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated', display: 'flex', gap: 1 }}>
        <Chip label="Exportar" size="small" clickable />
        <Chip label="Filtrar" size="small" clickable />
        <Chip label="Alertas" size="small" clickable />
        <Chip label="Configurar" size="small" clickable />
        {activeId === 'tour-actions' && step && (
          <TourCard step={step} total={total} index={1} onNext={onNext} onPrev={onPrev} onSkip={onSkip} />
        )}
      </Box>

      <Box id="tour-table" sx={{ ...highlight('tour-table'), borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated', overflow: 'hidden' }}>
        {['Error en módulo auth', 'Backup completado', 'Deploy exitoso', 'Nuevo usuario registrado'].map((evt, i) => (
          <Box key={i} sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 2, '&:last-child': { border: 0 } }}>
            <Chip label={i === 0 ? 'error' : 'info'} size="small" color={i === 0 ? 'error' : 'default'} sx={{ fontSize: '0.65rem', height: 20 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{evt}</Typography>
          </Box>
        ))}
        {activeId === 'tour-table' && step && (
          <TourCard step={step} total={total} index={2} onNext={onNext} onPrev={onPrev} onSkip={onSkip} />
        )}
      </Box>
    </Box>
  );
}

export default function OnboardingDemo() {
  const [stepIndex, setStepIndex] = useState<number | null>(null);

  const currentStep = stepIndex !== null ? STEPS[stepIndex] : null;
  const activeId = currentStep?.targetId ?? null;

  const start = () => setStepIndex(0);
  const next = () => {
    if (stepIndex === null) return;
    if (stepIndex >= STEPS.length - 1) { setStepIndex(null); return; }
    setStepIndex(stepIndex + 1);
  };
  const prev = () => {
    if (stepIndex === null || stepIndex === 0) return;
    setStepIndex(stepIndex - 1);
  };
  const skip = () => setStepIndex(null);

  return (
    <Box>
      <Section
        title="Tour paso a paso sin librería"
        subtitle="Backdrop + highlight via z-index + outline. Tooltip posicionado relativamente al elemento. Estado en useState — sin dependencias."
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <Button variant="contained" onClick={start} disabled={stepIndex !== null}>
            Iniciar tour
          </Button>
          {stepIndex !== null && (
            <>
              <Chip label={`Paso ${stepIndex + 1} / ${STEPS.length}`} color="primary" size="small" />
              <Button variant="text" onClick={skip} size="small" sx={{ color: 'text.secondary' }}>Saltar tour</Button>
            </>
          )}
          {stepIndex === null && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>El tour resalta cada elemento con outline y muestra un tooltip posicionado.</Typography>
          )}
        </Box>

        <DemoUI activeId={activeId} step={currentStep} total={STEPS.length} onNext={next} onPrev={prev} onSkip={skip} />
      </Section>

      <Section title="Patrón de implementación">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const STEPS = [
  { targetId: 'metrics-panel', title: '...', description: '...' },
  { targetId: 'action-bar',   title: '...', description: '...' },
];

// Técnica:
// 1. Backdrop con position:fixed inset:0 rgba(0,0,0,0.6) z-index:10000
// 2. El elemento activo sube z-index > 10000 y recibe outline
// 3. El tooltip se posiciona relative al elemento (position:absolute)
//    usando calc(100% + gap) en top/bottom/left/right

const highlight = (id: string) => ({
  position: 'relative',
  zIndex: activeId === id ? 10001 : 1,  // sube sobre el backdrop
  outline: activeId === id ? '2px solid #FF7043' : 'none',
  outlineOffset: 4,
});`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
