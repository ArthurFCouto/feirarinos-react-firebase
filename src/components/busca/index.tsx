'use client';
import { useEffect, useState } from 'react';
import { Market } from '@/config/firebase';
import {
    Box, Button, Card, CardContent,
    CardMedia, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton,
    Stack, Tooltip, Typography
} from '@mui/material';
import { AccountCircle, LocationOn, Loupe, Visibility, WhatsApp } from '@mui/icons-material';
import { ExtractCategories, OrderArrayString } from '@/util';


interface CustomMenuProps {
    smDownScreen: boolean;
}

interface CustomCardProps extends CustomMenuProps {
    infoMarket: Market;
    handleDetails: () => void;
}

interface CustomCardFooterProps extends CustomCardProps {
    sizeChip: 'small' | 'medium';
    sizeImage: number;
}

interface ChipCategorieProps {
    label: string;
    filtercategorie: () => void;
    selected: string;
}

interface DetailsProps {
    market?: Market;
    onClose: () => void;
    open: boolean;
    redirectWhatsapp: () => void;
}

function CustomCardFooter({ handleDetails, infoMarket, sizeChip, sizeImage, smDownScreen }: CustomCardFooterProps) {
    const { card, delivery, pix } = infoMarket;
    return (
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
                                sx={{ cursor: 'help', width: sizeImage }}
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
                                sx={{ cursor: 'help', width: sizeImage }}
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
                                sx={{ cursor: 'help', width: sizeImage }}
                            />
                        </Tooltip>
                    )
                }
            </Stack>
            <Tooltip title='Abrir detalhes'>
                <Button
                    color='success'
                    endIcon={<Visibility />}
                    onClick={handleDetails}
                    size={sizeChip}
                    variant='contained'
                >
                    Detalhes
                </Button>
            </Tooltip>
        </Box>
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
                Area Feirante
            </Button>
        </Box>
    )
}

export function ChipCategorie({ label, filtercategorie, selected }: ChipCategorieProps) {
    return (
        <Chip
            clickable
            size='medium'
            label={label}
            variant={'outlined'}
            onClick={filtercategorie}
            sx={{
                border: selected === label ? 3 : 'default',
                borderColor: selected === label ? (theme) => theme.palette.info.main : 'default'
            }}
        />
    )
}

export function CustomCard({ infoMarket, handleDetails, smDownScreen }: CustomCardProps) {
    const sizeChip = smDownScreen ? 'small' : 'medium';
    const { customName, products } = infoMarket;
    const [categories, setCategories] = useState<Array<string>>([]);
    useEffect(() => { setCategories(ExtractCategories(products)); }, []);

    return (
        <Card
            component={Box}
            display='flex'
            elevation={3}
            flexDirection={smDownScreen ? 'column-reverse' : 'row'}
        >
            <Box display='flex' flexDirection='column' width='100%'>
                <CardContent component={Box} flex={1}>
                    <Typography
                        component={Box}
                        fontWeight={500}
                        onClick={handleDetails}
                        variant='h5'
                        sx={{ cursor: 'pointer' }}
                    >
                        {customName.toUpperCase()}
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
                            categories.slice(0, 3).map((item, index) => <Chip clickable color='default' key={index} label={item} size={sizeChip} />)
                        }
                        <Tooltip title='Ver mais informações'>
                            <Button
                                color='info'
                                endIcon={<Loupe />}
                                onClick={handleDetails}
                                size={sizeChip}
                            >
                                Ver Mais
                            </Button>
                        </Tooltip>
                    </Stack>
                </CardContent>
                <CustomCardFooter
                    handleDetails={handleDetails}
                    infoMarket={infoMarket}
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

export function Details({ market, onClose, open, redirectWhatsapp }: DetailsProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                {market?.customName}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Ainda estamos em desenvolvimento, em breve você poderá utilizar todas as funções.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Voltar</Button>
                <Button
                    color='success'
                    endIcon={<WhatsApp />}
                    onClick={redirectWhatsapp}
                    variant='contained'
                >
                    Whatsapp
                </Button>
            </DialogActions>
        </Dialog>
    );
}