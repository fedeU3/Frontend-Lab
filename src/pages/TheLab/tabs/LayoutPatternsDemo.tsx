import { Box, Chip, Divider, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        {subtitle}
      </Typography>
    )}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const CodeBlock = ({ code }: { code: string }) => (
  <Box
    component="pre"
    sx={{
      p: 2,
      backgroundColor: 'background.elevated',
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      fontSize: '0.78rem',
      fontFamily: 'monospace',
      color: 'text.primary',
      overflow: 'auto',
      m: 0,
    }}
  >
    {code}
  </Box>
);

// Visual diagram block
const LayoutBlock = ({
  label,
  height,
  color,
  flex,
  children,
  direction = 'row',
}: {
  label: string;
  height?: number | string;
  color: string;
  flex?: number;
  children?: React.ReactNode;
  direction?: 'row' | 'column';
}) => (
  <Box
    sx={{
      backgroundColor: color,
      border: '1px dashed',
      borderColor: 'divider',
      borderRadius: 0.5,
      display: 'flex',
      flexDirection: direction,
      alignItems: children ? 'stretch' : 'center',
      justifyContent: children ? 'flex-start' : 'center',
      height,
      flex,
      p: children ? 0 : 1,
      overflow: 'hidden',
    }}
  >
    {children ?? (
      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
        {label}
      </Typography>
    )}
  </Box>
);

// ── AppLayout Diagram ──────────────────────────────────────────────────────
function AppLayoutDiagram() {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      {/* AppBar */}
      <LayoutBlock label="AppBar — position='fixed', zIndex: drawer + 1" height={40} color="background.paper" />

      {/* Body */}
      <Box sx={{ display: 'flex', height: 160 }}>
        {/* Drawer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: 56,
            backgroundColor: 'background.default',
            borderRight: '1px dashed',
            borderColor: 'divider',
            alignItems: 'center',
            pt: 1,
            gap: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', writingMode: 'vertical-rl', fontSize: '0.65rem' }}>
            SideDrawer
          </Typography>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ width: 28, height: 4, backgroundColor: 'primary.main', borderRadius: 0.5, opacity: 0.4 }} />
          ))}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <LayoutBlock label="children (page content)" height="100%" color="background.default" flex={1} />
        </Box>
      </Box>

      {/* Footer */}
      <LayoutBlock label="Footer" height={32} color="background.paper" />
    </Box>
  );
}

// ── BaseLayout Diagram ─────────────────────────────────────────────────────
function BaseLayoutDiagram() {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      <LayoutBlock label="AppBar — position='fixed'" height={40} color="background.paper" />
      <LayoutBlock label="children (page content)" height={192} color="background.default" />
    </Box>
  );
}

// ── SideDrawer Diagram ─────────────────────────────────────────────────────
function SideDrawerDiagram() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {/* Closed */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          Collapsed (≈65px)
        </Typography>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            height: 200,
          }}
        >
          <Box
            sx={{
              width: 40,
              backgroundColor: 'background.default',
              borderRight: '1px dashed',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 1.5,
              gap: 2,
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ width: 20, height: 20, backgroundColor: 'primary.main', borderRadius: '50%', opacity: 0.4 }} />
            ))}
          </Box>
          <Box sx={{ flex: 1, backgroundColor: 'background.default' }} />
        </Box>
      </Box>

      {/* Open */}
      <Box sx={{ flex: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
          Expanded (240px) — onMouseEnter
        </Typography>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            height: 200,
          }}
        >
          <Box
            sx={{
              width: 120,
              backgroundColor: 'background.default',
              borderRight: '1px dashed',
              borderColor: 'divider',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            {['Home', 'Pedidos', 'Usuarios', 'The Lab'].map((label) => (
              <Box
                key={label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  p: 0.5,
                  borderRadius: 0.5,
                  backgroundColor: label === 'Home' ? 'primary.main' : 'transparent',
                  opacity: label === 'Home' ? 0.2 : 1,
                }}
              >
                <Box sx={{ width: 12, height: 12, backgroundColor: 'primary.main', borderRadius: '50%', opacity: 0.5, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>{label}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ flex: 1, backgroundColor: 'background.default' }} />
        </Box>
      </Box>
    </Box>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function LayoutPatternsDemo() {
  return (
    <Box>
      {/* ── AppLayout ── */}
      <Section
        title="AppLayout"
        subtitle="Para rutas autenticadas. Compone AppBar + SideDrawer (hover-expand) + contenido principal + Footer. El paddingLeft del contenido se ajusta dinámicamente al estado del drawer."
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Diagrama
            </Typography>
            <Box sx={{ mt: 1 }}>
              <AppLayoutDiagram />
            </Box>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
              {['AppBar', 'SideDrawer', 'Footer', 'children'].map((p) => (
                <Chip key={p} label={p} size="small" variant="outlined" sx={{ fontFamily: 'monospace' }} />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Uso
            </Typography>
            <Box sx={{ mt: 1 }}>
              <CodeBlock
                code={`<AppLayout
  currentPage="Dashboard"
  isAdmin={user.esAdmin}
  isActive={user.activo}
>
  <MiPagina />
</AppLayout>`}
              />
            </Box>

            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
              Props
            </Typography>
            <Box sx={{ mt: 1 }}>
              <CodeBlock
                code={`type AppLayoutProps = {
  children: React.ReactNode;
  currentPage: string;   // título en AppBar
  isAdmin?: boolean;     // muestra items admin
  isActive?: boolean;    // filtra items activeOnly
}`}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              {[
                'SideDrawer se expande al hacer hover (onMouseEnter)',
                'paddingLeft del contenido transiciona suavemente',
                'Footer se oculta en /login y /logout',
                'MenuItems se filtran por adminOnly / activeOnly',
              ].map((note) => (
                <Box key={note} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                  <CheckIcon sx={{ fontSize: 16, color: 'primary.main', mt: 0.2, flexShrink: 0 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {note}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Section>

      {/* ── BaseLayout ── */}
      <Section
        title="BaseLayout"
        subtitle="Para rutas públicas (Login, SignUp). Solo AppBar. Sin drawer ni footer."
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Diagrama
            </Typography>
            <Box sx={{ mt: 1 }}>
              <BaseLayoutDiagram />
            </Box>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Uso
            </Typography>
            <Box sx={{ mt: 1 }}>
              <CodeBlock
                code={`<BaseLayout currentPage="Login">
  <LoginForm />
</BaseLayout>`}
              />
            </Box>

            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mt: 2 }}>
              Props
            </Typography>
            <Box sx={{ mt: 1 }}>
              <CodeBlock
                code={`type BaseLayoutProps = {
  children: React.ReactNode;
  currentPage: string;
}`}
              />
            </Box>
          </Box>
        </Box>
      </Section>

      {/* ── SideDrawer ── */}
      <Section
        title="SideDrawer"
        subtitle="Drawer permanente con mini-variant: colapsado muestra solo íconos, expandido muestra íconos + labels. Se expande en hover, colapsa al salir. El estado vive en AppLayout."
      >
        <Box sx={{ mb: 3 }}>
          <SideDrawerDiagram />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Props
            </Typography>
            <Box sx={{ mt: 1 }}>
              <CodeBlock
                code={`type SideDrawerProps = {
  menuList: MenuList;
  open: boolean;       // controlado por AppLayout
  onToggle: (open: boolean) => void;
}

type MenuList = {
  top: MenuItem[];
  bottom: MenuItem[];
}

type MenuItem = {
  label: string;
  path: string;
  Icon: SvgIconComponent;
  adminOnly?: boolean;
  activeOnly?: boolean;
}`}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Agregar un item al menú
            </Typography>
            <Box sx={{ mt: 1 }}>
              <CodeBlock
                code={`// src/layouts/constants/menuList.ts
import HomeIcon from '@mui/icons-material/Home';

export const menuList: MenuList = {
  top: [
    {
      label: 'Home',
      path: '/',
      Icon: HomeIcon,
    },
    {
      label: 'Admin Panel',
      path: '/admin',
      Icon: AdminIcon,
      adminOnly: true,   // solo si isAdmin=true
    },
  ],
  bottom: [
    {
      label: 'Logout',
      path: '/logout',
      Icon: LogoutIcon,
    },
  ],
};`}
              />
            </Box>
          </Box>
        </Box>
      </Section>

      {/* ── AppBar ── */}
      <Section
        title="AppBar"
        subtitle="Barra de navegación superior. Fija (position='fixed'). zIndex mayor que el drawer. Botones se adaptan al estado de autenticación del usuario."
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Estructura visual
            </Typography>
            <Box
              sx={{
                mt: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', minWidth: 80 }}>
                currentPage
              </Typography>
              <Box sx={{ flex: 1 }} />
              <Stack direction="row" spacing={1}>
                {['Outlined', 'Contained', 'Text'].map((v, i) => (
                  <Box
                    key={v}
                    sx={{
                      px: 1,
                      py: 0.3,
                      borderRadius: 0.5,
                      border: i === 1 ? 'none' : '1px solid',
                      borderColor: 'primary.main',
                      backgroundColor: i === 1 ? 'primary.main' : 'transparent',
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                      {v}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Convenciones de botones
            </Typography>
            <Box sx={{ mt: 1 }}>
              <CodeBlock
                code={`// Acción primaria (CTA)
<Button variant="contained">
  Perfil
</Button>

// Acción secundaria
<Button variant="outlined">
  Alquilar Equipo
</Button>

// Navegación (sin énfasis)
<Button
  variant="text"
  sx={{ color: 'text.primary' }}
>
  Home
</Button>`}
              />
            </Box>
          </Box>
        </Box>
      </Section>
    </Box>
  );
}
