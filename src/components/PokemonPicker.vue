<template>
  <div class="pokemon-picker">
    <div class="tw-p-3 tw-pb-0">
      <input
        class="tw-w-full tw-py-1 tw-px-2 tw-mb-1 tw-border tw-border-gray-800"
        type="text"
        :placeholder="searchPlaceholderText"
        v-model="searchText"
      >
      <div class="tw-flex">
        <TypeFilter class="tw-w-1/2" @filter="filterPokemonByType" />
        <GenerationFilter class="tw-w-1/2" @filter="filterPokemonByGeneration" />
      </div>
    </div>
    <div class="tw-h-full tw-flex tw-justify-center tw-overflow-auto tw-transform">
      <div class="tw-inline-block tw-h-full tw-w-72 xs:tw-w-full">
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
      pokemonResults: new Array<Pokemon>,
      searchPlaceholderText: 'Type a pokemon name here...',
      searchText: '',
      filteredPokemon: new Array<Pokemon>,
      filters: { type: '', generation: 1 },
    };
  },
  computed: {
    ...mapState(useAppStore, ['allPokemon']),
  },
  watch: {
    searchText(text: string): void {
      this.pokemonResults = [];

      if (!text) {
        this.pokemonResults = this.filteredPokemon;
      } else {
        this.pokemonResults = this.filteredPokemon.filter((pokemon: Pokemon) => {
          return pokemon.name.toLowerCase().indexOf(text) !== -1;
        });
      }
    },
  },
  mounted() {
    this.pokemonResults = this.allPokemon.filter((pokemon: Pokemon): boolean => pokemon.generation === 1);
    this.filteredPokemon = this.pokemonResults;
  },
  methods: {
    ...mapActions(useAppStore, { setPokemonToAdd: 'setPokemonToAdd' }),
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
    // filterPokemonByType(type: string): void {
    //   if (type) {
    //     this.filters.type = type;
    //     this.pokemonResults = this.filteredPokemon.filter((pokemon: Pokemon): boolean => {
    //       return pokemon.type.some((t: string) => t === type);
    //     });
    //     this.filteredPokemon = this.pokemonResults;
    //   } else {
    //     this.filters.type = '';
    //     this.filteredPokemon = this.allPokemon;
    //     this.pokemonResults = this.filteredPokemon;
    //   }
    // },
    // filterPokemonByGeneration(generation: number): void {
    //   if (generation) {
    //     this.filters.generation = generation;
    //     this.filteredPokemon = this.allPokemon.filter((pokemon: Pokemon): boolean => pokemon.generation === generation);
    //     this.pokemonResults = this.filteredPokemon;

    //     if (this.filters.type) {
    //       this.filterPokemonByType(this.filters.type);
    //     }
    //   }
    // },
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
