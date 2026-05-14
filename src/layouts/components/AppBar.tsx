import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';
import { useAuthContext } from '../../lib/hooks/contextHooks/useAuthContext';

type NavBarProps = {
  goTo: (path: string) => () => void;
  currentPage: string;
};

const NavBar: React.FC<NavBarProps> = ({ goTo, currentPage }) => {
  const { user } = useAuthContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: 'background.paper', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="div">
              {currentPage}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <Button
                  onClick={goTo('/equipo')}
                  variant="outlined"
                  size="small"
                >
                  Alquilar Equipo
                </Button>
                <Button
                  onClick={goTo('/')}
                  variant="text"
                  size="small"
                  sx={{ color: 'text.primary' }}
                >
                  Home
                </Button>
                <Button
                  onClick={goTo('/clientes')}
                  variant="text"
                  size="small"
                  sx={{ color: 'text.primary' }}
                >
                  Clientes
                </Button>
                <Button
                  onClick={goTo('/pedidos')}
                  variant="text"
                  size="small"
                  sx={{ color: 'text.primary' }}
                >
                  Pedidos
                </Button>
                {user.esAdmin && (
                  <Button
                    onClick={goTo('/MisPedidos')}
                    variant="text"
                    size="small"
                    sx={{ color: 'text.primary' }}
                  >
                    Mis pedidos
                  </Button>
                )}
                <Button
                  onClick={goTo('/usuario')}
                  variant="contained"
                  size="small"
                >
                  Perfil
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={goTo('/equipo')}
                  variant="outlined"
                  size="small"
                >
                  Alquilar Equipo
                </Button>
                <Button
                  onClick={goTo('/login')}
                  variant="contained"
                  size="small"
                >
                  Login
                </Button>
                <Button
                  onClick={goTo('/signup')}
                  variant="outlined"
                  size="small"
                >
                  Sign up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
