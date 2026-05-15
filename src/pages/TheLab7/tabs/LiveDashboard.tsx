import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface DataPoint { t: string; cpu: number; mem: number; rps: number }

function generatePoint(): DataPoint {
  return {
    t: new Date().toLocaleTimeString(),
    cpu: Math.round(20 + Math.random() * 60),
    mem: Math.round(40 + Math.random() * 40),
    rps: Math.round(50 + Math.random() * 450),
  };
}

function makeInitial(n = 20): DataPoint[] {
  const now = Date.now();
  return Array.from({ length: n }, (_, i) => ({
    t: new Date(now - (n - i) * 1000).toLocaleTimeString(),
    cpu: Math.round(20 + Math.random() * 60),
    mem: Math.round(40 + Math.random() * 40),
    rps: Math.round(50 + Math.random() * 450),
  }));
}

function StatCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated', flex: 1, minWidth: 120 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color }}>{value}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{unit}</Typography>
      </Box>
    </Paper>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ p: 1.5, backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>{label}</Typography>
      {payload.map((p) => (
        <Typography key={p.name} variant="caption" sx={{ color: p.color, display: 'block' }}>
          {p.name}: {p.value}
        </Typography>
      ))}
    </Box>
  );
};

export default function LiveDashboard() {
  const [data, setData] = useState<DataPoint[]>(makeInitial);
  const [running, setRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setData((prev) => [...prev.slice(-29), generatePoint()]);
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const last = data[data.length - 1];

  return (
    <Box>
      <Section
        title="Dashboard en tiempo real"
        subtitle="Métricas simuladas actualizándose cada segundo con recharts AreaChart. Los datos se limitan a los últimos 30 puntos para mantener rendimiento."
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip label={running ? '● LIVE' : '■ PAUSED'} color={running ? 'success' : 'default'} size="small" />
          <Button variant={running ? 'outlined' : 'contained'} onClick={() => setRunning((r) => !r)} size="small">
            {running ? 'Pausar' : 'Reanudar'}
          </Button>
          <Button variant="text" size="small" onClick={() => setData(makeInitial())} sx={{ color: 'text.secondary' }}>
            Reset
          </Button>
        </Box>

        {last && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <StatCard label="CPU" value={last.cpu} unit="%" color={last.cpu > 70 ? '#EF5350' : '#FF7043'} />
            <StatCard label="Memoria" value={last.mem} unit="%" color={last.mem > 70 ? '#EF5350' : '#42A5F5'} />
            <StatCard label="Requests/s" value={last.rps} unit="rps" color="#66BB6A" />
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>CPU & Memoria</Typography>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF7043" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF7043" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#42A5F5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#42A5F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#78909C' }} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#78909C' }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cpu" name="CPU" stroke="#FF7043" fill="url(#cpu)" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Area type="monotone" dataKey="mem" name="Memoria" stroke="#42A5F5" fill="url(#mem)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>Requests/s</Typography>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="rps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#66BB6A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: '#78909C' }} interval="preserveStartEnd" />
              <YAxis domain={[0, 500]} tick={{ fontSize: 10, fill: '#78909C' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rps" name="req/s" stroke="#66BB6A" fill="url(#rps)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Section>
    </Box>
  );
}
