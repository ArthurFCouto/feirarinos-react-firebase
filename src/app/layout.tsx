import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Box, Container, CssBaseline } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FeirArinos',
  description: 'Conheça os feirantes e seus produtos da cidade de Arinos/MG',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='pt-Br'>
      <body className={inter.className}>
        <Box display='flex' flexDirection='column' height='100vh'>
          <CssBaseline />
          <Box
          component='main'
          display='flex'
          height='100%'
          justifyContent='center'
          >
            <Container sx={{ maxWidth: '100% !important', paddingX: '0 !important' }}>
              {children}
            </Container>
          </Box>
        </Box>
      </body>
    </html>
  )
}