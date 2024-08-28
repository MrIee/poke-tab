<template>
  <div class="pokemon-picker">
    <div class="tw-p-3 tw-pb-0">
      <input
        class="tw-w-full tw-py-1 tw-px-2 tw-mb-1 tw-border tw-border-gray-800"
        type="text"
        :placeholder="searchPlaceholderText"
        v-model="searchText"
      >
      <TypeFilter @filter="filterPokemonByType" />
    </div>
    <div class="tw-h-full tw-flex tw-justify-center tw-overflow-auto">
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
import PokemonTile from './PokemonTile.vue';
import { type Pokemon } from '../util/interfaces';

export default defineComponent({
  components: {
    TypeFilter,
    PokemonTile,
  },
  data() {
    return {
      pokemonResults: new Array<Pokemon>,
      searchPlaceholderText: 'Type a pokemon name here...',
      searchText: '',
      filteredPokemon: new Array<Pokemon>,
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
    this.pokemonResults = this.allPokemon;
    this.filteredPokemon = this.allPokemon;
  },
  methods: {
    ...mapActions(useAppStore, { setPokemonToAdd: 'setPokemonToAdd' }),
    filterPokemonByType(type: string): void {
      if (type) {
        this.pokemonResults = this.allPokemon.filter((pokemon: Pokemon): boolean => {
          return pokemon.type.some((t: string) => t === type);
        });
        this.filteredPokemon = this.pokemonResults;
      } else {
        this.filteredPokemon = this.allPokemon;
        this.pokemonResults = this.filteredPokemon;
      }
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
