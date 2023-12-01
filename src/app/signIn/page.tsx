'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  Alert, Avatar, Box, Container,
  CssBaseline, IconButton, Link as MLink, Typography,
  Step, Stepper, Snackbar, LinearProgress
} from '@mui/material';
import { AccountBox, Close } from '@mui/icons-material';
import { Footer } from '@/components/ui';
import { CustomObject, FormUser, FormMarket, FormProduct, CustomUserForm, CustomMarketForm } from '@/components/signIn';
import firebase, { Market, CustomUser, messageError } from '@/config/firebase';

interface PropsAlert {
  color: 'success' | 'info' | 'warning' | 'error',
  open: boolean,
  message: string
}

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Market | {}>({});
  const [activeStep, setActiveStep] = useState(-1);
  const [categoryProducts, setCategoryProducts] = useState<Array<CustomObject>>([]);
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
  const handleFormUser = (customUserForm: CustomUserForm) => {
    if (customUserForm.password.length < 6) {
      setAlert({
        color: 'error',
        open: true,
        message: 'A senha deve ter no mínimo 6 dígitos.'
      })
      return;
    }
    if (customUserForm.password !== customUserForm.passwordConfirm) {
      setAlert({
        color: 'warning',
        open: true,
        message: 'As senhas digitadas não conferem'
      })
      return;
    }
    setUser((prevUser) => ({
      ...prevUser,
      ...customUserForm,
    }));
    setAlert((prevAlert) => ({ ...prevAlert, open: false }));
    nextStep();
  };
  const handleFormMarket = (customMarketForm: CustomMarketForm) => {
    if (customMarketForm.daysWorking.length === 0) {
      setAlert({
        color: 'warning',
        open: true,
        message: 'Favor informar os dias em que você realiza vendas.'
      });
      return;
    }
    setUser((prevUser) => ({
      ...prevUser,
      ...customMarketForm
    }));
    setAlert((prevAlert) => ({ ...prevAlert, open: false }));
    nextStep();
  };
  const handleFormProducts = (customProductsForm: Array<string>) => {
    if (customProductsForm.length === 0) {
      setAlert({
        color: 'warning',
        open: true,
        message: 'Favor selecionar ao menos um produto para venda.'
      });
      return;
    }
    setAlert({
      color: 'info',
      open: true,
      message: 'Enviando dados, aguarde...'
    })
    registerUser(customProductsForm);
  }
  const registerUser = async (products: Array<string>) => {
    if (loading)
      return;
    setLoading(true);
    const { email, password } = user as CustomUser;
    const auth = getAuth(firebase);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setAlert({
          color: 'info',
          open: true,
          message: 'Usuário criado! Cadastrando banca...'
        })
        const { user } = userCredential;
        registerMarket(user.uid, products)
      })
      .catch((error) => {
        handleError(error);
      });
  }
  const registerMarket = async (userID: string, products: Array<string>) => {
    const { card, customName, daysWorking, delivery, location, name, phone, pix } = user as Market;
    const db = getFirestore(firebase);
    await addDoc(collection(db, 'banca'), { card, customName, daysWorking, delivery, location, phone, pix, products, userID })
      .then(() => {
        setAlert({
          color: 'success',
          open: true,
          message: 'Cadastro finalizado! Redirecionando...'
        });
        router.push('/busca');
      })
      .catch((error: any) => {
        handleError(error);
      });
  }
  const handleError = (error: any) => {
    const { code, message } = error;
    setAlert({
      color: 'error',
      open: true,
      message: messageError(code)
    });
    setLoading(false);
  }
  const getCategoryProducts = async () => {
    setLoading(true);
    const categorias: Array<string> = [];
    const produtos: Array<string> = [];
    const db = getFirestore(firebase);
    const querySnapshot = await getDocs(collection(db, 'produtos'));
    querySnapshot.forEach((doc) => {
      const indexOf = doc.data().name.indexOf('-');
      categorias.push(doc.data().name.slice(0, indexOf));
      produtos.push(doc.data().name);
    });
    if (categorias.length === 0) {
      setAlert({
        color: 'error',
        open: true,
        message: 'Houve um erro ao conectar com o servidor, tente mais tarde.'
      });
      setLoading(false);
      return;
    }
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
    setActiveStep(0);
    setLoading(false);
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
                <FormUser onSubmitUser={handleFormUser} />
              </Step>
              <Step>
                <FormMarket onSubmitMarket={handleFormMarket} previousStep={previousStep} />
              </Step>
              <Step>
                <FormProduct categoryProducts={categoryProducts} onSubmitProducts={handleFormProducts} previousStep={previousStep} />
              </Step>
            </Stepper>
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