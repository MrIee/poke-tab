import { defineStore, StoreDefinition } from "pinia";
import { type Pokemon } from "../util/interfaces";
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
  }),
  actions: {
    setPokemonToAdd(pokemon: Pokemon | null): void {
      this.pokemonToAdd = pokemon;
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
  },
});
