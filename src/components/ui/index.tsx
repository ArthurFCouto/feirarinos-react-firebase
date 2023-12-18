'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import {
    Box, Button, Container, IconButton, Link as MLink, Stack,
    Typography, useMediaQuery
} from '@mui/material';
import logo from '../../app/favicon.ico';
import { AccountCircle, LocationOn, ManageSearch } from '@mui/icons-material';

interface HeaderProps {
    showManageSearch?: boolean;
}

interface ButonsHeaderProps extends HeaderProps {
    smDownScreen: boolean;
}

function ButtonsHeader({ smDownScreen, showManageSearch }: ButonsHeaderProps) {
    return smDownScreen ? (
        <Box>
            <IconButton color='secondary' size='large' sx={{ marginRight: 1 }}>
                <LocationOn />
            </IconButton>
            {
                showManageSearch && (
                    <IconButton color='secondary' href='/busca' sx={{ marginRight: 1 }}>
                        <ManageSearch />
                    </IconButton>
                )
            }
            <IconButton color='info' href='/login'>
                <AccountCircle />
            </IconButton>
        </Box>
    ) : (
        <Box>
            <Button color='secondary' startIcon={<LocationOn />} sx={{ marginRight: 2 }} variant='text'>
                Arinos MG
            </Button>
            {
                showManageSearch && (
                    <Button color='secondary' href='/busca' startIcon={<ManageSearch />} sx={{ marginRight: 2 }} variant='text'>
                        Buscar
                    </Button>
                )
            }
            <Button color='info' href='/login' startIcon={<AccountCircle />} variant='contained'>
                Area Feirante
            </Button>
        </Box>
    )

}

export function Footer() {
    return (
        <Box bgcolor='#F3F2F2' component='footer' padding={2} marginTop='auto'>
            <Container maxWidth='lg'>
                <Typography variant='body1'>
                    FeirArinos - Projeto de UCE do IFNMG (Turma BSI 2021)
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    {`Copyright © ${new Date().getFullYear()}`}
                    <MLink color='inherit' component={Link} href='/' sx={{ marginLeft: 0.5 }}>FeirArinos</MLink>
                </Typography>
            </Container>
        </Box>
    )
}

export function Header({ showManageSearch }: HeaderProps) {
    const theme = useTheme();
    const router = useRouter();
    const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const sizeImage = smDownScreen ? 20 : 40;
    const redirect = () => router.push('/');

    return (
        <Stack alignItems='center' flexDirection='row' justifyContent='space-between' padding={3}>
            <Box alignItems='center' display='flex' flexDirection='row' gap={1} sx={{ cursor: 'pointer' }}>
                <Image alt='Logo' height={sizeImage} src={logo} width={sizeImage} onClick={redirect} />
                <Typography
                    component='h1'
                    fontWeight='bold'
                    onClick={redirect}
                    variant={smDownScreen ? 'h5' : 'h4'}
                    sx={{ textShadow: '-1px -1px 1px #909090' }}
                >
                    FeirArinos
                </Typography>
            </Box>
            <Box alignItems='center' display='flex' flexDirection='row' gap={1}>
                <ButtonsHeader smDownScreen={smDownScreen} showManageSearch={showManageSearch} />
            </Box>
        </Stack >
    )
}