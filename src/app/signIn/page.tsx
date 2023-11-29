'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  Alert, Avatar, Box, Button, Container,
  CssBaseline, IconButton, Link as MLink, Typography,
  Paper, Step, Stepper, Snackbar, LinearProgress, Stack
} from '@mui/material';
import { AccountBox, Close } from '@mui/icons-material';
import { Footer } from '@/components/ui';
import { CustomObject, FormUser, FormMarket, FormProduct } from '@/components/signIn';
import firebase, { CustomUser, Market } from '@/config/firebase';

interface PropsAlert {
  color: 'success' | 'info' | 'warning' | 'error',
  open: boolean,
  message: string
}

export default function SignIn() {
  const router = useRouter();
  const [user, setUser] = useState<CustomUser | {}>({});
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [alert, setAlert] = useState<PropsAlert>({
    color: 'info',
    open: false,
    message: ''
  });
  const closeAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert((prevAlert) => ({ ...prevAlert, open: false }))
  };
  const nextStep = () => { setActiveStep((prevActiveStep) => prevActiveStep + 1) };
  const previousStep = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1) };
  const handleFormUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (String(data.get('password')).length < 6) {
      setAlert({
        color: 'error',
        open: true,
        message: 'A senha deve ter no mínimo 6 dígitos.'
      })
      return;
    }
    if (data.get('password') !== data.get('passwordConfirm')) {
      setAlert({
        color: 'warning',
        open: true,
        message: 'As senhas digitadas não conferem'
      })
      return;
    }
    setUser((prevUser) => ({
      ...prevUser,
      name: data.get('name'),
      email: data.get('email'),
      phone: parseInt(String(data.get('phone')).replace(/[^0-9]/g, '')),
      location: data.get('location'),
      password: data.get('password'),
    }));
    setAlert((prevAlert) => ({ ...prevAlert, open: false }));
    nextStep();
  };
  const handleSecondStep = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (String(data.get('daysWorking')).length === 0) {
      setAlert({
        color: 'warning',
        open: true,
        message: 'Favor informar os dias em que você realiza vendas.'
      });
      return;
    }
    setUser((prevUser) => ({
      ...prevUser,
      customName: data.get('customName'),
      delivery: data.get('delivery') == 'on',
      money: data.get('money') == 'on',
      pix: data.get('pix') == 'on',
      card: data.get('card') == 'on',
      daysWorking: data.get('daysWorking'),
    }));
    nextStep();
  };
  const handleThirdStep = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const options: string[] = [];
    for (const pair of data.entries()) {
      if (pair[1] === 'on')
        options.push(pair[0]);
    }
    setUser((prevUser) => ({
      ...prevUser,
      products: options
    }));
    setLoading(true);
    setAlert({
      color: 'info',
      open: true,
      message: 'Enviando dados, aguarde...'
    })
    setTimeout(() => { handleRegister() }, 3000);
    //nextStep();
  };
  const handleRegister = () => {
    if (loading)
      return;
    setLoading(true);
    try {
      const { card, customName, daysWorking, delivery, email, location, name, password, phone, pix, products } = user as CustomUser;
      const auth = getAuth(firebase);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setAlert({
            color: 'info',
            open: true,
            message: 'Usuário criado! Cadastrando banca...'
          })
          const { user } = userCredential;
          createMarket(user.uid)
        })
        .catch((error) => {
          const { code, message } = error;
          setAlert({
            color: 'error',
            open: true,
            message: message
          });
          setLoading(false);
        });
      const createMarket = async (uid: string) => {
        const db = getFirestore(firebase);
        await addDoc(collection(db, 'banca'), { card, customName, daysWorking, delivery, location, phone, pix, products, userID: uid })
          .then(() => {
            setAlert({
              color: 'success',
              open: true,
              message: 'Cadastro finalizado! Redirecionando...'
            });
            router.push('/busca');
          })
          .catch((error: any) => {
            setAlert({
              color: 'error',
              open: true,
              message: error.message
            });
          })
          .finally(() => {
            setLoading(false);
          })
      }
    } catch (error: any) {
      const { code, message } = error;
      setAlert({
        color: 'error',
        open: true,
        message: message
      });
      setLoading(false);
    };
  }
  const [categoryProducts, setCategoryProducts] = useState<Array<CustomObject>>([]);
  const getCategoryProducts = async () => {
    setLoading(true);
    const categorias: string[] = [];
    const produtos: string[] = [];
    const db = getFirestore(firebase);
    const querySnapshot = await getDocs(collection(db, 'produtos'));
    querySnapshot.forEach((doc) => {
      const indexOf = doc.data().name.indexOf('-');
      categorias.push(doc.data().name.slice(0, indexOf));
      produtos.push(doc.data().name);
    });
    const listCategoryProducts: Array<CustomObject> = [...new Set(categorias)].map((categoria) => {
      return {
        categoria,
        produtos: []
      }
    });
    produtos.forEach((produto) => {
      const indexOf = produto.indexOf('-');
      const prefix = produto.slice(0, indexOf);
      const suffix = produto.slice(indexOf + 1);
      listCategoryProducts.forEach((item) => {
        if (item.categoria === prefix) {
          item.produtos.push(suffix);
          return;
        }
      })
    })
    setCategoryProducts(listCategoryProducts);
    setLoading(false);
    /*
    Abaixo o código para montar o objeto que contem a lista de categoria e produtos
    setloading(true);
    const data: any = new Object();
    const db = getFirestore(firebase);
    const querySnapshot = await getDocs(collection(db, 'produtos'));
    querySnapshot.forEach((doc) => {
      const indexOf = doc.data().name.indexOf('-');
      if (!data[doc.data().name.slice(0, indexOf)])
        data[doc.data().name.slice(0, indexOf)] = [];
      data[doc.data().name.slice(0, indexOf)].push(doc.data().name.slice(indexOf + 1));
    });
    console.log('Data', data);
    setloading(false)
    */
  }
  useEffect(() => { getCategoryProducts() }, [])

  return (
    <Box display='flex' flexDirection='column' height='100%'>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={closeAlert}
        open={alert.open}
      >
        <Alert
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              onClick={closeAlert}
              size='small'
            >
              <Close fontSize='inherit' />
            </IconButton>
          }
          severity={alert.color}
          sx={{ marginBottom: 2 }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Container component='main' maxWidth='sm'>
        <CssBaseline />
        <Box
          alignItems='center'
          display='flex'
          flexDirection='column'
          marginTop={3}
        >
          <MLink
            component={Link}
            color='inherit'
            href='/'
            title='Página inicial'
          >
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                height: 55,
                margin: 1,
                width: 55
              }}
            >
              <AccountBox fontSize='large' />
            </Avatar>
          </MLink>
          <Typography component='h1' variant='h5'>
            Cadastre-se
          </Typography>
          <Box marginTop={3} width='100%'>
            <Stepper activeStep={activeStep} orientation='vertical'>
              <Step>
                <FormUser onSubmit={handleFormUser} />
              </Step>
              <Step>
                <FormMarket onSubmit={handleSecondStep} previousStep={previousStep} />
              </Step>
              <Step>
                <FormProduct categoryProducts={categoryProducts} nextStep={nextStep} onSubmit={handleThirdStep} previousStep={previousStep} />
              </Step>
            </Stepper>
            {
              activeStep === 3 && (
                <Paper square elevation={0} sx={{ padding: 3 }}>
                  <Typography>Todas as informações foram preenchidas, clique abaixo para finalizar.</Typography>
                  <Stack flexDirection='row' gap={1} justifyContent='flex-end' padding={1}>
                    <Button onClick={previousStep}>
                      Voltar
                    </Button>
                    <Button onClick={handleRegister} variant='contained'>
                      Cadastrar
                    </Button>
                  </Stack>
                </Paper>
              )
            }
            {
              loading && <LinearProgress />
            }
          </Box>
        </Box>
      </Container >
      <Footer />
    </Box>
  );
}