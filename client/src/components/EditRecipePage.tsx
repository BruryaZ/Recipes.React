import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
    CircularProgress,
    Box,
    Typography,
    Container
} from "@mui/material"
import type { CategoryRes, Recipe } from "../repositories/RecipeType"
import { convertResRecipeToRecipeType, ResRecipe } from "../repositories/ResRecipe"
import { detailsContext } from "../context/Provider"
import { useTheme } from "@mui/material/styles"
import EditRecipe2 from "./EditRecipe"

const EditRecipePage = () => {
    const { id } = useParams()
    const [recipe, setRecipe] = useState<Recipe>()
    const [categories, setCategories] = useState<CategoryRes[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const detailsContextProvider = useContext(detailsContext)
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recipeRes, categoriesRes] = await Promise.all([
                    axios.get<ResRecipe>(`http://localhost:8080/api/recipe/${id}`),
                    axios.get<CategoryRes[]>("http://localhost:8080/api/category")
                ])

                const fetchedRecipe = convertResRecipeToRecipeType(recipeRes.data)

                // בדיקת הרשאות
                if (recipeRes.data.UserId !== detailsContextProvider.id) {
                    setError("אין לך הרשאה לערוך מתכון זה")
                    return
                }

                setRecipe(fetchedRecipe)
                setCategories(categoriesRes.data)
            } catch (err) {
                setError("שגיאה בטעינת הנתונים")
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id])

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (error || !recipe) {
        return (
            <Typography color="error" align="center">
                {error || "לא נמצא מתכון"}
            </Typography>
        )
    }

    const handleSaveRecipe = (updatedRecipe: Recipe) => {
    }

    return (
        <Box
            sx={{
                backgroundColor: isDarkMode ? "#121212" : "#121212",
                minHeight: "100vh",
                py: 2,
            }}
        >
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2, fontFamily: "inherit"  }}>
                <EditRecipe2 recipe={recipe} isDarkMode={true} onSave={handleSaveRecipe} />
            </Container>
        </Box>
    )
}

export default EditRecipePage
