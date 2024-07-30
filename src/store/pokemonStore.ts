import { defineStore, StoreDefinition } from "pinia";

export const usePokemonStore: StoreDefinition = defineStore('pokemonStore', {
  state: () => ({
    idOfPokemonToRemove: '',
    imgUrlOfPokemonToAdd: '',
  }),
  actions: {
    setIdOfPokemonToRemove(id: string): void {
      this.idOfPokemonToRemove = id;
    },
  },
});
