import { Box, Tab, Tabs, Typography } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import SpeedIcon from '@mui/icons-material/Speed';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MemoryIcon from '@mui/icons-material/Memory';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import LayersIcon from '@mui/icons-material/Layers';
import { useState } from 'react';

import UseTransitionDemo from './tabs/UseTransitionDemo';
import UseDeferredValueDemo from './tabs/UseDeferredValueDemo';
import SuspenseDemo from './tabs/SuspenseDemo';
import MemoDemo from './tabs/MemoDemo';
import ProfilerDemo from './tabs/ProfilerDemo';
import BundleOptimization from './tabs/BundleOptimization';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'useTransition',    Icon: SpeedIcon,          Component: UseTransitionDemo },
  { label: 'useDeferredValue', Icon: HourglassEmptyIcon, Component: UseDeferredValueDemo },
  { label: 'Suspense',         Icon: CloudDownloadIcon,  Component: SuspenseDemo },
  { label: 'Memo',             Icon: MemoryIcon,         Component: MemoDemo },
  { label: 'Profiler',         Icon: AnalyticsIcon,      Component: ProfilerDemo },
  { label: 'Bundle',           Icon: LayersIcon,         Component: BundleOptimization },
];

export default function TheLab6() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <RocketIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>6</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            useTransition · useDeferredValue · Suspense · Memo · Profiler · Bundle
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
