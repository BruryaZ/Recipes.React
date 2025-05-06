"use client"

import type React from "react"

import { useContext, useState } from "react"
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
  FormHelperText,
  Paper,
  Divider,
  IconButton,
  Card,
  CardContent,
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"
import axios from "axios"
import type { Category, Ingredient, Instruction, Recipe } from "../repositories/RecipeType"
import { convertResRecipeToRecipeType, type ResRecipe } from "../repositories/ResRecipe"
import { detailsContext } from "../context/Provider"
import { useNavigate } from "react-router-dom"

const AddRecipe = ({
  recipe,
  onSave,
  isDarkMode,
  categories,
}: {
  recipe: Recipe
  onSave: (updated: Recipe) => void
  isDarkMode: boolean
  categories: Category[]
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const detailsContextProvider = useContext(detailsContext)
  const nav = useNavigate()
  const [addRecipe, setAddRecipe] = useState<Recipe>({
    ...recipe,
    Categoryid: recipe.Categoryid || (categories[0] ? categories[0].Id : 1),
  })

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!addRecipe.Name.trim()) newErrors.Name = "נא להזין שם למתכון"
    if (!addRecipe.Description.trim()) newErrors.Description = "נא להזין תיאור"
    if (!addRecipe.Difficulty || isNaN(+addRecipe.Difficulty)) newErrors.Difficulty = "נא להזין רמת קושי מספרית"
    if (!addRecipe.Duration || isNaN(+addRecipe.Duration)) newErrors.Duration = "נא להזין זמן הכנה במספרים"
    if (!addRecipe.Categoryid) newErrors.Categoryid = "נא לבחור קטגוריה"

    addRecipe.Ingridents.forEach((ing, i) => {
      if (!ing.Name.trim()) newErrors[`Ingridents-${i}-Name`] = "שם חובה"
      if (!ing.Count.trim()) newErrors[`Ingridents-${i}-Count`] = "כמות חובה"
      if (!ing.Type.trim()) newErrors[`Ingridents-${i}-Type`] = "סוג חובה"
    })

    addRecipe.Instructions.forEach((inst, i) => {
      if (!inst.Name.trim()) newErrors[`Instructions-${i}`] = "הוראה לא יכולה להיות ריקה"
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, field: string) => {
    setAddRecipe((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const handleIngredientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    field: string,
  ) => {
    const updatedIngredients = [...addRecipe.Ingridents]
    ;(updatedIngredients[index] as any)[field] = e.target.value
    setAddRecipe((prev) => ({
      ...prev,
      Ingridents: updatedIngredients,
    }))
    setErrors((prev) => ({ ...prev, [`Ingridents-${index}-${field}`]: "" }))
  }

  const handleInstructionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const updatedInstructions = [...addRecipe.Instructions]
    updatedInstructions[index].Name = e.target.value
    setAddRecipe((prev) => ({
      ...prev,
      Instructions: updatedInstructions,
    }))
    setErrors((prev) => ({ ...prev, [`Instructions-${index}`]: "" }))
  }

  const addInstruction = () => {
    setAddRecipe((prev) => ({
      ...prev,
      Instructions: [...prev.Instructions, { Name: "" }],
    }))
  }

  const addIngredient = () => {
    setAddRecipe((prev) => ({
      ...prev,
      Ingridents: [...prev.Ingridents, { Name: "", Count: "", Type: "" }],
    }))
  }

  const removeIngredient = (index: number) => {
    if (addRecipe.Ingridents.length > 1) {
      const updatedIngredients = [...addRecipe.Ingridents]
      updatedIngredients.splice(index, 1)
      setAddRecipe((prev) => ({
        ...prev,
        Ingridents: updatedIngredients,
      }))
    }
  }

  const removeInstruction = (index: number) => {
    if (addRecipe.Instructions.length > 1) {
      const updatedInstructions = [...addRecipe.Instructions]
      updatedInstructions.splice(index, 1)
      setAddRecipe((prev) => ({
        ...prev,
        Instructions: updatedInstructions,
      }))
    }
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      addRecipe.UserId = detailsContextProvider.id
      addRecipe.Img =
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
      const { data } = await axios.post<ResRecipe>("http://localhost:8080/api/recipe", addRecipe)
      onSave(convertResRecipeToRecipeType(data))
      nav("/recipes")
    } catch (error) {
      console.log("שגיאה בשמירת מתכון:", error)
    }
  }

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
          backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
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
          <Typography variant="h4" align="center" sx={{ fontWeight: 600, color: isDarkMode ? "#fff" : "#1976d2" }}>
            {addRecipe.Id === 0 ? "הוספת מתכון חדש" : "עריכת פרטי מתכון"}
          </Typography>
        </Box>

        <CardContent sx={{ padding: 4 }}>
          <Stack spacing={4}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: isDarkMode ? "#90caf9" : "#1976d2" }}>
              פרטי מתכון בסיסיים
            </Typography>

            <TextField
              label="שם המתכון"
              value={addRecipe.Name}
              onChange={(e) => handleChange(e, "Name")}
              fullWidth
              variant="outlined"
              error={!!errors.Name}
              helperText={errors.Name}
              InputLabelProps={{ style: { fontFamily: "inherit" } }}
              InputProps={{ style: { fontFamily: "inherit" } }}
            />

            <TextField
              label="תיאור"
              value={addRecipe.Description}
              onChange={(e) => handleChange(e, "Description")}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              error={!!errors.Description}
              helperText={errors.Description}
              InputLabelProps={{ style: { fontFamily: "inherit" } }}
              InputProps={{ style: { fontFamily: "inherit" } }}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="רמת קושי"
                type="number"
                value={addRecipe.Difficulty}
                onChange={(e) => handleChange(e, "Difficulty")}
                fullWidth
                variant="outlined"
                error={!!errors.Difficulty}
                helperText={errors.Difficulty}
                InputLabelProps={{ style: { fontFamily: "inherit" } }}
                InputProps={{
                  style: { fontFamily: "inherit" },
                  inputProps: { min: 1, max: 5 },
                }}
              />

              <TextField
                label="משך זמן הכנה (דקות)"
                type="number"
                value={addRecipe.Duration}
                onChange={(e) => handleChange(e, "Duration")}
                fullWidth
                variant="outlined"
                error={!!errors.Duration}
                helperText={errors.Duration}
                InputLabelProps={{ style: { fontFamily: "inherit" } }}
                InputProps={{
                  style: { fontFamily: "inherit" },
                  inputProps: { min: 1 },
                }}
              />
            </Box>

            <FormControl fullWidth error={!!errors.Categoryid} variant="outlined">
              <InputLabel id="category-label" style={{ fontFamily: "inherit" }}>
                קטגוריה
              </InputLabel>
              <Select
                labelId="category-label"
                value={addRecipe.Categoryid || ""}
                label="קטגוריה"
                onChange={(e) =>
                  setAddRecipe((prev) => ({
                    ...prev,
                    Categoryid: Number.parseInt(e.target.value as string),
                  }))
                }
                style={{ fontFamily: "inherit" }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.Id} value={cat.Id}>
                    {cat.Name}
                  </MenuItem>
                ))}
              </Select>
              {errors.Categoryid && <FormHelperText>{errors.Categoryid}</FormHelperText>}
            </FormControl>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: isDarkMode ? "#90caf9" : "#1976d2" }}>
                  מצרכים
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addIngredient}
                  size="small"
                  sx={{ borderRadius: 8 }}
                >
                  הוסף מצרך
                </Button>
              </Box>

              {addRecipe.Ingridents.map((ingredient: Ingredient, index: number) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                  }}
                >
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500 }}>
                        מצרך {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeIngredient(index)}
                        disabled={addRecipe.Ingridents.length <= 1}
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
                        InputLabelProps={{ style: { fontFamily: "inherit" } }}
                        InputProps={{ style: { fontFamily: "inherit" } }}
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
                        InputLabelProps={{ style: { fontFamily: "inherit" } }}
                        InputProps={{ style: { fontFamily: "inherit" } }}
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
                        InputLabelProps={{ style: { fontFamily: "inherit" } }}
                        InputProps={{ style: { fontFamily: "inherit" } }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: isDarkMode ? "#90caf9" : "#1976d2" }}>
                  הוראות הכנה
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addInstruction}
                  size="small"
                  sx={{ borderRadius: 8 }}
                >
                  הוסף הוראה
                </Button>
              </Box>

              {addRecipe.Instructions.map((instruction: Instruction, index: number) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                    backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                  }}
                >
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ flexGrow: 1, fontWeight: 500 }}>
                        שלב {index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeInstruction(index)}
                        disabled={addRecipe.Instructions.length <= 1}
                        sx={{ color: "error.main" }}
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
                      InputLabelProps={{ style: { fontFamily: "inherit" } }}
                      InputProps={{ style: { fontFamily: "inherit" } }}
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
                fontWeight: 600,
                backgroundColor: isDarkMode ? "#90caf9" : "#1976d2",
                "&:hover": {
                  backgroundColor: isDarkMode ? "#64b5f6" : "#1565c0",
                },
              }}
            >
              שמור מתכון
            </Button>
          </Stack>
        </CardContent>
      </Paper>
    </Box>
  )
}

export default AddRecipe
