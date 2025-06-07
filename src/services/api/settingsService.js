import settingsData from '../mockData/settings.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SettingsService {
  static data = [...settingsData];

  static async getAll() {
    await delay(200);
    return [...this.data];
  }

  static async getById(id) {
    await delay(200);
    const item = this.data.find(setting => setting.id === id);
    return item ? { ...item } : null;
  }

  static async create(settings) {
    await delay(300);
    const newSettings = {
      ...settings,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    this.data.push(newSettings);
    return { ...newSettings };
  }

  static async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(setting => setting.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date().toISOString() };
      return { ...this.data[index] };
    }
    throw new Error('Settings not found');
  }

  static async delete(id) {
    await delay(200);
    const index = this.data.findIndex(setting => setting.id === id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Settings not found');
  }
}

export default SettingsService;