import { useContext, useState } from 'react';
import {
  TextField, Button, Stack, Box, Typography,
  MenuItem, Select, InputLabel, FormControl, FormHelperText,
} from '@mui/material';
import axios from 'axios';
import { Category, Ingredient, Instruction, Recipe } from '../repositories/RecipeType';
import { convertResRecipeToRecipeType, ResRecipe } from '../repositories/ResRecipe';
import { detailsContext } from '../context/Provider';
import { useNavigate } from 'react-router-dom';

const AddRecipe = ({
  recipe,
  onSave,
  isDarkMode,
  categories,
}: {
  recipe: Recipe;
  onSave: (updated: Recipe) => void;
  isDarkMode: boolean;
  categories: Category[];
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const detailsContextProvider = useContext(detailsContext);
  const nav = useNavigate();
  const [addRecipe, setAddRecipe] = useState<Recipe>({
    ...recipe,
    Categoryid: recipe.Categoryid || (categories[0] ? categories[0].Id : 1), // בחר ברירת מחדל
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!addRecipe.Name.trim()) newErrors.Name = 'נא להזין שם למתכון';
    if (!addRecipe.Description.trim()) newErrors.Description = 'נא להזין תיאור';
    if (!addRecipe.Difficulty || isNaN(+addRecipe.Difficulty)) newErrors.Difficulty = 'נא להזין רמת קושי מספרית';
    if (!addRecipe.Duration || isNaN(+addRecipe.Duration)) newErrors.Duration = 'נא להזין זמן הכנה במספרים';
    if (!addRecipe.Categoryid) newErrors.Categoryid = 'נא לבחור קטגוריה';

    addRecipe.Ingridents.forEach((ing, i) => {
      if (!ing.Name.trim()) newErrors[`Ingridents-${i}-Name`] = 'שם חובה';
      if (!ing.Count.trim()) newErrors[`Ingridents-${i}-Count`] = 'כמות חובה';
      if (!ing.Type.trim()) newErrors[`Ingridents-${i}-Type`] = 'סוג חובה';
    });

    addRecipe.Instructions.forEach((inst, i) => {
      if (!inst.Name.trim()) newErrors[`Instructions-${i}`] = 'הוראה לא יכולה להיות ריקה';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, field: string) => {
    setAddRecipe((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleIngredientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: string
  ) => {
    const updatedIngredients = [...addRecipe.Ingridents];
    (updatedIngredients[index] as any)[field] = e.target.value;
    setAddRecipe((prev) => ({
      ...prev,
      Ingridents: updatedIngredients,
    }));
    setErrors((prev) => ({ ...prev, [`Ingridents-${index}-${field}`]: '' }));
  };

  const handleInstructionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedInstructions = [...addRecipe.Instructions];
    updatedInstructions[index].Name = e.target.value;
    setAddRecipe((prev) => ({
      ...prev,
      Instructions: updatedInstructions,
    }));
    setErrors((prev) => ({ ...prev, [`Instructions-${index}`]: '' }));
  };

  const addInstruction = () => {
    setAddRecipe((prev) => ({
      ...prev,
      Instructions: [...prev.Instructions, { Name: '' }], // נוסיף הוראה חדשה עם שדה Name ריק
    }));
  };

  const addIngredient = () => {
    setAddRecipe((prev) => ({
      ...prev,
      Ingridents: [...prev.Ingridents, { Name: '', Count: '', Type: '' }], // נוסיף מצרך חדש עם שדות ריקים
    }));
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      addRecipe.UserId = detailsContextProvider.id;
      addRecipe.Img = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
      const { data } = await axios.post<ResRecipe>('http://localhost:8080/api/recipe', addRecipe);
      onSave(convertResRecipeToRecipeType(data));
      nav('/recipes')
    } catch (error) {
      console.log('שגיאה בשמירת מתכון:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', padding: 4 }} dir="rtl">
      <Box sx={{ width: '100%', maxWidth: 600 }}>
        <Typography variant="h5" align="center" sx={{ fontFamily: 'inherit' }}>
          {addRecipe.Id === 0 ? 'הוספת מתכון חדש' : 'עריכת פרטי מתכון'}
        </Typography>

        <Stack spacing={4}>
          <TextField
            label="שם המתכון"
            value={addRecipe.Name}
            onChange={(e) => handleChange(e, 'Name')}
            fullWidth
            error={!!errors.Name}
            helperText={errors.Name}
          />
          <TextField
            label="תיאור"
            value={addRecipe.Description}
            onChange={(e) => handleChange(e, 'Description')}
            fullWidth
            error={!!errors.Description}
            helperText={errors.Description}
          />
          <TextField
            label="רמת קושי"
            type="number"
            value={addRecipe.Difficulty}
            onChange={(e) => handleChange(e, 'Difficulty')}
            fullWidth
            error={!!errors.Difficulty}
            helperText={errors.Difficulty}
          />
          <TextField
            label="משך זמן הכנה (דקות)"
            type="number"
            value={addRecipe.Duration}
            onChange={(e) => handleChange(e, 'Duration')}
            fullWidth
            error={!!errors.Duration}
            helperText={errors.Duration}
          />

          <FormControl fullWidth error={!!errors.Categoryid}>
            <InputLabel id="category-label" style={{ fontFamily: 'inherit' }}>
              קטגוריה
            </InputLabel>
            <Select
              labelId="category-label"
              value={addRecipe.Categoryid || ''}
              label="קטגוריה"
              onChange={(e) =>
                setAddRecipe((prev) => ({
                  ...prev,
                  Categoryid: parseInt(e.target.value as string),
                }))
              }
            >
              {categories.map((cat) => (
                <MenuItem key={cat.Id} value={cat.Id}>
                  {cat.Name}
                </MenuItem>
              ))}
            </Select>
            {errors.Categoryid && <FormHelperText>{errors.Categoryid}</FormHelperText>}
          </FormControl>

          <Typography variant="h6" align="center">מצרכים</Typography>
          {addRecipe.Ingridents.map((ingredient: Ingredient, index: number) => (
            <Stack direction="row" spacing={2} key={index}>
              <TextField
                label="שם"
                value={ingredient.Name}
                onChange={(e) => handleIngredientChange(e, index, 'Name')}
                fullWidth
                error={!!errors[`Ingridents-${index}-Name`]}
                helperText={errors[`Ingridents-${index}-Name`]}
              />
              <TextField
                label="כמות"
                value={ingredient.Count}
                onChange={(e) => handleIngredientChange(e, index, 'Count')}
                fullWidth
                error={!!errors[`Ingridents-${index}-Count`]}
                helperText={errors[`Ingridents-${index}-Count`]}
              />
              <TextField
                label="סוג"
                value={ingredient.Type}
                onChange={(e) => handleIngredientChange(e, index, 'Type')}
                fullWidth
                error={!!errors[`Ingridents-${index}-Type`]}
                helperText={errors[`Ingridents-${index}-Type`]}
              />
            </Stack>
          ))}
          <Button variant="contained" onClick={addIngredient}>הוסף מצרך</Button>

          <Typography variant="h6" align="center">הוראות הכנה</Typography>
          {addRecipe.Instructions.map((instruction: Instruction, index: number) => (
            <TextField
              key={index}
              label={`הוראה ${index + 1}`}
              value={instruction.Name}
              onChange={(e) => handleInstructionChange(e, index)}
              fullWidth
              multiline
              rows={2}
              error={!!errors[`Instructions-${index}`]}
              helperText={errors[`Instructions-${index}`]}
            />
          ))}
          <Button variant="contained" onClick={addInstruction}>הוסף הוראה</Button>

          <Button variant="contained" onClick={handleSave} fullWidth>
            שמור
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AddRecipe;
