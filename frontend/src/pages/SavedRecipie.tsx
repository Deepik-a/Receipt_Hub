// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import RecipeCard from '../components/RecipeCard';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { useRouter } from 'next/router';

// interface SavedRecipe {
//   id: number;
//   title: string;
//   image: string;
//   summary: string;
//   savedAt: string;
// }

// export default function SavedRecipesPage() {
//   const router = useRouter();
//   const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       router.push('/login');
//       return;
//     }
//     fetchSavedRecipes();
//   }, []);

//   const fetchSavedRecipes = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/user/saved-recipes`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setRecipes(response.data);
//     } catch (error) {
//       console.error('Error fetching saved recipes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeRecipe = async (recipeId: number) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/user/saved-recipes/${recipeId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
//     } catch (error) {
//       console.error('Error removing recipe:', error);
//     }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-8">My Saved Recipes</h1>
        
//         {recipes.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {recipes.map((recipe) => (
//               <div key={recipe.id} className="relative">
//                 <RecipeCard recipe={recipe} />
//                 <button
//                   onClick={() => removeRecipe(recipe.id)}
//                   className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center text-gray-500 mt-8">
//             <p>No saved recipes yet.</p>
//             <button
//               onClick={() => router.push('/')}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Browse Recipes
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }