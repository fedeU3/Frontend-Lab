import { Box, Tab, Tabs, Typography } from '@mui/material';
import Science from '@mui/icons-material/Science';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HookIcon from '@mui/icons-material/Cable';
import ImageIcon from '@mui/icons-material/Image';
import { useState } from 'react';

import TablesDemo from './tabs/TablesDemo';
import DialogsDrawersDemo from './tabs/DialogsDrawersDemo';
import StepperDemo from './tabs/StepperDemo';
import MutationsDemo from './tabs/MutationsDemo';
import CustomHooksDemo from './tabs/CustomHooksDemo';
import SkeletonsDemo from './tabs/SkeletonsDemo';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'Tables',        Icon: TableChartIcon,  Component: TablesDemo },
  { label: 'Dialogs',       Icon: ViewAgendaIcon,  Component: DialogsDrawersDemo },
  { label: 'Stepper',       Icon: LinearScaleIcon, Component: StepperDemo },
  { label: 'Mutations',     Icon: SwapHorizIcon,   Component: MutationsDemo },
  { label: 'Custom Hooks',  Icon: HookIcon,        Component: CustomHooksDemo },
  { label: 'Skeletons',     Icon: ImageIcon,       Component: SkeletonsDemo },
];

export default function TheLab2() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Science sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>2</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tables · Dialogs · Stepper · Mutations · Custom Hooks · Skeletons
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {TABS.map(({ label, Icon }) => (
            <Tab
              key={label}
              icon={<Icon fontSize="small" />}
              iconPosition="start"
              label={label}
            />
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
