<template>
  <div class="pokemon-picker">
    <div class="tw-p-3 tw-pb-0">
      <button class="tw-w-full tw-mb-2" @click="toggleSearch">
        {{ isSearch ? 'Use Filters' : 'Search' }}
      </button>
      <input
        v-if="isSearch"
        :ref="searchBarRef"
        class="tw-w-full tw-py-1 tw-px-2 tw-mb-1 tw-rounded-md tw-border tw-border-gray-800"
        type="text"
        :placeholder="searchPlaceholderText"
        v-model="searchText"
      >
      <div v-else class="tw-flex tw-gap-1">
        <TypeFilter class="tw-w-1/2" @filter="filterPokemonByType" />
        <GenerationFilter class="tw-w-1/2" @filter="filterPokemonByGeneration" />
      </div>
    </div>
    <Reminder
      v-if="showFormsReminder"
      class="tw-top-[142px]"
      :text="formReminderText"
      :image-url="ReminderImage"
      @dont-show-again="saveShowFormsReminder(false)"
    />
    <div class="tw-h-full tw-flex tw-justify-center tw-pt-4 tw-overflow-auto tw-transform tw-relative">
      <span v-if="showHint">Not seeing any pokemon? Try typing {{ minSearchLength }} or more letters</span>
      <div v-else class="tw-inline-block tw-h-full tw-w-72 xs:tw-w-full">
        <PokemonTile
          v-for="(pokemon, key) in pokemonResults"
          :key="key"
          :img-url="pokemon.imgUrl"
          :name="pokemon.name"
          :label="pokemon.name"
          :forms="pokemon.forms"
          :locked="isPokemonLocked(pokemon.achievement as string)"
          @on-click-pokemon="setPokemonToAdd(pokemon)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useAppStore } from '../store/appStore';
import { useAchievementStore } from '../store/achievementStore';
import TypeFilter from './TypeFilter.vue';
import GenerationFilter from './GenerationFilter.vue';
import PokemonTile from './PokemonTile.vue';
import Reminder from './Reminder.vue';
import ReminderImage from '../../public/images/pikachu-forms-reminder.png';
import { type Pokemon } from '../util/interfaces';

export default defineComponent({
  components: {
    TypeFilter,
    GenerationFilter,
    PokemonTile,
    Reminder,
  },
  data() {
    return {
      searchBarRef: 'searchBarRef',
      pokemonResults: new Array<Pokemon>,
      searchPlaceholderText: 'Type a pokemon name here...',
      searchText: '',
      filteredPokemon: new Array<Pokemon>,
      filters: { type: '', generation: 1 },
      isSearch: false,
      showHint: false,
      minSearchLength: 3,
      formReminderText: 'Pokemon with a plus (+) icon in the top right corner have additional forms. Click on them to reveal their forms.',
      ReminderImage,
    };
  },
  computed: {
    ...mapState(useAppStore, ['allPokemon', 'showFormsReminder']),
    ...mapState(useAchievementStore, ['unlockedAchievements']),
  },
  watch: {
    searchText(text: string): void {
      this.showHint = false;

      if (text) {
        if (text.length >= this.minSearchLength) {
          this.showHint = false;
          this.pokemonResults = this.allPokemon.filter((pokemon: Pokemon) => {
            return pokemon.name.toLowerCase().indexOf(text) !== -1;
          });
        } else {
          this.showHint = true;
        }
      }
    },
  },
  mounted() {
    this.resetPokemon();
    this.loadShowFormsReminder();
  },
  methods: {
    ...mapActions(useAppStore, {
      setPokemonToAdd: 'setPokemonToAdd',
      saveShowFormsReminder: 'saveShowFormsReminder',
      loadShowFormsReminder: 'loadShowFormsReminder',
    }),
    resetPokemon(): void {
      this.pokemonResults = this.allPokemon.filter((pokemon: Pokemon): boolean => pokemon.generation === 1);
      this.filteredPokemon = this.pokemonResults;
    },
    toggleSearch(): void {
      this.isSearch = !this.isSearch;
      this.showHint = false;

      if (!this.isSearch) {
        this.resetPokemon();
      }

      this.$nextTick(() => {
        if (this.isSearch) {
          const searchBarEl: HTMLElement = this.$refs[this.searchBarRef] as HTMLElement;
          searchBarEl.focus();
          this.pokemonResults = [];
        } else {
          this.resetPokemon();
        }

        this.searchText = '';
        this.showHint = false;
      });
    },
    filterPokemon(): void {
      const type: string = this.filters.type;
      const generation: number = this.filters.generation;

      this.filteredPokemon = this.allPokemon.filter((pokemon: Pokemon): boolean => pokemon.generation === generation);

      if (type) {
        this.filteredPokemon = this.filteredPokemon.filter((pokemon: Pokemon): boolean => {
          return pokemon.type.some((t: string) => t === type);
        });
      }

      this.pokemonResults = this.filteredPokemon;
    },
    filterPokemonByType(type: string): void {
      this.filters.type = type;
      this.filterPokemon();
    },
    filterPokemonByGeneration(generation: number): void {
      this.filters.generation = generation;
      this.filterPokemon();
    },
    isPokemonLocked(achievement: string): boolean {
      return !!achievement && this.unlockedAchievements.indexOf(achievement) === -1;
    },
  },
});
</script>

<style>
.pokemon-picker {
  @apply tw-h-full
  tw-w-full
  sm:tw-h-auto
  sm:tw-w-full
  tw-flex
  tw-flex-col
  tw-bg-white
  tw-rounded-bl-lg
  tw-rounded-br-lg;
}
</style>
