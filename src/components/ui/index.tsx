import Link from 'next/link';
import {
    Box, Button, Container, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    Link as MLink, Typography
} from '@mui/material';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog
        aria-describedby='alert-dialog-description'
        aria-labelledby='alert-dialog-title'
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle id='alert-dialog-title'>
                Plataforma em Fase de Desenvolvimento
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-description'>
                    Ainda estamos em desenvolvimento, em breve você poderá utilizar todas as funções.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled onClick={onClose} >Cancelar</Button>
                <Button autoFocus onClick={onClose} >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const Footer = () => (
    <Box
        bgcolor='#F3F2F2'
        component='footer'
        paddingX={2}
        marginTop='auto'
    >
        <Container maxWidth='lg' sx={{ paddingY: 2 }}>
            <Typography variant='body1'>
                FeirArinos - Projeto de UCE do IFNMG (Turma BSI 2021)
            </Typography>
            <Typography variant='body2' color='text.secondary'>
                {`Copyright © ${new Date().getFullYear()}`}
                <MLink color='inherit' component={Link} href='/'>FeirArinos</MLink>
            </Typography>
        </Container>
    </Box>
)