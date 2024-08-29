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
    <div class="tw-h-full tw-flex tw-justify-center tw-pt-4 tw-overflow-auto tw-transform">
      <span v-if="showHint">Not seeing any pokemon? Try typing {{ minSearchLength }} or more letters</span>
      <div v-else class="tw-inline-block tw-h-full tw-w-72 xs:tw-w-full">
        <PokemonTile
          v-for="(pokemon, key) in pokemonResults"
          :key="key"
          :img-url="pokemon.imgUrl"
          :name="pokemon.name"
          :label="pokemon.name"
          :forms="pokemon.forms"
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
import TypeFilter from './TypeFilter.vue';
import GenerationFilter from './GenerationFilter.vue';
import PokemonTile from './PokemonTile.vue';
import { type Pokemon } from '../util/interfaces';

export default defineComponent({
  components: {
    TypeFilter,
    GenerationFilter,
    PokemonTile,
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
    };
  },
  computed: {
    ...mapState(useAppStore, ['allPokemon']),
  },
  watch: {
    searchText(text: string): void {
      this.pokemonResults = [];
      this.showHint = false;

      if (!text) {
        this.resetPokemon();
      } else {
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
  },
  methods: {
    ...mapActions(useAppStore, { setPokemonToAdd: 'setPokemonToAdd' }),
    resetPokemon(): void {
      this.pokemonResults = this.allPokemon.filter((pokemon: Pokemon): boolean => pokemon.generation === 1);
      this.filteredPokemon = this.pokemonResults;
    },
    toggleSearch(): void {
      this.isSearch = !this.isSearch;
      this.resetPokemon();
      this.$nextTick(() => {
        const searchBarEl: HTMLElement = this.$refs[this.searchBarRef] as HTMLElement;
        searchBarEl.focus();
        this.searchText = '';
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
