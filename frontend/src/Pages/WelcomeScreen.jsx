import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useTheme } from "../context/ThemeContect.jsx";
import ThemeToggle from "../context/ThemeToggle.jsx"; // add toggle

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else clearInterval(timer);
    }, 260);
    return () => clearInterval(timer);
  }, [text]);

  return (
      <span className="inline-block">
      {displayText}
        <span className="animate-pulse">|</span>
    </span>
  );
};

const BackgroundEffect = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-red-600/20 blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-transparent to-red-600/10 blur-2xl animate-float" />
    </div>
);

const WelcomeScreen = ({ onLoadingComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: false });
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => onLoadingComplete?.(), 1000);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const containerVariants = {
    exit: { opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut", when: "beforeChildren", staggerChildren: 0.1 } }
  };

  const childVariants = {
    exit: { y: -20, opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } }
  };
  const backgroundColor = theme === "dark" ? "#030014" : "#f1f5f9";

  return (
      <>
        <AnimatePresence>
          {isLoading && (
              <motion.div
                  className="fixed inset-0"
                  style={{ backgroundColor, transition: "background-color 0.4s" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit="exit"
                  variants={containerVariants}
              >
              <BackgroundEffect />
                <div className="relative min-h-screen flex items-center justify-center px-4">
                  <div className="w-full max-w-4xl mx-auto">
                    <motion.div className="text-center mb-6 sm:mb-8 md:mb-12" variants={childVariants}>
                      <div>
                        <img data-aos="fade-in"
                             data-aos-delay="800"
                             className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-red-600 bg-clip-text text-transparent"
                             src="src\\assets\\media\\Welcome to.png"
                             alt="Welcome to"
                             loading="lazy" />
                      </div>
                      <div>
                        <img data-aos="fade-up"
                             data-aos-delay="800"
                             className="inline-block px-2 bg-gradient-to-r from-indigo-600 to-red-600 bg-clip-text text-transparent"
                             src="src\\assets\\media\\side logo.png"
                             alt="Hikma Learn Logo"
                             loading="lazy" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
        <ThemeToggle /> {/* toggle on screen */}
      </>
  );
};

export default WelcomeScreen;
