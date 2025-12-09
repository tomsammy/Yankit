import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Sun, Moon } from 'lucide-react';

    const ThemeToggleButton = ({ isDarkMode, toggleTheme }) => (
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          aria-label="Toggle theme" 
          className="text-blue-100 dark:text-sky-200 hover:bg-white/10 dark:hover:bg-blue-600/50"
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-white" />}
        </Button>
      </motion.div>
    );
    ThemeToggleButton.displayName = 'ThemeToggleButton';

    export default ThemeToggleButton;