'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import {
    Box, Container, CssBaseline,
    Divider, IconButton, InputBase, LinearProgress, Paper,
    Stack, Typography, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Clear, Search } from '@mui/icons-material';
import logo from '../favicon.ico';
import { ChipCategorie, CustomCard, CustomMenu } from '@/components/busca';
import { Footer } from '@/components/ui';
import firebase, { Market } from '@/config/firebase';
import { orderArrayString } from '@/util';

const emptyMessage = 'Não encontramos resultados para exibir.';

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
        const search = String(data.get('search'));
        if (search.trim().length === 0) return;
        getmarketListByFilter(search);
        setSearchTerm(`Buscando por ${search}`);
    };

    const changeCategorie = (item: string) => {
        if (loading) return;
        setSelectedCategory((prevCategorie) => prevCategorie === item ? '' : item);
        getmarketListByFilter(selectedCategory === item ? '' : item);
        setSearchTerm(selectedCategory === item ? '' : `Filtrando por ${item}`);
    };

    const getmarketListByFilter = async (item: string) => {
        try {
            setLoading(true);
            const db = getFirestore(firebase);
            const list: Array<Market> = [];
            const querySnapshot = await getDocs(collection(db, 'banca'));
            querySnapshot.forEach((doc) => {
                const data = JSON.stringify(doc.data()).toLowerCase();
                if (data.includes(item.toLowerCase()))
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
                    <Box
                        alignItems='center'
                        display='flex'
                        flexDirection='row'
                        gap={1}
                    >
                        <CustomMenu smDownScreen={smDownScreen} />
                    </Box>
                </Stack >
                <Paper component={Box} width='100%'>
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
                            placeholder='Busque por nome, categoria ou feirante'
                            sx={{
                                flex: 1,
                                marginLeft: 1
                            }}
                        />
                        <Divider orientation='vertical' sx={{ height: 30, marginX: 1 }} />
                        <IconButton color='primary' type='submit'>
                            <Search />
                        </IconButton>
                        {
                            searchTerm.length > 0 && (
                                <IconButton
                                    color='error'
                                    onClick={() => {
                                        getmarketListByFilter('');
                                        setSearchTerm('');
                                        setSelectedCategory('');
                                    }}
                                >
                                    <Clear />
                                </IconButton>
                            )
                        }
                    </Box>
                </Paper>
                <Stack
                    flexDirection='row'
                    flexWrap='nowrap'
                    gap={1}
                    marginTop={2}
                    overflow='auto'
                    paddingY={1}
                    marginRight={smDownScreen ? -2 : undefined}
                >
                    {
                        loading && categoryList.length === 0 ? <Typography variant='subtitle2'>Carregando categorias...</Typography> :
                            <>
                                {
                                    categoryList.map((item, index) => <ChipCategorie filtercategorie={() => changeCategorie(item)} key={index} label={item} selected={selectedCategory} />)
                                }
                            </>
                    }
                </Stack>
                <Box display='flex' flexDirection='column' gap={2} paddingY={2}>
                    {
                        searchTerm.length > 0 && <Typography fontWeight={500} variant='h6'>{searchTerm}</Typography>
                    }
                    <Divider />
                    {
                        loading ? <LinearProgress sx={{ marginTop: 2 }} />
                            : marketList.length === 0 ?
                                <Typography variant='h6'>{emptyMessage}</Typography>
                                :
                                <>
                                    {
                                        marketList.map((market, index) => <CustomCard key={index} market={market} details={() => alert('Em fase de desenvolvimento.')} redirectWhatsapp={() => window.open(`https://api.whatsapp.com/send?phone=55${market.phone}`)} smDownScreen={smDownScreen} />)
                                    }
                                </>
                    }
                </Box >
            </Container >
            <Footer />
        </Box>
    )
}