'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import {
    Box, Chip, Container, CssBaseline,
    Divider, IconButton, InputBase, LinearProgress,
    Link as MLink, Paper,
    Stack, Typography, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search } from '@mui/icons-material';
import logo from '../favicon.ico';
import { CustomCard, CustomMenu } from '@/components/busca';
import { AlertDialog } from '@/components/ui';
import firebase, { Market } from '@/config/firebase';
import { orderArrayString } from '@/util';

export default function Busca() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const sizeImage = smDownScreen ? 30 : 50;
    const [openDialog, setOpenDialog] = useState(false);
    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setOpenDialog(true)
        setLoading(false);
    };
    const [markets, setMarkets] = useState<Array<Market>>([]);
    const getMarkets = async () => {
        try {
            const db = getFirestore(firebase);
            const list: Array<Market> = [];
            const querySnapshot = await getDocs(collection(db, 'banca'));
            querySnapshot.forEach((doc) => {
                list.push(doc.data() as Market);
            });
            setMarkets([...list]);
            setLoading(false);
        } catch (error) {
            console.log('Firebase Error', error);
            alert('Tivemos um erro no servidor. Tente mais tarde.');
            setLoading(false);
        }
    }
    const [categories, setCategories] = useState<string[]>([]);
    const getCategoryProducts = async () => {
        try {
            const db = getFirestore(firebase);
            const querySnapshot = await getDocs(collection(db, 'produtos'));
            const dataCategories: string[] = [];
            querySnapshot.forEach((doc) => {
                const indexOf = doc.data().name.indexOf('-');
                dataCategories.push(doc.data().name.slice(0, indexOf));
            });
            const listCategories = [...new Set(dataCategories)];
            setCategories(orderArrayString(listCategories));
            getMarkets();
        } catch (error) {
            console.log('Firebase Error', error);
            alert('Tivemos um erro no servidor. Tente mais tarde.');
            setLoading(false);
        }
    }
    useEffect(() => { getCategoryProducts() }, [])

    return (
        <Container maxWidth='xl' >
            <AlertDialog isOpen={openDialog} onClose={() => setOpenDialog(false)} />
            <CssBaseline />
            <Stack
                alignItems='center'
                flexDirection='row'
                justifyContent='space-between'
                paddingX={1}
                paddingY={3}
            >
                <MLink
                    component={Link}
                    color='inherit'
                    href='/'
                    title='Ir para página inicial'
                    sx={{ textDecoration: 'none' }}
                >
                    <Box alignItems='center' display='flex' flexDirection='row'>
                        <Image alt='Logo' src={logo} height={sizeImage} width={sizeImage} />
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
                </MLink>
                <Box
                    alignItems='center'
                    display='flex'
                    flexDirection='row'
                    gap={1}
                >
                    <CustomMenu smDownScreen={smDownScreen} />
                </Box>
            </Stack >
            <Paper component={Box} marginTop={1} width='100%'>
                <Box
                    alignItems='center'
                    display='flex'
                    component='form'
                    onSubmit={handleSearch}
                    paddingY={1}
                    paddingX={2}
                >
                    <InputBase
                        id='search'
                        name='search'
                        placeholder='Busque por nome ou categoria'
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
            <Stack
                bgcolor='#FEFEFE'
                borderRadius={1}
                flexDirection='row'
                flexWrap='nowrap'
                gap={1}
                marginTop={2}
                overflow='auto'
                paddingY={1}
            >
                {
                    categories.map((item, index) => <Chip clickable key={index} size='small' label={item} variant='outlined' onClick={() => setOpenDialog(true)} />)
                }
            </Stack>
            <Box display='flex' flexDirection='column' gap={2} paddingY={2}>
                {
                    loading ? <LinearProgress />
                        : markets.length === 0 ?
                            <Typography>Ainda não há feirantes cadastrados</Typography>
                            :
                            <>
                                {
                                    markets.map((market, index) => <CustomCard key={index} market={market} details={() => setOpenDialog(true)} redirectWhatsapp={() => setOpenDialog(true)} />)
                                }
                            </>
                }
            </Box >
        </Container >
    )
}