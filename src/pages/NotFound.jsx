import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ApperIcon name="Skull" className="w-24 h-24 text-neon-error mx-auto mb-6 neon-text" />
        </motion.div>
        <h1 className="text-6xl font-display font-bold text-primary neon-text mb-4">
          404
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Game Over - Page Not Found
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-primary text-neon-bg font-bold rounded-lg neon-border hover:shadow-neon-cyan transition-all duration-300"
        >
          Return to Game
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;