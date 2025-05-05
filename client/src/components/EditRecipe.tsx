import { useContext, useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import axios from 'axios';
import { Category, Ingredient, Instruction, Recipe } from '../repositories/RecipeType';
import { ResRecipe } from '../repositories/ResRecipe';
import { detailsContext } from '../context/Provider';

const EditRecipe = ({ recipe, onSave, isDarkMode }: any) => {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>({ ...recipe });
  const [categories, setCategories] = useState<Category[]>([]);
  const [unauthorized, setUnauthorized] = useState(false);  // משתנה להודעות לא מורשה
  const detailsContextProvider = useContext(detailsContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>('http://localhost:8080/api/category');
        setCategories(res.data);
      } catch (error) {
        console.log('שגיאה בטעינת קטגוריות:', error);
      }
    };

    // בדיקה אם המשתמש הוא בעל המתכון
    if (recipe.UserId !== detailsContextProvider.id) {
      setUnauthorized(true); // אם לא, הצג הודעה שלא מורשה
    }

    fetchCategories();
  }, [recipe, detailsContextProvider.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, field: string) => {
    setEditedRecipe((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleIngredientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: string
  ) => {
    const updatedIngredients = [...editedRecipe.Ingridents];
    (updatedIngredients[index] as any)[field] = e.target.value;
    setEditedRecipe((prev) => ({
      ...prev,
      Ingridents: updatedIngredients,
    }));
  };

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedInstructions = [...editedRecipe.Instructions];
    updatedInstructions[index].Name = e.target.value;
    setEditedRecipe((prev) => ({
      ...prev,
      Instructions: updatedInstructions,
    }));
  };

  const addIngredient = () => {
    setEditedRecipe((prev) => ({
      ...prev,
      Ingridents: [...prev.Ingridents, { Name: '', Count: '', Type: '' }],
    }));
  };

  const addInstruction = () => {
    setEditedRecipe((prev) => ({
      ...prev,
      Instructions: [...prev.Instructions, { Name: '' }],
    }));
  };

  const handleSave = async () => {
    try {
      editedRecipe.Id = detailsContextProvider.id;
      console.log('Saving recipe:', editedRecipe);
      const res = await axios.post<ResRecipe>('http://localhost:8080/api/recipe/edit', editedRecipe);
      console.log(res.data);
      onSave(res.data);
    } catch (error) {
      console.log('Error saving recipe:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#333' : '#fff',
        color: isDarkMode ? '#fff' : '#000',
        padding: 4,
      }}
      dir="rtl"
    >
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" align="center" sx={{ fontFamily: 'inherit' }}>
          עריכת פרטי מתכון
        </Typography>

        {/* הצגת הודעת לא מורשה אם המשתמש לא יכול לערוך את המתכון */}
        {unauthorized && (
          <Typography variant="body1" color="error" align="center" sx={{ fontFamily: 'inherit', marginBottom: 2 }}>
            אין לך הרשאה לערוך את המתכון הזה.
          </Typography>
        )}

        {!unauthorized && (
          <Stack spacing={4}>
            <TextField
              label="שם המתכון"
              value={editedRecipe.Name}
              onChange={(e) => handleChange(e, 'Name')}
              fullWidth
              InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
              InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
            />
            <TextField
              label="תיאור"
              value={editedRecipe.Description}
              onChange={(e) => handleChange(e, 'Description')}
              fullWidth
              InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
              InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
            />
            <TextField
              label="רמת קושי"
              value={editedRecipe.Difficulty}
              onChange={(e) => handleChange(e, 'Difficulty')}
              fullWidth
              InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
              InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
            />
            <TextField
              label="משך זמן הכנה (דקות)"
              type="number"
              value={editedRecipe.Duration}
              onChange={(e) => handleChange(e, 'Duration')}
              fullWidth
              InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
              InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
            />

            {/* שדה קטגוריה */}
            <FormControl fullWidth>
              <InputLabel id="category-label" style={{ fontFamily: 'inherit', textAlign: 'right' }}>
                קטגוריה
              </InputLabel>
              <Select
                labelId="category-label"
                value={editedRecipe.CategoryId || ''}
                label="קטגוריה"
                onChange={(e) =>
                  setEditedRecipe((prev) => ({
                    ...prev,
                    CategoryId: parseInt(e.target.value as string),
                  }))
                }
                style={{ fontFamily: 'inherit', textAlign: 'right' }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.Id} value={cat.Id} style={{ fontFamily: 'inherit', textAlign: 'right' }}>
                    {cat.Name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" align="center" sx={{ fontFamily: 'inherit' }}>
              מצרכים
            </Typography>
            {editedRecipe.Ingridents.map((ingredient: Ingredient, index: number) => (
              <Stack direction="row" spacing={2} key={index}>
                <TextField
                  label="שם"
                  value={ingredient.Name}
                  onChange={(e) => handleIngredientChange(e, index, 'Name')}
                  fullWidth
                  InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                  InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                />
                <TextField
                  label="כמות"
                  value={ingredient.Count}
                  onChange={(e) => handleIngredientChange(e, index, 'Count')}
                  fullWidth
                  InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                  InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                />
                <TextField
                  label="סוג"
                  value={ingredient.Type}
                  onChange={(e) => handleIngredientChange(e, index, 'Type')}
                  fullWidth
                  InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                  InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                />
              </Stack>
            ))}
            <Button variant="contained" color="primary" onClick={addIngredient}>
              הוסף מצרך
            </Button>

            <Typography variant="h6" align="center" sx={{ fontFamily: 'inherit' }}>
              הוראות הכנה
            </Typography>
            {editedRecipe.Instructions.map((instruction: Instruction, index: number) => (
              <TextField
                key={index}
                label={`הוראה ${index + 1}`}
                value={instruction.Name}
                onChange={(e) => handleInstructionChange(e, index)}
                fullWidth
                multiline
                rows={2}
                InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
              />
            ))}
            <Button variant="contained" color="primary" onClick={addInstruction}>
              הוסף הוראה
            </Button>

            <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
              שמור
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default EditRecipe;
