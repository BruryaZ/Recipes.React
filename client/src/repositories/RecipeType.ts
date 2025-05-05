type RecipeType = {
    Id: number,
    Name: string,
    Instructions: [{ Name: "" }],
    Difficulty: "קשה" | "בינוני" | "קל",
    Duration: number,
    Description: string,
    UserId: number,
    CategoryId: number,
    Img: string,
    Ingridents: Ingredient[],
    createdAt: string,
    updatedAt: string
}
export interface Ingredient {
    Name: string;
    Count: string;
    Type: string;
}

export interface Instruction {
    Name: string;
    RecipeId?: number;
}

export interface Recipe {
    Id: number;
    Name: string;
    UserId: number;
    CategoryId: number;
    Img: string;
    Duration: number;
    Difficulty: number;
    Description: string;
    Ingridents: Ingredient[];
    Instructions: Instruction[];
}

export interface Category {
    Id: number;
    Name: string;
}

export default RecipeType;