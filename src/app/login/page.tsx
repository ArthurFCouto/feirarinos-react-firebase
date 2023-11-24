'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  Alert, AlertTitle, Avatar, Box,
  Button, CircularProgress, Container, CssBaseline,
  FormControl, Grid, IconButton,
  InputAdornment, InputLabel, Link as MLink,
  OutlinedInput, TextField, Typography
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { Footer } from '@/components/ui';
import firebase, { messageError } from '../../config/firebase';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<string | false>(false);
  const router = useRouter();
  const labelPassword = 'Senha'
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setAlert(false);
    setLoading(true);
    try {
      const data = new FormData(event.currentTarget);
      const email = String(data.get('email'));
      const password = String(data.get('password'));
      const auth = getAuth(firebase);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const { user } = userCredential;
          router.push('/busca');
        })
        .catch((error) => {
          const { code, message } = error;
          setAlert(messageError(code));
          setLoading(false);
        });
    } catch (error) {
      console.log('Firebase Error', error);
      setAlert('Tivemos um erro no servidor. Tente mais tarde.');
      setLoading(false);
    }
  };

  return (
    <>
      <Box display='flex' flexDirection='column' height='100%'>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <Box
            alignItems='center'
            display='flex'
            flexDirection='column'
            marginTop={10}
          >
            <MLink
              component={Link}
              color='inherit'
              href='/'
              title='Ir para página inicial'
            >
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  height: 55,
                  margin: 1,
                  width: 55
                }}
              >
                <LockOutlined fontSize='large' />
              </Avatar>
            </MLink>
            <Typography component='h1' variant='h5'>
              Acesse sua Conta
            </Typography>
            <Box component='form' marginTop={5} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete='email'
                    autoFocus
                    fullWidth
                    id='email'
                    label='E-mail'
                    name='email'
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ width: '100%' }} variant='outlined'>
                    <InputLabel htmlFor='password'>{labelPassword}</InputLabel>
                    <OutlinedInput
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='Alterar visibilidade da senha'
                            onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
                            edge='end'
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      id='password'
                      label={labelPassword}
                      name='password'
                      required
                      type={showPassword ? 'text' : 'password'}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                fullWidth
                size='large'
                sx={{ marginY: 2 }}
                type='submit'
                variant='contained'
              >
                Entrar
              </Button>
              <Grid container>
                <Grid display='flex' justifyContent='flex-end' item xs={12}>
                  <MLink component={Link} href='signIn' variant='body2' >
                    Não sou cadastrado
                  </MLink>
                </Grid>
                {
                  loading && (
                    <Grid display='flex' item justifyContent='center' xs={12}>
                      <CircularProgress />
                    </Grid>
                  )
                }
                {
                  alert && (
                    <Grid display='flex' item xs={12}>
                      <Alert severity='error' sx={{ marginTop: 2, width: '100%' }}>
                        <AlertTitle>Ops!</AlertTitle>
                        {alert}
                      </Alert>
                    </Grid>
                  )
                }
              </Grid>
            </Box>
          </Box>
        </Container >
        <Footer />
      </Box>
    </>
  );
}