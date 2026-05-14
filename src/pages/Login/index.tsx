import { Box, Button, TextField, Typography, Card, CardContent, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../lib/hooks/contextHooks/useAuthContext';
import { LogInFormType } from '../../lib/types/forms/LoginForm';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const { login } = useAuthContext();
  const {
    handleSubmit,
    register,
  } = useForm<LogInFormType>({
    defaultValues: {
      userID: '',
      password: '',
      rememberMe: false,
    }
  });

  return (
    <Box
      sx={(theme) => ({
        background: `linear-gradient(to bottom, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
        minHeight: '100vh',
        color: 'text.primary',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      })}
    >
      <Card sx={{ width: '25rem', padding: '2rem' }}>
        <CardContent>
          <Typography variant='h4' align='center' gutterBottom>
            Login
          </Typography>
          <Box
            component={'form'}
            onSubmit={handleSubmit(login)}
            sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <TextField
              label='Email'
              variant='outlined'
              fullWidth
              {...register('userID', { required: true })}
            />
            <TextField
              label='Password'
              variant='outlined'
              type='password'
              fullWidth
              {...register('password', { required: true })}
            />

            <FormControlLabel
              control={<Checkbox {...register('rememberMe')} />}
              label="Recuérdame"
            />

            <Button variant='contained' type='submit' sx={{ fontWeight: 'bold' }}>
              Login
            </Button>

            <Typography
              variant='body2'
              align='center'
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': { color: 'primary.dark' },
              }}
            >
              ¿Olvidaste tu contraseña?
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
