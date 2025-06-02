import { MMKV } from 'react-native-mmkv';

class Storage {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV();
  }

  setItem<T>(key: string, value: T): void {
    try {
      if (key === 'token') {
        // Store token as raw string
        this.storage.set(key, value as string);
      } else {
        // Store other items as JSON
        const jsonValue = JSON.stringify(value);
        this.storage.set(key, jsonValue);
      }
    } catch (e) {
      console.error('Error saving to storage:', e);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      if (key === 'token') {
        // Get token as raw string
        const value = this.storage.getString(key);
        return value as T;
      } else {
        // Get other items as JSON
        const jsonValue = this.storage.getString(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
      }
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.delete(key);
    } catch (e) {
      console.error('Error removing from storage:', e);
    }
  }

  clearAll(): void {
    try {
      this.storage.clearAll();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  }
}

export const storage = new Storage();

// Redux persist storage adapter
export const reduxStorage = {
  setItem: (key: string, value: string) => {
    storage.setItem(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getItem<string>(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.removeItem(key);
    return Promise.resolve();
  },
};
