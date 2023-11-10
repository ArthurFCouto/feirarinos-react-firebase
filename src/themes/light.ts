import { createTheme } from '@mui/material';

export const LightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    typography: {
        allVariants: {
            color: 'black',
        },
        fontFamily: [
            'lato',
            'Roboto',
            'Montserrat',
            'sans-serif',
        ].join(','),
    }
});