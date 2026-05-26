import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import recipeService, { type Recipe } from "@/services/recipeService";
import type { AxiosError } from "axios";



// Simple search component with premium styling
function RecipeSearch() {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Navigate to search results page with query parameter
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-4 mb-12">
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 placeholder:text-gray-400 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-full transition-all duration-300 shadow-lg"
          >
            Explore Recipies
          </button>
        </form>
      </div>
    </section>
  );
}

export default RecipeSearch;
