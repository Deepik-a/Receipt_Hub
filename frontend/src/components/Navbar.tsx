import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import authService from "@/services/authService";

function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    setScrolled(window.scrollY > 30);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const links = [
    { label: "Home", onClick: () => {
      if (isHome) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } },
    { label: "Recipes", onClick: () => navigate("/search?q=") },
    {
      label: "Favourites",
      onClick: () => {
        if (isAuthenticated) {
          navigate("/profile?tab=recipes");
        } else {
          navigate("/login");
        }
      },
    },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local session even if API call fails
    }
    logout();
    navigate("/");
  };

  const getAvatarUrl = () => {
    if (!user?.avatarUrl) return "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=40&h=40&fit=crop&q=80";
    if (user.avatarUrl.startsWith("http")) return user.avatarUrl;
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3333/api";
    const serverRoot = apiBase.replace(/\/api$/, "");
    return `${serverRoot}${user.avatarUrl}`;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'glass-morphism' : 'bg-transparent'
      }`} 
      style={{ backdropFilter: scrolled ? 'blur(14px)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <span 
          onClick={() => navigate("/")}
          className="font-['Parisienne',cursive] text-3xl md:text-4xl bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent tracking-wide drop-shadow-sm cursor-pointer"
        >
          RecipieHub
        </span>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <ul className="flex items-center gap-8 lg:gap-10 text-[13px] text-gray-200 font-medium tracking-wider uppercase">
            {links.map(l => (
              <li key={l.label}>
                <button
                  onClick={l.onClick}
                  className="relative pb-1 transition-all duration-300 hover:text-amber-400 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Combined Name + Avatar Chip */}
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-amber-400/30 px-3 py-1.5 hover:bg-white/10 transition-all duration-300 group"
                >
                  <img
                    src={getAvatarUrl()}
                    alt="Profile"
                    className="w-7 h-7 object-cover rounded-full border-2 border-amber-400/60 group-hover:border-amber-400 transition-all"
                  />
                  <span className="text-sm font-medium text-gray-200 group-hover:text-amber-300 transition-colors">
                    {user?.fullName?.split(" ")[0] ?? "Chef"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-amber-400/60 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-amber-300 transition-all hover:bg-amber-400/10 hover:border-amber-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-full border border-amber-400/60 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-amber-300 transition-all hover:bg-amber-400/10 hover:border-amber-400"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#1a1208] transition-all hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col gap-1.5 p-2" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0,1,2].map(i => (
            <span 
              key={i} 
              className="block w-6 h-0.5 bg-gray-200 transition-all duration-300" 
              style={{
                opacity: menuOpen && i===1 ? 0 : 1,
                transform: menuOpen && i===0 ? "rotate(45deg) translateY(8px)" : menuOpen && i===2 ? "rotate(-45deg) translateY(-8px)" : "none"
              }} 
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className="md:hidden overflow-hidden transition-all duration-500" 
        style={{ maxHeight: menuOpen ? "460px" : "0", background: "rgba(10,7,5,0.98)", backdropFilter: "blur(12px)" }}
      >
        <ul className="flex flex-col px-8 pb-8 pt-3 gap-2">
          {links.map(l => (
            <li key={l.label} className="border-b border-white/10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  l.onClick();
                }}
                className="block w-full py-3 text-left text-gray-200 tracking-wider hover:text-amber-400 transition"
              >
                {l.label}
              </button>
            </li>
          ))}
          <li className="border-b border-white/10 pt-2">
            {isAuthenticated ? (
              <>
                {/* Mobile combined avatar + name */}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center gap-3 w-full py-3 text-left transition group"
                >
                  <img
                    src={getAvatarUrl()}
                    alt="Profile"
                    className="w-8 h-8 object-cover rounded-full border border-amber-400/60"
                  />
                  <span className="text-gray-200 tracking-wider group-hover:text-amber-400 transition">
                    {user?.fullName ?? "My Profile"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full py-3 text-left text-gray-200 tracking-wider hover:text-amber-400 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  className="block w-full py-3 text-left text-gray-200 tracking-wider hover:text-amber-400 transition"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/register");
                  }}
                  className="block w-full py-3 text-left text-amber-400 tracking-wider hover:text-amber-300 transition"
                >
                  Sign up
                </button>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
