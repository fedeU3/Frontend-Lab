import { Box, Button, TextField, Typography, Card, CardContent, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../lib/hooks/contextHooks/useAuthContext';
import { SignUpFormType } from '../../lib/types/forms/SignUpForm';

type SignUpProps = {};

const SignUp: React.FC<SignUpProps> = () => {
  const { signUp } = useAuthContext();
  const {
    handleSubmit,
    register,
  } = useForm<SignUpFormType>({
    defaultValues: {
      userID: '',
      password: '',
      name: '',
      confirmPassword: '',
      acceptTerms: false,
    }
  });

  return (
    <Box
      sx={(theme) => ({
        background: `linear-gradient(to bottom, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      })}
    >
      <Card sx={{ width: '25rem', padding: '2rem' }}>
        <CardContent>
          <Typography variant='h4' align='center' gutterBottom>
            Sign Up
          </Typography>
          <Box
            component={'form'}
            onSubmit={handleSubmit(signUp)}
            sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <TextField
              label='Email'
              variant='outlined'
              fullWidth
              {...register('userID', { required: true })}
            />
            <TextField
              label='Name'
              variant='outlined'
              fullWidth
              {...register('name', { required: true })}
            />
            <TextField
              label='Password'
              variant='outlined'
              type='password'
              fullWidth
              {...register('password', { required: true })}
            />
            <TextField
              label='Confirm Password'
              variant='outlined'
              type='password'
              fullWidth
              {...register('confirmPassword', { required: true })}
            />

            <FormControlLabel
              control={<Checkbox {...register('acceptTerms', { required: true })} />}
              label={
                <Typography variant='body2'>
                  Acepto los términos y condiciones
                </Typography>
              }
            />

            <Button variant='contained' type='submit' sx={{ fontWeight: 'bold' }}>
              Sign Up
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
              onClick={() => {
                console.log('Redirigir a la página de términos y condiciones');
              }}
            >
              Términos y condiciones
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignUp;
