import gameStateData from '../mockData/gameState.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameStateService {
  static data = [...gameStateData];

  static async getAll() {
    await delay(200);
    return [...this.data];
  }

  static async getById(id) {
    await delay(200);
    const item = this.data.find(state => state.id === id);
    return item ? { ...item } : null;
  }

  static async create(gameState) {
    await delay(300);
    const newGameState = {
      ...gameState,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data.push(newGameState);
    return { ...newGameState };
  }

  static async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(state => state.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date().toISOString() };
      
      // Save to localStorage for persistence
      if (updates.highScore !== undefined) {
        localStorage.setItem('neonSnakeHighScore', updates.highScore.toString());
      }
      
      return { ...this.data[index] };
    }
    throw new Error('Game state not found');
  }

  static async delete(id) {
    await delay(200);
    const index = this.data.findIndex(state => state.id === id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Game state not found');
  }

  // Initialize high score from localStorage
  static initializeHighScore() {
    const savedHighScore = localStorage.getItem('neonSnakeHighScore');
    if (savedHighScore && this.data.length > 0) {
      this.data[0].highScore = parseInt(savedHighScore, 10);
    }
  }
}

// Initialize high score on service load
GameStateService.initializeHighScore();

export default GameStateService;