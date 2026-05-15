import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface SseEvent { id: number; type: string; data: string; ts: string }

const EVENT_TYPES = ['cpu', 'memory', 'network', 'disk', 'alert'];
const EVENT_COLORS: Record<string, string> = {
  cpu: '#FF7043', memory: '#42A5F5', network: '#66BB6A', disk: '#FFA726', alert: '#EF5350',
};

function generateEvent(): SseEvent {
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const value = Math.floor(Math.random() * 100);
  return {
    id: Date.now(),
    type,
    data: type === 'alert'
      ? `⚠️ Umbral superado: ${value}%`
      : `${type.toUpperCase()}: ${value}% utilización`,
    ts: new Date().toLocaleTimeString(),
  };
}

export default function SSEDemo() {
  const [events, setEvents] = useState<SseEvent[]>([]);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [events]);

  useEffect(() => {
    if (!running) return;
    const controller = new AbortController();
    abortRef.current = controller;

    const stream = new ReadableStream<SseEvent>({
      start(controller2) {
        const id = setInterval(() => {
          if (abortRef.current?.signal.aborted) {
            clearInterval(id);
            controller2.close();
            return;
          }
          controller2.enqueue(generateEvent());
        }, 1200 + Math.random() * 800);
        controller.signal.addEventListener('abort', () => clearInterval(id));
      },
    });

    const reader = stream.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setEvents((prev) => [value, ...prev].slice(0, 50));
      }
    };
    pump();

    return () => { controller.abort(); };
  }, [running]);

  const toggle = () => {
    if (running) {
      abortRef.current?.abort();
      abortRef.current = null;
    }
    setRunning((r) => !r);
  };

  const clear = () => setEvents([]);

  return (
    <Box>
      <Section
        title="Server-Sent Events simulados"
        subtitle="Un ReadableStream local emite eventos del sistema cada 1-2s. El mismo patrón aplica a un SSE real de servidor usando EventSource."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`// Con servidor real:
const es = new EventSource('/api/events');
es.onmessage = (e) => handleEvent(JSON.parse(e.data));
es.addEventListener('cpu', (e) => handleCpu(e.data));
es.close(); // para desconectarse

// Diferencias con WebSocket:
// ✅ Unidireccional (server → client) — menos overhead
// ✅ Reconexión automática
// ✅ HTTP estándar — funciona con proxies
// ❌ Solo texto, no binario`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
          <Chip label={running ? 'STREAMING' : 'PAUSADO'} color={running ? 'success' : 'default'} size="small" />
          <Button variant={running ? 'outlined' : 'contained'} onClick={toggle} size="small">
            {running ? 'Pausar' : 'Iniciar stream'}
          </Button>
          <Button variant="text" onClick={clear} size="small" sx={{ color: 'text.secondary' }}>Limpiar</Button>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{events.length} eventos</Typography>
        </Box>

        <Box ref={listRef} sx={{ maxHeight: 380, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, backgroundColor: 'background.elevated' }}>
          {events.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Iniciá el stream para ver eventos…</Typography>
            </Box>
          )}
          {events.map((evt) => (
            <Box key={evt.id} sx={{
              display: 'flex', gap: 2, px: 1.5, py: 1,
              borderBottom: '1px solid', borderColor: 'divider',
              alignItems: 'center',
              '&:last-child': { border: 0 },
            }}>
              <Chip
                label={evt.type}
                size="small"
                sx={{
                  backgroundColor: `${EVENT_COLORS[evt.type]}22`,
                  color: EVENT_COLORS[evt.type],
                  borderColor: EVENT_COLORS[evt.type],
                  minWidth: 80,
                  fontSize: '0.65rem',
                }}
                variant="outlined"
              />
              <Typography variant="body2" sx={{ flex: 1, color: evt.type === 'alert' ? 'error.main' : 'text.primary' }}>
                {evt.data}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', flexShrink: 0 }}>
                {evt.ts}
              </Typography>
            </Box>
          ))}
        </Box>
      </Section>

      <Section title="Tipos de eventos SSE">
        <Stack spacing={1}>
          {[
            { type: 'message', desc: 'Evento genérico — escuchado con es.onmessage o es.addEventListener("message", ...)' },
            { type: 'custom', desc: 'Evento con nombre — escuchado solo con es.addEventListener("nombreEvento", ...)' },
            { type: 'error', desc: 'Errores de red o servidor. El browser reintenta automáticamente (retry)' },
            { type: 'open', desc: 'La conexión fue establecida exitosamente' },
          ].map(({ type, desc }) => (
            <Box key={type} sx={{ display: 'flex', gap: 2, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
              <Chip label={type} size="small" variant="outlined" sx={{ minWidth: 80, fontFamily: 'monospace', fontSize: '0.68rem' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{desc}</Typography>
            </Box>
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
