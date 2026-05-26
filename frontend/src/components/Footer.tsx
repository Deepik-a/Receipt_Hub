import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#060403] pt-16 pb-8 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <span className="font-['Parisienne',cursive] text-3xl text-amber-400">Recipe Hub</span>
            <p className="text-gray-500 text-sm mt-3">Discover, cook, and share delicious recipes from around the world.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-gray-500 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/search?q=" className="hover:text-amber-400 transition">Recipes</Link>
              </li>
              <li>
                <Link to="/profile?tab=recipes" className="hover:text-amber-400 transition">Saved Recipes</Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider font-semibold">Categories</h4>
            <ul className="mt-4 space-y-1 text-gray-500 text-sm">
              <li>
                <Link to="/search?q=breakfast" className="hover:text-amber-400 transition">Breakfast</Link>
              </li>
              <li>
                <Link to="/search?q=lunch" className="hover:text-amber-400 transition">Lunch</Link>
              </li>
              <li>
                <Link to="/search?q=dinner" className="hover:text-amber-400 transition">Dinner</Link>
              </li>
              <li>
                <Link to="/search?q=dessert" className="hover:text-amber-400 transition">Dessert</Link>
              </li>
              <li>
                <Link to="/search?q=vegetarian" className="hover:text-amber-400 transition">Vegetarian</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact & Social */}
          <div>
            <h4 className="text-white text-sm uppercase tracking-wider font-semibold">Get in Touch</h4>
            <ul className="mt-4 space-y-1 text-gray-500 text-sm">
              <li>hello@recipehub.com</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Instagram</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Facebook</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Pinterest</li>
              <li className="hover:text-amber-400 cursor-pointer transition">Twitter</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 text-center text-gray-600 text-xs">
          © {new Date().getFullYear()} Recipe Hub. All rights reserved. | Made with ❤️ for home cooks
        </div>
      </div>
    </footer>
  );
}

export default Footer;
