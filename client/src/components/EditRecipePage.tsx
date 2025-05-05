import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Box, Typography } from '@mui/material';
import EditRecipe from './EditRecipe';
import { Recipe } from '../repositories/RecipeType';
import { convertResRecipeToRecipeType, ResRecipe } from '../repositories/ResRecipe';
import { detailsContext } from '../context/Provider';

const EditRecipePage = () => {
    const { id } = useParams(); // expects <Route path="/edit/:id" />
    const [recipe, setRecipe] = useState<Recipe>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const detailsContextProvider = useContext(detailsContext)

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get<ResRecipe>(`http://localhost:8080/api/recipe/${id}`);
                const fetchedRecipe = convertResRecipeToRecipeType(response.data); // המרת המתכון ל-RecipeType
                setRecipe(fetchedRecipe);

                // במקרה שהמשתמש הנוכחי לא ייצר את המתכון
                if (response.data.UserId !== detailsContextProvider.id) {
                    setError('אין לך הרשאה לערוך מתכון זה');
                    return;
                }
            } catch (err) {
                setError('שגיאה בטעינת המתכון');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return <Box sx={{ textAlign: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error || !recipe) {
        return <Typography color="error" align="center">{error || 'לא נמצא מתכון'}</Typography>;
    }

    return (
        <EditRecipe recipe={recipe} onSave={(updated: Recipe) => setRecipe(updated)} />
    );
};
 
export default EditRecipePage;
