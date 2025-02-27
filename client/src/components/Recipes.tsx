import '../styles/global.css'
import axios from "axios";
import RecipeType from "../repositories/RecipeType";
import { useEffect, useState } from "react";
import '../styles/global.css';
import Recipe from "./Recipe";
import { CssBaseline, extendTheme, ThemeProvider } from '@mui/material';
import anyFood from '../img/health_recipe.webp'

const demoTheme = extendTheme({
    typography: {
        fontFamily: 'Heebo Thin',
    },
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#1976d2', // צבע ראשי
                },
                secondary: {
                    main: '#dc004e', // צבע משני
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: '#90caf9', // צבע ראשי בחשיכה
                },
                secondary: {
                    main: '#f48fb1', // צבע משני בחשיכה
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
    const [recipes, setRecipes] = useState<RecipeType[]>([]); // מערך של מתכונים

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await axios.get<RecipeType[]>('http://localhost:8080/api/recipe');
                setRecipes(res.data); // עדכון מצב המתכונים
            } catch (error) {
                console.log("Error fetching recipes:", error);
            }
        };

        fetchRecipes();
    }, []); // ריצה פעם אחת כאשר הקומפוננטה נטענת

    return (
        <ThemeProvider theme={demoTheme}>
            <CssBaseline />
            <div>
                {recipes.map((recipe) => (
                    <Recipe
                        key={recipe.Id}
                        title={recipe.Name}
                        date={new Date().toLocaleDateString()}
                        image={anyFood} //{recipe.Img ? recipe.Img : anyFood}
                        description={recipe.Description}
                        method={recipe.Instructions.map(instruction => instruction.Name)}
                        difficulty={recipe.Difficulty} // הוספת רמת קושי
                        duration={recipe.Duration} // הוספת משך זמן
                        userId={recipe.UserId} // הוספת מזהה משתמש
                        categoryId={recipe.CategoryId} // הוספת מזהה קטגוריה
                        ingredients={recipe.Ingrident} // הוספת רכיבים
                        instructions={recipe.Instructions} // הוספת הוראות
                    />
                ))}
            </div>
        </ThemeProvider>
    );
};

export default Recipes;
