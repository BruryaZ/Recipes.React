import Ingredient from "./Ingredient";

type RecipeType = {
    Id: number,
    Name: string,
    Instructions: string[],// Instructions: [{ Name: "" }],
    Difficulty: "קשה" | "בינוני" | "קל",
    Duration: number,
    Description: string,
    UserId: number,
    CategoryId: number,
    Img: string,
    Ingrident: Ingredient[]
}

export default RecipeType;

// ❖	Id מזהה מתכון
// ❖	Name שם המתכון
// ❖	Instructions - מערך של הוראות
// ❖	Difficulty רמת קושי
// ❖	Duration - זמן הכנה
// ❖	Description - תיאור קצר
// ❖	UserId משתמש מוסיף
// ❖	CategoryId- (מספר) מזהה קטגוריה
// ❖	Img- מסוג מחרוזת url  קישור לתמונה מתאימה
// ❖	Ingrident מערך של:
