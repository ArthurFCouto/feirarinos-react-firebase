'use client';
import Image from 'next/image';
import { Footer } from '@/components/ui';
import {
  Box, Button, CssBaseline, Divider,
  Grid, IconButton, InputBase, Paper,
  Stack, Typography, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import logo from './favicon.ico';
import { AccountCircle, LocationOn, ManageSearch, Search } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Player } from '@lottiefiles/react-lottie-player';
import connection from '../util/lottiefiles/connection.json';

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const sizeImage = smDownScreen ? 20 : 40;

  return (
    <>
      <CssBaseline />
      <Stack
        alignItems='center'
        flexDirection='row'
        justifyContent='space-between'
        padding={3}
      >
        <Box
          alignItems='center'
          display='flex'
          flexDirection='row'
          sx={{ cursor: 'default' }}
        >
          <Image
            alt='Logo'
            src={logo}
            height={sizeImage}
            width={sizeImage}
          />
          <Typography
            component='h1'
            fontWeight='bold'
            ml={1}
            variant={smDownScreen ? 'h5' : 'h4'}
            sx={{ textShadow: '-1px -1px 1px #909090' }}
          >
            FeirArinos
          </Typography>
        </Box>
        <Box
          alignItems='center'
          display='flex'
          flexDirection='row'
          gap={1}
        >
          {
            smDownScreen ? (
              <Box>
                <IconButton color='secondary' size='large' sx={{ marginRight: 1 }}>
                  <LocationOn />
                </IconButton>
                <IconButton color='secondary' href='/busca' sx={{ marginRight: 1 }}>
                  <ManageSearch />
                </IconButton>
                <IconButton color='info' href='/login'>
                  <AccountCircle />
                </IconButton>
              </Box>
            ) : (
              <Box>
                <Button color='secondary' startIcon={<LocationOn />} sx={{ marginRight: 2 }} variant='text'>
                  Arinos MG
                </Button>
                <Button color='secondary' href='/busca' startIcon={<ManageSearch />} sx={{ marginRight: 2 }} variant='text'>
                  Buscar
                </Button>
                <Button color='info' href='/login' startIcon={<AccountCircle />} variant='contained'>
                  Area Feirante
                </Button>
              </Box>
            )
          }
        </Box>
      </Stack >
      <Grid container>
        <Grid
          color='white'
          display='flex'
          height='calc(100vh - 90px)'
          item
          paddingX={3}
          sx={{
            backgroundImage: 'url(/plano-1.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          xs={12}
        >
          <Box marginY='auto'>
            <Typography
              paragraph
              sx={{ textShadow: '-1px -1px 4px #101010' }}
              variant={smDownScreen ? 'h4' : 'h3'}
              width={smDownScreen ? '100%' : '75%'}
            >
              Encontre os melhores feirantes de sua região de forma simples, prática e fácil.
            </Typography>
            <Button
              color='primary'
              href='/busca'
              variant='contained'
              size='large'
            >
              Conhecer
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          paddingX={3}
          paddingTop={5}
        >
          <Stack
            alignItems='center'
            flexDirection={smDownScreen ? 'column-reverse' : 'row'}
            gap={3}
            justifyContent='space-between'
          >
            <Player
              autoplay
              keepLastFrame
              loop
              src={connection}
              style={{ height: 200, width: 200 }}
            />
            <Typography variant={'h5'} >
              Buscando <strong>aproximar</strong> os feirantes da população, esta plataforma foi desenvolvida para facilitar a <strong>divulgação dos feirantes e seus produtos</strong> para o cliente que procura por um produto artesanal.
            </Typography>
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          padding={3}
        >
          <Grid container>
            <Grid item paddingY={2} sm={6}>
              <Typography gutterBottom variant={smDownScreen ? 'h4' : 'h3'} fontWeight='bold'>
                Um Projeto Estudantil
              </Typography>
              <Typography variant='h5'>
                Esta plataforma faz parte de um projeto desenvolvido pelos alunos da turma de BSI 6º periodo do IFNMG, em parceria com a associação de feirantes do municipio de Arinos/MG
              </Typography>
            </Grid>
            <Grid
              alignItems='center'
              display='flex'
              item
              justifyContent='center'
              sm={6}
              width='100%'
            >
              <Image
                alt='Logo'
                src={logo}
                height={225}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation='horizontal' sx={{ marginY: 5, width: '100%' }} />
        <Grid item xs={12}>
          <Typography fontWeight='bold' gutterBottom textAlign='center' variant='h5'>
            Busque por produtos, categoria de produtos ou feirantes!
          </Typography>
          <Typography gutterBottom textAlign='center' variant='h5'>
            Encontre o que precisa e entre em contato direto pelo <>Whatsapp.</>
          </Typography>
        </Grid>
        <Divider orientation='horizontal' variant='fullWidth' />
        <Grid item xs={12}>
          <Paper
            component={Box}
            marginX='auto'
            marginY={3}
            width='50%'
          >
            <Box
              alignItems='center'
              display='flex'
              component='form'
              onSubmit={(e) => {
                e.preventDefault();
                router.push('/busca');
              }}
              paddingY={1}
              paddingX={2}
            >
              <InputBase
                id='search'
                name='search'
                placeholder='Digite o que você procura'
                sx={{
                  flex: 1,
                  marginLeft: 1
                }}
              />
              <Divider orientation='vertical' sx={{ height: 30, marginX: 1 }} />
              <IconButton color='primary' type='submit'>
                <Search />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Footer />
    </>
  )
}