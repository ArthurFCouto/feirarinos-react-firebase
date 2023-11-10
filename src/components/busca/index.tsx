'use client';
import { useEffect, useState } from 'react';
import { Market } from '@/config/firebase';
import {
    Box, Button, Card, CardContent,
    CardMedia, Chip, Divider, IconButton,
    Menu, MenuItem, Stack, Tooltip,
    Typography, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AccountCircle, LocationOn, Loupe, WhatsApp } from '@mui/icons-material';
import { orderArrayString } from '@/util';
import { useRouter } from 'next/navigation';

interface CustomCardProps {
    market: Market;
    details: () => void;
    redirectWhatsapp: () => void;
}

interface CustomMenuProps {
    smDownScreen: boolean;
}

export function CustomCard({ details, market, redirectWhatsapp }: CustomCardProps) {
    const { card, customName, delivery, pix, products } = market;
    const theme = useTheme();
    const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const sizeChip = smDownScreen ? 'small' : 'medium';
    const sizeImage = smDownScreen ? 30 : 50;
    const [categories, setCategories] = useState<string[]>([]);
    const extractCategories = () => {
        const list: string[] = [];
        products.forEach((item) => {
            const indexOf = item.indexOf('-');
            list.push(item.slice(0, indexOf));
        });
        const listCategories = [...new Set(list)];
        setCategories(orderArrayString(listCategories));
    }
    const CardFooter = () => (
        <Box
            alignItems='center'
            display='flex'
            flexDirection={smDownScreen ? 'row-reverse' : 'row'}
            justifyContent='space-between'
            padding={2}
            width='100%'
        >
            <Stack flexDirection={smDownScreen ? 'row-reverse' : 'row'} gap={1} alignItems='center'>
                {
                    pix && (
                        <Tooltip title='Aceita pagamento via PIX'>
                            <CardMedia
                                alt='Pagamento via PIX'
                                component='img'
                                image='/pix.png'
                                sx={{ width: sizeImage }}
                            />
                        </Tooltip>
                    )
                }
                {
                    card && (
                        <Tooltip title='Aceita pagamento via artão credito/débito'>
                            <CardMedia
                                alt='Pagamento via cartão'
                                component='img'
                                image='/credit-card.png'
                                sx={{ width: sizeImage }}
                            />
                        </Tooltip>
                    )
                }
                {
                    delivery && (
                        <Tooltip title='Realiza entregas*'>
                            <CardMedia
                                alt='Pagamento via PIX'
                                component='img'
                                image='/delivery.png'
                                sx={{ width: sizeImage }}
                            />
                        </Tooltip>
                    )
                }
            </Stack>
            <Tooltip title='Chamar no Whatsapp'>
                <Button
                    color='success'
                    endIcon={<WhatsApp />}
                    onClick={redirectWhatsapp}
                    size={sizeChip}
                    variant='contained'
                >
                    Whatsapp
                </Button>
            </Tooltip>
        </Box>
    )

    useEffect(() => {
        extractCategories();
    }, []);
    return (
        <Card
            component={Box}
            display='flex'
            flexDirection={smDownScreen ? 'column-reverse' : 'row'}
            //height={smDownScreen ? 'auto' : 220}
            variant='outlined'
        >
            <Box display='flex' flexDirection='column' width='100%'>
                <CardContent component={Box} flex={1}>
                    <Typography component='h5' fontWeight={500} variant='h5'>
                        {customName}
                    </Typography>
                    <Stack
                        alignItems='center'
                        flexDirection='row'
                        flexWrap='wrap'
                        gap={1.5}
                        marginY={1.5}
                        marginBottom={smDownScreen ? -2 : undefined}
                        rowGap={1}
                    >
                        {
                            categories.slice(0, 3).map((item, index) => <Chip clickable key={index} label={item} size={sizeChip} />)
                        }
                        <Tooltip title='Ver mais informações'>
                            <Button
                                color='info'
                                endIcon={<Loupe />}
                                onClick={details}
                                size={sizeChip}
                            >
                                Ver Mais
                            </Button>
                        </Tooltip>
                    </Stack>
                </CardContent>
                <CardFooter />
            </Box>
            {
                smDownScreen && (
                    <Divider component='div' variant='fullWidth' sx={{ marginY: 1 }} />
                )
            }
            <CardMedia
                alt='Imagem de perfil'
                component='img'
                image='/avatar-m.png'
                sx={{ width: 180, margin: 'auto', marginTop: smDownScreen ? 1 : 'auto' }}
            />
        </Card >
    )
}

export function CustomMenu({ smDownScreen }: CustomMenuProps) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const stateOpenMenuAccount = Boolean(anchorEl);
    const openMenuAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const closeMenuAccount = () => {
        setAnchorEl(null);
    };
    const MenuAccount = () => (
        <Menu
            anchorEl={anchorEl}
            id='account-menu'
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
            onClose={closeMenuAccount}
            open={stateOpenMenuAccount}
        >
            <MenuItem onClick={() => router.push('/login')}>Sou Feirante</MenuItem>
        </Menu>
    )

    return smDownScreen ? (
        <Box>
            <IconButton color='secondary' size='large'>
                <LocationOn />
            </IconButton>
            <IconButton
                aria-controls={stateOpenMenuAccount ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={stateOpenMenuAccount ? 'true' : undefined}
                color='info'
                onClick={openMenuAccount}
            >
                <AccountCircle />
            </IconButton>
            <MenuAccount />
        </Box>
    ) : (
        <Box>
            <Button color='secondary' startIcon={<LocationOn />} variant='text'>
                Arinos MG
            </Button>
            <Button
                aria-controls={stateOpenMenuAccount ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={stateOpenMenuAccount ? 'true' : undefined}
                color='info'
                onClick={openMenuAccount}
                startIcon={<AccountCircle />}
                variant='contained'
            >
                Acessar Conta
            </Button>
            <MenuAccount />
        </Box>
    )
}