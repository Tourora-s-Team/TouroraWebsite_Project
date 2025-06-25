import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0064D2',
            light: '#1BA0E2',
            dark: '#004C9E',
        },
        secondary: {
            main: '#FF5722',
            light: '#FF7A47',
            dark: '#F57C00',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                },
            },
        },
    },
});

export default theme;
