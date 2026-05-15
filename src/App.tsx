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
import TheLab5 from './pages/TheLab5';
import TheLab6 from './pages/TheLab6';
import TheLab7 from './pages/TheLab7';
import TheLab8 from './pages/TheLab8';
import TheLab9 from './pages/TheLab9';
import TheLab10 from './pages/TheLab10';
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
        <Route path={ROUTES.theLab5.path} element={<TheLab5 />} />
        <Route path={ROUTES.theLab6.path} element={<TheLab6 />} />
        <Route path={ROUTES.theLab7.path} element={<TheLab7 />} />
        <Route path={ROUTES.theLab8.path} element={<TheLab8 />} />
        <Route path={ROUTES.theLab9.path} element={<TheLab9 />} />
        <Route path={ROUTES.theLab10.path} element={<TheLab10 />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
