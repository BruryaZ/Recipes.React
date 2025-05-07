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
  Paper,
  CardContent,
  Card,
  Divider,
  FormHelperText,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Category, Ingredient, Instruction, Recipe } from '../repositories/RecipeType';
import { ResRecipe } from '../repositories/ResRecipe';
import { detailsContext } from '../context/Provider';
import { useNavigate } from 'react-router-dom';

const editRecipe = ({
  recipe,
  onSave,
  isDarkMode
}: {
  recipe: Recipe
  onSave: (updated: Recipe) => void
  isDarkMode: boolean
}) => {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>({ ...recipe });
  const [categories, setCategories] = useState<Category[]>([]);
  const [unauthorized, setUnauthorized] = useState(false);  // משתנה להודעות לא מורשה
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
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
      if (!ingredient.Name) errors[`Ingridents-${index}-Name`] = `שם המצרך ${index + 1} הוא שדה חובה`;
      if (!ingredient.Count) errors[`Ingridents-${index}-Count`] = `כמות המצרך ${index + 1} היא שדה חובה`;
      if (!ingredient.Type) errors[`Ingridents-${index}-Type`] = `סוג המצרך ${index + 1} הוא שדה חובה`;
    });


    editedRecipe.Instructions.forEach((instruction, index) => {
      if (!instruction.Name) errors[`instruction-${index}`] = `הוראת הכנה ${index + 1} היא שדה חובה`;
    });

    setErrors(errors);
    return Object.keys(errors).length === 0; // אם אין שגיאות
  };

  const removeIngredient = (index: number) => {
    if (editedRecipe.Ingridents.length > 1) {
      const updatedIngredients = [...editedRecipe.Ingridents]
      updatedIngredients.splice(index, 1)
      setEditedRecipe((prev) => ({
        ...prev,
        Ingridents: updatedIngredients,
      }))
    }
  }

  const removeInstruction = (index: number) => {
    if (editedRecipe.Instructions.length > 1) {
      const updatedInstructions = [...editedRecipe.Instructions]
      updatedInstructions.splice(index, 1)
      setEditedRecipe((prev) => ({
        ...prev,
        Instructions: updatedInstructions,
      }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return; // אם יש שגיאות, לא נמשיך

    try {
      const res = await axios.post<ResRecipe>('http://localhost:8080/api/recipe/edit', editedRecipe);
      onSave(res.data);      
      nav('/'); // נווט לדף המתכונים
    } catch (error) {
      console.log('Error saving recipe:', error);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
        color: isDarkMode ? "#fff" : "#000",
        padding: 4,
      }}
      dir="rtl"
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 800,
          borderRadius: 3,
          backgroundColor: isDarkMode ? "#333333" : "#333333",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            padding: 3,
            backgroundColor: isDarkMode ? "#333" : "#f0f7ff",
            borderBottom: "1px solid",
            borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h4" align="center" sx={{ fontWeight: 600, color: isDarkMode ? "white" : "white", fontFamily: "inherit" }}>
            עריכת פרטי מתכון
          </Typography>
        </Box>

        <CardContent sx={{ padding: 4, backgroundColor: isDarkMode ? "#444444" : "#444444", }}>
          <Stack spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: isDarkMode ? "#90caf9" : "#1976d2", fontFamily: "inherit" }}>
              פרטי מתכון בסיסיים
            </Typography>

            <TextField
              label="שם המתכון"
              value={editedRecipe.Name}
              onChange={(e) => handleChange(e, "Name")}
              fullWidth
              variant="outlined"
              error={!!errors.Name}
              helperText={errors.Name}
              InputLabelProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
              InputProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                },
              }}
            />

            <TextField
              label="תיאור"
              value={editedRecipe.Description}
              onChange={(e) => handleChange(e, "Description")}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              error={!!errors.Description}
              helperText={errors.Description}
              InputLabelProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
              InputProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                    
                  },
                },
              }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="רמת קושי"
                type="number"
                value={editedRecipe.Difficulty}
                onChange={(e) => handleChange(e, "Difficulty")}
                fullWidth
                variant="outlined"
                error={!!errors.Difficulty}
                helperText={errors.Difficulty}
                InputLabelProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                InputProps={{
                  style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" },
                  inputProps: { min: 1, max: 5 },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white', 
                    },
                  },
                }}
              />

              <TextField
                label="משך זמן הכנה (דקות)"
                type="number"
                value={editedRecipe.Duration}
                onChange={(e) => handleChange(e, "Duration")}
                fullWidth
                variant="outlined"
                error={!!errors.Duration}
                helperText={errors.Duration}
                InputLabelProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                InputProps={{
                  style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" },
                  inputProps: { min: 1 },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
            </Box>

            <FormControl fullWidth error={!!errors.Categoryid} variant="outlined">
              <InputLabel
                id="category-label"
                style={{
                  fontFamily: "inherit",
                  color: isDarkMode ? "white" : "white",
                }}
              >
                קטגוריה
              </InputLabel>
              <Select
                labelId="category-label"
                value={editedRecipe.Categoryid || ""}
                label="קטגוריה"
                onChange={(e) =>
                  setEditedRecipe((prev) => ({
                    ...prev,
                    Categoryid: Number.parseInt(e.target.value as string),
                  }))
                }
                style={{
                  fontFamily: "inherit",
                  color: "white",
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "#444444", // רקע התפריט הנפתח
                      color: "white", // צבע טקסט ברשימה
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: "white", // מסגרת לבנה לשדה
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: "white",
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: "white",
                  },
                  backgroundColor: "#444444",
                }}
              >
                {categories.map((cat) => (
                  <MenuItem
                    key={cat.Id}
                    value={cat.Id}
                    sx={{
                      fontFamily: "inherit",
                      backgroundColor: "#2e2e2e",
                      color: "white",
                      '&:hover': {
                        backgroundColor: "#3a3a3a",
                      },
                      '&.Mui-selected': {
                        backgroundColor: "#444444",
                      },
                    }}
                  >
                    {cat.Name}
                  </MenuItem>
                ))}
              </Select>
              {errors.Categoryid && <FormHelperText>{errors.Categoryid}</FormHelperText>}
            </FormControl>

            <TextField
              label="קישור לתמונה"
              variant="outlined"
              fullWidth
              value={editedRecipe.Img || ""}
              onChange={(e) =>
                setEditedRecipe((prev) => ({
                  ...prev,
                  Img: e.target.value,
                }))
              }
              style={{
                fontFamily: "inherit",
                color: "white",
              }}
              InputLabelProps={{
                style: {
                  color: "white",
                  fontFamily: "inherit",
                },
              }}
              sx={{
                mt: 2,
                backgroundColor: "#2e2e2e",
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  color: 'white',
                  fontFamily: 'inherit',
                },
              }}
            />

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: isDarkMode ? "#90caf9" : "#1976d2", fontFamily: "inherit" }}>
                  מצרכים
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addIngredient}
                  size="small"
                  sx={{
                    borderRadius: 8, fontFamily: "inherit", backgroundColor: isDarkMode ? "#90caf9" : "#1976d2",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#64b5f6" : "#1565c0",
                    }, color: isDarkMode ? "white" : "white"
                  }}
                >
                  הוסף מצרך
                </Button>
              </Box>

              {editedRecipe.Ingridents.map((ingredient: Ingredient, index: number) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                    fontFamily: "inherit",
                    color: isDarkMode ? "white" : "white"
                  }}
                >
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500, fontFamily: "inherit", color: isDarkMode ? "white" : "white" }}>
                        מצרך {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeIngredient(index)}
                        disabled={editedRecipe.Ingridents.length <= 1}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        label="שם"
                        value={ingredient.Name}
                        onChange={(e) => handleIngredientChange(e, index, "Name")}
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={!!errors[`Ingridents-${index}-Name`]}
                        helperText={errors[`Ingridents-${index}-Name`]}
                        InputLabelProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                        InputProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'white',  
                            },
                          },
                        }}
                      />
                      <TextField
                        label="כמות"
                        value={ingredient.Count}
                        onChange={(e) => handleIngredientChange(e, index, "Count")}
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={!!errors[`Ingridents-${index}-Count`]}
                        helperText={errors[`Ingridents-${index}-Count`]}
                        InputLabelProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                        InputProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'white',
                            },
                          },
                        }}
                      />
                      <TextField
                        label="סוג"
                        value={ingredient.Type}
                        onChange={(e) => handleIngredientChange(e, index, "Type")}
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={!!errors[`Ingridents-${index}-Type`]}
                        helperText={errors[`Ingridents-${index}-Type`]}
                        InputLabelProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                        InputProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'white',
                            },
                          },
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, color: isDarkMode ? "white" : "white" }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: isDarkMode ? "#90caf9" : "#1976d2", fontFamily: "inherit" }}>
                  הוראות הכנה
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addInstruction}
                  size="small"
                  sx={{
                    borderRadius: 8, fontFamily: "inherit", backgroundColor: isDarkMode ? "#90caf9" : "#1976d2",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#64b5f6" : "#1565c0",
                    }, color: isDarkMode ? "white" : "white"
                  }}
                >
                  הוסף הוראה
                </Button>
              </Box>

              {editedRecipe.Instructions.map((instruction: Instruction, index: number) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                    color: isDarkMode ? "white" : "white"
                  }}
                >
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500, fontFamily: "inherit", color: isDarkMode ? "white" : "white" }}>
                        שלב {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeInstruction(index)}
                        disabled={editedRecipe.Instructions.length <= 1}
                        sx={{ fontFamily: "inherit", color: isDarkMode ? "white" : "white" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <TextField
                      label={`הוראה ${index + 1}`}
                      value={instruction.Name}
                      onChange={(e) => handleInstructionChange(e, index)}
                      fullWidth
                      multiline
                      rows={2}
                      variant="outlined"
                      error={!!errors[`Instructions-${index}`]}
                      helperText={errors[`Instructions-${index}`]}
                      InputLabelProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                      InputProps={{ style: { fontFamily: "inherit", color: isDarkMode ? "white" : "white" } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'white', 
                          },
                        },
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={handleSave}
              fullWidth
              size="large"
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "1.1rem",
                fontFamily: "inherit",
                fontWeight: 600,
                backgroundColor: isDarkMode ? "#90caf9" : "#1976d2",
                "&:hover": {
                  backgroundColor: isDarkMode ? "#64b5f6" : "#1565c0",
                },
                color: "black"
              }}
            >
              שמור מתכון
            </Button>
          </Stack>
        </CardContent>
      </Paper>
    </Box>
  )
};

export default editRecipe;
