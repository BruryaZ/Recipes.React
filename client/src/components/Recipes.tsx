import "../styles/global.css"
import axios from "axios"
import type RecipeType from "../repositories/RecipeType"
import type { CategoryRes } from "../repositories/RecipeType"
import { useEffect, useState } from "react"
import Recipe from "./Recipe"
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Box,
    Typography,
    TextField,
    Paper,
    Chip,
    Button,
    Card,
    CardContent,
    useTheme,
    InputAdornment,
    IconButton,
    Divider,
} from "@mui/material"
import { Search as SearchIcon, FilterList as FilterListIcon, Clear as ClearIcon } from "@mui/icons-material"
import anyFood from "../img/health_recipe.webp"

const Recipes = () => {
    const theme = useTheme()
    const isDarkMode = theme.palette.mode === "dark"
    const [recipes, setRecipes] = useState<RecipeType[]>([])
    const [categories, setCategories] = useState<CategoryRes[]>([])
    const [selectedCategory, setSelectedCategory] = useState<number>(0)
    const [selectedDifficulty, setSelectedDifficulty] = useState("")
    const [durationFilter, setDurationFilter] = useState("")
    const [createdByFilter, setCreatedByFilter] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get<RecipeType[]>("http://localhost:8080/api/recipe")
                setRecipes(res.data)
            } catch (error) {
                console.log("Error fetching recipes:", error)
            }
        }

        const fetchCategories = async () => {
            try {
                const res = await axios.get<CategoryRes[]>("http://localhost:8080/api/category")
                setCategories(res.data)
            } catch (error) {
                console.log("Error fetching categories:", error)
            }
        }

        fetchRecipes()
        fetchCategories()
    }, [])

    // מיפוי הערכים בין רמות קושי למספרים
    const difficultyMap: Record<string, number> = {
        קל: 1,
        בינוני: 2,
        קשה: 3,
    }

    const clearFilters = () => {
        setSelectedCategory(0)
        setSelectedDifficulty("")
        setDurationFilter("")
        setCreatedByFilter("")
        setSearchTerm("")
    }

    // פונקציית סינון
    const filteredRecipes = recipes.filter((recipe) => {
        const matchesSearch =
            searchTerm === "" ||
            recipe.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.Description.toLowerCase().includes(searchTerm.toLowerCase())

        return (
            matchesSearch &&
            (selectedCategory === 0 || recipe.Categoryid === selectedCategory) &&
            (selectedDifficulty === "" || Number(recipe.Difficulty) === difficultyMap[selectedDifficulty]) &&
            (durationFilter === "" || recipe.Duration.toString() === durationFilter) &&
            (createdByFilter === "" || recipe.UserId.toString().toLowerCase().includes(createdByFilter.toLowerCase()))
        )
    })

    const activeFiltersCount = [
        selectedCategory !== 0,
        selectedDifficulty !== "",
        durationFilter !== "",
        createdByFilter !== "",
        searchTerm !== "",
    ].filter(Boolean).length
    
    return (
        <Box
            sx={{
                backgroundColor: isDarkMode ? "#1e1e1e" : "#f5f5f5",
                minHeight: "100vh",
                padding: { xs: 2, md: 4 },
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 3,
                    backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: 2 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            mb: { xs: 2, md: 0 },
                            color: isDarkMode ? "#fff" : "#1976d2",
                        }}
                    >
                        מתכונים
                    </Typography>

                    <TextField
                        placeholder="חיפוש מתכונים..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                            maxWidth: { xs: "100%", md: "400px" },
                            ml: { xs: 0, md: "auto" },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                                        <ClearIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 8,
                                backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                            },
                        }}
                    />

                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                        sx={{
                            borderRadius: 8,
                            minWidth: "120px",
                            height: "56px",
                        }}
                    >
                        סינון
                        {activeFiltersCount > 0 && (
                            <Chip label={activeFiltersCount} size="small" color="primary" sx={{ ml: 1, height: 20, minWidth: 20 }} />
                        )}
                    </Button>
                </Box>

                {showFilters && (
                    <Box sx={{ mt: 3 }}>
                        <Divider sx={{ mb: 3 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>קטגוריה</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(Number(e.target.value))}
                                        label="קטגוריה"
                                    >
                                        <MenuItem value={0}>הכול</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.Id} value={category.Id}>
                                                {category.Name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>רמת קושי</InputLabel>
                                    <Select
                                        value={selectedDifficulty}
                                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                                        label="רמת קושי"
                                    >
                                        <MenuItem value="">הכול</MenuItem>
                                        <MenuItem value="קל">קל</MenuItem>
                                        <MenuItem value="בינוני">בינוני</MenuItem>
                                        <MenuItem value="קשה">קשה</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="משך זמן (בדקות)"
                                    value={durationFilter}
                                    onChange={(e) => setDurationFilter(e.target.value)}
                                    type="number"
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="נוצר על ידי (User ID)"
                                    value={createdByFilter}
                                    onChange={(e) => setCreatedByFilter(e.target.value)}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} sx={{ borderRadius: 8 }}>
                                נקה סינון
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* אזור המתכונים */}
            <Grid container spacing={3} justifyContent="center">
                {filteredRecipes.length === 0 ? (
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                p: 4,
                                textAlign: "center",
                                borderRadius: 3,
                                backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5" sx={{ mb: 2, color: isDarkMode ? "#90caf9" : "#1976d2" }}>
                                    לא נמצאו מתכונים שתואמים לסינון
                                </Typography>
                                <Typography variant="body1">נסו לשנות את הגדרות הסינון או לחפש מתכונים אחרים</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (
                    filteredRecipes.map((recipe) => (
                        <Grid
                            item
                            xs={12}
                            sm={10}
                            md={8}
                            lg={6}
                            key={recipe.Id}
                            sx={{
                                minWidth: "700px",
                                maxWidth: "800px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                mx: "auto",
                            }}
                        >
                            <Recipe
                                Id={recipe.Id}
                                title={recipe.Name}
                                date={new Date(recipe.createdAt).toLocaleDateString("he-IL")}
                                image={recipe.Img ? recipe.Img : anyFood}
                                description={recipe.Description}
                                method={recipe.Instructions.map((instruction) => instruction.Name)}
                                difficulty={recipe.Difficulty}
                                duration={recipe.Duration}
                                userId={recipe.UserId}
                                categoryId={recipe.Categoryid}
                                ingredients={recipe.Ingridents}
                                instructions={recipe.Instructions}
                                recipes= {recipes}
                                setRecipes={setRecipes}
                            />
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    )
}

export default Recipes
