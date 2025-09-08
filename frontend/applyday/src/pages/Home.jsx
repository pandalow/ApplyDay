import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getTranslations, availableLanguages, defaultLanguage } from "../locales";
import "../css/Home.css";

function Home() {
  const [isFading, setIsFading] = useState(false);
  const [language, setLanguage] = useState(defaultLanguage); // Use default language
  const [dataFlow, setDataFlow] = useState([]);
  const [llmProcessing, setLlmProcessing] = useState(false);
  const [technologiesFlow, setTechnologiesFlow] = useState([]);
  const navigate = useNavigate();

  // Get current language translation text
  const t = getTranslations(language);

  // Dynamically update analysis steps
  const [analysisSteps, setAnalysisSteps] = useState([]);
  
  useEffect(() => {
    setAnalysisSteps([
      { id: 1, text: t.pipeline.steps[0], active: false, completed: false },
      { id: 2, text: t.pipeline.steps[1], active: false, completed: false },
      { id: 3, text: t.pipeline.steps[2], active: false, completed: false },
      { id: 4, text: t.pipeline.steps[3], active: false, completed: false },
      { id: 5, text: t.pipeline.steps[4], active: false, completed: false }
    ]);
  }, [language]);

  // Generate data flow animation
  useEffect(() => {
    const generateDataFlow = () => {
      const flows = [];
      const dataTypes = ['JSON', 'PDF', 'TXT', 'API', 'CSV', 'XML'];
      for (let i = 0; i < 12; i++) {
        flows.push({
          id: i,
          type: dataTypes[Math.floor(Math.random() * dataTypes.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 3 + Math.random() * 2
        });
      }
      setDataFlow(flows);
    };

    generateDataFlow();
    const interval = setInterval(generateDataFlow, 6000);
    return () => clearInterval(interval);
  }, []);

  // Technology stack flow effect
  useEffect(() => {
    const technologies = ['React', 'Python', 'OpenAI', 'FastAPI', 'TailwindCSS', 'PostgreSQL', 'Docker', 'AWS'];
    const generateTechFlow = () => {
      const flows = [];
      for (let i = 0; i < 6; i++) {
        flows.push({
          id: i,
          tech: technologies[Math.floor(Math.random() * technologies.length)],
          x: Math.random() * 100,
          delay: Math.random() * 4,
          duration: 4 + Math.random() * 2
        });
      }
      setTechnologiesFlow(flows);
    };

    generateTechFlow();
    const interval = setInterval(generateTechFlow, 8000);
    return () => clearInterval(interval);
  }, []);

  // LLM处理动画
  useEffect(() => {
    const startLLMProcessing = () => {
      setLlmProcessing(true);
      let currentStep = 0;
      const totalSteps = 5; // Fixed number of steps, avoid depending on analysis steps array
      
      const processSteps = () => {
        setAnalysisSteps(prev => prev.map((step, index) => ({
          ...step,
          active: index === currentStep,
          completed: index < currentStep
        })));

        currentStep++;
        if (currentStep <= totalSteps) {
          setTimeout(processSteps, 1500);
        } else {
          setTimeout(() => {
            setLlmProcessing(false);
            setAnalysisSteps(prev => prev.map(step => ({
              ...step,
              active: false,
              completed: false
            })));
          }, 2000);
        }
      };

      setTimeout(processSteps, 1000);
    };

    const interval = setInterval(startLLMProcessing, 12000);
    setTimeout(startLLMProcessing, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setIsFading(true);
  };

  const handleAnimationEnd = () => {
    if (isFading) {
      navigate("/app");
    }
  };

  const toggleLanguage = () => {
    const currentIndex = availableLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    setLanguage(availableLanguages[nextIndex]);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Dynamic background particles */}
      <div className="absolute inset-0">
        {dataFlow.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-xs font-mono text-blue-300/60 bg-blue-500/10 px-2 py-1 rounded border border-blue-400/20"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {item.type}
          </motion.div>
        ))}
      </div>

      {/* Technology stack flow background */}
      <div className="absolute inset-0 pointer-events-none">
        {technologiesFlow.map((tech) => (
          <motion.div
            key={tech.id}
            className="absolute text-sm font-semibold text-purple-300/40"
            style={{ left: `${tech.x}%`, top: '-5%' }}
            animate={{ y: ['0vh', '105vh'] }}
            transition={{
              duration: tech.duration,
              delay: tech.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {tech.tech}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-8">
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mt-12 mb-8"
        >
          <motion.h1
            className={`text-5xl md:text-7xl font-extrabold mb-4 ${isFading ? "fade-out" : ""}`}
            onClick={handleClick}
            onAnimationEnd={handleAnimationEnd}
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t.title}
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-blue-200 font-light"
          >
            {t.subtitle}
          </motion.div>
          
          {/* Language toggle button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center mt-4 mb-2"
          >
            <motion.button
              onClick={toggleLanguage}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 text-blue-200 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium">
                {language === 'en' ? '🇨🇳 切换中文' : '🇺🇸 Switch to English'}
              </span>
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-sm md:text-base text-blue-300/80"
          >
            {t.tagline}
          </motion.div>
        </motion.div>

        {/* Core philosophy introduction */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="max-w-5xl text-center mb-12"
        >
          <div className="bg-gradient-to-r from-slate-800/60 to-blue-900/60 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 mb-8">
            <p className="text-lg text-blue-100 mb-4 leading-relaxed">
              <span className="text-cyan-300 font-semibold">{t.coreMessage.main}</span> {t.coreMessage.description}
            </p>
            <p className="text-base text-blue-200 leading-relaxed">
              {t.coreMessage.philosophy}
            </p>
          </div>
          
          {/* Three-step growth cycle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { 
                icon: "📝", 
                title: t.growthCycle.record.title, 
                desc: t.growthCycle.record.description,
                color: "from-blue-500 to-cyan-500"
              },
              { 
                icon: "🔍", 
                title: t.growthCycle.analyze.title, 
                desc: t.growthCycle.analyze.description,
                color: "from-purple-500 to-pink-500"
              },
              { 
                icon: "🚀", 
                title: t.growthCycle.improve.title, 
                desc: t.growthCycle.improve.description,
                color: "from-green-500 to-emerald-500"
              }
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.2, duration: 0.6 }}
                className={`bg-gradient-to-br ${step.color} bg-opacity-10 backdrop-blur-sm border border-white/20 rounded-lg p-4`}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-300">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Featured function tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {t.features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-20 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <span className="mr-2">{feature.icon}</span>
                {feature.text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Capability comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full max-w-4xl"
        >
          {/* What it can do */}
          <div className="bg-gradient-to-br from-green-800/50 to-emerald-900/50 backdrop-blur-sm border border-green-400/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-200 mb-4 flex items-center">
              <span className="mr-2">✅</span>
              {t.capabilities.canDo.title}
            </h3>
            <ul className="space-y-2 text-sm text-green-100">
              {t.capabilities.canDo.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* What it won't do */}
          <div className="bg-gradient-to-br from-red-800/50 to-pink-900/50 backdrop-blur-sm border border-red-400/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-200 mb-4 flex items-center">
              <span className="mr-2">🚫</span>
              {t.capabilities.wontDo.title}
            </h3>
            <ul className="space-y-2 text-sm text-red-100">
              {t.capabilities.wontDo.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Human-in-the-Loop 处理流程展示 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6 mb-8 w-full max-w-2xl"
        >
          <div className="text-center mb-4">
            <h3 className="text-xl font-semibold text-blue-200 mb-2">
              🤝 {t.pipeline.title}
            </h3>
            <div className="text-sm text-blue-300">{t.pipeline.subtitle}</div>
          </div>
          
          <div className="space-y-3">
            {analysisSteps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                  step.active 
                    ? 'bg-blue-500/20 border border-blue-400/40' 
                    : step.completed 
                    ? 'bg-green-500/20 border border-green-400/40'
                    : 'bg-gray-800/30 border border-gray-600/30'
                }`}
                animate={{
                  scale: step.active ? 1.02 : 1,
                  x: step.active ? 5 : 0
                }}
              >
                <div className={`w-3 h-3 rounded-full ${
                  step.active 
                    ? 'bg-blue-400 animate-pulse' 
                    : step.completed 
                    ? 'bg-green-400'
                    : 'bg-gray-500'
                }`} />
                <span className={`text-sm ${
                  step.active 
                    ? 'text-blue-200 font-medium' 
                    : step.completed 
                    ? 'text-green-200'
                    : 'text-gray-400'
                }`}>
                  {step.text}
                </span>
                {step.active && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="ml-auto text-blue-400"
                  >
                    ⚡
                  </motion.div>
                )}
                {step.completed && (
                  <div className="ml-auto text-green-400">✓</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Open source community introduction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="bg-gradient-to-r from-purple-800/50 to-indigo-900/50 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 mb-8 w-full max-w-4xl text-center"
        >
          <h3 className="text-xl font-semibold text-purple-200 mb-4">
            🌟 {t.community.title}
          </h3>
          <p className="text-purple-100 mb-4 leading-relaxed">
            {t.community.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {t.community.tags.map((tag, index) => (
              <span key={index} className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-200">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>


        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.4, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={handleClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            {t.cta.button}
          </motion.button>
          <p className="text-sm text-blue-300 mt-4">
            {t.cta.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Decorative light effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
    </div>
  );
}

export default Home;
