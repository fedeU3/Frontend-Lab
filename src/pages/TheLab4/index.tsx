import { Box, Tab, Tabs, Typography } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import BarChartIcon from '@mui/icons-material/BarChart';
import ViewListIcon from '@mui/icons-material/ViewList';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArticleIcon from '@mui/icons-material/Article';
import { useState } from 'react';

import DragDropDemo       from './tabs/DragDropDemo';
import ChartsDemo         from './tabs/ChartsDemo';
import VirtualizationDemo from './tabs/VirtualizationDemo';
import ContextReducerDemo from './tabs/ContextReducerDemo';
import NotificationsDemo  from './tabs/NotificationsDemo';
import MarkdownDemo       from './tabs/MarkdownDemo';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'Drag & Drop',    Icon: DragIndicatorIcon, Component: DragDropDemo },
  { label: 'Charts',         Icon: BarChartIcon,      Component: ChartsDemo },
  { label: 'Virtualization', Icon: ViewListIcon,      Component: VirtualizationDemo },
  { label: 'Context+Reducer',Icon: ShoppingCartIcon,  Component: ContextReducerDemo },
  { label: 'Notifications',  Icon: NotificationsIcon, Component: NotificationsDemo },
  { label: 'Markdown',       Icon: ArticleIcon,       Component: MarkdownDemo },
];

export default function TheLab4() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <RocketIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>4</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Drag & Drop · Charts · Virtualization · Context+Reducer · Notifications · Markdown
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
