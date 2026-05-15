import { Box, Button, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Component, useState, type ErrorInfo, type ReactNode } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── Error Boundary class component ────────────────────────────────────────────

interface BoundaryState { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }

class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode; onError?: (e: Error, info: ErrorInfo) => void }, BoundaryState> {
  state: BoundaryState = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<BoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorInfo: info });
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ hasError: false, error: null, errorInfo: null });

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <Paper variant="outlined" sx={{ p: 3, borderColor: 'error.main', backgroundColor: 'background.elevated' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <BugReportIcon sx={{ color: 'error.main' }} />
            <Typography variant="subtitle2" sx={{ color: 'error.main' }}>Algo salió mal</Typography>
          </Box>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', display: 'block', mb: 2 }}>
            {this.state.error?.message}
          </Typography>
          <Button size="small" variant="outlined" startIcon={<RefreshIcon />} onClick={this.reset}>
            Reintentar
          </Button>
        </Paper>
      );
    }
    return this.props.children;
  }
}

// ── Components that throw ─────────────────────────────────────────────────────

function BombComponent({ shouldExplode }: { shouldExplode: boolean }) {
  if (shouldExplode) {
    throw new Error('TypeError: Cannot read properties of null (reading "data")');
  }
  return (
    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated', borderColor: 'success.main' }}>
      <Typography variant="body2" sx={{ color: 'success.main' }}>Componente renderizado correctamente</Typography>
    </Paper>
  );
}

function AsyncErrorComponent({ shouldFail }: { shouldFail: boolean }) {
  if (shouldFail) {
    throw new Error('Failed to fetch: Network error');
  }
  return (
    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated', borderColor: 'success.main' }}>
      <Typography variant="body2" sx={{ color: 'success.main' }}>Datos cargados correctamente</Typography>
    </Paper>
  );
}

// ── Custom fallback ───────────────────────────────────────────────────────────

function CustomFallback({ onReset }: { onReset: () => void }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, borderColor: 'warning.main', backgroundColor: 'background.elevated' }}>
      <Typography variant="h6" sx={{ color: 'warning.main', mb: 1 }}>Houston, tenemos un problema</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Este componente tuvo un error. Puedes reintentar o reportar el problema.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button size="small" variant="contained" color="warning" startIcon={<RefreshIcon />} onClick={onReset}>
          Reintentar
        </Button>
        <Button size="small" variant="outlined">Reportar bug</Button>
      </Box>
    </Paper>
  );
}

// ── useErrorBoundary hook (React 19 compatible) ───────────────────────────────

function useErrorState() {
  const [error, setError] = useState<Error | null>(null);
  if (error) throw error;
  return setError;
}

function NetworkSimulator() {
  const throwError = useErrorState();
  const [loading, setLoading] = useState(false);

  const simulateFail = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    throwError(new Error('429 Too Many Requests — rate limit exceeded'));
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Button size="small" variant="outlined" color="error" onClick={simulateFail} disabled={loading}>
        {loading ? 'Cargando…' : 'Simular error de red'}
      </Button>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Lanza el error desde dentro del render cycle → ErrorBoundary lo captura
      </Typography>
    </Box>
  );
}

// ── Error log ────────────────────────────────────────────────────────────────

interface LogEntry { ts: string; message: string; component: string }

export default function ErrorBoundaryDemo() {
  const [bomb1, setBomb1] = useState(false);
  const [bomb2, setBomb2] = useState(false);
  const [bomb1Key, setBomb1Key] = useState(0);
  const [bomb2Key, setBomb2Key] = useState(0);
  const [errorLog, setErrorLog] = useState<LogEntry[]>([]);

  const addLog = (message: string, component: string) =>
    setErrorLog((prev) => [{ ts: new Date().toLocaleTimeString(), message, component }, ...prev.slice(0, 4)]);

  return (
    <Box>
      <Section
        title="ErrorBoundary — clase con getDerivedStateFromError"
        subtitle="Error Boundaries son componentes de clase. getDerivedStateFromError actualiza el estado sincrónico. componentDidCatch recibe info de la traza."
      >
        <Box sx={{ mb: 2, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { hasError: true, error };     // sync — actualiza antes del render
  }
  componentDidCatch(error, info) {
    logToService(error, info.componentStack); // side effects aquí
  }
  render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}`}
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Fallback por defecto
            </Typography>
            <Button
              size="small" variant="outlined" color="error" sx={{ mb: 1.5 }}
              onClick={() => { setBomb1(true); }}
            >
              Lanzar error
            </Button>
            <ErrorBoundary
              key={bomb1Key}
              onError={(e) => { addLog(e.message, 'BombComponent'); setBomb1(false); }}
            >
              <BombComponent shouldExplode={bomb1} />
            </ErrorBoundary>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Fallback personalizado
            </Typography>
            <Button
              size="small" variant="outlined" color="error" sx={{ mb: 1.5 }}
              onClick={() => { setBomb2(true); }}
            >
              Lanzar error
            </Button>
            <ErrorBoundary
              key={bomb2Key}
              fallback={<CustomFallback onReset={() => { setBomb2(false); setBomb2Key((k) => k + 1); }} />}
              onError={(e) => addLog(e.message, 'AsyncErrorComponent')}
            >
              <AsyncErrorComponent shouldFail={bomb2} />
            </ErrorBoundary>
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button size="small" variant="text" onClick={() => { setBomb1(false); setBomb1Key((k) => k + 1); }}>
            Reset izquierdo
          </Button>
          <Button size="small" variant="text" onClick={() => { setBomb2(false); setBomb2Key((k) => k + 1); }}>
            Reset derecho
          </Button>
        </Box>
      </Section>

      <Section
        title="Lanzar errores desde hooks (useErrorBoundary pattern)"
        subtitle="Los errores asíncronos no los captura automáticamente el Error Boundary. El patrón: guardar en estado y relanzar en el render."
      >
        <ErrorBoundary key="network-sim" onError={(e) => addLog(e.message, 'NetworkSimulator')}>
          <NetworkSimulator />
        </ErrorBoundary>
      </Section>

      <Section title="Log de errores capturados">
        <Stack spacing={0.75} sx={{ maxWidth: 560 }}>
          {errorLog.length === 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Lanzá errores arriba para ver el log.
            </Typography>
          )}
          {errorLog.map((entry, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 1.5, backgroundColor: 'background.elevated', borderColor: 'error.main' }}>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', flexShrink: 0 }}>{entry.ts}</Typography>
                <Box>
                  <Chip label={entry.component} size="small" color="error" sx={{ height: 18, fontSize: '0.62rem', mb: 0.5 }} />
                  <Typography variant="caption" sx={{ color: 'error.main', display: 'block', fontFamily: 'monospace' }}>{entry.message}</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Section>

      <Section title="Reglas de Error Boundaries">
        <Stack spacing={1} sx={{ maxWidth: 600 }}>
          {[
            { rule: 'Solo captura errores de render', detail: 'No captura errores en event handlers, async code, o server-side rendering.' },
            { rule: 'Deben ser componentes de clase', detail: 'React no expone una API funcional equivalente (aunque useErrorBoundary de react-error-boundary lo simula).' },
            { rule: 'Granularidad estratégica', detail: 'Poner boundaries en secciones independientes de la UI, no uno global para todo.' },
            { rule: 'key para reset', detail: 'Cambiar la key del ErrorBoundary lo desmonta y remonta, limpiando el estado de error.' },
            { rule: 'Loguear en componentDidCatch', detail: 'Enviar a Sentry, Datadog, etc. Solo en componentDidCatch — getDerivedStateFromError es síncrono y no debe tener side effects.' },
          ].map(({ rule, detail }) => (
            <Paper key={rule} variant="outlined" sx={{ p: 1.5, backgroundColor: 'background.elevated' }}>
              <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mb: 0.25 }}>{rule}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{detail}</Typography>
            </Paper>
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
