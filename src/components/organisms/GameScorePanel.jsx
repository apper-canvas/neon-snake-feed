import React from 'react';
import { motion } from 'framer-motion';
import ScoreDisplayItem from '@/components/molecules/ScoreDisplayItem';

const GameScorePanel = ({ score, highScore, snakeLength, scoreFlash }) => {
    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-6 p-4 bg-neon-grid/20 rounded-xl border border-primary/30 neon-border"
        >
            <ScoreDisplayItem label="SCORE" value={score} valueClassName="text-accent" flash={scoreFlash} />
            <ScoreDisplayItem label="HIGH SCORE" value={highScore} valueClassName="text-primary" />
            <ScoreDisplayItem label="LENGTH" value={snakeLength} valueClassName="text-secondary" />
        </motion.div>
    );
};

export default GameScorePanel;