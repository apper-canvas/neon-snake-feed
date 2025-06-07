import React from 'react';
import { motion } from 'framer-motion';
import ControlHint from '@/components/molecules/ControlHint';

const GameControlInstructions = () => {
    return (
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
<div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <ControlHint iconName="ArrowUp" text="Move Up" className="justify-center" />
                        <ControlHint iconName="ArrowDown" text="Move Down" className="justify-center" />
                        <ControlHint iconName="ArrowLeft" text="Move Left" className="justify-center" />
                        <ControlHint iconName="ArrowRight" text="Move Right" className="justify-center" />
                    </div>
                    
                    <div className="text-xs text-gray-400 font-semibold">OR</div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <ControlHint keyboardKey="W" text="Move Up" className="justify-center" />
                        <ControlHint keyboardKey="S" text="Move Down" className="justify-center" />
                        <ControlHint keyboardKey="A" text="Move Left" className="justify-center" />
                        <ControlHint keyboardKey="D" text="Move Right" className="justify-center" />
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-primary/20">
                        <ControlHint keyboardKey="SPACE" text="Pause / Resume" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GameControlInstructions;