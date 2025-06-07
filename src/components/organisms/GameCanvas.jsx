import React from 'react';
import { motion } from 'framer-motion';
import GridCell from '@/components/atoms/GridCell';

const GameCanvas = ({ gridSize, snake, food, trailPositions }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative bg-neon-bg border-2 border-primary/50 rounded-xl overflow-hidden neon-border"
            style={{ aspectRatio: '1' }}
        >
            {/* Grid */}
            <div
                className="absolute inset-0 game-grid animate-grid-pulse"
                style={{
                    backgroundSize: `${100 / gridSize}% ${100 / gridSize}%`,
                }}
            />

            {/* Trail Effect */}
            {trailPositions.map((pos, index) => {
                const age = Date.now() - pos.timestamp;
                const opacity = Math.max(0, 1 - age / 500); // Fades out over 500ms
                return (
                    <GridCell
                        key={`trail-${pos.x}-${pos.y}-${pos.timestamp}`}
                        x={pos.x}
                        y={pos.y}
                        size={gridSize}
                        type="trail"
                        style={{
                            opacity: opacity * 0.3,
                            boxShadow: `0 0 10px rgba(0, 255, 255, ${opacity * 0.3})`
                        }}
                        zIndex={index + 1} // Ensure newer trails layer correctly
                    />
                );
            })}

            {/* Snake */}
            {snake.map((segment, index) => (
                <GridCell
                    key={`snake-${index}`}
                    x={segment.x}
                    y={segment.y}
                    size={gridSize}
                    type={index === 0 ? "snake-head" : "snake-segment"}
                    style={{ zIndex: 10 + (snake.length - index) }} // Head on top
                />
            ))}

            {/* Food */}
            <GridCell
                x={food.x}
                y={food.y}
                size={gridSize}
                type="food"
                style={{ zIndex: 5 }}
            />
        </motion.div>
    );
};

export default GameCanvas;