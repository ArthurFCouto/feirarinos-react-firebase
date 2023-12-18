'use client';

import { useRouter } from 'next/navigation';
import {
  Box, Button, CssBaseline, Divider,
  Grid, IconButton, InputBase, Paper,
  Typography, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search } from '@mui/icons-material';
import { Player } from '@lottiefiles/react-lottie-player';
import { Footer, Header } from '@/components/ui';
import connection from '../util/lottiefiles/connection.json';
import student from '../util/lottiefiles/student.json';

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const sizeAnimation = 200;

  return (
    <>
      <CssBaseline />
      <Header showManageSearch />
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
              gutterBottom
              sx={{ textShadow: '-1px -1px 4px #101010' }}
              variant={smDownScreen ? 'h4' : 'h3'}
              width={smDownScreen ? '100%' : '75%'}
            >
              Encontre os melhores feirantes de sua região de forma simples, prática e fácil.
            </Typography>
            <Button color='primary' href='/busca' variant='contained' size='large'>
              Conhecer
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} paddingX={3} paddingTop={5}>
          <Grid container>
            <Grid
              alignItems='center'
              display='flex'
              item
              justifyContent='center'
              sm={6}
              xs={12}
            >
              <Player
                autoplay
                loop
                src={connection}
                style={{ height: sizeAnimation, width: sizeAnimation }}
              />
            </Grid>
            <Grid item paddingY={2} sm={6} xs={12}>
              <Typography gutterBottom variant={smDownScreen ? 'h4' : 'h3'} fontWeight='bold'>
                Aumentando Oportunidades
              </Typography>
              <Typography variant={'h5'}>
                Buscando <strong>facilitar o contato</strong> entre os feirantes e a população, esta plataforma foi desenvolvida para ajudar na <strong>divulgação dos feirantes e seus produtos</strong>, e aumentar sua chance de novos negócios.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} padding={3} paddingTop={5}>
          <Grid container>
            <Grid item paddingY={2} sm={6} xs={12}>
              <Typography gutterBottom variant={smDownScreen ? 'h4' : 'h3'} fontWeight='bold'>
                Um Projeto Estudantil
              </Typography>
              <Typography variant='h5'>
                Esta plataforma é um projeto desenvolvido pelos alunos da turma de BSI 6º periodo do IFNMG, em parceria com a associação de feirantes do municipio de Arinos/MG.
              </Typography>
            </Grid>
            <Grid
              alignItems='center'
              display='flex'
              item
              justifyContent='center'
              sm={6}
              xs={12}
            >
              <Player
                autoplay
                loop
                src={student}
                style={{ height: sizeAnimation, width: sizeAnimation }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ marginY: 5, width: '100%' }} />
        <Grid item xs={12}>
          <Typography fontWeight='bold' gutterBottom textAlign='center' variant='h5'>
            Busque por produtos, suas categorias ou feirantes!
          </Typography>
          <Typography gutterBottom textAlign='center' variant='h5'>
            Encontre o que precisa e negocie diretamente pelo <Typography color={(theme) => theme.palette.success.main} fontWeight='bold' variant='h5'>Whatsapp</Typography>
          </Typography>
        </Grid>
        <Grid item padding={3} xs={12}>
          <Paper
            component={Box}
            marginX='auto'
            marginY={3}
            width={smDownScreen ? '100%' : '50%'}
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