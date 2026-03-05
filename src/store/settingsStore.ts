import { defineStore, StoreDefinition } from 'pinia';
import { loadObjectFromLocal, saveObjectToLocal } from '../util/localStorage';
import type { RandomizerOptions } from '../util/interfaces';

interface SettingsStoreState {
  hasShinyCharm: boolean;
  randomizerOptions: RandomizerOptions;
  alwaysRandom: boolean;
  backgroundColor: string;
  speed: number;
  size: number;
};

const randomizerOptions: RandomizerOptions = {
  includeExtras: false,
  includeForms: false,
};

export const useSettingsStore: StoreDefinition = defineStore('settingsStore', {
  state: (): SettingsStoreState => ({
    hasShinyCharm: false,
    randomizerOptions,
    alwaysRandom: false,
    backgroundColor: '#ffffff',
    speed: 5,
    size: 96,
  }),
  actions: {
    async saveSettings(): Promise<void> {
      await saveObjectToLocal({ ...this.$state });
    },
    async loadSettings(): Promise<void> {
      const loadedSettings: SettingsStoreState = await loadObjectFromLocal<SettingsStoreState>(Object.keys(this.$state));

      if (loadedSettings.randomizerOptions) {
        this.randomizerOptions = typeof loadedSettings.randomizerOptions === 'string'
          ? JSON.parse(loadedSettings.randomizerOptions)
          : loadedSettings.randomizerOptions;
      }

      this.hasShinyCharm = loadedSettings.hasShinyCharm || this.hasShinyCharm;
      this.alwaysRandom = loadedSettings.alwaysRandom || this.alwaysRandom;
      this.backgroundColor = loadedSettings.backgroundColor || this.backgroundColor;
      this.speed = loadedSettings.speed || this.speed;
      this.size = loadedSettings.size || this.size;
    },
    async setHasShinyCharm(hasCharm: boolean): Promise<void> {
      this.hasShinyCharm = hasCharm;
      await saveObjectToLocal({ hasShinyCharm: this.hasShinyCharm });
    },
    setAlwaysRandom(isRandom: boolean): void {
      this.alwaysRandom = isRandom;
    },
    setRandomIncludeExtras(includeExtras: boolean): void {
      this.randomizerOptions.includeExtras = includeExtras;
    },
    setRandomIncludeForms(includeForms: boolean): void {
      this.randomizerOptions.includeForms = includeForms;
    },
    setBackgroundColor(color: string): void {
      if (color) {
        this.backgroundColor = color;
      }
    },
    setSpeed(speed: number): void {
      if (speed) {
        this.speed = speed;
      }
    },
    setSize(size: number): void {
      if (size) {
        this.size = size;
      }
    },
  },
});
