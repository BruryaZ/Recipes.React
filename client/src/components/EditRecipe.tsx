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
import { useNavigate } from 'react-router-dom';

const EditRecipe = ({ recipe, onSave, isDarkMode }: any) => {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>({ ...recipe });
  const [categories, setCategories] = useState<Category[]>([]);
  const [unauthorized, setUnauthorized] = useState(false);  // משתנה להודעות לא מורשה
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const detailsContextProvider = useContext(detailsContext);
  const nav = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>('http://localhost:8080/api/category');
        setCategories(res.data);

        // אם אין קטגוריה נבחרת במתכון, קובעים את הראשונה כברירת מחדל
        if (!editedRecipe.Categoryid && res.data.length > 0) {
          setEditedRecipe((prev) => ({
            ...prev,
            Categoryid: res.data[0].Id,
          }));
        }
      } catch (error) {
        console.log('שגיאה בטעינת קטגוריות:', error);
      }
    };

    if (recipe.UserId !== detailsContextProvider.id) {
      setUnauthorized(true);
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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!editedRecipe.Name) errors.Name = 'שם המתכון הוא שדה חובה';
    if (!editedRecipe.Description) errors.Description = 'תיאור המתכון הוא שדה חובה';
    if (!editedRecipe.Categoryid) errors.Categoryid = 'קטגוריה היא שדה חובה';
    if (!editedRecipe.Duration || editedRecipe.Duration <= 0) errors.Duration = 'משך זמן הכנה חייב להיות מספר חיובי';

    editedRecipe.Ingridents.forEach((ingredient, index) => {
      if (!ingredient.Name) errors[`ingredientName-${index}`] = `שם המצרך ${index + 1} הוא שדה חובה`;
      if (!ingredient.Count) errors[`ingredientCount-${index}`] = `כמות המצרך ${index + 1} היא שדה חובה`;
      if (!ingredient.Type) errors[`ingredientType-${index}`] = `סוג המצרך ${index + 1} הוא שדה חובה`;
    });

    editedRecipe.Instructions.forEach((instruction, index) => {
      if (!instruction.Name) errors[`instruction-${index}`] = `הוראת הכנה ${index + 1} היא שדה חובה`;
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // אם אין שגיאות
  };

  const handleSave = async () => {
    if (!validateForm()) return; // אם יש שגיאות, לא נמשיך

    try {
      const res = await axios.post<ResRecipe>('http://localhost:8080/api/recipe/edit', editedRecipe);
      onSave(res.data);
      nav('/recipes'); // חזרה לדף הבית לאחר שמירה
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
              error={!!validationErrors.Name}
              helperText={validationErrors.Name}
            />
            <TextField
              label="תיאור"
              value={editedRecipe.Description}
              onChange={(e) => handleChange(e, 'Description')}
              fullWidth
              InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
              InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
              error={!!validationErrors.Description}
              helperText={validationErrors.Description}
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
              error={!!validationErrors.Duration}
              helperText={validationErrors.Duration}
            />

            {/* שדה קטגוריה */}
            <FormControl fullWidth>
              <InputLabel id="category-label" style={{ fontFamily: 'inherit', textAlign: 'right' }}>
                קטגוריה
              </InputLabel>
              <Select
                labelId="category-label"
                value={editedRecipe.Categoryid || ''}
                label="קטגוריה"
                onChange={(e) =>
                  setEditedRecipe((prev) => ({
                    ...prev,
                    Categoryid: parseInt(e.target.value as string),
                  }))
                }
                style={{ fontFamily: 'inherit', textAlign: 'right' }}
                error={!!validationErrors.Categoryid}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.Id} value={cat.Id} style={{ fontFamily: 'inherit', textAlign: 'right' }}>
                    {cat.Name}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.Categoryid && (
                <Typography color="error" variant="body2" align="right">
                  {validationErrors.Categoryid}
                </Typography>
              )}
            </FormControl>

            {/* מצרכים */}
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
                  error={!!validationErrors[`ingredientName-${index}`]}
                  helperText={validationErrors[`ingredientName-${index}`]}
                />
                <TextField
                  label="כמות"
                  value={ingredient.Count}
                  onChange={(e) => handleIngredientChange(e, index, 'Count')}
                  fullWidth
                  InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                  InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                  error={!!validationErrors[`ingredientCount-${index}`]}
                  helperText={validationErrors[`ingredientCount-${index}`]}
                />
                <TextField
                  label="סוג"
                  value={ingredient.Type}
                  onChange={(e) => handleIngredientChange(e, index, 'Type')}
                  fullWidth
                  InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                  InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
                  error={!!validationErrors[`ingredientType-${index}`]}
                  helperText={validationErrors[`ingredientType-${index}`]}
                />
              </Stack>
            ))}
            <Button variant="contained" color="primary" onClick={addIngredient}>
              הוסף מצרך
            </Button>

            {/* הוראות הכנה */}
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
                error={!!validationErrors[`instruction-${index}`]}
                helperText={validationErrors[`instruction-${index}`]}
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
