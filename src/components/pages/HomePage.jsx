import React from 'react';
import { motion } from 'framer-motion';
import HomePageHeader from '@/components/organisms/HomePageHeader';
import SnakeGame from '@/components/organisms/SnakeGame';
import GameControlInstructions from '@/components/organisms/GameControlInstructions';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <HomePageHeader />

      {/* Main Game Component */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <SnakeGame />
      </motion.div>

      <GameControlInstructions />
    </div>
  );
};

export default HomePage;