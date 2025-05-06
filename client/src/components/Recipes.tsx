import '../styles/global.css';
import axios from "axios";
import RecipeType, { CategoryRes } from "../repositories/RecipeType";
import { useEffect, useState } from "react";
import Recipe from "./Recipe";
import {
    CssBaseline, extendTheme, ThemeProvider,
    Select, MenuItem, InputLabel, FormControl,
    Grid, Box, Typography, TextField
} from '@mui/material';
import anyFood from '../img/health_recipe.webp';

const demoTheme = extendTheme({
    typography: {
        fontFamily: 'Heebo Thin',
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#1976d2',
                },
                secondary: {
                    main: '#dc004e',
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#90caf9',
                },
                secondary: {
                    main: '#f48fb1',
                },
            },
        },
    },
    colorSchemeSelector: 'class',
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

const Recipes = () => {
    const [recipes, setRecipes] = useState<RecipeType[]>([]);
    const [categories, setCategories] = useState<CategoryRes[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [durationFilter, setDurationFilter] = useState('');
    const [createdByFilter, setCreatedByFilter] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get<RecipeType[]>('http://localhost:8080/api/recipe');
                setRecipes(res.data);
            } catch (error) {
                console.log("Error fetching recipes:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await axios.get<CategoryRes[]>('http://localhost:8080/api/category');
                setCategories(res.data);
            } catch (error) {
                console.log("Error fetching categories:", error);
            }
        };

        fetchRecipes();
        fetchCategories();
    }, []);

    // מיפוי הערכים בין רמות קושי למספרים
    const difficultyMap: Record<string, number> = {
        'קל': 1,
        'בינוני': 2,
        'קשה': 3,
    };

    // פונקציית סינון
    const filteredRecipes = recipes.filter((recipe) => {
        return (
            (selectedCategory === 0 || recipe.Categoryid === selectedCategory) &&
            (selectedDifficulty === '' || Number(recipe.Difficulty) === difficultyMap[selectedDifficulty]) &&
            (durationFilter === '' || recipe.Duration.toString() === durationFilter) &&
            (createdByFilter === '' || recipe.UserId.toString().toLowerCase().includes(createdByFilter.toLowerCase()))
        );
    });

    return (
        <ThemeProvider theme={demoTheme}>
            <CssBaseline />
            <Grid container spacing={2} sx={{ px: 2, mt: 2 }}>
                {/* אזור המתכונים */}
                <Grid item xs={12} md={9}>
                    <Grid container justifyContent="center">
                        {filteredRecipes.length === 0 ? (
                            <Typography variant="h6" sx={{ mt: 4 }}>
                                לא נמצאו מתכונים שתואמים לסינון
                            </Typography>
                        ) : (
                            filteredRecipes.map((recipe) => (
                                <Grid item xs={12} sm={10} md={8} key={recipe.Id}>
                                    <Recipe
                                        Id={recipe.Id}
                                        title={recipe.Name}
                                        date={new Date(recipe.createdAt).toLocaleDateString('he-IL')}
                                        image={recipe.Img ? recipe.Img : anyFood}
                                        description={recipe.Description}
                                        method={recipe.Instructions.map(instruction => instruction.Name)}
                                        difficulty={recipe.Difficulty}
                                        duration={recipe.Duration}
                                        userId={recipe.UserId}
                                        categoryId={recipe.Categoryid}
                                        ingredients={recipe.Ingridents}
                                        instructions={recipe.Instructions}
                                    />
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Grid>

                {/* אזור הסינון בצד ימין */}
                <Grid item xs={12} md={3}>
                    <Box
                        sx={{
                            position: 'sticky',
                            top: 20,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            p: 2,
                            boxShadow: 2,
                            minWidth: '100%',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>סינון מתכונים</Typography>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>קטגוריה</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                                label="קטגוריה"
                            >
                                <MenuItem value={0}>הכול</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category.Id} value={category.Id}>{category.Name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
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

                        <TextField
                            fullWidth
                            margin="normal"
                            label="משך זמן (בדקות)"
                            value={durationFilter}
                            onChange={(e) => setDurationFilter(e.target.value)}
                            type="number"
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="נוצר על ידי (User ID)"
                            value={createdByFilter}
                            onChange={(e) => setCreatedByFilter(e.target.value)}
                        />
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

export default Recipes;
