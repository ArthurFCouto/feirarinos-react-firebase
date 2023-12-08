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
                <MLink color='inherit' component={Link} href='/' sx={{marginLeft: 0.5}}>FeirArinos</MLink>
            </Typography>
        </Container>
    </Box>
)