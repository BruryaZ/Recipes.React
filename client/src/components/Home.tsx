import { Box } from '@mui/material';
import '../styles/global.css'
import ImagesDashboard from './ImagesDashboard';
import MySighInButton from './MySighInButton';
import Grid from '@mui/material/Grid2';

const Home = () => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center', // מרכז את התוכן אופקית
                    alignItems: 'center', // מרכז את התוכן אנכית
                    padding: 2, // הוסף padding כדי למנוע חיתוך
                    width:'100%'
                }}
            >
                <Grid container spacing={1}>
                    <Grid size={5} />
                    <Grid size={12}>
                        <p>מבחר ענק טעיםם ומרשיםם של מתכונים בריאים מקלי הכנה ועד להכנה מורכבת</p>
                    </Grid>
                    <MySighInButton />
                    <Grid size={12}>
                        <small>יש לנו המון מבחר המון סגנונות בטוח תמצאו משהו שיטעיםםם</small>
                    </Grid>
                    <Grid size={12}>
                        <ImagesDashboard />
                    </Grid>
                </Grid>
            </Box>

        </>
    );
};

export default Home;