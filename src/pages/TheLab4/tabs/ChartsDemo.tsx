import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const COLORS = { primary: '#FF7043', secondary: '#78909C', success: '#66BB6A', warning: '#FFA726', info: '#42A5F5' };

const CHART_STYLE = {
  backgroundColor: '#151E26',
  border: '1px solid rgba(176,190,197,0.2)',
  borderRadius: 4,
  fontSize: '0.72rem',
  color: '#B0BEC5',
};

// ── Line chart ───────────────────────────────────────────────────────────────
const lineData = [
  { mes: 'Ene', visitas: 4200, conversiones: 380 },
  { mes: 'Feb', visitas: 5800, conversiones: 520 },
  { mes: 'Mar', visitas: 5100, conversiones: 460 },
  { mes: 'Abr', visitas: 7200, conversiones: 690 },
  { mes: 'May', visitas: 6800, conversiones: 640 },
  { mes: 'Jun', visitas: 8900, conversiones: 820 },
  { mes: 'Jul', visitas: 9400, conversiones: 910 },
];

function LineChartDemo() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const toggle = (key: string) => setHidden((p) => { const n = new Set(p); n.has(key) ? n.delete(key) : n.add(key); return n; });

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        {['visitas', 'conversiones'].map((k) => (
          <Chip key={k} label={k} size="small" clickable onClick={() => toggle(k)}
            variant={hidden.has(k) ? 'outlined' : 'filled'}
            sx={{ backgroundColor: hidden.has(k) ? 'transparent' : k === 'visitas' ? COLORS.primary : COLORS.info,
              color: hidden.has(k) ? 'text.secondary' : '#080808', borderColor: k === 'visitas' ? COLORS.primary : COLORS.info }} />
        ))}
      </Stack>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={lineData} style={CHART_STYLE}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(176,190,197,0.1)" />
          <XAxis dataKey="mes" tick={{ fill: '#78909C', fontSize: 11 }} />
          <YAxis tick={{ fill: '#78909C', fontSize: 11 }} />
          <Tooltip contentStyle={{ backgroundColor: '#1E2D3D', border: '1px solid #FF7043', borderRadius: 4, color: '#B0BEC5' }} />
          {!hidden.has('visitas')      && <Line type="monotone" dataKey="visitas"      stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
          {!hidden.has('conversiones') && <Line type="monotone" dataKey="conversiones" stroke={COLORS.info}    strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

// ── Bar chart ────────────────────────────────────────────────────────────────
const barData = [
  { trimestre: 'Q1', ingresos: 48000, gastos: 31000 },
  { trimestre: 'Q2', ingresos: 62000, gastos: 38000 },
  { trimestre: 'Q3', ingresos: 57000, gastos: 34000 },
  { trimestre: 'Q4', ingresos: 78000, gastos: 42000 },
];

function BarChartDemo() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={barData} style={CHART_STYLE} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(176,190,197,0.1)" />
        <XAxis dataKey="trimestre" tick={{ fill: '#78909C', fontSize: 11 }} />
        <YAxis tick={{ fill: '#78909C', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip contentStyle={{ backgroundColor: '#1E2D3D', border: '1px solid #FF7043', borderRadius: 4, color: '#B0BEC5' }}
          formatter={(v: number) => [`$${v.toLocaleString()}`, undefined]} />
        <Legend wrapperStyle={{ color: '#78909C', fontSize: 12 }} />
        <Bar dataKey="ingresos" fill={COLORS.primary} radius={[3, 3, 0, 0]} />
        <Bar dataKey="gastos"   fill={COLORS.secondary} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Pie chart ────────────────────────────────────────────────────────────────
const pieData = [
  { name: 'Orgánico',  value: 42 },
  { name: 'Directo',   value: 28 },
  { name: 'Social',    value: 18 },
  { name: 'Referido',  value: 12 },
];
const PIE_COLORS = [COLORS.primary, COLORS.info, COLORS.success, COLORS.warning];

function PieChartDemo() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 3, alignItems: 'center' }}>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart style={CHART_STYLE}>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value"
            onMouseEnter={(_, i) => setActive(i)} onMouseLeave={() => setActive(null)}>
            {pieData.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i]} opacity={active === null || active === i ? 1 : 0.45}
                stroke={active === i ? '#fff' : 'transparent'} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#1E2D3D', border: '1px solid #FF7043', borderRadius: 4, color: '#B0BEC5' }}
            formatter={(v: number) => [`${v}%`, undefined]} />
        </PieChart>
      </ResponsiveContainer>
      <Stack spacing={1}>
        {pieData.map((d, i) => (
          <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: PIE_COLORS[i], flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{d.name}</Typography>
            <Typography variant="caption" sx={{ ml: 'auto', fontFamily: 'monospace' }}>{d.value}%</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// ── Area chart ───────────────────────────────────────────────────────────────
const areaData = [
  { semana: 'S1', usuarios: 1200 },
  { semana: 'S2', usuarios: 1900 },
  { semana: 'S3', usuarios: 1600 },
  { semana: 'S4', usuarios: 2400 },
  { semana: 'S5', usuarios: 2800 },
  { semana: 'S6', usuarios: 3200 },
  { semana: 'S7', usuarios: 3900 },
  { semana: 'S8', usuarios: 4500 },
];

function AreaChartDemo() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={areaData} style={CHART_STYLE}>
        <defs>
          <linearGradient id="gradUsuarios" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={COLORS.primary} stopOpacity={0.3} />
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(176,190,197,0.1)" />
        <XAxis dataKey="semana" tick={{ fill: '#78909C', fontSize: 11 }} />
        <YAxis tick={{ fill: '#78909C', fontSize: 11 }} />
        <Tooltip contentStyle={{ backgroundColor: '#1E2D3D', border: '1px solid #FF7043', borderRadius: 4, color: '#B0BEC5' }} />
        <Area type="monotone" dataKey="usuarios" stroke={COLORS.primary} strokeWidth={2} fill="url(#gradUsuarios)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function ChartsDemo() {
  return (
    <Box>
      <Section title="Line Chart" subtitle="Usá ResponsiveContainer para que el gráfico sea fluid. Hacé click en los chips para mostrar/ocultar series.">
        <LineChartDemo />
      </Section>
      <Section title="Bar Chart" subtitle="Barras agrupadas con múltiples series. tickFormatter para formatear el eje Y.">
        <BarChartDemo />
      </Section>
      <Section title="Pie / Donut Chart" subtitle="innerRadius convierte el pie en donut. onMouseEnter para highlight de segmento.">
        <PieChartDemo />
      </Section>
      <Section title="Area Chart" subtitle="linearGradient en defs para el fill degradado. Útil para mostrar crecimiento acumulado.">
        <AreaChartDemo />
      </Section>
    </Box>
  );
}
