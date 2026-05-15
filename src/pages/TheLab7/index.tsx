import { Box, Tab, Tabs, Typography } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import LanguageIcon from '@mui/icons-material/Language';
import CastIcon from '@mui/icons-material/Cast';
import RefreshIcon from '@mui/icons-material/Refresh';
import BoltIcon from '@mui/icons-material/Bolt';
import CompareIcon from '@mui/icons-material/Compare';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useState } from 'react';

import WebSocketDemo from './tabs/WebSocketDemo';
import SSEDemo from './tabs/SSEDemo';
import PollingDemo from './tabs/PollingDemo';
import UseOptimisticDemo from './tabs/UseOptimisticDemo';
import RealtimePatterns from './tabs/RealtimePatterns';
import LiveDashboard from './tabs/LiveDashboard';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'WebSocket',     Icon: LanguageIcon, Component: WebSocketDemo },
  { label: 'SSE',           Icon: CastIcon,     Component: SSEDemo },
  { label: 'Polling',       Icon: RefreshIcon,  Component: PollingDemo },
  { label: 'useOptimistic', Icon: BoltIcon,     Component: UseOptimisticDemo },
  { label: 'Patrones',      Icon: CompareIcon,  Component: RealtimePatterns },
  { label: 'Dashboard',     Icon: DashboardIcon,Component: LiveDashboard },
];

export default function TheLab7() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <RocketIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>7</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            WebSocket · SSE · Polling · useOptimistic · Patrones · Dashboard
          </Typography>
        </Box>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {TABS.map(({ label, Icon }) => (
            <Tab key={label} icon={<Icon fontSize="small" />} iconPosition="start" label={label} />
          ))}
        </Tabs>
      </Box>
      {TABS.map(({ Component }, i) => (
        <TabPanel key={i} value={tab} index={i}>
          <Component />
        </TabPanel>
      ))}
    </Box>
  );
}
