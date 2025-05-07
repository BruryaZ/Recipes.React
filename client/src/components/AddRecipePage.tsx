import { useState, useEffect } from "react"
import { Box, Container } from "@mui/material"
import axios from "axios"
import type { Category, Recipe } from "../repositories/RecipeType"
import { useTheme } from "@mui/material/styles"
import AddRecipe from "./AddRecipe"
import { useNavigate } from "react-router-dom"

const AddRecipePage = () => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === "dark"
  const [categories, setCategories] = useState<Category[]>([])
  const nav = useNavigate()

  const emptyRecipe: Recipe = {
    Id: 0,
    Name: "",
    Description: "",
    Difficulty: 1,
    Duration: 30,
    Categoryid: 1,
    UserId: -1,
    Img: "",
    Ingridents: [{ Name: "", Count: "", Type: "" }],
    Instructions: [{ Name: "" }],
  }

  const [recipe] = useState<Recipe>(emptyRecipe)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>("http://localhost:8080/api/category")
        setCategories(res.data)
      } catch (error) {
        console.log("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleSaveRecipe = (updatedRecipe: Recipe) => {//todo
    nav('/')
  }

  return (
    <Box
      sx={{
        backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
        minHeight: "100vh",
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <AddRecipe recipe={recipe} onSave={handleSaveRecipe} isDarkMode={isDarkMode} categories={categories} />
      </Container>
    </Box>
  )
}

export default AddRecipePage
