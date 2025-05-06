import { useContext, useState, useEffect } from 'react';
import { Category, Recipe } from '../repositories/RecipeType';
import axios from 'axios';
import { detailsContext } from '../context/Provider';
import AddRecipe from './AddRecipe';
import { useNavigate } from 'react-router-dom';

const AddRecipePage = () => {
  const detailsContextProvider = useContext(detailsContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const nav = useNavigate()
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
    Categoryid: 1,
    Img: '',
    Duration: 0,
    Difficulty: 1,
    Description: '',
    Ingridents: [{ Name: '', Count: '', Type: '' }],
    Instructions: [{ Name: '' }],
  });

  const handleSave = (savedRecipe: Recipe) => {
    alert('המתכון נוסף בהצלחה!');
    setNewRecipe(savedRecipe); // או לאפס ל־default אם רוצים
    nav('/recipes'); // נווט לדף המתכונים
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
