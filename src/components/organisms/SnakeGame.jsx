import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import GameStateService from '@/services/api/gameStateService';
import SettingsService from '@/services/api/settingsService';

import GameScorePanel from '@/components/organisms/GameScorePanel';
import GameCanvas from '@/components/organisms/GameCanvas';
import GameStatusOverlay from '@/components/molecules/GameStatusOverlay';
import ControlHint from '@/components/molecules/ControlHint';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const INITIAL_SPEED = 200;

const SnakeGame = () => {
    const [gameState, setGameState] = useState({
        snake: INITIAL_SNAKE,
        food: { x: 15, y: 15 },
        direction: INITIAL_DIRECTION,
        score: 0,
        highScore: 0,
        gameStatus: 'ready', // ready, playing, paused, gameOver
        speed: INITIAL_SPEED
    });

    const [settings, setSettings] = useState({
        difficulty: 'normal',
        soundEnabled: true,
        gridSize: GRID_SIZE
    });

    const [loading, setLoading] = useState(true);
    const [trailPositions, setTrailPositions] = useState([]);
    const [scoreFlash, setScoreFlash] = useState(false);
    const gameLoopRef = useRef();
    const lastDirectionRef = useRef(INITIAL_DIRECTION); // To prevent immediate reverse

    // Load initial data
    useEffect(() => {
        const loadGameData = async () => {
            setLoading(true);
            try {
                const [gameData, settingsData] = await Promise.all([
                    GameStateService.getById(1),
                    SettingsService.getById(1)
                ]);

                if (gameData) {
                    setGameState(prev => ({
                        ...prev,
                        highScore: gameData.highScore || 0
                    }));
                }

                if (settingsData) {
                    setSettings(settingsData);
                }
            } catch (error) {
                console.error('Failed to load game data:', error);
                toast.error('Failed to load game data.');
            } finally {
                setLoading(false);
            }
        };

        loadGameData();
    }, []);

    // Generate random food position
    const generateFood = useCallback((snake) => {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }, []);

    // Move snake
    const moveSnake = useCallback(() => {
        setGameState(prevState => {
            if (prevState.gameStatus !== 'playing') return prevState;

            const { snake, direction, food, score } = prevState;
            const head = { ...snake[0] };

            // Update head position based on direction
            switch (direction) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
                default: break;
            }

            // Check wall collision
            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                toast.error("Game Over - Hit the wall!");
                return { ...prevState, gameStatus: 'gameOver' };
            }

            // Check self collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                toast.error("Game Over - Ate yourself!");
                return { ...prevState, gameStatus: 'gameOver' };
            }

            const newSnake = [head, ...snake];
            let newFood = food;
            let newScore = score;
            let newSpeed = prevState.speed;

            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                newFood = generateFood(newSnake);
                newScore += 10;
                newSpeed = Math.max(50, newSpeed - 5); // Increase speed
                setScoreFlash(true);
                setTimeout(() => setScoreFlash(false), 300);
                toast.success(`+10 Points! Score: ${newScore}`);
            } else {
                newSnake.pop(); // Remove tail if no food eaten
            }

            // Add trail effect
            setTrailPositions(prev => {
                const newTrail = [...prev, { ...snake[0], timestamp: Date.now() }];
                return newTrail.filter(pos => Date.now() - pos.timestamp < 500);
            });

            return {
                ...prevState,
                snake: newSnake,
                food: newFood,
                score: newScore,
                speed: newSpeed
            };
        });
    }, [generateFood]);

    // Game loop
    useEffect(() => {
        if (gameState.gameStatus === 'playing') {
            gameLoopRef.current = setInterval(moveSnake, gameState.speed);
        } else {
            clearInterval(gameLoopRef.current);
        }

        return () => clearInterval(gameLoopRef.current);
    }, [gameState.gameStatus, gameState.speed, moveSnake]);

    const startGame = useCallback(() => {
        setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
        toast.success("Game Started! Use arrow keys to move");
    }, []);

    const pauseGame = useCallback(() => {
        setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
        toast.info("Game Paused - Press SPACE to resume");
    }, []);

    const resumeGame = useCallback(() => {
        setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
        toast.success("Game Resumed!");
    }, []);

    const resetGame = useCallback(async () => {
        const newHighScore = Math.max(gameState.score, gameState.highScore);

        // Save high score
        if (newHighScore > gameState.highScore) {
            try {
                await GameStateService.update(1, { highScore: newHighScore });
                toast.success("New High Score!");
            } catch (error) {
                console.error('Failed to save high score:', error);
                toast.error('Failed to save high score.');
            }
        }

        setGameState(prev => ({
            snake: INITIAL_SNAKE,
            food: generateFood(INITIAL_SNAKE),
            direction: INITIAL_DIRECTION,
            score: 0,
            highScore: newHighScore,
            gameStatus: 'ready',
            speed: INITIAL_SPEED
        }));

        setTrailPositions([]);
        lastDirectionRef.current = INITIAL_DIRECTION;
        toast.info("Game Reset - Press SPACE to start");
    }, [gameState.score, gameState.highScore, generateFood]);

    const changeDirection = useCallback((newDirection) => {
        setGameState(prev => ({ ...prev, direction: newDirection }));
        lastDirectionRef.current = newDirection;
    }, []);

    // Handle keyboard input
    useEffect(() => {
        const handleKeyPress = (e) => {
            const { gameStatus, direction } = gameState;

            if (gameStatus === 'gameOver' && e.key !== ' ') return;

            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    if (gameStatus === 'ready') {
                        startGame();
                    } else if (gameStatus === 'playing') {
                        pauseGame();
                    } else if (gameStatus === 'paused') {
                        resumeGame();
                    } else if (gameStatus === 'gameOver') {
                        resetGame();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (direction !== 'DOWN' && lastDirectionRef.current !== 'DOWN') {
                        changeDirection('UP');
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (direction !== 'UP' && lastDirectionRef.current !== 'UP') {
                        changeDirection('DOWN');
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (direction !== 'RIGHT' && lastDirectionRef.current !== 'RIGHT') {
                        changeDirection('LEFT');
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (direction !== 'LEFT' && lastDirectionRef.current !== 'LEFT') {
                        changeDirection('RIGHT');
                    }
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState, startGame, pauseGame, resumeGame, resetGame, changeDirection]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    const handleGameAction = () => {
        if (gameState.gameStatus === 'ready') startGame();
        else if (gameState.gameStatus === 'paused') resumeGame();
        else if (gameState.gameStatus === 'gameOver') resetGame();
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <GameScorePanel
                score={gameState.score}
                highScore={gameState.highScore}
                snakeLength={gameState.snake.length}
                scoreFlash={scoreFlash}
            />

            <GameCanvas
                gridSize={settings.gridSize}
                snake={gameState.snake}
                food={gameState.food}
                trailPositions={trailPositions}
            />

            {gameState.gameStatus !== 'playing' && (
                <GameStatusOverlay
                    status={gameState.gameStatus}
                    score={gameState.score}
                    highScore={gameState.highScore}
                    onAction={handleGameAction}
                />
            )}

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex justify-center gap-4 text-sm text-gray-400"
            >
                <ControlHint iconName="Navigation" text="Arrow Keys to Move" />
                <ControlHint keyboardKey="SPC" text="Pause/Resume" />
            </motion.div>
        </div>
    );
};

export default SnakeGame;