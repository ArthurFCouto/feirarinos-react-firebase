'use client';
import { useEffect, useState } from 'react';
import { Market } from '@/config/firebase';
import {
    Box, Button, Card, CardContent,
    CardMedia, Chip, Divider, IconButton,
    Stack, Tooltip, Typography, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AccountCircle, LocationOn, Loupe, WhatsApp } from '@mui/icons-material';
import { orderArrayString } from '@/util';

interface CustomCardProps {
    market: Market;
    details: () => void;
    redirectWhatsapp: () => void;
}

interface CustomMenuProps {
    smDownScreen: boolean;
}

interface CustomCardFooterProps {
    card: boolean;
    delivery: boolean;
    pix: boolean;
    redirectWhatsapp: () => void;
    smDownScreen: boolean;
    sizeChip: 'small' | 'medium';
    sizeImage: number;
}

interface ChipCategorieProps {
    label: string;
    filtercategorie: () => void;
    selected: string;
}

const CustomCardFooter = ({ card, delivery, pix, redirectWhatsapp, sizeChip, sizeImage, smDownScreen }: CustomCardFooterProps) => (
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
                    <Tooltip title='Aceita pagamento via cartão crédito/débito'>
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
                            alt='É possível combinar a entrega'
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

export function CustomCard({ details, market, redirectWhatsapp }: CustomCardProps) {
    const { card, customName, delivery, pix, products } = market;
    const theme = useTheme();
    const smDownScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const sizeChip = smDownScreen ? 'small' : 'medium';
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
                <CustomCardFooter
                    card={card}
                    delivery={delivery}
                    pix={pix}
                    redirectWhatsapp={redirectWhatsapp}
                    sizeChip={sizeChip}
                    sizeImage={smDownScreen ? 30 : 50}
                    smDownScreen={smDownScreen}
                />
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
    return smDownScreen ? (
        <Box>
            <Tooltip title='Arinos/MG'>
                <IconButton color='secondary' size='large' sx={{ marginRight: 1 }}>
                    <LocationOn />
                </IconButton>
            </Tooltip>
            <IconButton color='info' href='/login'>
                <AccountCircle />
            </IconButton>
        </Box>
    ) : (
        <Box>
            <Button color='secondary' startIcon={<LocationOn />} sx={{ marginRight: 2 }} variant='text'>
                Arinos MG
            </Button>
            <Button
                color='info'
                href='/login'
                startIcon={<AccountCircle />}
                variant='contained'
            >
                Acessar Conta
            </Button>
        </Box>
    )
}

export function ChipCategorie({ label, filtercategorie, selected }: ChipCategorieProps) {
    return (
        <Chip
            clickable
            size='small'
            label={label}
            variant={selected === label ? 'filled' : 'outlined'}
            onClick={filtercategorie}
        />
    )
}