import axios from "axios"
import RecipeType from "../repositories/RecipeType";
import { useEffect, useState } from "react";



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
        <div>
            {recipes.map((recipe: RecipeType) => (
                <div key={recipe.Id}>{/* מזהה מתכון */}
                    <h2>{recipe.Name}</h2>
                    <h3>{recipe.Description}</h3>
                    <img src={recipe.Img} alt={recipe.Name} />

                </div>
            ))}
        </div>
    );
};

export default Recipes