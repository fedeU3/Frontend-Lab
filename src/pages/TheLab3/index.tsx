import { Box, Tab, Tabs, Typography } from '@mui/material';
import BiotechIcon from '@mui/icons-material/Biotech';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import AnimationIcon from '@mui/icons-material/Animation';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';

import InfiniteScrollDemo from './tabs/InfiniteScrollDemo';
import DatePickersDemo from './tabs/DatePickersDemo';
import AutocompleteDemo from './tabs/AutocompleteDemo';
import AnimationsDemo from './tabs/AnimationsDemo';
import DynamicFormsDemo from './tabs/DynamicFormsDemo';
import FileUploadDemo from './tabs/FileUploadDemo';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'Infinite Scroll', Icon: AllInclusiveIcon,  Component: InfiniteScrollDemo },
  { label: 'Date Pickers',    Icon: CalendarMonthIcon, Component: DatePickersDemo },
  { label: 'Autocomplete',    Icon: SearchIcon,        Component: AutocompleteDemo },
  { label: 'Animations',      Icon: AnimationIcon,     Component: AnimationsDemo },
  { label: 'Dynamic Forms',   Icon: DynamicFormIcon,   Component: DynamicFormsDemo },
  { label: 'File Upload',     Icon: CloudUploadIcon,   Component: FileUploadDemo },
];

export default function TheLab3() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <BiotechIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>3</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Infinite Scroll · Date Pickers · Autocomplete · Animations · Dynamic Forms · File Upload
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
