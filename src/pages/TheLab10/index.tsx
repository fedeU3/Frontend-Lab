import { Box, Tab, Tabs, Typography } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import LockIcon from '@mui/icons-material/Lock';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CachedIcon from '@mui/icons-material/Cached';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useState } from 'react';

import AuthFlowDemo from './tabs/AuthFlowDemo';
import OptimisticUpdatesDemo from './tabs/OptimisticUpdatesDemo';
import InfiniteUploadDemo from './tabs/InfiniteUploadDemo';
import GraphQLDemo from './tabs/GraphQLDemo';
import CachingPatterns from './tabs/CachingPatterns';
import ErrorBoundaryDemo from './tabs/ErrorBoundaryDemo';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'Auth Flow',         Icon: LockIcon,        Component: AuthFlowDemo },
  { label: 'Optimistic',        Icon: FlashOnIcon,     Component: OptimisticUpdatesDemo },
  { label: 'Infinite Upload',   Icon: CloudUploadIcon, Component: InfiniteUploadDemo },
  { label: 'GraphQL',           Icon: AccountTreeIcon, Component: GraphQLDemo },
  { label: 'Caching Patterns',  Icon: CachedIcon,      Component: CachingPatterns },
  { label: 'Error Boundary',    Icon: BugReportIcon,   Component: ErrorBoundaryDemo },
];

export default function TheLab10() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <RocketIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>10</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Auth Flow · Optimistic Updates · Infinite Upload · GraphQL · Caching · Error Boundary
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
