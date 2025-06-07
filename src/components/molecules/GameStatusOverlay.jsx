import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const GameStatusOverlay = ({ status, score, highScore, onAction }) => {
    let iconName, title, message, buttonText, iconClass, buttonClass, buttonHoverShadow;

    switch (status) {
        case 'ready':
            iconName = 'Play';
            title = 'READY TO PLAY';
            message = 'Press SPACE to start the game';
            buttonText = 'START GAME';
            iconClass = 'text-primary';
            buttonClass = 'bg-primary text-neon-bg';
            buttonHoverShadow = 'hover:shadow-neon-cyan';
            break;
        case 'paused':
            iconName = 'Pause';
            title = 'PAUSED';
            message = 'Press SPACE to resume';
            buttonText = 'RESUME';
            iconClass = 'text-accent';
            buttonClass = 'bg-accent text-neon-bg';
            buttonHoverShadow = 'hover:shadow-neon-yellow';
            break;
        case 'gameOver':
            iconName = 'SkullIcon';
            title = 'GAME OVER';
            message = `Final Score: ${score}`;
            buttonText = 'PLAY AGAIN';
            iconClass = 'text-neon-error';
            buttonClass = 'bg-neon-error text-white';
            buttonHoverShadow = 'hover:shadow-[0_0_20px_#ff0055]';
            break;
        default:
            return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                    className="text-center bg-neon-grid/30 rounded-xl p-8 border border-primary/50 neon-border backdrop-blur-sm"
                >
                    <ApperIcon name={iconName} className={`w-16 h-16 mx-auto mb-4 neon-text ${iconClass}`} />
                    <h2 className={`text-3xl font-display font-bold neon-text mb-4 ${iconClass}`}>
                        {title}
                    </h2>
                    <div className="text-xl text-gray-300 mb-2">{message}</div>
                    {status === 'gameOver' && score === highScore && score > 0 && (
                        <div className="text-lg text-accent neon-text mb-4">🏆 NEW HIGH SCORE! 🏆</div>
                    )}
                    <Button
                        onClick={onAction}
                        className={`${buttonClass} ${buttonHoverShadow}`}
                    >
                        {buttonText}
                    </Button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GameStatusOverlay;