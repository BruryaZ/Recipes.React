import Ingredient from "./Ingredient";

type RecipeType = {
    Id: number,
    Name: string,
    Instructions:  [{ Name: "" }],
    Difficulty: "קשה" | "בינוני" | "קל",
    Duration: number,
    Description: string,
    UserId: number,
    CategoryId: number,
    Img: string,
    Ingrident: Ingredient[]
}

export default RecipeType;