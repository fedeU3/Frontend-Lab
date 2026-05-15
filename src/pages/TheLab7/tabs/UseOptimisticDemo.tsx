import { Box, Button, Chip, Divider, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useOptimistic, useTransition, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface Message { id: number; text: string; status: 'sent' | 'pending' | 'error' }

const FAIL_RATE = 0.3;

async function simulateSend(text: string): Promise<Message> {
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
  if (Math.random() < FAIL_RATE) throw new Error('Server error');
  return { id: Date.now(), text, status: 'sent' };
}

export default function UseOptimisticDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hola desde el servidor', status: 'sent' },
  ]);
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state, newMsg: Message) => [...state, newMsg]
  );
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [failCount, setFailCount] = useState(0);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    const tempMsg: Message = { id: Date.now(), text, status: 'pending' };

    startTransition(async () => {
      addOptimistic(tempMsg);
      try {
        const confirmed = await simulateSend(text);
        setMessages((prev) => [...prev, confirmed]);
      } catch {
        setFailCount((c) => c + 1);
        // El optimistic state se revierte automáticamente cuando la transición termina sin commit
      }
    });
  };

  return (
    <Box>
      <Section
        title="useOptimistic — React 19"
        subtitle="Agrega mensajes optimistamente antes de que el servidor confirme. Si la llamada falla, el estado se revierte automáticamente al finalizar la transición."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const [optimistic, addOptimistic] = useOptimistic(
  messages,
  (state, newMsg: Message) => [...state, newMsg]
);

const send = (text: string) => {
  startTransition(async () => {
    addOptimistic({ id: Date.now(), text, status: 'pending' });
    try {
      const real = await serverSend(text);
      setMessages((prev) => [...prev, real]); // confirma
    } catch {
      // ↑ la transición termina → optimistic se revierte
    }
  });
};`}
          </Typography>
        </Box>

        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={isPending ? 'Enviando…' : 'Listo'} color={isPending ? 'warning' : 'success'} size="small" />
          <Chip label={`✓ confirmados: ${messages.length}`} size="small" color="primary" variant="outlined" />
          <Chip label={`✗ fallidos: ${failCount}`} size="small" color={failCount > 0 ? 'error' : 'default'} variant="outlined" />
          <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>
            (~30% tasa de error simulada)
          </Typography>
        </Box>

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', maxWidth: 560 }}>
          <Stack sx={{ maxHeight: 300, overflowY: 'auto', p: 2, backgroundColor: 'background.elevated' }} spacing={1}>
            {optimisticMessages.map((msg, i) => (
              <Box key={msg.id ?? i} sx={{
                display: 'flex', justifyContent: msg.id === 1 ? 'flex-start' : 'flex-end',
              }}>
                <Box sx={{
                  maxWidth: '75%', px: 1.5, py: 0.75, borderRadius: 2,
                  backgroundColor: msg.id === 1 ? 'background.paper' : 'primary.main',
                  opacity: msg.status === 'pending' ? 0.6 : 1,
                  border: msg.status === 'pending' ? '1px dashed' : '1px solid transparent',
                  borderColor: msg.status === 'pending' ? 'warning.main' : 'transparent',
                  transition: 'opacity 0.2s',
                }}>
                  <Typography variant="body2" sx={{ color: msg.id === 1 ? 'text.primary' : '#fff' }}>
                    {msg.text}
                  </Typography>
                  <Chip
                    label={msg.status}
                    size="small"
                    color={msg.status === 'pending' ? 'warning' : msg.status === 'error' ? 'error' : 'success'}
                    sx={{ height: 16, fontSize: '0.6rem', mt: 0.5 }}
                  />
                </Box>
              </Box>
            ))}
          </Stack>
          <Box sx={{ display: 'flex', gap: 1, p: 1.5, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
            <TextField
              size="small" fullWidth value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Escribí un mensaje…"
            />
            <Button variant="contained" onClick={send} startIcon={<SendIcon />} disabled={!input.trim()}>
              Enviar
            </Button>
          </Box>
        </Box>
      </Section>
    </Box>
  );
}
