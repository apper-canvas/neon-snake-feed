import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`px-8 py-3 font-bold rounded-lg neon-border transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default Button;