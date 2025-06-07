import React from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon 
              name="Zap" 
              className="w-12 h-12 text-primary neon-text" 
            />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-primary neon-text">
            NEON SNAKE
          </h1>
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <ApperIcon 
              name="Zap" 
              className="w-12 h-12 text-secondary neon-text" 
            />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl text-gray-300 font-sans tracking-wider"
        >
          Retro arcade action in blazing neon
        </motion.p>
      </motion.div>

      {/* Main Game Component */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <MainFeature />
      </motion.div>

      {/* Footer Instructions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="bg-neon-grid/20 rounded-xl p-6 border border-primary/30 neon-border backdrop-blur-sm">
          <h3 className="text-lg font-display font-bold text-primary mb-3 neon-text">
            CONTROLS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-gray-400 rounded flex items-center justify-center">
                <ApperIcon name="ArrowUp" size={16} />
              </div>
              <span>Move Up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-gray-400 rounded flex items-center justify-center">
                <ApperIcon name="ArrowDown" size={16} />
              </div>
              <span>Move Down</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-gray-400 rounded flex items-center justify-center">
                <ApperIcon name="ArrowLeft" size={16} />
              </div>
              <span>Move Left</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-gray-400 rounded flex items-center justify-center">
                <ApperIcon name="ArrowRight" size={16} />
              </div>
              <span>Move Right</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="px-4 py-2 border border-gray-400 rounded">SPACE</div>
            <span>Pause / Resume</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;