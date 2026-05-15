import { Box, Tab, Tabs, Typography } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import TerminalIcon from '@mui/icons-material/Terminal';
import SchoolIcon from '@mui/icons-material/School';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import InfoIcon from '@mui/icons-material/Info';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useState } from 'react';

import CommandPaletteDemo from './tabs/CommandPaletteDemo';
import OnboardingDemo from './tabs/OnboardingDemo';
import SkeletonDemo from './tabs/SkeletonDemo';
import GesturesDemo from './tabs/GesturesDemo';
import TooltipAndPopoverDemo from './tabs/TooltipAndPopoverDemo';
import AccessibilityDemo from './tabs/AccessibilityDemo';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'Command Palette', Icon: TerminalIcon,        Component: CommandPaletteDemo },
  { label: 'Onboarding',      Icon: SchoolIcon,          Component: OnboardingDemo },
  { label: 'Skeleton',        Icon: ViewStreamIcon,      Component: SkeletonDemo },
  { label: 'Gestures',        Icon: TouchAppIcon,        Component: GesturesDemo },
  { label: 'Tooltip/Popover', Icon: InfoIcon,            Component: TooltipAndPopoverDemo },
  { label: 'Accesibilidad',   Icon: AccessibilityNewIcon,Component: AccessibilityDemo },
];

export default function TheLab9() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <RocketIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>9</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Command Palette · Onboarding · Skeleton · Gestures · Tooltip · Accesibilidad
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
