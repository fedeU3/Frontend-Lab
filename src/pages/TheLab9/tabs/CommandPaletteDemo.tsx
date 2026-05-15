import { Box, Chip, Divider, Modal, Paper, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Command } from 'cmdk';
import { useEffect, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const COMMANDS = [
  { group: 'Navegación', items: [
    { label: 'Ir a Home', icon: <HomeIcon fontSize="small" />, shortcut: 'G H' },
    { label: 'The Lab 5 — State', icon: <ScienceIcon fontSize="small" />, shortcut: 'G 5' },
    { label: 'The Lab 6 — Performance', icon: <ScienceIcon fontSize="small" />, shortcut: 'G 6' },
  ]},
  { group: 'Acciones', items: [
    { label: 'Buscar en el proyecto', icon: <SearchIcon fontSize="small" />, shortcut: 'Ctrl P' },
    { label: 'Abrir configuración', icon: <SettingsIcon fontSize="small" />, shortcut: 'G S' },
  ]},
  { group: 'Usuario', items: [
    { label: 'Ver perfil', icon: <PersonIcon fontSize="small" />, shortcut: '' },
    { label: 'Cerrar sesión', icon: <LogoutIcon fontSize="small" />, shortcut: '' },
  ]},
];

const paletteStyles: React.CSSProperties = {
  background: 'transparent',
  width: '100%',
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: '#B0BEC5',
  fontSize: '1rem',
  fontFamily: 'inherit',
};

const listStyles: React.CSSProperties = {
  maxHeight: 360,
  overflowY: 'auto',
};

const groupStyles: React.CSSProperties = {
  padding: '4px 0',
};

function CommandItem({ label, icon, shortcut, onSelect }: { label: string; icon: React.ReactNode; shortcut: string; onSelect: () => void }) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 16px',
        cursor: 'pointer',
        borderRadius: 4,
        margin: '1px 8px',
        color: '#B0BEC5',
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255,112,67,0.12)'; (e.currentTarget as HTMLDivElement).style.color = '#FF7043'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'; (e.currentTarget as HTMLDivElement).style.color = '#B0BEC5'; }}
    >
      <Box sx={{ color: 'inherit', display: 'flex' }}>{icon}</Box>
      <Typography variant="body2" sx={{ flex: 1, color: 'inherit' }}>{label}</Typography>
      {shortcut && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.7rem' }}>
          {shortcut}
        </Typography>
      )}
    </Command.Item>
  );
}

export default function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSelect = (label: string) => {
    setSelected(label);
    setOpen(false);
  };

  return (
    <Box>
      <Section
        title="Command Palette con cmdk"
        subtitle="Ctrl+K / Cmd+K para abrir. Búsqueda filtrada, grupos, atajos de teclado. cmdk es headless — la UI la ponés vos."
      >
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box
            onClick={() => setOpen(true)}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              px: 2, py: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider',
              backgroundColor: 'background.elevated', cursor: 'pointer',
              '&:hover': { borderColor: 'primary.main' },
              transition: 'border-color 0.2s',
              minWidth: 280,
            }}
          >
            <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>Buscar comandos…</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Chip label="Ctrl" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
              <Chip label="K" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
            </Box>
          </Box>
          {selected && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Último comando: <strong style={{ color: '#FF7043' }}>{selected}</strong>
            </Typography>
          )}
        </Box>

        <Modal open={open} onClose={() => setOpen(false)} closeAfterTransition>
          <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', pt: '15vh' }}>
            <Paper elevation={12} sx={{ width: 560, borderRadius: 2, overflow: 'hidden', backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Command style={paletteStyles} label="Command Palette">
                <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', px: 1 }}>
                  <SearchIcon sx={{ color: 'text.secondary', mx: 1, flexShrink: 0 }} />
                  <Command.Input placeholder="Escribí un comando…" style={inputStyles} />
                </Box>
                <Command.List style={listStyles}>
                  <Command.Empty style={{ padding: '24px 16px', textAlign: 'center', color: '#78909C', fontSize: '0.875rem' }}>
                    No se encontraron comandos.
                  </Command.Empty>
                  {COMMANDS.map(({ group, items }) => (
                    <Command.Group
                      key={group}
                      heading={group}
                      style={groupStyles}
                    >
                      <Box sx={{ px: 2, py: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {group}
                        </Typography>
                      </Box>
                      {items.map((item) => (
                        <CommandItem key={item.label} {...item} onSelect={() => handleSelect(item.label)} />
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>
                <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>↑↓ navegar</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>↵ seleccionar</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Esc cerrar</Typography>
                </Box>
              </Command>
            </Paper>
          </Box>
        </Modal>
      </Section>

      <Section title="Uso básico de cmdk">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`import { Command } from 'cmdk';

<Command label="Command Palette">
  <Command.Input placeholder="Buscar…" />
  <Command.List>
    <Command.Empty>Sin resultados.</Command.Empty>
    <Command.Group heading="Navegación">
      <Command.Item onSelect={() => navigate('/')}>
        Home
      </Command.Item>
    </Command.Group>
    <Command.Separator />
  </Command.List>
</Command>

// Abrir con atajo de teclado:
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
