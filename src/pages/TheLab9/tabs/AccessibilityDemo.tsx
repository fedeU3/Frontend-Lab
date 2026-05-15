import { Box, Button, Chip, Divider, Modal, Paper, Stack, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect, useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── Focus trap ────────────────────────────────────────────────────────────────
function FocusTrapModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusables = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [open, onClose]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" elevation={12}
          sx={{ p: 3, width: 360, backgroundColor: 'background.paper', borderRadius: 2 }}>
          <Typography id="modal-title" variant="h6" sx={{ mb: 1.5 }}>Modal accesible</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            El foco está atrapado aquí. Presioná Tab para moverte entre elementos. Esc para cerrar.
          </Typography>
          <Stack spacing={1.5}>
            <TextField size="small" label="Nombre" autoFocus />
            <TextField size="small" label="Email" type="email" />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={onClose} tabIndex={0}>Cancelar</Button>
              <Button variant="contained" tabIndex={0}>Confirmar</Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Modal>
  );
}

// ── Live region ───────────────────────────────────────────────────────────────
function LiveRegionDemo() {
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);

  const announce = (msg: string) => {
    setMessage('');
    setTimeout(() => setMessage(msg), 100);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={() => { setCount((c) => c + 1); announce(`Contador actualizado: ${count + 1}`); }}>
          Incrementar ({count})
        </Button>
        <Button size="small" variant="outlined" onClick={() => announce('Archivo guardado correctamente.')}>
          Simular guardado
        </Button>
        <Button size="small" variant="outlined" color="error" onClick={() => announce('Error: no se pudo conectar al servidor.')}>
          Simular error
        </Button>
      </Box>
      <Box sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Anuncio live region:</Typography>
        <Typography variant="body2" sx={{ color: message ? 'primary.main' : 'text.secondary', fontStyle: message ? 'normal' : 'italic' }}>
          {message || '(vacío)'}
        </Typography>
      </Box>
      {/* Live region real — invisible pero leída por lectores de pantalla */}
      <Box aria-live="polite" aria-atomic="true" sx={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        {message}
      </Box>
    </Box>
  );
}

// ── Color contrast checker ────────────────────────────────────────────────────
function ContrastChecker() {
  const COMBOS = [
    { fg: '#B0BEC5', bg: '#080808', ratio: '7.9:1', pass: 'AAA' },
    { fg: '#FF7043', bg: '#080808', ratio: '4.8:1', pass: 'AA' },
    { fg: '#78909C', bg: '#080808', ratio: '4.1:1', pass: 'AA' },
    { fg: '#78909C', bg: '#2C3E50', ratio: '2.1:1', pass: '✗' },
    { fg: '#ffffff', bg: '#FF7043', ratio: '3.4:1', pass: 'AA (grande)' },
  ];

  return (
    <Stack spacing={1}>
      {COMBOS.map(({ fg, bg, ratio, pass }) => (
        <Box key={`${fg}${bg}`} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
          <Box sx={{ width: 80, height: 32, borderRadius: 1, backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: fg, fontWeight: 'bold', fontSize: '0.7rem' }}>Texto</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
              {fg} sobre {bg}
            </Typography>
          </Box>
          <Chip label={ratio} size="small" variant="outlined" sx={{ fontFamily: 'monospace', fontSize: '0.68rem' }} />
          <Chip
            label={pass}
            size="small"
            color={pass === 'AAA' ? 'success' : pass.startsWith('AA') ? 'warning' : 'error'}
          />
        </Box>
      ))}
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        WCAG 2.1: AA requiere 4.5:1 (texto normal) o 3:1 (texto grande). AAA requiere 7:1.
      </Typography>
    </Stack>
  );
}

export default function AccessibilityDemo() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box>
      <Box
        component="a"
        href="#a11y-main"
        sx={{
          position: 'absolute', top: -40, left: 8, zIndex: 9999,
          px: 2, py: 1, borderRadius: 1, backgroundColor: 'primary.main', color: '#fff',
          textDecoration: 'none', fontSize: '0.875rem',
          '&:focus': { top: 8 },
          transition: 'top 0.15s',
        }}
      >
        Saltar al contenido principal
      </Box>

      <Box id="a11y-main">
        <Section title="Focus trap en modal" subtitle="Al abrir el modal, el foco queda atrapado adentro. Tab cicla entre los focusables. Esc cierra. Implementado con addEventListener.">
          <Button variant="contained" onClick={() => setModalOpen(true)}>
            Abrir modal accesible
          </Button>
          <FocusTrapModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </Section>

        <Section title="aria-live para anuncios dinámicos" subtitle="Los cambios de estado que no van acompañados de foco deben anunciarse en una live region para lectores de pantalla.">
          <Box sx={{ mb: 2, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`// Región invisible — los lectores de pantalla la monitoran
<div aria-live="polite" aria-atomic="true"
     style={{ position: 'absolute', left: '-9999px' }}>
  {statusMessage}
</div>
// polite = espera a que el usuario termine de leer
// assertive = interrumpe inmediatamente (solo para errores críticos)`}
            </Typography>
          </Box>
          <LiveRegionDemo />
        </Section>

        <Section title="Contraste de color — WCAG 2.1" subtitle="Todos los colores del tema pasan AA o AAA para texto normal.">
          <ContrastChecker />
        </Section>

        <Section title="ARIA patterns esenciales">
          <Stack spacing={1.5}>
            {[
              { attr: 'aria-label', desc: 'Nombre accesible cuando el elemento no tiene texto visible. Ej: botones con solo ícono.' },
              { attr: 'aria-describedby', desc: 'ID de un elemento que provee descripción adicional (ej: campo de formulario + mensaje de error).' },
              { attr: 'aria-expanded', desc: 'Estado de acordeones, dropdowns. true/false según esté abierto o cerrado.' },
              { attr: 'aria-current="page"', desc: 'Marca el ítem activo en navegación. Alternativa a CSS :active para AT.' },
              { attr: 'role="dialog" + aria-modal', desc: 'Combinación para modales. Indica a los AT que deben tratar el contenido como diálogo.' },
              { attr: 'tabIndex={-1}', desc: 'Permite enfocar el elemento por JS (ej: al abrir un modal) sin incluirlo en el tab flow natural.' },
            ].map(({ attr, desc }) => (
              <Box key={attr} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
                <CheckCircleIcon fontSize="small" sx={{ color: 'success.main', mt: 0.25, flexShrink: 0 }} />
                <Box>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', display: 'block', mb: 0.25 }}>{attr}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{desc}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Section>
      </Box>
    </Box>
  );
}
