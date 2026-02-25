import { defineStore, StoreDefinition } from "pinia";
import type { Pokemon } from "../util/interfaces";
import { makePokemonShiny } from '../util/helpers';
import { saveToLocal, loadFromLocal } from '../util/localStorage';
import { LOCAL_OPTIONS_POKEMON_FORMS_REMINDER } from '../util/constants';
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
    showFormsReminder: true,
    pokemonIdsToTransfer: new Array<string>,
    transferPokemonEvent: 0,
    transferToBoxId: 0,
    shouldClone: false,
    transferErrorMsg: '',
  }),
  actions: {
    setPokemonToAdd(pokemon: Pokemon | null): void {
      if (pokemon) {
        this.pokemonToAdd = makePokemonShiny(pokemon);
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
    dispatchTransferPokemonEvent(boxId: number, pokemonIds, shouldClone = false): void {
      this.transferToBoxId = boxId;
      this.pokemonIdsToTransfer = pokemonIds;
      this.shouldClone = shouldClone;
      this.transferPokemonEvent++;
    },
    setTransferErrorMsg(message: string): void {
      this.transferErrorMsg = message;
    },
    async saveShowFormsReminder(showReminder: boolean): Promise<void> {
      await saveToLocal(LOCAL_OPTIONS_POKEMON_FORMS_REMINDER, showReminder);
    },
    async loadShowFormsReminder(): Promise<void> {
      const showFormsReminder: boolean = await loadFromLocal(LOCAL_OPTIONS_POKEMON_FORMS_REMINDER);
      this.showFormsReminder = showFormsReminder === null ? true : showFormsReminder;
    },
  },
});
