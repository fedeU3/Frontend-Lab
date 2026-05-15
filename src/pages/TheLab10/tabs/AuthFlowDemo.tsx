import { Box, Button, Chip, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios, { type AxiosInstance } from 'axios';
import { useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface Tokens { accessToken: string; refreshToken: string; expiresAt: number }
interface AuthLog { ts: string; event: string; ok: boolean }

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function mockLogin(user: string, pass: string): Promise<Tokens> {
  await delay(800);
  if (user !== 'user' || pass !== 'pass') throw new Error('Credenciales incorrectas');
  return {
    accessToken: `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ sub: user, exp: Math.floor((Date.now() + 30000) / 1000) }))}`,
    refreshToken: `refresh_${Math.random().toString(36).slice(2)}`,
    expiresAt: Date.now() + 30_000,
  };
}

async function mockRefresh(refreshToken: string): Promise<Tokens> {
  await delay(500);
  if (!refreshToken) throw new Error('No refresh token');
  return {
    accessToken: `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ sub: 'user', exp: Math.floor((Date.now() + 30000) / 1000) }))}`,
    refreshToken,
    expiresAt: Date.now() + 30_000,
  };
}

async function mockProtectedCall(token: string): Promise<{ data: string }> {
  await delay(600);
  if (!token) throw new Error('No token');
  if (Math.random() < 0.3) throw new Error('Unauthorized (401)');
  return { data: `Datos protegidos — ${new Date().toLocaleTimeString()}` };
}

function createAuthApi(getTokens: () => Tokens | null, setTokens: (t: Tokens | null) => void): AxiosInstance {
  const api = axios.create({ baseURL: '/' });
  api.interceptors.request.use((config) => {
    const t = getTokens();
    if (t) config.headers.Authorization = `Bearer ${t.accessToken}`;
    return config;
  });
  api.interceptors.response.use(
    (r) => r,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        const t = getTokens();
        if (t) {
          const fresh = await mockRefresh(t.refreshToken);
          setTokens(fresh);
          error.config.headers.Authorization = `Bearer ${fresh.accessToken}`;
          return api.request(error.config);
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
}

export default function AuthFlowDemo() {
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [user, setUser] = useState('user');
  const [pass, setPass] = useState('pass');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<AuthLog[]>([]);
  const [apiResult, setApiResult] = useState<string | null>(null);
  const tokensRef = useRef<Tokens | null>(null);

  const addLog = (event: string, ok: boolean) =>
    setLog((prev) => [{ ts: new Date().toLocaleTimeString(), event, ok }, ...prev.slice(0, 9)]);

  const syncTokens = (t: Tokens | null) => {
    tokensRef.current = t;
    setTokens(t);
  };

  const api = useRef(createAuthApi(() => tokensRef.current, syncTokens)).current;

  const login = async () => {
    setLoading(true);
    try {
      const t = await mockLogin(user, pass);
      syncTokens(t);
      addLog(`Login exitoso · Token expira en 30s`, true);
    } catch (e) {
      addLog(`Login fallido: ${(e as Error).message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const callProtected = async () => {
    setLoading(true);
    try {
      const { data } = await mockProtectedCall(tokensRef.current?.accessToken ?? '');
      setApiResult(data.data);
      addLog(`Llamada protegida OK`, true);
    } catch (e) {
      addLog(`Llamada protegida fallida: ${(e as Error).message}`, false);
      setApiResult(null);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (!tokensRef.current) return;
    setLoading(true);
    try {
      const t = await mockRefresh(tokensRef.current.refreshToken);
      syncTokens(t);
      addLog('Token refrescado manualmente', true);
    } catch (e) {
      addLog(`Refresh fallido: ${(e as Error).message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    syncTokens(null);
    setApiResult(null);
    addLog('Logout', true);
  };

  const isExpired = tokens && Date.now() > tokens.expiresAt;
  const expiresIn = tokens ? Math.max(0, Math.floor((tokens.expiresAt - Date.now()) / 1000)) : null;

  return (
    <Box>
      <Section
        title="Flujo JWT simulado"
        subtitle="Login → access + refresh tokens en memoria → interceptor axios adjunta Bearer → refresh automático en 401."
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            {!tokens ? (
              <Stack spacing={1.5}>
                <TextField size="small" label="Usuario" value={user} onChange={(e) => setUser(e.target.value)} helperText="Usar: user / pass" />
                <TextField size="small" label="Contraseña" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
                <Button variant="contained" onClick={login} disabled={loading} startIcon={<LockIcon />}>
                  {loading ? 'Iniciando sesión…' : 'Login'}
                </Button>
              </Stack>
            ) : (
              <Stack spacing={1.5}>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated' }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip label="Autenticado" color="success" size="small" />
                    {isExpired ? (
                      <Chip label="Token expirado" color="error" size="small" />
                    ) : (
                      <Chip label={`Expira en ${expiresIn}s`} color={expiresIn! < 10 ? 'warning' : 'default'} size="small" />
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', wordBreak: 'break-all', display: 'block' }}>
                    {tokens.accessToken.slice(0, 50)}…
                  </Typography>
                </Paper>
                <Button variant="outlined" onClick={callProtected} disabled={loading}>
                  Llamar endpoint protegido
                </Button>
                <Button variant="outlined" onClick={refresh} disabled={loading} startIcon={<RefreshIcon />}>
                  Refresh token manual
                </Button>
                <Button variant="outlined" color="error" onClick={logout} startIcon={<LogoutIcon />}>
                  Logout
                </Button>
                {apiResult && (
                  <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: 'background.elevated' }}>
                    <Typography variant="caption" sx={{ color: 'success.main' }}>✓ {apiResult}</Typography>
                  </Paper>
                )}
              </Stack>
            )}
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Log de eventos</Typography>
            <Stack spacing={0.5} sx={{ maxHeight: 280, overflowY: 'auto' }}>
              {log.length === 0 && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Iniciá sesión para ver eventos…</Typography>
              )}
              {log.map((entry, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 1, borderRadius: 0.5, backgroundColor: 'background.elevated', border: '1px solid', borderColor: entry.ok ? 'success.main' : 'error.main', borderOpacity: 0.3 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', flexShrink: 0 }}>{entry.ts}</Typography>
                  <Typography variant="caption" sx={{ color: entry.ok ? 'success.main' : 'error.main' }}>{entry.event}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Section>

      <Section title="Interceptor de axios para Bearer token">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const api = axios.create({ baseURL: '/api' });

// Request: adjuntar Bearer
api.interceptors.request.use((config) => {
  if (tokens.accessToken) {
    config.headers.Authorization = \`Bearer \${tokens.accessToken}\`;
  }
  return config;
});

// Response: refresh automático en 401
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const fresh = await refreshToken(tokens.refreshToken);
      setTokens(fresh);
      error.config.headers.Authorization = \`Bearer \${fresh.accessToken}\`;
      return api.request(error.config); // reintenta la petición original
    }
    return Promise.reject(error);
  }
);`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
