import { useContext, useState } from 'react';
import {
  TextField, Button, Stack, Box, Typography,
  MenuItem, Select, InputLabel, FormControl,
} from '@mui/material';
import axios from 'axios';
import { Category, Ingredient, Instruction, Recipe } from '../repositories/RecipeType';
import { convertResRecipeToRecipeType, ResRecipe } from '../repositories/ResRecipe';
import { detailsContext } from '../context/Provider';

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
  const [addRecipe, setAddRecipe] = useState<Recipe>({ ...recipe });
  const detailsContextProvider = useContext(detailsContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, field: string) => {
    setAddRecipe((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
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
  };

  const addIngredient = () => {
    setAddRecipe((prev) => ({
      ...prev,
      Ingridents: [...prev.Ingridents, { Name: '', Count: '', Type: '' }],
    }));
  };

  const addInstruction = () => {
    setAddRecipe((prev) => ({
      ...prev,
      Instructions: [...prev.Instructions, { Name: '' }],
    }));
  };

  const handleSave = async () => {
    try {
      addRecipe.UserId = detailsContextProvider.id;
      addRecipe.Img = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      console.log('addRecipe', addRecipe);

      const { data } = await axios.post<ResRecipe>('http://localhost:8080/api/recipe', addRecipe );
      onSave(convertResRecipeToRecipeType(data));

    } catch (error) {
      console.log('שגיאה בשמירת מתכון:', error);
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
          {addRecipe.Id === 0 ? 'הוספת מתכון חדש' : 'עריכת פרטי מתכון'}
        </Typography>

        <Stack spacing={4}>
          <TextField
            label="שם המתכון"
            value={addRecipe.Name}
            onChange={(e) => handleChange(e, 'Name')}
            fullWidth
            InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
            InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
          />
          <TextField
            label="תיאור"
            value={addRecipe.Description}
            onChange={(e) => handleChange(e, 'Description')}
            fullWidth
            InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
            InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
          />
          <TextField
            label="רמת קושי"
            type="number"
            value={addRecipe.Difficulty}
            onChange={(e) => handleChange(e, 'Difficulty')}
            fullWidth
            InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
            InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
          />
          <TextField
            label="משך זמן הכנה (דקות)"
            type="number"
            value={addRecipe.Duration}
            onChange={(e) => handleChange(e, 'Duration')}
            fullWidth
            InputLabelProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
            InputProps={{ style: { fontFamily: 'inherit', textAlign: 'right' } }}
          />

          <FormControl fullWidth>
            <InputLabel id="category-label" style={{ fontFamily: 'inherit', textAlign: 'right' }}>
              קטגוריה
            </InputLabel>
            <Select
              labelId="category-label"
              value={addRecipe.CategoryId || ''}
              label="קטגוריה"
              onChange={(e) =>
                setAddRecipe((prev) => ({
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
          {addRecipe.Ingridents.map((ingredient: Ingredient, index: number) => (
            <Stack direction="row" spacing={2} key={index}>
              <TextField
                label="שם"
                value={ingredient.Name}
                onChange={(e) => handleIngredientChange(e, index, 'Name')}
                fullWidth
              />
              <TextField
                label="כמות"
                value={ingredient.Count}
                onChange={(e) => handleIngredientChange(e, index, 'Count')}
                fullWidth
              />
              <TextField
                label="סוג"
                value={ingredient.Type}
                onChange={(e) => handleIngredientChange(e, index, 'Type')}
                fullWidth
              />
            </Stack>
          ))}
          <Button variant="contained" color="primary" onClick={addIngredient}>
            הוסף מצרך
          </Button>

          <Typography variant="h6" align="center" sx={{ fontFamily: 'inherit' }}>
            הוראות הכנה
          </Typography>
          {addRecipe.Instructions.map((instruction: Instruction, index: number) => (
            <TextField
              key={index}
              label={`הוראה ${index + 1}`}
              value={instruction.Name}
              onChange={(e) => handleInstructionChange(e, index)}
              fullWidth
              multiline
              rows={2}
            />
          ))}
          <Button variant="contained" color="primary" onClick={addInstruction}>
            הוסף הוראה
          </Button>

          <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
            שמור
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AddRecipe;
