import React from 'react';
import { motion } from 'framer-motion';

const ScoreDisplayItem = ({ label, value, valueClassName, flash = false }) => {
    return (
        <div className="text-center">
            <div className="text-sm text-gray-400 font-sans">{label}</div>
            <motion.div
                animate={flash ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`text-3xl font-display font-bold neon-text ${valueClassName}`}
            >
                {value.toLocaleString()}
            </motion.div>
        </div>
    );
};

export default ScoreDisplayItem;