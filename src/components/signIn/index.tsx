'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
    Accordion, AccordionDetails, AccordionSummary, Alert,
    Box, Button, Checkbox, Chip, FormControl,
    FormControlLabel, FormGroup, FormLabel, Grid,
    IconButton, InputAdornment, InputLabel, Link as MLink,
    MenuItem, OutlinedInput, Select, SelectChangeEvent,
    Stack, StepContent, StepLabel,
    Switch, TextField, Typography
} from '@mui/material'
import { ExpandMore, Visibility, VisibilityOff } from '@mui/icons-material';
import { phoneMask } from '@/util';

export type CustomObject = {
    categoria: string,
    produtos: string[]
}

export type CustomUserForm = {
    name: string;
    phone: number;
    email: string;
    location: string;
    password: string;
    passwordConfirm: string;
}

export type CustomMarketForm = {
    customName: string,
    delivery: boolean,
    money: boolean,
    pix: boolean,
    card: boolean,
    daysWorking: string,
}

interface FormUserProps {
    onSubmitUser: (userForm: CustomUserForm) => void;
}

interface FormMarketProps {
    onSubmitMarket: (marketForm: CustomMarketForm) => void;
    previousStep: React.MouseEventHandler<HTMLButtonElement>;
}

interface FormProductProps {
    onSubmitProducts: (products: Array<string>) => void;
    categoryProducts: Array<CustomObject>;
    previousStep: React.MouseEventHandler<HTMLButtonElement>;
}

export function FormUser({ onSubmitUser }: FormUserProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const labelPassword = {
        confirm: 'Confirme sua senha',
        password: 'Crie uma senha'
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const dataUser = {
            name: String(data.get('name')),
            phone: parseInt(String(data.get('phone')).replace(/[^0-9]/g, '')),
            email: String(data.get('email')),
            location: String(data.get('location')),
            password: String(data.get('password')),
            passwordConfirm: String(data.get('passwordConfirm'))
        };
        onSubmitUser(dataUser);
    };

    return (
        <>
            <StepLabel>
                Informações Cadastrais
            </StepLabel>
            <StepContent>
                <Box component='form' marginY={1} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete='name'
                                fullWidth
                                id='name'
                                label='Digite seu Nome'
                                name='name'
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete='tel-area-code'
                                fullWidth
                                id='phone'
                                label='WhatsApp'
                                name='phone'
                                onChange={(e) => { e.target.value = phoneMask(e.target.value) }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete='email'
                                fullWidth
                                id='email'
                                label='E-mail'
                                name='email'
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id='location'>Localidade</InputLabel>
                                <Select
                                    id='location'
                                    labelId='location'
                                    label='Localidade'
                                    name='location'
                                    required
                                >
                                    <MenuItem value='ARINOS-MG'>Arinos MG</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant='outlined'>
                                <InputLabel htmlFor='password'>{labelPassword.password}</InputLabel>
                                <OutlinedInput
                                    autoComplete='new-password'
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='Alterar visibilidade da senha'
                                                edge='end'
                                                onClick={() => setShowPassword((prevState) => !prevState)}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    id='password'
                                    label={labelPassword.password}
                                    name='password'
                                    required
                                    type={showPassword ? 'text' : 'password'}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant='outlined'>
                                <InputLabel htmlFor='passwordConfirm'>{labelPassword.confirm}</InputLabel>
                                <OutlinedInput
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='Alterar visibilidade da senha'
                                                edge='end'
                                                onClick={() => setShowConfirmPassword((prevState) => !prevState)}
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    id='passwordConfirm'
                                    label={labelPassword.confirm}
                                    name='passwordConfirm'
                                    required
                                    type={showConfirmPassword ? 'text' : 'password'}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item justifyContent='flex-end' marginY={1.5} xs={12}>
                            <MLink component={Link} href='/login' variant='body2'>
                                Já é cadastrado? Faça login
                            </MLink>
                        </Grid>
                    </Grid>
                    <Stack
                        direction='row'
                        justifyContent='flex-end'
                        gap={1}
                        paddingRight={1}
                        paddingTop={1}
                        width='100%'
                    >
                        <Button disabled>
                            Voltar
                        </Button>
                        <Button variant='contained' type='submit'>
                            Continuar
                        </Button>
                    </Stack>
                </Box>
            </StepContent>
        </>
    )
}

export function FormMarket({ onSubmitMarket, previousStep }: FormMarketProps) {
    const [daysWorking, setDaysWorking] = useState<string[]>([]);
    const labelDaysWorking = 'Dias de Venda';
    const handleDaysWorking = (event: SelectChangeEvent<typeof daysWorking>) => {
        const value = event.target.value;
        setDaysWorking(typeof value === 'string' ? value.split(',') : value);
    };
    const payments = [
        {
            id: 'money',
            label: 'Dinheiro'
        },
        {
            id: 'pix',
            label: 'PIX'
        },
        {
            id: 'card',
            label: 'Crédito/Débito'
        }
    ];
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const dataMarket = {
            customName: String(data.get('customName')),
            delivery: data.get('delivery') == 'on',
            money: data.get('money') == 'on',
            pix: data.get('pix') == 'on',
            card: data.get('card') == 'on',
            daysWorking: String(data.get('daysWorking')),
        };
        onSubmitMarket(dataMarket);
    };

    return (
        <>
            <StepLabel>
                Informações da Banca
            </StepLabel>
            <StepContent>
                <Box component='form' marginY={1} onSubmit={handleSubmit}>
                    <Grid container marginBottom={2} spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete='username'
                                fullWidth
                                id='customName'
                                helperText='O nome como todos te conhecem'
                                label='Nome da Banca'
                                name='customName'
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component='fieldset' variant='standard'>
                                <FormLabel component='legend'>Disponbilidade</FormLabel>
                                <FormGroup>
                                    <FormControlLabel control={<Switch id='delivery' name='delivery' />} label='Faz entrega' />
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component='fieldset' variant='standard'>
                                <FormLabel component='legend'>Formas de pagamento</FormLabel>
                                <FormGroup>
                                    {
                                        payments.map((item, index) => <FormControlLabel control={<Switch id={item.id} name={item.id} />} key={index} label={item.label} />)
                                    }
                                </FormGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id='working'>{labelDaysWorking}</InputLabel>
                                <Select
                                    id='daysWorking'
                                    labelId='daysWorking'
                                    multiple
                                    name='daysWorking'
                                    onChange={handleDaysWorking}
                                    value={daysWorking}
                                    input={<OutlinedInput id='daysWorkingSelect' label={labelDaysWorking} />}
                                    renderValue={
                                        (selected) => (
                                            <Stack flexDirection='row' flexWrap='wrap' gap={0.5}>
                                                {
                                                    selected.map((value, index) => (
                                                        <Chip key={index} label={value} />
                                                    ))
                                                }
                                            </Stack>
                                        )}
                                >
                                    {
                                        ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day, index) => (
                                            <MenuItem key={index} value={day}>
                                                {day}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Stack
                        direction='row'
                        gap={1}
                        justifyContent='flex-end'
                        paddingTop={1}
                        paddingRight={1}
                        width='100%'
                    >
                        <Button onClick={previousStep}>
                            Voltar
                        </Button>
                        <Button variant='contained' type='submit'>
                            Continuar
                        </Button>
                    </Stack>
                </Box>
            </StepContent>
        </>
    )
}

export function FormProduct({ categoryProducts, onSubmitProducts, previousStep }: FormProductProps) {
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
    const handleChangeAccordion =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpandedAccordion(isExpanded ? panel : false);
        };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const products: Array<string> = [];
        for (const pair of data.entries()) {
            if (pair[1] === 'on')
                products.push(pair[0]);
        }
        onSubmitProducts(products);
    }

    return (
        <>
            <StepLabel optional={<Typography variant='caption'>Último Passo</Typography>}>
                Informações dos Produtos
            </StepLabel>
            <StepContent>
                <Typography gutterBottom>Nesta última etapa, basta abrir as abas e escolher os produtos que você vende.</Typography>
                <Box component='form' marginY={1} onSubmit={handleSubmit}>
                    {
                        categoryProducts.map((item, index) =>
                            <Accordion
                                key={index}
                                expanded={expandedAccordion === item.categoria}
                                onChange={handleChangeAccordion(item.categoria)}
                                sx={{ marginTop: index === 0 ? 2 : 0 }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls='panel1bh-content'
                                    id='panel1bh-header'
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>{item.categoria}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Stack flexDirection='row' gap={1} flexWrap='wrap'>
                                        {
                                            item.produtos.map(
                                                (label, index) =>
                                                    <Checkbox
                                                        checkedIcon={<Chip color='primary' variant='filled' label={label} />}
                                                        id={label}
                                                        icon={<Chip color='primary' variant='outlined' label={label} />}
                                                        key={index}
                                                        name={item.categoria + '-' + label}
                                                        sx={{ padding: '0 !important' }}
                                                    />
                                            )
                                        }
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                    <Stack
                        direction='row'
                        gap={1}
                        justifyContent='flex-end'
                        paddingTop={1}
                        paddingRight={1}
                        width='100%'
                    >
                        <Button onClick={previousStep}>
                            Voltar
                        </Button>
                        <Button variant='contained' type='submit'>
                            Finalizar
                        </Button>
                    </Stack>
                </Box>
            </StepContent>
        </>
    )
}