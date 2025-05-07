import '../styles/global.css';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { AppProvider, Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box, Button, Typography, Avatar } from '@mui/material';
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
});

const DemoPageContent = ({ pathname }: { pathname: string }) => {
    const { id } = useContext(detailsContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (id === -1) {
            if (pathname === '/add-recipe' || pathname === '/recipes' || pathname === '/dashboard') {
                navigate('/login');
            }
        }
    }, [id, pathname, navigate]);

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
    const { id, name, setMyId } = useContext(detailsContext);
    const isLoggedIn = id !== -1;
    const nav = useNavigate();

    const NAVIGATION: Navigation = [
        {
            kind: 'header',
            title: 'תפריט ראשי',
        },
        {
            segment: 'home',
            title: 'עמוד הבית',
            icon: <DashboardIcon />,
        },
        {
            segment: 'recipes',
            title: 'מתכונים',
            icon: <RestaurantIcon />,
        },
        {
            segment: 'add-recipe',
            title: 'הוספת מתכון',
            icon: <AddCircleOutlineIcon />,
        },
        {
            segment: 'contact',
            title: 'צור קשר',
            icon: <ContactSupportIcon />,
        },
    ];

    return (
        <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme} window={demoWindow}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <DashboardLayout>
                    {/* כותרת עליונה עם ברכה ומשתמש */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 24px',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            backgroundColor: 'background.paper',
                        }}
                        dir="rtl"
                    >
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            אתר המתכונים
                        </Typography>

                        {isLoggedIn ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        py: 0.5,
                                        px: 2,
                                        borderRadius: 20,
                                        bgcolor: 'action.hover',
                                    }}
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                        {name?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <Typography>שלום, {name}</Typography>
                                </Box>
                                <Button variant="outlined" size="small" onClick={() => setMyId(-1)} sx={{ borderRadius: 2, backgroundColor: '#1e1e1e' }}>
                                    התנתקות
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => nav('/login')}
                                sx={{ borderRadius: 2, backgroundColor: '#90caf9' }}
                            >
                                התחברות
                            </Button>
                        )}
                    </Box>

                    {/* תוכן הדף */}
                    <Box >
                        <DemoPageContent pathname={router.pathname} />
                    </Box>
                </DashboardLayout>
            </Box>
        </AppProvider>
    );
}
