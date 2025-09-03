import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Dashboard from "../components/Dashboard";
import "../css/Home.css"; // 保留你的动画效果

function Home() {
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsFading(true);
  };

  const handleAnimationEnd = () => {
    if (isFading) {
      navigate("/app");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`welcome-title text-4xl md:text-6xl font-extrabold mt-12 mb-8 text-center ${isFading ? "fade-out" : ""}`}
        onClick={handleClick}
        onAnimationEnd={handleAnimationEnd}
      >
        Welcome to ApplyDay
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl text-center mb-12"
      >
        This is a personal job hunting assistant.  
        You can track, analyze, and optimize your applications with ease.
      </motion.h2>

      {/* Dashboard */}
      <div className="w-full max-w-6xl px-4">
        <Dashboard />
      </div>
    </div>
  );
}

export default Home;
