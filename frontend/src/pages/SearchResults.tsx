import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import recipeService, { type Recipe } from "@/services/recipeService";

// Module-level cache for fallback results when API quota is exceeded
let cachedResults: Recipe[] = [];

const CATEGORIES = ["All", "Main Course", "Soup", "Salad", "Dessert", "Appetizer", "Side Dish"];
const DIETS = ["Gluten Free", "Vegan", "Vegetarian", "Dairy Free"];

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const navigate = useNavigate();

  // Results & Core states
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<string>("");

  // Input state for inline searching
  const [newQuery, setNewQuery] = useState(query);

  // Sorting & Filtering states
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState<number | "any">("any");

  // Keep query input in sync with URL changes
  useEffect(() => {
    setNewQuery(query);
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setWarning("");
      try {
        const response = await recipeService.search({ query, number: 12 });
        setResults(response.results);
        cachedResults = response.results;
      } catch (err: any) {
        console.error("Search failed", err);
        const status = err.response?.status;
        if (status === 503) {
          if (cachedResults.length > 0) {
            setResults(cachedResults);
            setWarning("Showing previous results — daily limit reached.");
          } else {
            setWarning("Daily recipe limit reached, please try again tomorrow");
          }
        } else {
          if (cachedResults.length > 0) {
            setResults(cachedResults);
          } else {
            setWarning("Unable to fetch recipes. Please try again later.");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  // Handle inline search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(newQuery.trim())}`);
    }
  };

  // Toggle dietary filters
  const handleDietToggle = (diet: string) => {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  // Process sorting & filtering
  const getProcessedResults = () => {
    let list = [...results];

    // 1. Categorization (Dish type pill)
    if (selectedCategory !== "All") {
      list = list.filter((recipe) =>
        recipe.dishTypes?.some((t) => t.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // 2. Dietary filters
    if (selectedDiets.length > 0) {
      list = list.filter((recipe) =>
        selectedDiets.every((diet) =>
          recipe.diets?.some((d) => d.toLowerCase() === diet.toLowerCase())
        )
      );
    }

    // 3. Cooking/prep time filter (with safety checks)
    if (maxTime !== "any") {
      list = list.filter(
        (recipe) =>
          recipe.readyInMinutes !== undefined &&
          recipe.readyInMinutes !== null &&
          recipe.readyInMinutes > 0 &&
          recipe.readyInMinutes <= maxTime
      );
    }

    // 4. Sorting
    if (sortBy === "time-asc") {
      list.sort((a, b) => (a.readyInMinutes ?? 9999) - (b.readyInMinutes ?? 9999));
    } else if (sortBy === "time-desc") {
      list.sort((a, b) => (b.readyInMinutes ?? 0) - (a.readyInMinutes ?? 0));
    } else if (sortBy === "title-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "title-desc") {
      list.sort((a, b) => b.title.localeCompare(a.title));
    }

    return list;
  };

  const processedResults = getProcessedResults();

  return (
    <div className="min-h-screen bg-[#070503] text-white font-['Inter',sans-serif] pt-24 pb-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none blur-3xl" />

      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto px-6 pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors group self-start"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span></span>
        </button>

        {/* Inline Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md w-full relative">
          <input
            type="text"
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-5 pr-12 focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-full p-1.5 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Title */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <h1 className="text-3xl font-bold font-['Outfit',sans-serif]">
          Results for <span className="text-amber-400">"{query}"</span>
          {results.length > 0 && (
            <span className="text-sm font-normal text-gray-400 ml-3">
              ({processedResults.length} recipes found)
            </span>
          )}
        </h1>
      </div>

      {/* Warning Banner */}
      {warning && (
        <div className="max-w-6xl mx-auto px-6 mb-8">
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-md">
            <span className="text-xl">⚠️</span>
            <span className="font-medium">{warning}</span>
          </div>
        </div>
      )}

      {/* Main Grid Layout: Filters Sidebar + Results Grid */}
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[250px_1fr] gap-8 items-start relative z-10">
        
        {/* Filters Sidebar */}
        <aside className="bg-white/5 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-8 lg:sticky lg:top-8">
          
          {/* Sorting */}
          <div>
            <label className="block text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider font-['Outfit',sans-serif]">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#140e0a] border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
            >
              <option value="recommended">Recommended</option>
              <option value="time-asc">Time: Fast to Slow</option>
              <option value="time-desc">Time: Slow to Fast</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>

          {/* Prep Time Limit */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider font-['Outfit',sans-serif]">
              Ready Time
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { label: "Any Time", value: "any" },
                { label: "Under 15 Mins", value: 15 },
                { label: "Under 30 Mins", value: 30 },
                { label: "Under 60 Mins", value: 60 },
              ].map((timeOpt) => (
                <button
                  key={timeOpt.label}
                  onClick={() => setMaxTime(timeOpt.value as any)}
                  className={`text-left text-sm py-2 px-3.5 rounded-xl transition-all font-medium border ${
                    maxTime === timeOpt.value
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-300 font-semibold"
                      : "bg-transparent border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/2"
                  }`}
                >
                  {timeOpt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Diets */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-3 uppercase tracking-wider font-['Outfit',sans-serif]">
              Dietary Options
            </h3>
            <div className="flex flex-col gap-3">
              {DIETS.map((diet) => {
                const isSelected = selectedDiets.includes(diet);
                return (
                  <button
                    key={diet}
                    onClick={() => handleDietToggle(diet)}
                    className={`flex items-center gap-3 w-full py-2 px-3 rounded-xl transition-all border ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                        : "bg-transparent border-transparent text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center border text-xs ${
                        isSelected
                          ? "bg-amber-500 border-amber-500 text-black"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>
                    <span className="text-sm font-medium">{diet}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="space-y-6">
          
          {/* Category Pills (Horizontal Scroll) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isSelected
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Results Grid */}
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
                />
              </div>
            ) : processedResults.length > 0 ? (
              <motion.div
                layout
                className="grid md:grid-cols-2 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {processedResults.map((recipe) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={recipe.id}
                      className="bg-white/5 border border-white/5 backdrop-blur-md rounded-3xl p-5 hover:shadow-[0_15px_30px_rgba(255,193,7,0.1)] hover:border-amber-500/20 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="flex gap-4">
                        <img
                          src={recipe.image || "https://images.unsplash.com/photo-1546833998-877b9a0a2fa5?w=200"}
                          alt={recipe.title}
                          className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl shadow-lg flex-shrink-0"
                        />
                        <div className="flex-grow min-w-0">
                          <h3 className="text-base md:text-lg font-semibold text-amber-300 line-clamp-2 mb-1.5 font-['Outfit',sans-serif]">
                            {recipe.title}
                          </h3>
                          
                          {/* Recipe Info Badges */}
                          <div className="flex flex-wrap gap-2 mb-2">
                            {recipe.readyInMinutes ? (
                              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-gray-300">
                                ⏱ {recipe.readyInMinutes}m
                              </span>
                            ) : null}
                            {recipe.diets?.slice(0, 2).map((d) => (
                              <span
                                key={d}
                                className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full capitalize"
                              >
                                {d}
                              </span>
                            ))}
                          </div>

                          {recipe.summary && (
                            <p
                              className="text-gray-400 text-xs line-clamp-2 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: recipe.summary }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
                        <span className="text-[10px] text-gray-500 capitalize">
                          {recipe.dishTypes?.slice(0, 1).join("") || "Recipe"}
                        </span>
                        <Link
                          to={`/recipes/${recipe.id}`}
                          className="text-amber-400 text-xs font-semibold hover:text-amber-300 flex items-center gap-1 group"
                        >
                          <span>View Details</span>
                          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/2">
                <p className="text-gray-400 text-lg mb-2">No matching recipes found.</p>
                <p className="text-gray-500 text-sm">
                  Try clearing some filters or searching for a different keyword.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
