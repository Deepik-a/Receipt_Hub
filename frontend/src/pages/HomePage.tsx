import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RecipeSearch from "@/components/RecipeSearch"

// ─── Intersection Observer Hook (improved threshold) ─────────────────────
function useInView(threshold = 0.2, triggerOnce = true) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) obs.disconnect();
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, triggerOnce]);
  return { ref, inView };
}


// ─── High-quality Unsplash images (optimized & modern) ──────────────────
const IMG = {
  heroSteak:   "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1000&q=85&auto=format",
  heroTomato:  "https://images.unsplash.com/photo-1546470427-f5c9b4b8e1d6?w=300&q=80&auto=format",
  heroOnion:   "https://images.unsplash.com/photo-1618517351616-38da9d6eb5c4?w=300&q=80&auto=format",
  storySteak:  "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=900&q=85&auto=format",
  menuPlate:   "https://images.unsplash.com/photo-1546833998-877b9a0a2fa5?w=700&q=85&auto=format",
  sideSalad:   "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=85&auto=format",
  dessert:     "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=700&q=85&auto=format",
  events:      "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=900&q=85&auto=format",
  reservation: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85&auto=format",
  ingr1:       "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80&auto=format",
  ingr2:       "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&q=80&auto=format",
  ingr3:       "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80&auto=format",
  ingr4:       "https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&q=80&auto=format",
};

// ─── FadeUp component with refined easing ────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }) {
  const { ref, inView } = useInView(0.2);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0) rotateX(0deg)" : "translateY(55px) rotateX(-2deg)",
        transition: `opacity 0.9s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${delay}s, transform 0.9s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${delay}s`,
        willChange: "transform, opacity"
      }}
    >
      {children}
    </div>
  );
}




// ─── Hero section (modern, dynamic, improved images) ──────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);
 
  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "radial-gradient(circle at 30% 10%, #1f160e, #080604)" }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.85) contrast(1.15)" }}
        >
          <source src="/HeroVideo.mp4" type="video/mp4" />
          <img
            src="/HomePageImage.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </video>
        {/* extra dark veil so results grid is readable */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
 
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pt-28 pb-24 relative z-10 flex-1">
        <div className="grid lg:grid-cols-2 items-start gap-12 lg:gap-16">
          {/* Left text + search */}
          <div
            className="order-2 lg:order-1"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateX(0)" : "translateX(-50px)",
              transition: "all 1s cubic-bezier(0.2, 0.9, 0.4, 1.2) 0.2s",
            }}
          >
            <h1 className="font-['Cormorant_Garamond',serif] text-white font-bold text-5xl sm:text-6xl xl:text-7xl leading-[1.2] tracking-tight">
              FROM OUR HUB <br />
              TO YOUR HOME
            </h1>
 
            <p className="mt-6 text-gray-200 text-base max-w-md leading-relaxed border-l-2 border-amber-500/50 pl-5 backdrop-blur-sm bg-black/20 rounded-r-lg pr-2">
              We believe cooking should be joyful, not stressful. That's why every recipe on{" "}
              <span className="font-['Parisienne',cursive] text-amber-400 text-2xl md:text-3xl mb-3">
                RecipieHub{" "}
              </span>
              is carefully curated, easy to follow, and absolutely delicious.
            </p>
 
 
            {/* ── Recipe Search lives here ── */}
            <RecipeSearch />
          </div>
        </div>
      </div>
 
      <style>{`
        @keyframes floatParticle {
          0%   { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.3; }
          100% { transform: translateY(-35px) translateX(12px) rotate(12deg); opacity: 0.8; }
        }
        @keyframes slowFloatPlate {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(2deg); }
        }
        @keyframes gentleFloat {
          0%   { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-20px) scale(1.02); }
        }
      `}</style>
    </section>
  );
}

// ─── Our Story Component (improved layout) ─────────────────────────────
function OurStory() {
  const { ref, inView } = useInView(0.2);
  
  return (
    <div>
    <section ref={ref} className="relative py-8 md:py-0 overflow-hidden bg-[#0a0705]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row min-h-[620px] relative">
          
          {/* Left side - Square image with shutter effect */}
          <div 
            className="md:w-[40%] relative z-10"
            style={{ 
              opacity: inView ? 1 : 0, 
              transform: inView ? "translateX(0) skewX(0deg)" : "translateX(-150px) skewX(-12deg)", 
              transition: "opacity 0.7s ease 0.2s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s" 
            }}
          >
            <div className="h-full overflow-hidden rounded-l-3xl shadow-2xl">
              <img 
                src="/5.jpeg" 
                className="w-full h-full object-cover brightness-[0.9] hover:scale-105 transition-all duration-700" 
                alt="story" 
              />
            </div>
          </div>
          
          {/* Right side - Text content with shutter effect */}
          <div 
            className="md:w-[60%] bg-white px-8 md:pl-48 md:pr-20 py-12 md:py-16 flex flex-col justify-center rounded-r-3xl shadow-2xl ml-auto"
            style={{ 
              opacity: inView ? 1 : 0, 
              transform: inView ? "translateX(0) skewX(0deg)" : "translateX(150px) skewX(12deg)", 
              transition: "opacity 0.7s ease 0.3s, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s"
            }}
          >
            <span className="font-['Parisienne',cursive] text-amber-400 text-3xl mb-2 block">Every Plate</span>
            <h2 className="font-['Cormorant_Garamond',serif] text-4xl md:text-5xl font-bold text-stone-900 mb-6">Our Story</h2>
            <p className="text-stone-600 text-base leading-relaxed mb-5">
              Recipe Hub was born from a simple belief: everyone deserves to create delicious meals, regardless of their cooking experience. What started as a collection of family recipes has grown into a vibrant community of food lovers sharing their culinary adventures.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed mb-8">
              From beginner cooks to seasoned chefs, we've helped thousands discover the joy of cooking. Our curated recipes are tested, trusted, and designed to inspire — because every great meal tells a story.
            </p>
            <button className="self-start px-8 py-3 border-2 border-amber-400 text-amber-400 text-xs tracking-widest uppercase font-semibold hover:bg-amber-400 hover:text-white transition-all duration-300 rounded-full">
              Explore Recipes →
            </button>
          </div>
          
          {/* Circular image with amber-400 ring overlay */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 z-20"
            style={{ 
              left: "25%",
              opacity: inView ? 1 : 0, 
              transform: inView ? "translateY(-50%) scale(1) rotate(0deg)" : "translateY(-50%) scale(0) rotate(-180deg)", 
              transition: "opacity 0.8s ease 0.35s, transform 0.7s cubic-bezier(0.34, 1.2, 0.64, 1) 0.35s" 
            }}
          >
            <div 
              className="rounded-full overflow-hidden shadow-2xl"
              style={{ 
                width: "clamp(200px, 28vw, 350px)", 
                height: "clamp(200px, 28vw, 350px)",
              }}
            >
              <img 
                src="/2.png"  
                className="w-full h-full object-cover hover:scale-110 transition-all duration-500" 
                alt="featured dish" 
              />
            </div>
          </div>
          
        </div>
      </div>

      <style>{`
        @keyframes floatCircle {
          0%, 100% {
            transform: translateY(-50%) translateY(0px);
          }
          50% {
            transform: translateY(-50%) translateY(-12px);
          }
        }
        
        @keyframes shutterLeft {
          0% {
            transform: translateX(-150px) skewX(-12deg);
            opacity: 0;
          }
          100% {
            transform: translateX(0) skewX(0deg);
            opacity: 1;
          }
        }
        
        @keyframes shutterRight {
          0% {
            transform: translateX(150px) skewX(12deg);
            opacity: 0;
          }
          100% {
            transform: translateX(0) skewX(0deg);
            opacity: 1;
          }
        }
        
        @keyframes circularPop {
          0% {
            transform: translateY(-50%) scale(0) rotate(-180deg);
            opacity: 0;
          }
          100% {
            transform: translateY(-50%) scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        .absolute.top-1-2 {
          animation: floatCircle 5s ease-in-out infinite;
        }
      `}</style>
    
    </section>
    </div>
  );
}

// ─── Menu items data ────────────────────────────────────────────────────
const menuItems = [
  { 
    tag: "Quick & Easy", 
    desc: "30-minute meals that don't compromise on flavor. Perfect for busy weeknights when time is short.", 
    img: "/7.png"
  },
  { 
    tag: "Healthy Choices", 
    desc: "Nutritious, balanced recipes packed with veggies, lean proteins, and whole grains.", 
    img:"/9.png"
  },
  { 
    tag: "Comfort Food", 
    desc: "Warm, satisfying classics that feel like a hug on a plate — from creamy pastas to slow-cooked stews.", 
    img: "/6.png" 
  },
];

// ─── Menu Section ───────────────────────────────────────────────────────
function MenuSection() {

  const slideVariants = {
    hiddenLeft: {
      opacity: 0,
      x: -80,
    },
    hiddenRight: {
      opacity: 0,
      x: 80,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-20 md:py-24 bg-gradient-to-b from-[#0d0906] to-[#110c09] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <FadeUp className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <p className="font-['Parisienne',cursive] text-amber-400 text-3xl mb-1">
              Discover
            </p>

            <h2 className="font-['Cormorant_Garamond',serif] text-4xl md:text-5xl font-bold text-white">
              Popular Recipes
            </h2>
          </div>
        </FadeUp>

        {/* Menu items */}
        <div className="space-y-12 md:space-y-16">
          {menuItems.map((item, idx) => (
            <motion.div
              key={item.tag}
              variants={slideVariants}
              initial={idx % 2 === 0 ? "hiddenLeft" : "hiddenRight"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={`flex flex-col ${
                idx % 2 === 0
                  ? "md:flex-row"
                  : "md:flex-row-reverse"
              } items-center gap-8 md:gap-12`}
            >

              {/* Image */}
              <div className="relative group flex-shrink-0">
                <div
                  className="rounded-full overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105"
                  style={{
                    width: "clamp(170px, 24vw, 260px)",
                    height: "clamp(170px, 24vw, 260px)",
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.tag}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="max-w-lg">
                <p className="font-['Parisienne',cursive] text-amber-400 text-3xl mb-2">
                  {item.tag}
                </p>

                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {item.desc}
                </p>

                <button className="mt-5 text-sm text-amber-400 tracking-widest uppercase border-b border-amber-400/50 pb-1 hover:border-amber-400 transition">
                  Explore Dish →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Upcoming Events ────────────────────────────────────────────────────
const cuisines = [
  { name: "Italian", date: "Pasta • Pizza • Risotto", desc: "Experience the heart of Italy with homemade pasta, wood-fired pizzas, and rich tomato sauces." },
  { name: "Asian", date: "Stir-fry • Dumplings • Noodles", desc: "Bold flavors from Thailand, Japan, China, and Vietnam — fragrant curries to sushi rolls." },
  { name: "Mediterranean", date: "Greek • Turkish • Lebanese", desc: "Fresh olive oil, herbs, grilled meats, and vibrant salads from the Mediterranean coast." },
];

function EventsSection() {
  const { ref, inView } = useInView(0.2);
  
  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0a0705]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[520px]">
        {/* Image left */}
        <div 
          className="md:w-1/2 min-h-[300px]" 
          style={{ 
            opacity: inView ? 1 : 0, 
            transform: inView ? "translateX(0)" : "translateX(-60px)", 
            transition: "all 0.9s ease" 
          }}
        >
          <img src={IMG.events} className="w-full h-full object-cover brightness-75" alt="events" />
        </div>
        
        {/* White card right */}
        <div 
          className="md:w-1/2 bg-white px-10 md:px-16 py-16 flex flex-col justify-center" 
          style={{ 
            opacity: inView ? 1 : 0, 
            transform: inView ? "translateX(0)" : "translateX(60px)", 
            transition: "all 0.9s ease 0.2s" 
          }}
        >
          <span className="font-['Parisienne',cursive] text-stone-400 text-3xl">Master</span>
          <h2 className="font-['Cormorant_Garamond',serif] text-4xl font-bold mb-6">Cooking Guides</h2>
          <div className="space-y-6">
            {cuisines.map(ev => (
              <div key={ev.name} className="border-b border-stone-100 pb-5 last:border-0">
                <h3 className="font-semibold text-stone-800 text-xl">{ev.name}</h3>
                <p className="text-amber-600 text-xs tracking-wide">{ev.date}</p>
                <p className="text-stone-500 text-sm mt-1">{ev.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Best Ingredients ────────────────────────────────────────────────────
const categories = [
  {
    name: "Breakfast",
    img: "/10.png",
    count: "245 Recipes",
    price: "12+",
    desc: "Healthy and energizing morning meals",
    rating: "9.1",
  },
  {
    name: "Lunch",
    img: "/11.png",
    count: "512 Recipes",
    price: "18+",
    desc: "Fresh and delicious midday specials",
    rating: "8.8",
  },
  {
    name: "Dinner",
    img: "/15.png",
    count: "893 Recipes",
    price: "25+",
    desc: "Luxury dinner dishes for every night",
    rating: "9.5",
  },
  {
    name: "Dessert",
    img: "/14.png",
    count: "367 Recipes",
    price: "10+",
    desc: "Sweet treats and signature delights",
    rating: "8.9",
  },
];

function IngredientsSection() {
  return (
    <section className="py-24 bg-[#0d0a07] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <FadeUp>
          <div className="text-center mb-32">
            <span className="font-['Parisienne',cursive] text-amber-400 text-3xl">
              Fresh & Flavorful
            </span>

            <h2 className="font-['Cormorant_Garamond',serif] text-5xl font-bold text-white mt-2 mb-5">
              Explore by Category
            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover recipes organized by meal type, cuisine, or dietary
              preference — find exactly what you're craving in seconds.
            </p>
          </div>
        </FadeUp>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-20 gap-x-10 place-items-center">
          {categories.map((item, i) => (
            <FadeUp key={item.name} delay={i * 0.12}>
              <div
                className="
                  group relative
                  w-[220px]
                  rounded-[28px]
                  bg-yellow-400
                  p-5 pt-28
                  text-left
                  shadow-[0_20px_50px_rgba(255,193,7,0.28)]
                  transition-all duration-500
                  hover:-translate-y-3
                  hover:shadow-[0_35px_70px_rgba(255,193,7,0.4)]
                  animate-floatCard
                "
                style={{
                  animationDelay: `${i * 0.4}s`,
                }}
              >

                {/* Large Floating Circle Image */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2">
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2">
  <div
    className="
      w-[250px] h-[250px]
      shadow-[0_20px_50px_rgba(0,0,0,0.45)]
      transition-all duration-500
      group-hover:scale-105
    "
  >
    <img
      src={item.img}
      alt={item.name}
      className="h-full"
    />
  </div>
</div>
                </div>

              

                {/* Title */}
                <h3 className="text-black text-xl font-bold mt-3">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-black/70 text-sm mt-2 leading-relaxed">
                  {item.desc}
                </p>

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-[28px] bg-white/10 opacity-0 group-hover:opacity-100 transition duration-500" />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* Floating Animation */}
   <style>{`
  @keyframes floatCard {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    25% {
      transform: translateY(-8px) rotate(-1deg);
    }
    50% {
      transform: translateY(0px) rotate(1deg);
    }
    75% {
      transform: translateY(6px) rotate(-1deg);
    }
    100% {
      transform: translateY(0px) rotate(0deg);
    }
  }

  .animate-floatCard {
    animation: floatCard 5s ease-in-out infinite;
  }
`}</style>
    </section>
  );
}

// ─── Book Your Table ─────────────────────────────────────────────────────
function NewsletterSection() {
  const { ref, inView } = useInView(0.2);
  
  return (
    <section ref={ref} className="relative min-h-[460px] flex items-center justify-center overflow-hidden">
      <img 
        src={IMG.events} 
        className="absolute w-full h-full object-cover brightness-[0.35] scale-105" 
        alt="newsletter" 
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      
      <div 
        className="relative z-10 text-center px-6" 
        style={{ 
          opacity: inView ? 1 : 0, 
          transform: inView ? "translateY(0)" : "translateY(50px)", 
          transition: "all 0.9s ease" 
        }}
      >
        <p className="font-['Parisienne',cursive] text-amber-400 text-3xl md:text-4xl">Stay Updated</p>
        <h2 className="font-['Cormorant_Garamond',serif] text-5xl md:text-6xl font-bold text-white my-5">Get Weekly Recipes</h2>
        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-amber-400"
          />
          <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold tracking-widest uppercase rounded-full transition-all duration-300 shadow-2xl hover:scale-105">
            Subscribe →
          </button>
        </div>
      </div>
    </section>
  );
}



// ─── Root Component ──────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="font-sans antialiased">
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Cormorant+Garamond:wght@400;500;600;700&family=Parisienne&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          background-color: #0a0705;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1a140f;
        }
        ::-webkit-scrollbar-thumb {
          background: #b87c2e;
          border-radius: 8px;
        }
        ::selection {
          background: rgba(184, 124, 46, 0.4);
          color: #f5e7d9;
        }
        
        .glass-morphism {
          backdrop-filter: blur(12px);
          background: rgba(20, 15, 12, 0.65);
          border-bottom: 1px solid rgba(184, 124, 46, 0.25);
        }
      `}</style>
      
      <Hero />
      <OurStory />
      <MenuSection />
      <EventsSection />
      <IngredientsSection />
      <NewsletterSection />
    </div>
  );
}


