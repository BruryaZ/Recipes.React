import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Stack,
    Divider,
    Box,
    useMediaQuery,
    useTheme,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { detailsContext } from '../context/Provider';
import axios from 'axios';

const difficultyMap: Record<number, string> = {
    1: 'קל',
    2: 'בינוני',
    3: 'קשה',
};

const difficultyColors: Record<string, string> = {
    'קל': '#388e3c',
    'בינוני': '#f9a825',
    'קשה': '#d32f2f',
};

const Recipe = ({
    Id,
    title,
    date,
    image,
    description,
    method,
    difficulty,
    duration,
    ingredients,
    userId
}: any) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const detailsContextProvider = useContext(detailsContext);
    const [unauthorized, setUnauthorized] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        console.log('Recipe component mounted with Id:', Id);
        console.log('Current user id:', detailsContextProvider.id);
        
        
        // בדיקה אם המשתמש הנוכחי הוא בעל המתכון
        if (userId !== detailsContextProvider.id) {
            setUnauthorized(true); // אם לא, הצג הודעה שלא מורשה
        }
    }, [Id, detailsContextProvider.id]);

    const handleEditClick = () => {
        navigate(`/edit/${Id}`);
    };

    const handleDeleteClick = () => {
        setOpenDeleteDialog(true); // הצגת דיאלוג אישור מחיקה
    };

    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);
        try {
            const res = await axios.post<any>(`http://localhost:8080/api/recipe/delete/${Id}`)
            console.log(res);

        }
        catch (error) {
            console.log('שגיאה במחיקת המתכון:', error);
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    // המרת רמת הקושי למילים אם מדובר במספר
    const difficultyText = typeof difficulty === 'number' ? difficultyMap[difficulty] || 'לא מוגדר' : difficulty;

    return (
        <Card
            sx={{
                maxWidth: '1000px',
                margin: '30px auto',
                borderRadius: 6,
                boxShadow: 6,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
            dir="rtl"
        >
            <CardMedia
                component="img"
                height="360"
                image={image}
                alt={title}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ padding: 4 }}>
                <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: 'bold', textAlign: 'right' }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, textAlign: 'right' }}
                >
                    {description}
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 3 }}
                >
                    <Chip
                        icon={<WhatshotIcon />}
                        label={difficultyText}
                        sx={{
                            backgroundColor: difficultyColors[difficultyText] || '#757575',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '1rem',
                            px: 2,
                            py: 1
                        }}
                    />
                    <Chip
                        icon={<AccessTimeIcon />}
                        label={`${duration} דקות`}
                        sx={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            px: 2,
                            py: 1
                        }}
                    />
                    <Box sx={{ flexGrow: 1 }} />
                    <Typography variant="subtitle2" sx={{ mt: isSmallScreen ? 1 : 0, textAlign: 'left' }}>
                        {date}
                    </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, textAlign: 'right' }}>
                    מצרכים:
                </Typography>
                <ul style={{ marginTop: 8, paddingRight: '20px' }}>
                    {ingredients?.map((ingredient: any, idx: number) => (
                        <li key={idx}>
                            <Typography variant="body1" sx={{ textAlign: 'right' }}>
                                {`${ingredient.Name} – ${ingredient.Count} ${ingredient.Type}`}
                            </Typography>
                        </li>
                    ))}
                </ul>
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, textAlign: 'right' }}>
                    הוראות הכנה:
                </Typography>
                <ol style={{ marginTop: 8, paddingRight: '20px' }}>
                    {method?.map((step: string, idx: number) => (
                        <li key={idx}>
                            <Typography variant="body1" sx={{ textAlign: 'right' }}>
                                {step}
                            </Typography>
                        </li>
                    ))}
                </ol>

                {/* הצגת הודעה אם המשתמש לא יכול לערוך את המתכון */}
                {unauthorized ? (
                    <Typography variant="body1" color="error" align="center" sx={{ fontFamily: 'inherit', marginTop: 2 }}>
                        אין לך הרשאה לערוך את המתכון הזה.
                    </Typography>
                ) : (
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditClick}
                            sx={{ flex: 1 }}
                        >
                            ערוך מתכון
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteClick}
                            sx={{ flex: 1 }}
                        >
                            מחק מתכון
                        </Button>
                    </Stack>
                )}

            </CardContent>


            {/* דיאלוג אישור מחיקה */}
            <Dialog open={openDeleteDialog} onClose={handleCancelDelete} dir="rtl">
                <DialogTitle>אישור מחיקת מתכון</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ textAlign: 'right' }}>
                        האם אתה בטוח שברצונך למחוק את המתכון הזה? פעולה זו לא ניתנת לביטול.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        ביטול
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        מחק
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Recipe;
