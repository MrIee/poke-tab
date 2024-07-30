import { defineStore, StoreDefinition } from "pinia";
import { type Pokemon } from "../util/interfaces";

export const usePokemonStore: StoreDefinition = defineStore('pokemonStore', {
  state: () => ({
    pokemonIdsToRemove: new Array<string>,
    pokemonToAdd: {} as Pokemon | null,
    imgUrlOfPokemonToAdd: '',
  }),
  actions: {
    setPokemonToAdd(pokemon: Pokemon | null): void {
      this.pokemonToAdd = pokemon;
    },
    setIdsOfPokemonToRemove(ids: Array<string>): void {
      this.pokemonIdsToRemove = ids;
    },
  },
});
