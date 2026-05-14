import { Route, Routes } from 'react-router';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Books from './pages/Books';
import Miembros from './pages/Miembros';
import Users from './pages/Usuarios';
import Logout from './pages/Logout';
import MyOrders from './pages/MisPedidos';
import CreateOrder from './pages/CrearPedidos';
import TheLab from './pages/TheLab';
import TheLab2 from './pages/TheLab2';
import TheLab3 from './pages/TheLab3';
import TheLab4 from './pages/TheLab4';
import { ROUTES } from './lib/constants/routes';
import theme from './theme'; 
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path={ROUTES.home.path} element={<Home />} />
        <Route path={ROUTES.login.path} element={<Login />} />
        <Route path={ROUTES.signup.path} element={<SignUp />} />
        <Route path={ROUTES.books.path} element={<Books />} />
        <Route path={ROUTES.logout.path} element={<Logout />} />
        <Route path={ROUTES.usuarios.path} element={<Users />} />
        <Route path={ROUTES.miembros.path} element={<Miembros />} />
        <Route path={ROUTES.MisPedidos.path} element={<MyOrders />} />
        <Route path={ROUTES.createOrders.path} element={<CreateOrder />} />
        <Route path={ROUTES.theLab.path} element={<TheLab />} />
        <Route path={ROUTES.theLab2.path} element={<TheLab2 />} />
        <Route path={ROUTES.theLab3.path} element={<TheLab3 />} />
        <Route path={ROUTES.theLab4.path} element={<TheLab4 />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
