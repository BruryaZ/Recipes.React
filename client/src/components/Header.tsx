import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import food from "../img/wide.jpg";
import { Link } from 'react-router-dom';
import milky from "../img/milky.jpg";
import fleshy from "../img/fleshy.jpg";
import petit_fours from "../img/petit_fours3.jpg";
import children from "../img/child_food.jpg";

const NAVIGATION: Navigation = [
    {
        kind: 'header',
        title: 'לבחירתך :)',
    },
    {
        segment: 'dashboard',
        title: 'ברוכים הבאים לאתר המתכונים שלנו',
        icon: <DashboardIcon />,
    },
    {
        segment: 'home',
        title: 'עמוד בית',
        icon: '🏠',
    },
    {
        segment: 'recipes',
        title: 'הצגת מתכונים',
        icon: '🍳',
    },
    {
        segment: 'home',
        title: 'עריכת מתכון',
        icon: '📝',
    },
    {
        segment: 'home',
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
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#1976d2', // צבע ראשי
                },
                secondary: {
                    main: '#dc004e', // צבע משני
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#90caf9', // צבע ראשי בחשיכה
                },
                secondary: {
                    main: '#f48fb1', // צבע משני בחשיכה
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

function useDemoRouter(initialPath: string): Router {
    const [pathname, setPathname] = React.useState(initialPath);

    const router = React.useMemo(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path: string | URL) => setPathname(String(path)),
        };
    }, [pathname]);

    return router;
}

const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    height,
    content: '" "',
}));

export default function DashboardLayoutBasic(props: any) {
    const { window } = props;

    const router = useDemoRouter('/dashboard');

    const demoWindow = window ? window() : undefined;

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>
                <PageContainer>
                    <Grid container spacing={1}>
                        <Grid size={5} />
                        <Grid size={12}>
                            <small>מבחר ענק טעיםם ומרשיםם של מתכונים בריאים מקלי הכנה ועד להכנה מורכבת</small>
                        </Grid>

                        <Grid size={4}>
                            <div>
                                <p>עדיין לא רשומים? לחצו כאן👇</p>
                                <Link to="/login">אני רוצה לטעום</Link>
                            </div>
                        </Grid>
                        <Grid size={8}>
                            <div>
                                <p>רשומים? לחצו כאן👇</p>
                                <Link to="/login">זה היה טובב</Link>
                            </div>
                        </Grid>

                        <Grid item xs={12} style={{ width: '700px' }}>
                            <div style={{
                                width: '100vh',
                                height: '100%',
                                overflow: 'hidden'
                            }}>
                                <img
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover' // השתמש ב-cover כדי שהתמונה תתמלא את כל השטח
                                    }}
                                    src={food}
                                    alt="תמונה של מתכון"
                                />
                            </div>
                        </Grid>


                        <Grid size={12}>
                            <small>יש לנו המונמון מבחר המון סגנונות בטוח תמצאו משהו שיטעיםםם</small>
                        </Grid>

                        {/* התמונות האחרונות בשורה */}
                        <Grid container spacing={1}>
                            <Grid item xs={3} component="div" style={{ height: '25vh' }}>
                                <img
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    src={milky}
                                    alt="תמונה של מתכון"
                                />
                            </Grid>
                            <Grid item xs={3} component="div" style={{ height: '25vh' }}>
                                <img
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    src={fleshy}
                                    alt="תמונה של מתכון"
                                />
                            </Grid>
                            <Grid item xs={3} component="div" style={{ height: '25vh' }}>
                                <img
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    src={petit_fours}
                                    alt="תמונה של מתכון"
                                />
                            </Grid>
                            <Grid item xs={3} component="div" style={{ height: '25vh' }}>
                                <img
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    src={children}
                                    alt="תמונה של מתכון"
                                />
                            </Grid>
                        </Grid>

                    </Grid>
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
