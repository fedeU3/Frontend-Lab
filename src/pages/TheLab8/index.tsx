import { Box, Tab, Tabs, Typography } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BrushIcon from '@mui/icons-material/Brush';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import TuneIcon from '@mui/icons-material/Tune';
import { useState } from 'react';

import TiptapDemo from './tabs/TiptapDemo';
import CanvasDemo from './tabs/CanvasDemo';
import PDFExportDemo from './tabs/PDFExportDemo';
import CSVExportDemo from './tabs/CSVExportDemo';
import QRCodeDemo from './tabs/QRCodeDemo';
import ImageEditorDemo from './tabs/ImageEditorDemo';

function TabPanel({ value, index, children }: { value: number; index: number; children: React.ReactNode }) {
  return value === index ? <Box sx={{ pt: 4 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'Tiptap',       Icon: EditNoteIcon,    Component: TiptapDemo },
  { label: 'Canvas',       Icon: BrushIcon,       Component: CanvasDemo },
  { label: 'PDF Export',   Icon: PictureAsPdfIcon,Component: PDFExportDemo },
  { label: 'CSV Export',   Icon: GridOnIcon,      Component: CSVExportDemo },
  { label: 'QR Code',      Icon: QrCode2Icon,     Component: QRCodeDemo },
  { label: 'Image Editor', Icon: TuneIcon,        Component: ImageEditorDemo },
];

export default function TheLab8() {
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <RocketIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
            The Lab <Typography component="span" variant="h4" sx={{ color: 'primary.main' }}>8</Typography>
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tiptap · Canvas · PDF · CSV · QR Code · Image Editor
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
