import '../styles/global.css';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider, Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box, Button, Typography } from '@mui/material';
import { useDemoRouter } from '@toolpad/core/internal';
import Home from './Home';
import Recipes from './Recipes';
import AddRecipePage from './AddRecipePage';
import Contact from './Contact';
import { detailsContext } from '../context/Provider';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const demoTheme = extendTheme({
    typography: {
        fontFamily: 'Heebo Thin',
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#1976d2', // הצבעים כאן הם לדוגמה
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
    colorSchemeSelector: 'class', // מאפשר למערכת לבחור את מצב הצבעים
});

const DemoPageContent = ({ pathname }: { pathname: string }) => {
    const { id } = useContext(detailsContext);
    const navigate = useNavigate();  // הוספת הניווט

    // אם המשתמש לא מחובר והוא מנסה לגשת לעמוד שבו הוא לא מורשה
    useEffect(() => {
        if (id === -1) {
            if (pathname === '/add-recipe' || pathname === '/recipes') {
                // אם המשתמש לא מחובר, נווט לעמוד התחברות
                navigate('/login');
            }
        }
    }, [id, pathname, navigate]);

    if (pathname === '/add-recipe' && id === -1) {
        return <Typography color="error">עליך להתחבר כדי להוסיף מתכון</Typography>;
    }

    if (pathname === '/recipes' && id === -1) {
        return <Typography color="error">עליך להתחבר כדי לצפות במתכונים שלנו</Typography>;
    }

    switch (pathname) {
        case '/home':
            return <Home />;
        case '/recipes':
            return <Recipes />;
        case '/add-recipe':
            return <AddRecipePage />;
        case '/contact':
            return <Contact />;
        default:
            return (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography>אין עמוד כזה: {pathname}</Typography>
                </Box>
            );
    }
};

export default function Dashboard({ window }: { window?: () => Window }) {
    const router = useDemoRouter('/home');
    const demoWindow = window ? window() : undefined;
    const { id, name, setMyId } = useContext(detailsContext); // כאן אנחנו מקבלים את כל פרטי המשתמש
    const isLoggedIn = id !== -1;
    const nav = useNavigate()

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
            segment: 'add-recipe',
            title: 'הוספת מתכון',
            icon: '➕',
        },
        {
            segment: 'contact',
            title: 'צור קשר',
            icon: '📞',
        },
    ];

    return (
        <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme} window={demoWindow}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, padding: 2 }}>
                    {isLoggedIn ? (
                        <>
                            <Typography>שלום, {name}</Typography>
                            <Button variant="outlined" onClick={() => setMyId(-1)}>התנתקות</Button>
                        </>
                    ) : (
                        <Button variant="contained" onClick={() => { nav('/login') }}>התחברות</Button>
                    )}
                </Box>

                {/* Dashboard Content */}
                <DashboardLayout>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
                        <DemoPageContent pathname={router.pathname} />
                    </Box>
                </DashboardLayout>
            </Box>
        </AppProvider>
    );
}
