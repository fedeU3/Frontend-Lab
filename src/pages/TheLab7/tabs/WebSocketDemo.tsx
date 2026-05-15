import { Box, Button, Chip, Divider, Stack, TextField, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

type WsStatus = 'connecting' | 'open' | 'closed' | 'error';

interface ChatMessage { id: number; text: string; direction: 'sent' | 'received'; ts: string }

const STATUS_COLOR: Record<WsStatus, 'warning' | 'success' | 'default' | 'error'> = {
  connecting: 'warning',
  open: 'success',
  closed: 'default',
  error: 'error',
};

class MockEchoSocket {
  private _status: WsStatus = 'connecting';
  private onStatusChange: (s: WsStatus) => void;
  private onMessage: (msg: string) => void;
  private closed = false;

  constructor(
    onStatusChange: (s: WsStatus) => void,
    onMessage: (msg: string) => void
  ) {
    this.onStatusChange = onStatusChange;
    this.onMessage = onMessage;
    setTimeout(() => {
      if (!this.closed) { this._status = 'open'; onStatusChange('open'); }
    }, 600);
  }

  send(text: string) {
    if (this._status !== 'open') return;
    setTimeout(() => {
      if (!this.closed) this.onMessage(`Echo: ${text}`);
    }, 250 + Math.random() * 300);
  }

  disconnect() {
    this.closed = true;
    this._status = 'closed';
    this.onStatusChange('closed');
  }

  triggerError() {
    this.closed = true;
    this._status = 'error';
    this.onStatusChange('error');
  }

  get status() { return this._status; }
}

export default function WebSocketDemo() {
  const [status, setStatus] = useState<WsStatus>('closed');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<MockEchoSocket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const connect = () => {
    if (socketRef.current) return;
    setStatus('connecting');
    setMessages([]);
    const sock = new MockEchoSocket(
      (s) => setStatus(s),
      (msg) => setMessages((prev) => [...prev, { id: Date.now(), text: msg, direction: 'received', ts: new Date().toLocaleTimeString() }])
    );
    socketRef.current = sock;
  };

  const disconnect = () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  };

  const triggerError = () => {
    socketRef.current?.triggerError();
    socketRef.current = null;
  };

  const send = () => {
    if (!input.trim() || status !== 'open') return;
    const msg: ChatMessage = { id: Date.now(), text: input.trim(), direction: 'sent', ts: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, msg]);
    socketRef.current?.send(input.trim());
    setInput('');
  };

  return (
    <Box>
      <Section
        title="Chat con WebSocket simulado"
        subtitle="Simula el ciclo de vida completo: connecting → open → closed/error. El servidor eco responde cada mensaje."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 520 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const ws = new WebSocket('wss://echo.example.com');
ws.onopen    = () => setStatus('open');
ws.onmessage = (e) => addMessage(e.data, 'received');
ws.onclose   = () => setStatus('closed');
ws.onerror   = () => setStatus('error');
ws.send('Hola servidor');`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip label={status.toUpperCase()} color={STATUS_COLOR[status]} size="small" />
          <Button variant="contained" onClick={connect} disabled={status === 'connecting' || status === 'open'} size="small">
            Conectar
          </Button>
          <Button variant="outlined" onClick={disconnect} disabled={status !== 'open'} size="small">
            Desconectar
          </Button>
          <Button variant="outlined" color="error" onClick={triggerError} disabled={status !== 'open'} size="small">
            Simular error
          </Button>
        </Box>

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', maxWidth: 600 }}>
          <Box ref={listRef} sx={{ height: 300, overflowY: 'auto', p: 2, backgroundColor: 'background.elevated', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {messages.length === 0 && (
              <Typography variant="caption" sx={{ color: 'text.secondary', m: 'auto' }}>
                {status === 'open' ? 'Enviá un mensaje…' : 'Conectate para chatear'}
              </Typography>
            )}
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.direction === 'sent' ? 'flex-end' : 'flex-start' }}>
                <Box sx={{
                  maxWidth: '75%', px: 1.5, py: 0.75, borderRadius: 2,
                  backgroundColor: msg.direction === 'sent' ? 'primary.main' : 'background.paper',
                }}>
                  <Typography variant="body2" sx={{ color: msg.direction === 'sent' ? '#fff' : 'text.primary' }}>{msg.text}</Typography>
                  <Typography variant="caption" sx={{ color: msg.direction === 'sent' ? 'rgba(255,255,255,0.6)' : 'text.secondary', fontSize: '0.65rem' }}>{msg.ts}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, p: 1.5, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
            <TextField
              size="small" fullWidth value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={status === 'open' ? 'Escribí un mensaje…' : 'Conectate primero'}
              disabled={status !== 'open'}
            />
            <Button variant="contained" onClick={send} disabled={status !== 'open'} startIcon={<SendIcon />}>
              Enviar
            </Button>
          </Box>
        </Box>
      </Section>

      <Section title="Estados del ciclo de vida">
        <Stack spacing={1}>
          {([
            ['connecting', 'warning', 'La conexión TCP está siendo establecida. No se puede enviar mensajes.'],
            ['open', 'success', 'La conexión está activa. Se pueden enviar y recibir mensajes.'],
            ['closed', 'default', 'La conexión fue cerrada limpiamente (código de cierre + motivo disponibles).'],
            ['error', 'error', 'Ocurrió un error. Generalmente seguido de un evento close.'],
          ] as [WsStatus, string, string][]).map(([s, color, desc]) => (
            <Box key={s} sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', backgroundColor: 'background.elevated' }}>
              <Chip label={s} size="small" color={color as 'warning' | 'success' | 'default' | 'error'} sx={{ minWidth: 100 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{desc}</Typography>
            </Box>
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
