import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  const navigate = useNavigate();
  const HomeIcon = getIcon('Home');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="relative mb-8">
          <motion.div 
            animate={{ 
              rotate: [0, 5, -5, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 5 
            }}
            className="w-32 h-32 mx-auto grid grid-cols-2 grid-rows-2 gap-4"
          >
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <div className="w-8 h-8 bg-primary rounded-full"></div>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold">404</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Looks like the dots didn't connect here. Let's get you back to the game.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn-primary mx-auto"
        >
          <HomeIcon className="w-5 h-5 mr-2" />
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}

export default NotFound;