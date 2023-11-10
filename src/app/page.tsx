import { Footer } from '@/components/ui';
import { Box, Button, Grid, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      display='flex'
      flexDirection='column'
      height='100%'
      sx={{
        backgroundImage: 'url(/plano-1.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Grid marginTop='auto' container>
        <Grid
          color='white'
          item
          padding={3}
          xs={12}
        >
          <Typography
            component='h1'
            fontWeight='bold'
            gutterBottom
            sx={{ textShadow: '-1px -1px 4px #101010' }}
            variant='h3'
          >
            FeirArinos
          </Typography>
          <Typography paragraph sx={{ textShadow: '-1px -1px 4px #101010' }} variant='h5'>
            Encontre os melhores feirantes de sua região de forma simples, prática e fácil
          </Typography>
        </Grid>
        <Grid
          display='flex'
          item
          justifyContent='center'
          padding={3}
          xs={12}
        >
          <Button
            color='primary'
            href='/busca'
            variant='contained'
            size='large'
          >
            Descobrir
          </Button>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  )
}