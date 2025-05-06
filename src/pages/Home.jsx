import { useState } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

function Home({ darkMode, toggleDarkMode }) {
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const GithubIcon = getIcon('Github');
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-4 md:px-8 flex items-center justify-between border-b border-surface-200 dark:border-surface-800">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-semibold">D</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DotLinked
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </motion.button>
          
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors"
            aria-label="View source code on GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-8 py-6 md:py-10">
        <MainFeature />
      </main>

      <footer className="py-4 px-4 md:px-8 border-t border-surface-200 dark:border-surface-800 text-center text-sm text-surface-600 dark:text-surface-400">
        <p>© {new Date().getFullYear()} DotLinked. Connect dots. Claim boxes. Win territory.</p>
      </footer>
    </div>
  );
}

export default Home;