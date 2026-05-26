import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import recipeService from "@/services/recipeService";
import useAuthStore from "@/store/authStore";

interface Ingredient {
  id: number;
  original: string;
  name: string;
  amount: number;
  unit: string;
}

interface Step {
  number: number;
  step: string;
}

interface Instruction {
  name: string;
  steps: Step[];
}

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  extendedIngredients: Ingredient[];
  analyzedInstructions: Instruction[];
  nutrition?: {
    nutrients: Nutrient[];
  };
}

function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [toggleLoading, setToggleLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError("");
        const data = await recipeService.getById(Number(id), true);
        if (data && data.recipe) {
          setRecipe(data.recipe);
        } else {
          setError("Recipe details not found.");
        }
      } catch (err: any) {
        console.error("Failed to fetch recipe details", err);
        if (err.response?.status === 503) {
          setError("Daily recipe limit reached, please try again tomorrow");
        } else {
          setError("Failed to load recipe details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      if (!isAuthenticated || !id) return;
      try {
        const favoriteIds = await recipeService.getFavoriteIds();
        setIsFavorited(favoriteIds.includes(Number(id)));
      } catch (err) {
        console.error("Failed to check favorite status", err);
      }
    };

    fetchRecipeDetails();
    checkFavoriteStatus();
  }, [id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!recipe) return;
    try {
      setToggleLoading(true);
      const res = await recipeService.toggleFavorite(recipe.id, recipe.title, recipe.image);
      setIsFavorited(res.favorited);
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070503] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070503] flex flex-col items-center justify-center px-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center backdrop-blur-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4 font-['Outfit',sans-serif]">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-full transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  // Filter key nutrients
  const keyNutrients = recipe.nutrition?.nutrients.filter(n =>
    ["Calories", "Fat", "Carbohydrates", "Protein"].includes(n.name)
  ) || [];

  return (
    <div className="min-h-screen bg-[#070503] text-white font-['Inter',sans-serif] pt-24 pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none blur-3xl" />

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors group mb-8"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Results</span>
        </button>
      </div>

      {/* Recipe Header */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full aspect-[4/3] object-cover rounded-3xl border border-white/10 shadow-2xl relative z-10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-300 font-['Outfit',sans-serif] leading-tight">
              {recipe.title}
            </h1>
            <button
              onClick={handleFavoriteToggle}
              disabled={toggleLoading}
              className={`p-3 rounded-full border backdrop-blur-md transition-all duration-300 ${
                isFavorited
                  ? "bg-red-500/20 border-red-500/40 text-red-500 hover:bg-red-500/30"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
              aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorited ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6 transform active:scale-125 transition-transform duration-200"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-amber-400">⏱</span>
              <span>{recipe.readyInMinutes} Mins</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-amber-400">👥</span>
              <span>{recipe.servings} Servings</span>
            </div>
          </div>

          <p
            className="text-gray-300 leading-relaxed line-clamp-6 text-base"
            dangerouslySetInnerHTML={{ __html: recipe.summary }}
          />
        </motion.div>
      </div>

      {/* Key Nutrition Badges */}
      {keyNutrients.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <h2 className="text-2xl font-semibold text-amber-400 font-['Outfit',sans-serif] mb-6">Nutrition Facts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {keyNutrients.map((n) => (
              <div key={n.name} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md">
                <span className="text-gray-400 text-sm block mb-1">{n.name}</span>
                <span className="text-2xl font-bold text-white block">
                  {Math.round(n.amount)} {n.unit}
                </span>
                <span className="text-amber-400/80 text-xs mt-1 block">
                  {Math.round(n.percentOfDailyNeeds)}% Daily Value
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients & Instructions Grid */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12">
        {/* Ingredients */}
        <div className="md:col-span-5">
          <h2 className="text-2xl font-semibold text-amber-400 font-['Outfit',sans-serif] mb-6">Ingredients</h2>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <ul className="space-y-4">
              {recipe.extendedIngredients?.map((ing, index) => (
                <li key={`${ing.id}-${index}`} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                  <span className="text-amber-400 mt-1">•</span>
                  <span className="text-gray-300">
                    <strong className="text-white font-medium">
                      {Math.round(ing.amount * 100) / 100} {ing.unit}
                    </strong>{" "}
                    {ing.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="md:col-span-7">
          <h2 className="text-2xl font-semibold text-amber-400 font-['Outfit',sans-serif] mb-6">Instructions</h2>
          {recipe.analyzedInstructions && recipe.analyzedInstructions[0]?.steps.length > 0 ? (
            <div className="space-y-6">
              {recipe.analyzedInstructions[0].steps.map((step) => (
                <div key={step.number} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {step.number}
                  </div>
                  <p className="text-gray-300 leading-relaxed pt-1">{step.step}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No instructions available for this recipe.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetails;
