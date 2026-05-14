import { Logout, Home, Group, MenuBook, Science, Biotech, Rocket } from '@mui/icons-material'
import { MenuItem, MenuList } from '../types/MenuList'

export const menuList: MenuList = {
  top: [
    { label: 'Home', path: '/', Icon: Home},
    { label: 'Miembros', path: '/miembros', Icon: Group},
    { label: 'Books', path: '/books', Icon: MenuBook},
    { label: 'Usuario', path: '/usuario', Icon: MenuBook},
    { label: 'MisPedidos', path: '/MisPedidos', Icon: MenuBook},
    { label: 'The Lab', path: '/the-lab', Icon: MenuBook },
    { label: 'The Lab 2', path: '/the-lab-2', Icon: Science },
    { label: 'The Lab 3', path: '/the-lab-3', Icon: Biotech },
    { label: 'The Lab 4', path: '/the-lab-4', Icon: Rocket },
  ],
  bottom: [
    { label: 'Log Out', path: '/logout', Icon: Logout },
  ],
}

export const menuListMap: Record<string, MenuItem> = menuList.top.reduce((acc, item) => ({ ...acc, [item.path]: item }), {})