import { defineStore, StoreDefinition } from "pinia";
import { useAchievementStore } from "./achievementStore";
import { type Pokemon } from "../util/interfaces";
import { makePokemonShiny } from '../util/helpers';
import { saveToLocal, loadFromLocal } from "../util/localStorage";
import { LOCAL_OPTIONS_POKEMON_FORMS_REMINDER } from "../util/constants";
import pokemonJSON from '../assets/json/pokemon.json';

export const useAppStore: StoreDefinition = defineStore('appStore', {
  state: () => ({
    allPokemon: pokemonJSON,
    pokemonIdsToRemove: new Array<string>,
    pokemonToAdd: {} as Pokemon | null,
    imgUrlOfPokemonToAdd: '',
    randomizeBoxId: -1,
    shouldRandomizeBox: 0,
    defaultBoxId: 0,
    isRandomOnStartUp: false,
    backgroundColor: '#ffffff',
    speed: 5,
    size: 96,
    showFormsReminder: true,
  }),
  actions: {
    setPokemonToAdd(pokemon: Pokemon | null): void {
      if (pokemon) {
        this.pokemonToAdd = makePokemonShiny(pokemon);
        useAchievementStore().addPokemonToAchievements(this.pokemonToAdd);
      } else {
        this.pokemonToAdd = null;
      }
    },
    setIdsOfPokemonToRemove(ids: Array<string>): void {
      this.pokemonIdsToRemove = ids;
    },
    setRandomizeBoxId(id: number): void {
      this.randomizeBoxId = id;
      this.shouldRandomizeBox++;
    },
    setDefaultBoxId(id: number): void {
      this.defaultBoxId = id;
    },
    setAlwaysRandom(isRandom: boolean): void {
      this.isRandomOnStartUp = isRandom;
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
    saveShowFormsReminder(showReminder: boolean): void {
      saveToLocal(LOCAL_OPTIONS_POKEMON_FORMS_REMINDER, showReminder);
    },
    async loadShowFormsReminder(): Promise<void> {
      const showFormsReminder: boolean = await loadFromLocal(LOCAL_OPTIONS_POKEMON_FORMS_REMINDER);
      this.showFormsReminder = showFormsReminder === null ? true : showFormsReminder;
    },
  },
});
