import { defineStore, StoreDefinition } from "pinia";
import { useCalloutStore } from "./calloutStore";
import { type Pokemon, type Callout } from "../util/interfaces";
import achievementsJSON from '../assets/json/achievements.json';
// import { saveToLocal, loadFromLocal } from "../util/localStorage";

const achievementLabel = 'Achievement Unlocked!';

const getNewCallout = (imgUrl: string, label: string, description: string): Callout => ({
  type: 'achievement',
  imgUrl,
  label,
  description,
});

export const useAchievementStore: StoreDefinition = defineStore('achievementStore', {
  state: () => ({
    unlockedAchievements: new Array<string>,
    first151Pokemon: new Array<string>,
    ghastlyFusionPokemon: new Array<string>,
  }),
  actions: {
    addPokemonToAchievements(pokemon: Pokemon): void {
      this.addPokemonToFirst151(pokemon);
      this.addPokemonToGastlyFusion(pokemon);
    },
    addPokemonToFirst151(pokemon: Pokemon): void {
      const length = achievementsJSON.First151.requirements.length;

      if (!this.first151PokemonUnlocked && pokemon.generation === 1 && this.first151Pokemon.indexOf(pokemon.name) === -1) {
        this.first151Pokemon.push(pokemon.name);
      }

      if (this.first151Pokemon.length === length && this.unlockedAchievements.indexOf(achievementsJSON.First151.name) === -1) {
        this.unlockedAchievements.push(achievementsJSON.First151.name);
        useCalloutStore().addCallout(getNewCallout(
          achievementsJSON.First151.imgUrl,
          achievementLabel,
          achievementsJSON.First151.name
        ));
      }
    },
    addPokemonToGastlyFusion(pokemon: Pokemon): void {
      const requirements = achievementsJSON.GhastlyFusion.requirements.pokemon;

      if (!this.ghastlyFusionUnlocked && requirements.indexOf(pokemon.name) > -1) {
        this.ghastlyFusionPokemon.push(pokemon.name);
      }

      if (this.ghastlyFusionPokemon.length === requirements.length && this.unlockedAchievements.indexOf(achievementsJSON.GhastlyFusion.name) === -1) {
        this.unlockedAchievements.push(achievementsJSON.GhastlyFusion.name);
        useCalloutStore().addCallout(getNewCallout(
          achievementsJSON.GhastlyFusion.imgUrl,
          achievementLabel,
          achievementsJSON.GhastlyFusion.name
        ));
      }
    },
  },
});
