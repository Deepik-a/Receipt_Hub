import React, { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import userService from "@/services/userService";
import recipeService, { type Recipe } from "@/services/recipeService";

function Profile() {
  const { user, setUser, isAuthenticated, token } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"recipes" | "settings">("recipes");

  useEffect(() => {
    if (tabParam === "settings" || tabParam === "recipes") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: "recipes" | "settings") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Favorites state
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [favLoading, setFavLoading] = useState<boolean>(true);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  // Avatar state
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  // Protect route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch favorites on mount
  const fetchFavorites = async () => {
    try {
      setFavLoading(true);
      const data = await recipeService.getFavorites();
      setFavorites(data.results);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    } finally {
      setFavLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPassError("New password must be at least 6 characters.");
      return;
    }

    try {
      setPassLoading(true);
      await userService.changePassword({ currentPassword, newPassword });
      setPassSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPassError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setPassLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError("");
    setAvatarLoading(true);

    try {
      const data = await userService.uploadAvatar(file);
      setUser(data.user);
    } catch (err: any) {
      setAvatarError(err.response?.data?.message || "Failed to upload avatar image.");
    } finally {
      setAvatarLoading(false);
    }
  };

  // Handle remove favorite
  const handleRemoveFavorite = async (recipeId: number, title: string) => {
    try {
      await recipeService.toggleFavorite(recipeId, title);
      setFavorites((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  // Helper to resolve avatar URL
  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop&q=80";
    if (user.avatarUrl.startsWith("http")) return user.avatarUrl;
    // Resolve relative path to backend server
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3333/api";
    // Strip trailing /api if it exists to get server root
    const serverRoot = apiBase.replace(/\/api$/, "");
    return `${serverRoot}${user.avatarUrl}`;
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#070503] text-white font-['Inter',sans-serif] pt-24 pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none blur-3xl" />

      {/* Header / Nav */}
      <div className="max-w-6xl mx-auto px-6 pt-12 mb-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-amber-400 transition-colors group mb-6"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Home</span>
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white/5 border border-white/5 p-8 rounded-3xl backdrop-blur-md">
          {/* Avatar Container */}
          <div className="relative group w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <img
              src={getAvatarUrl()}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-2 border-amber-500/40 shadow-2xl"
            />
            {avatarLoading ? (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-xs font-semibold text-amber-300">
                <span>Change Image</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* User Details */}
          <div className="text-center md:text-left flex-grow pt-4">
            <h1 className="text-3xl font-bold font-['Outfit',sans-serif] text-amber-300 mb-2">
              {user?.fullName || "Chef"}
            </h1>
            <p className="text-gray-400 mb-4">{user?.email}</p>
            {avatarError && <p className="text-red-500 text-sm mt-1">{avatarError}</p>}
            
            <div className="flex gap-4 justify-center md:justify-start mt-6">
              <button
                onClick={() => handleTabChange("recipes")}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  activeTab === "recipes"
                    ? "bg-amber-500 text-[#1a1208]"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                Saved Recipes ({favorites.length})
              </button>
              <button
                onClick={() => handleTabChange("settings")}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  activeTab === "settings"
                    ? "bg-amber-500 text-[#1a1208]"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                Account Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="max-w-6xl mx-auto px-6">
        {activeTab === "recipes" ? (
          <div>
            <h2 className="text-2xl font-semibold font-['Outfit',sans-serif] text-amber-400 mb-6">
              My Saved Recipes
            </h2>

            {favLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    layout
                    className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/20 transition-all group flex flex-col"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={recipe.image || "https://images.unsplash.com/photo-1546833998-877b9a0a2fa5?w=500"}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => handleRemoveFavorite(recipe.recipeId || recipe.id, recipe.title)}
                        className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-red-500 border border-white/10 hover:bg-black/80 transition-colors"
                        title="Remove from Saved"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <h3 className="font-semibold text-lg line-clamp-2 text-white group-hover:text-amber-300 transition-colors font-['Outfit',sans-serif] mb-4">
                        {recipe.title}
                      </h3>

                      <Link
                        to={`/recipes/${recipe.recipeId || recipe.id}`}
                        className="text-amber-400 hover:text-amber-300 font-medium text-sm flex items-center gap-1 group/link w-fit"
                      >
                        <span>View Details</span>
                        <span className="transform group-hover/link:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl bg-white/2">
                <p className="text-gray-400 text-lg mb-2">No saved recipes yet.</p>
                <p className="text-gray-500 text-sm">Heart recipes on details pages to save them here.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold font-['Outfit',sans-serif] text-amber-400 mb-6">
              Account Settings
            </h2>

            <div className="bg-white/5 border border-white/5 p-8 rounded-3xl backdrop-blur-md">
              <h3 className="text-lg font-semibold mb-6 text-gray-200">Change Password</h3>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                {user?.provider === "google" && (
                  <p className="text-amber-400/90 text-sm mb-4">
                    Note: Since you logged in with Google, you can set a password for the first time or update it below.
                  </p>
                )}

                {user?.provider !== "google" && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#140e0a]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#140e0a]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#140e0a]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>

                {passError && <p className="text-red-500 text-sm">{passError}</p>}
                {passSuccess && <p className="text-emerald-400 text-sm">{passSuccess}</p>}

                <button
                  type="submit"
                  disabled={passLoading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  {passLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
