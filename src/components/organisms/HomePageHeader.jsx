import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const HomePageHeader = () => {
    return (
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
    );
};

export default HomePageHeader;