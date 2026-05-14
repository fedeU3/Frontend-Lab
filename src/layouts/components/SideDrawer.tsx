import { Drawer as MuiDrawer } from '@mui/material'
import { styled, Theme, CSSObject } from '@mui/material/styles';
import React from 'react'
import DrawerList from './DrawerList'
import { MenuList } from '../types/MenuList';

type SideDrawerProps = {
  menuList: MenuList;
  open: boolean;
  onToggle: (open: boolean) => void;
}

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  zIndex: theme.zIndex.appBar - 1,
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

const SideDrawer: React.FC<SideDrawerProps> = ({ menuList, open, onToggle }) => {
  const toggleDrawer = (newOpen: boolean) => () => {
    onToggle(newOpen);
  };

  return (
    <Drawer
      variant='permanent'
      open={open}
      onMouseEnter={toggleDrawer(true)}
      onMouseLeave={toggleDrawer(false)}
    >
      <DrawerList menuList={menuList} expanded={open} toggleDrawer={toggleDrawer} />
    </Drawer>
  )
}

export default SideDrawer
