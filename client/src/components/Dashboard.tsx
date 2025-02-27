import '../styles/global.css';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider, Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box, Typography } from '@mui/material';
import { useDemoRouter } from '@toolpad/core/internal';
import Contact from './Contact';
import Home from './Home';
import Recipes from './Recipes';

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'לבחירתך :)',
    },
    {
        segment: 'home',
        title: 'ברוכים הבאים לאתר המתכונים שלנו',
        icon: <DashboardIcon />,
    },
    {
        segment: 'recipes',
        title: 'הצגת מתכונים',
        icon: '🍳',
    },
    {
        segment: 'edit-recipe',
        title: 'עריכת מתכון',
        icon: '📝',
    },
    {
        segment: 'add-recipe',
        title: 'הוספת מתכון',
        icon: '➕',
    },
    {
        segment: 'contact',
        title: 'צור קשר',
        icon: '📞',
    },
    {
        kind: 'divider',
    },
    {
        kind: 'header',
        title: 'אפשרויות נוספות',
    },
    {
        segment: 'reports',
        title: 'משוב',
        icon: '',
        children: [
            {
                segment: 'sales',
                title: 'נהנינו',
                icon: '👍',
            },
            {
                segment: 'traffic',
                title: 'יש לנו רעיון לשיפור',
                icon: '👎',
            },
        ],
    },
    {
        segment: 'reports',
        title: 'דיווח על תקלה',
        icon: '',
        children: [
            {
                segment: 'sales',
                title: 'מתכון פגום',
                icon: '🔥',
            },
            {
                segment: 'traffic',
                title: 'תלונות',
                icon: '😥',
            },
        ],
    }
];

const demoTheme = extendTheme({
    typography: {
        fontFamily: 'Heebo Thin',
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#1976d2',
                },
                secondary: {
                    main: '#dc004e',
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#90caf9',
                },
                secondary: {
                    main: '#f48fb1',
                },
            },
        },
    },
    colorSchemeSelector: 'class',
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});


interface DemoProps {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;
}

function DemoPageContent({ pathname }: { pathname: string }) {
    switch (pathname) {
        case '/home':
            return <Home />;
        case '/recipes':
            return <Recipes />;
        case '/edit-recipe':
            return <></>;
        case '/add-recipe':
            return <></>
        case '/contact':
            return <Contact />;
        default:
            return (
                <Box
                    sx={{
                        py: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Typography>Dashboard content for {pathname}</Typography>
                </Box>
            );
    }
}

export default function Dashboard(props: DemoProps) {
    const { window } = props;

    const router = useDemoRouter('/home');

    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center', // מרכז את התוכן אופקית
                        alignItems: 'center', // מרכז את התוכן אנכית
                        // height: '100vh', // גובה של 100% מהגובה של החלון
                        padding: 2, // הוסף padding כדי למנוע חיתוך
                    }}
                >
                    <DemoPageContent pathname={router.pathname} />
                </Box>
            </DashboardLayout>
        </AppProvider>
    );
}