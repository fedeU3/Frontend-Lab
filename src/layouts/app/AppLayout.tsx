import React, { useMemo } from 'react';
import NavBar from '../components/AppBar';
import SideDrawer from '../components/SideDrawer';
import Footer from '../components/Footer';
import { Box } from '@mui/material';
import { menuList } from '../constants/menuList';
import { useNavigate, useLocation } from 'react-router';
import { useAuthContext } from '../../lib/hooks/contextHooks/useAuthContext';

const DRAWER_OPEN_WIDTH = 240;

type AppLayoutProps = {
  children: React.ReactNode;
  currentPage: string;
  isAdmin?: boolean;
  isActive?: boolean;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPage, isAdmin, isActive }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const goTo = (url: string) => () => {
    navigate(url);
  };

  const menuItems = useMemo(() => {
    if (isAdmin) {
      return { ...menuList };
    }
    if (isActive) {
      return {
        top: menuList.top.filter(item => !item.adminOnly),
        bottom: menuList.bottom.filter(item => !item.adminOnly),
      };
    }
    return {
      top: menuList.top.filter(item => !item.adminOnly && !item.activeOnly),
      bottom: menuList.bottom.filter(item => !item.adminOnly && !item.activeOnly),
    };
  }, [isAdmin]);

  return (
    <Box id="layout">
      <NavBar currentPage={currentPage} goTo={goTo} />
      <SideDrawer menuList={menuItems} open={drawerOpen} onToggle={setDrawerOpen} />
      <Box
        sx={(theme) => ({
          paddingTop: '65px',
          paddingLeft: drawerOpen
            ? `${DRAWER_OPEN_WIDTH}px`
            : `calc(${theme.spacing(8)} + 1px)`,
          transition: theme.transitions.create('padding-left', {
            easing: theme.transitions.easing.sharp,
            duration: drawerOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        {children}
        {!['/login', '/logout'].includes(location.pathname) && <Footer />}
      </Box>
    </Box>
  );
};

export default AppLayout;
