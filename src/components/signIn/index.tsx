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
import { CustomUser } from '@/config/firebase';

export type CustomObject = {
    categoria: string,
    produtos: string[]
}

interface FormUserProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>;
    user?: CustomUser;
}

interface FormMarketProps extends FormUserProps {
    previousStep: React.MouseEventHandler<HTMLButtonElement>;
}

interface FormProductProps extends FormMarketProps {
    nextStep: React.MouseEventHandler<HTMLButtonElement>;
    categoryProducts: Array<CustomObject>;
}

/**
* O formulário contém os seguintes labels:
* @name Nome <string>
* @phone Telefone Whatsapp <string>
* @email Email <string>
* @location Cidade <string>
* @password Senha <string>
* @passwordConfirm Confirmação da Senha <string>
*/
export function FormUser({ onSubmit, user }: FormUserProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const labelPassword = {
        confirm: 'Confirme sua senha',
        password: 'Crie uma senha'
    }

    return (
        <>
            <StepLabel>
                Informações Cadastrais
            </StepLabel>
            <StepContent>
                <Box component='form' marginY={1} onSubmit={onSubmit}>
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
                        <Button variant='contained' type='submit'>
                            Continuar
                        </Button>
                        <Button disabled>
                            Voltar
                        </Button>
                    </Stack>
                </Box>
            </StepContent>
        </>
    )
}

/**
* O formulário contém os seguintes labels:
* @customName Nome da Banca <string>
* @delivery Se realiza entrega <'on' | null>
* @money Se aceita pagamento em dinheiro <'on' | null>
* @pix Se aceita pagamento via PIX <'on' | null>
* @card  Se aceita pagamento com cartão credito/debito <'on' | null>
* @daysWorking Dias de trabalho <string>
*/
export function FormMarket({ onSubmit, previousStep }: FormMarketProps) {
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

    return (
        <>
            <StepLabel>
                Informações da Banca
            </StepLabel>
            <StepContent>
                <Box component='form' marginY={1} onSubmit={onSubmit}>
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
                        <Button variant='contained' type='submit'>
                            Continuar
                        </Button>
                        <Button onClick={previousStep}>
                            Voltar
                        </Button>
                    </Stack>
                </Box>
            </StepContent>
        </>
    )
}

/**
* Este formulário contém apenas CheckBox, em que sua ID é o nome do produto e o NAME é a categoria-produto, neste formato.
*/
export function FormProduct({ categoryProducts, onSubmit, previousStep }: FormProductProps) {
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
    const handleChangeAccordion =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpandedAccordion(isExpanded ? panel : false);
        };

    return (
        <>
            <StepLabel optional={<Typography variant='caption'>Último Passo</Typography>}>
                Informações dos Produtos
            </StepLabel>
            <StepContent>
                <Typography gutterBottom>Nesta última etapa, basta abrir as abas e escolher os produtos que você vende.</Typography>
                <Box component='form' marginY={1} onSubmit={onSubmit}>
                    {
                        categoryProducts.length === 0 ?
                            <Alert severity='error'>Houver um erro ao carregar os produtos, tente mais tarde.</Alert>
                            : categoryProducts.map((item, index) =>
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
                        <Button variant='contained' type='submit'>
                            Cadastrar
                        </Button>
                        <Button onClick={previousStep}>
                            Voltar
                        </Button>
                    </Stack>
                </Box>
            </StepContent>
        </>
    )
}