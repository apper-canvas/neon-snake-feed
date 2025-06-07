import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import GameStateService from '../services/api/gameStateService';
import SettingsService from '../services/api/settingsService';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const INITIAL_SPEED = 200;

const MainFeature = () => {
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
  const lastDirectionRef = useRef(INITIAL_DIRECTION);

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
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
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

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      const { gameStatus, direction } = gameState;
      
      if (gameStatus === 'gameOver') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (gameStatus === 'ready') {
            startGame();
          } else if (gameStatus === 'playing') {
            pauseGame();
          } else if (gameStatus === 'paused') {
            resumeGame();
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
  }, [gameState]);

  const changeDirection = (newDirection) => {
    setGameState(prev => ({ ...prev, direction: newDirection }));
    lastDirectionRef.current = newDirection;
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    toast.success("Game Started! Use arrow keys to move");
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'paused' }));
    toast.info("Game Paused - Press SPACE to resume");
  };

  const resumeGame = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    toast.success("Game Resumed!");
  };

  const resetGame = async () => {
    const newHighScore = Math.max(gameState.score, gameState.highScore);
    
    // Save high score
    if (newHighScore > gameState.highScore) {
      try {
        await GameStateService.update(1, { highScore: newHighScore });
        toast.success("New High Score!");
      } catch (error) {
        console.error('Failed to save high score:', error);
      }
    }

    setGameState({
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: INITIAL_DIRECTION,
      score: 0,
      highScore: newHighScore,
      gameStatus: 'ready',
      speed: INITIAL_SPEED
    });
    
    setTrailPositions([]);
    lastDirectionRef.current = INITIAL_DIRECTION;
    toast.info("Game Reset - Press SPACE to start");
  };

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Score Panel */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-6 p-4 bg-neon-grid/20 rounded-xl border border-primary/30 neon-border"
      >
        <div className="text-center">
          <div className="text-sm text-gray-400 font-sans">SCORE</div>
          <motion.div
            animate={scoreFlash ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
            className="text-3xl font-display font-bold text-accent neon-text"
          >
            {gameState.score.toLocaleString()}
          </motion.div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-400 font-sans">HIGH SCORE</div>
          <div className="text-3xl font-display font-bold text-primary neon-text">
            {gameState.highScore.toLocaleString()}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-400 font-sans">LENGTH</div>
          <div className="text-3xl font-display font-bold text-secondary neon-text">
            {gameState.snake.length}
          </div>
        </div>
      </motion.div>

      {/* Game Canvas */}
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
            backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`,
          }}
        />

        {/* Trail Effect */}
        {trailPositions.map((pos, index) => {
          const age = Date.now() - pos.timestamp;
          const opacity = Math.max(0, 1 - age / 500);
          return (
            <motion.div
              key={`trail-${pos.x}-${pos.y}-${pos.timestamp}`}
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{ opacity: opacity * 0.3, scale: 1 }}
              className="absolute bg-primary/30 rounded-sm"
              style={{
                left: `${(pos.x / GRID_SIZE) * 100}%`,
                top: `${(pos.y / GRID_SIZE) * 100}%`,
                width: `${100/GRID_SIZE}%`,
                height: `${100/GRID_SIZE}%`,
                boxShadow: `0 0 10px rgba(0, 255, 255, ${opacity * 0.3})`
              }}
            />
          );
        })}

        {/* Snake */}
        {gameState.snake.map((segment, index) => (
          <motion.div
            key={`snake-${index}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={index === 0 ? "absolute snake-head" : "absolute snake-segment"}
            style={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              width: `${100/GRID_SIZE}%`,
              height: `${100/GRID_SIZE}%`,
              zIndex: 10 + (gameState.snake.length - index)
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          key={`food-${gameState.food.x}-${gameState.food.y}`}
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [1, 1.2, 1], 
            rotate: 360 
          }}
          transition={{ 
            scale: { duration: 1, repeat: Infinity },
            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
          className="absolute food-item animate-food-rotate"
          style={{
            left: `${(gameState.food.x / GRID_SIZE) * 100}%`,
            top: `${(gameState.food.y / GRID_SIZE) * 100}%`,
            width: `${100/GRID_SIZE}%`,
            height: `${100/GRID_SIZE}%`,
            zIndex: 5
          }}
        />

        {/* Game Status Overlay */}
        <AnimatePresence>
          {gameState.gameStatus !== 'playing' && (
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
                {gameState.gameStatus === 'ready' && (
                  <>
                    <ApperIcon name="Play" className="w-16 h-16 text-primary mx-auto mb-4 neon-text" />
                    <h2 className="text-3xl font-display font-bold text-primary neon-text mb-4">
                      READY TO PLAY
                    </h2>
                    <p className="text-gray-300 mb-6">Press SPACE to start the game</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startGame}
                      className="px-8 py-3 bg-primary text-neon-bg font-bold rounded-lg neon-border hover:shadow-neon-cyan transition-all duration-300"
                    >
                      START GAME
                    </motion.button>
                  </>
                )}

                {gameState.gameStatus === 'paused' && (
                  <>
                    <ApperIcon name="Pause" className="w-16 h-16 text-accent mx-auto mb-4 neon-text" />
                    <h2 className="text-3xl font-display font-bold text-accent neon-text mb-4">
                      PAUSED
                    </h2>
                    <p className="text-gray-300 mb-6">Press SPACE to resume</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resumeGame}
                      className="px-8 py-3 bg-accent text-neon-bg font-bold rounded-lg neon-border hover:shadow-neon-yellow transition-all duration-300"
                    >
                      RESUME
                    </motion.button>
                  </>
                )}

                {gameState.gameStatus === 'gameOver' && (
                  <>
                    <ApperIcon name="SkullIcon" className="w-16 h-16 text-neon-error mx-auto mb-4 neon-text" />
                    <h2 className="text-3xl font-display font-bold text-neon-error neon-text mb-4">
                      GAME OVER
                    </h2>
                    <div className="text-xl text-gray-300 mb-2">Final Score: {gameState.score}</div>
                    {gameState.score === gameState.highScore && gameState.score > 0 && (
                      <div className="text-lg text-accent neon-text mb-4">🏆 NEW HIGH SCORE! 🏆</div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetGame}
                      className="px-8 py-3 bg-neon-error text-white font-bold rounded-lg neon-border hover:shadow-[0_0_20px_#ff0055] transition-all duration-300"
                    >
                      PLAY AGAIN
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Control Hints */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex justify-center gap-4 text-sm text-gray-400"
      >
        <div className="flex items-center gap-2">
          <ApperIcon name="Navigation" size={16} />
          <span>Arrow Keys to Move</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 border border-gray-400 rounded text-xs flex items-center justify-center">
            SPC
          </div>
          <span>Pause/Resume</span>
        </div>
      </motion.div>
    </div>
  );
};

export default MainFeature;