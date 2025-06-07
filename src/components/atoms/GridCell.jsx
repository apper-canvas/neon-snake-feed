import React from 'react';
import { motion } from 'framer-motion';

const GridCell = ({ x, y, type, size, className, children, style, ...props }) => {
    const baseStyle = {
        left: `${(x / size) * 100}%`,
        top: `${(y / size) * 100}%`,
        width: `${100 / size}%`,
        height: `${100 / size}%`,
    };

    const baseClasses = "absolute rounded-sm";
    let typeClasses = "";
    let motionProps = {};

    switch (type) {
        case 'snake-head':
            typeClasses = "snake-head";
            motionProps = { initial: { scale: 0 }, animate: { scale: 1 } };
            break;
        case 'snake-segment':
            typeClasses = "snake-segment";
            motionProps = { initial: { scale: 0 }, animate: { scale: 1 } };
            break;
        case 'food':
            typeClasses = "food-item animate-food-rotate";
            motionProps = {
                key: `food-${x}-${y}`, // Ensure a new key for each food to re-trigger animations
                initial: { scale: 0, rotate: 0 },
                animate: {
                    scale: [1, 1.2, 1],
                    rotate: 360
                },
                transition: {
                    scale: { duration: 1, repeat: Infinity },
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                }
            };
            break;
        case 'trail':
            typeClasses = "bg-primary/30 rounded-sm";
            motionProps = { initial: { opacity: 0.5, scale: 0.8 }, animate: { opacity: (style?.opacity || 0.3), scale: 1 } };
            break;
        default:
            break;
    }

    return (
        <motion.div
            className={`${baseClasses} ${typeClasses} ${className || ''}`}
            style={{ ...baseStyle, ...style }}
            {...motionProps}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GridCell;