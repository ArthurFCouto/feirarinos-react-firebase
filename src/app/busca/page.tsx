'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import {
    Box, Container, CssBaseline,
    Divider, IconButton, InputBase, LinearProgress,
    Link as MLink, Paper,
    Stack, Typography, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Search } from '@mui/icons-material';
import logo from '../favicon.ico';
import { ChipCategorie, CustomCard, CustomMenu } from '@/components/busca';
import { Footer } from '@/components/ui';
import firebase, { Market } from '@/config/firebase';
import { orderArrayString } from '@/util';

export default function Busca() {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const sizeImage = smDownScreen ? 30 : 50;
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [marketList, setMarketList] = useState<Array<Market>>([]);
    const [categoryList, setCategoryList] = useState<string[]>([]);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading) return;
        setSelectedCategory('');
        const data = new FormData(event.currentTarget);
        getmarketListByFilter(String(data.get('search')));
        setSearchTerm(`Buscando por ${data.get('search')}...`);
    };

    const changeCategorie = (item: string) => {
        if (loading) return;
        setSelectedCategory((prevCategorie) => prevCategorie === item ? '' : item);
        getmarketListByFilter(selectedCategory === item ? '' : item);
        setSearchTerm(`Buscando por ${item}...`);
    };

    const getmarketListByFilter = async (item: string) => {
        try {
            setLoading(true);
            const db = getFirestore(firebase);
            const list: Array<Market> = [];
            const querySnapshot = await getDocs(collection(db, 'banca'));
            querySnapshot.forEach((doc) => {
                const data = JSON.stringify(doc.data() as Market);
                if (data.includes(item))
                    list.push(doc.data() as Market);
            });
            setMarketList([...list]);
            setLoading(false);
        } catch (error) {
            console.log('Firebase Error', error);
            alert('Tivemos um erro no servidor. Tente mais tarde.');
            setLoading(false);
        }
    }

    const getCategoryProducts = async () => {
        try {
            const db = getFirestore(firebase);
            const querySnapshot = await getDocs(collection(db, 'produtos'));
            const datacategoryList: string[] = [];
            querySnapshot.forEach((doc) => {
                const indexOf = doc.data().name.indexOf('-');
                datacategoryList.push(doc.data().name.slice(0, indexOf));
            });
            const listcategoryList = [...new Set(datacategoryList)];
            setCategoryList(orderArrayString(listcategoryList));
            getmarketListByFilter('');
        } catch (error) {
            console.log('Firebase Error', error);
            alert('Tivemos um erro no servidor. Tente mais tarde.');
            setLoading(false);
        }
    }
    useEffect(() => { getCategoryProducts() }, [])

    return (
        <Box display='flex' flexDirection='column' height='100%'>
            <Container maxWidth='xl' sx={{ flex: 1 }}>
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
                        title='Bem vindo a FeirArinos'
                        sx={{ textDecoration: 'none' }}
                    >
                        <Box alignItems='center' display='flex' flexDirection='row'>
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
                        loading && categoryList.length === 0 ? <Typography component='h5' fontWeight={500} variant='h5'>Carregando categorias</Typography> :
                            <>
                                {
                                    categoryList.map((item, index) => <ChipCategorie filtercategorie={() => changeCategorie(item)} key={index} label={item} selected={selectedCategory} />)
                                }
                            </>
                    }
                </Stack>
                <Box display='flex' flexDirection='column' gap={2} paddingY={2}>
                    {
                        searchTerm.length > 0 && <Typography component='h5' fontWeight={500} variant='h5'>{searchTerm}</Typography>
                    }
                    {
                        loading ? <LinearProgress />
                            : marketList.length === 0 ?
                                <Typography component='h5' fontWeight={500} variant='h5'>Não encontramos resultados para exibir</Typography>
                                :
                                <>
                                    {
                                        marketList.map((market, index) => <CustomCard key={index} market={market} details={() => alert('Em fase de desenvolvimento.')} redirectWhatsapp={() => window.open(`https://api.whatsapp.com/send?phone=55${market.phone}`)} />)
                                    }
                                </>
                    }
                </Box >
            </Container >
            <Footer />
        </Box>
    )
}