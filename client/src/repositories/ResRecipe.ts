import { Ingredient, Instruction, Recipe } from "./RecipeType";

export interface ResRecipe {
    Id: number;
    Name: string;
    UserId: number;
    Categoryid: number; 
    Img: string;
    Duration: number;
    Difficulty: number;
    Description: string;
    Ingridents: Ingredient[];
    Instructions: Instruction[];
    createdAt: string; // או Date, אם אתה מתכוון להמיר את התאריך לאובייקט Date
    updatedAt: string; // או Date
}

// פונקציה להמרת ResRecipe ל-RecipeType
export function convertResRecipeToRecipeType(resRecipe: ResRecipe): Recipe {
    return {
        Id: resRecipe.Id,
        Name: resRecipe.Name,
        Instructions: resRecipe.Instructions.map(instruction => ({ Name: instruction.Name })),
        Difficulty: resRecipe.Difficulty,
        Duration: resRecipe.Duration,
        Description: resRecipe.Description,
        UserId: resRecipe.UserId,
        CategoryId: resRecipe.Categoryid ?? 0, // אם Categoryid הוא null, נשתמש ב-0
        Img: resRecipe.Img,
        Ingridents: resRecipe.Ingridents,
    };
}

// פונקציה להמרת RecipeType ל-ResRecipe
export function convertRecipeTypeToResRecipe(recipeType: Recipe): ResRecipe {
    return {
        Id: recipeType.Id,
        UserId: recipeType.UserId,
        Name: recipeType.Name,
        Img: recipeType.Img,
        Duration: recipeType.Duration,
        Difficulty: recipeType.Difficulty,
        Description: recipeType.Description,
        Categoryid: recipeType.CategoryId,
        Ingridents: recipeType.Ingridents,
        Instructions: recipeType.Instructions.map(instruction => ({ Name: instruction.Name })),
        createdAt: "",
        updatedAt: "",
    };
}