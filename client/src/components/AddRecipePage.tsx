import { useContext, useState, useEffect } from 'react';
import { Category, Recipe } from '../repositories/RecipeType';
import axios from 'axios';
import { ResRecipe, convertResRecipeToRecipeType } from '../repositories/ResRecipe';
import { detailsContext } from '../context/Provider';
import AddRecipe from './AddRecipe';

const AddRecipePage = () => {
  const detailsContextProvider = useContext(detailsContext);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // טעינת הקטגוריות מראש
    const loadCategories = async () => {
      try {
        const { data } = await axios.get<Category[]>('http://localhost:8080/api/category');
        setCategories(data);
      } catch (error) {
        console.log('שגיאה בטעינת הקטגוריות:', error);
      }
    };
    loadCategories();
  }, []);

  const [newRecipe, setNewRecipe] = useState<Recipe>({
    Id: 0,
    Name: '',
    UserId: detailsContextProvider.id,
    CategoryId: 0,
    Img: '',
    Duration: 0,
    Difficulty: 1,
    Description: '',
    Ingridents: [{ Name: '', Count: '', Type: '' }],
    Instructions: [{ Name: '' }],
  });

  const handleSave = async (recipeToSave: Recipe) => {
    try {
      const res = await axios.post<ResRecipe>('http://localhost:8080/api/recipe', recipeToSave);
      const created = convertResRecipeToRecipeType(res.data);
      alert('המתכון נוסף בהצלחה!');
      setNewRecipe(created); // או איפוס מחדש אם תרצי
    } catch (error) {
      console.log('שגיאה ביצירת מתכון:', error);
    }
  };

  return (
    <>
      <AddRecipe
        recipe={newRecipe}
        onSave={handleSave}
        isDarkMode={true}
        categories={categories}
      />
    </>
  );
};

export default AddRecipePage;
