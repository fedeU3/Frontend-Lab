import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    elevated: string;
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default:  '#080808', // SideDrawer, gradiente en Login/SignUp/Home
      paper:    '#2C3E50', // AppBar, Footer, Cards, Dialogs, gradiente en Login/SignUp/Home
      elevated: '#151E26', // Inputs, paneles de código, filas de tabla, zonas de drop en todos los Labs
    },
    text: {
      primary:   '#B0BEC5', // AppBar, headings, body text y labels en todos los Labs
      secondary: '#78909C', // Subtítulos, captions, helper text y placeholders en todos los Labs
    },
    primary: {
      main:         '#FF7043', // Botones, bordes de inputs, Checkboxes, hover del SideDrawer, Avatars y acento en todos los Labs
      dark:         '#E64A19', // Hover de borde en inputs, hover de botón outlined en Login/SignUp
      contrastText: '#080808', // Texto sobre botones contained y Avatars con bgcolor primary
    },
    secondary: {
      main:         '#E64A19', // Solo vía MUI interno — color="secondary" en IconButton de MutationsDemo
      contrastText: '#080808', // Texto sobre elementos con bgcolor secondary
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiCard: { // Todas las Cards del proyecto
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: '1rem',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }),
      },
    },
    MuiTextField: { // Todos los inputs del proyecto
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.elevated,
          borderRadius: '0.5rem',
          '& .MuiOutlinedInput-root': { color: theme.palette.text.primary },
          '& .MuiInputLabel-root': { color: theme.palette.text.primary },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.dark },
        }),
      },
    },
    MuiCheckbox: { // Todos los checkboxes del proyecto
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          '&.Mui-checked': { color: theme.palette.primary.main },
        }),
      },
    },
    MuiListItemButton: { // Items del SideDrawer
      styleOverrides: {
        root: ({ theme }) => ({
          '&:hover':    { backgroundColor: `${theme.palette.primary.main}1A` }, // 10% opacidad
          '&.Mui-selected': { backgroundColor: `${theme.palette.primary.main}26` }, // 15% opacidad
        }),
      },
    },
    MuiListItemIcon: { // Íconos del SideDrawer
      styleOverrides: {
        root: ({ theme }) => ({ color: theme.palette.text.primary }),
      },
    },
    MuiDivider: { // Todos los Dividers del proyecto
      styleOverrides: {
        root: ({ theme }) => ({ borderColor: `${theme.palette.text.primary}33` }), // 20% opacidad
      },
    },
  },
});

export default theme;
