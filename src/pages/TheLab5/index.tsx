import { Box, Tab, Tabs, Typography } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import StorageIcon from '@mui/icons-material/Storage';
import HubIcon from '@mui/icons-material/Hub';
import ScienceIcon from '@mui/icons-material/Science';
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveIcon from '@mui/icons-material/Save';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useState } from 'react';

import ZustandDemo from './tabs/ZustandDemo';
import ReduxToolkitDemo from './tabs/ReduxToolkitDemo';
import JotaiDemo from './tabs/JotaiDemo';
import SelectorPatterns from './tabs/SelectorPatterns';
import PersistenceDemo from './tabs/PersistenceDemo';
import ComparisonTable from './tabs/ComparisonTable';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'Zustand',         Icon: StorageIcon,     Component: ZustandDemo },
  { label: 'Redux Toolkit',   Icon: HubIcon,          Component: ReduxToolkitDemo },
  { label: 'Jotai',           Icon: ScienceIcon,     Component: JotaiDemo },
  { label: 'Selectors',       Icon: FilterListIcon,  Component: SelectorPatterns },
  { label: 'Persistence',     Icon: SaveIcon,         Component: PersistenceDemo },
  { label: 'Comparativa',     Icon: TableChartIcon,  Component: ComparisonTable },
];

export default function TheLab5() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <RocketIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>5</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Zustand · Redux Toolkit · Jotai · Selectors · Persistence · Comparativa
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
