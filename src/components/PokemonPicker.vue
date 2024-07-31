<template>
  <div class="pokemon-picker">
    <input
      class="tw-w-full tw-py-1 tw-px-2 tw-mb-3 tw-border tw-border-gray-800"
      type="text"
      :placeholder="searchPlaceholderText"
      v-model="searchText"
    >
    <TypeFilter @filter="filterPokemonByType" />
    <div class="tw-inline-block tw-h-full tw-overflow-auto">
      <div
        class="pokemon-picker__sprite"
        v-for="(pokemon, key) in pokemonResults"
        :key="key"
        @click="onAddPokemonToCanvas(pokemon)"
      >
        <img class="-tw-mb-2.5" :src="pokemon.imgUrl" :alt="pokemon.name" loading="lazy" />
        <span class="tw-text-sm">{{ pokemon.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { usePokemonStore } from '../store/pokemonStore';
import TypeFilter from './TypeFilter.vue';
import { type Pokemon } from '../util/interfaces';

export default defineComponent({
  components: {
    TypeFilter,
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
    ...mapState(usePokemonStore, ['allPokemon']),
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
    ...mapActions(usePokemonStore, { setPokemonToAdd: 'setPokemonToAdd' }),
    onAddPokemonToCanvas(pokemon: Pokemon): void {
      this.setPokemonToAdd(pokemon);
    },
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

.pokemon-picker__sprite {
  @apply
  tw-inline-block
  tw-h-24
  tw-w-24
  tw-text-center
  tw-cursor-pointer
  tw-rounded-lg
  tw-relative
  tw-z-10;
}

/* Pokeball hover effect */
/* .pokemon-picker__sprite::before {
  content: '';
  background-image: url(../assets//images/pokeball.png);

  @apply tw-h-full tw-w-full tw-absolute tw-top-0 tw-left-0 tw-opacity-0 hover:tw-opacity-20 -tw-z-10;
} */


/* Fancy border hover effect */
/* .pokemon-picker__sprite:hover {
  box-shadow: inset 0 0 0 4px theme('colors.gray.800');
}

.pokemon-picker__sprite::before,
.pokemon-picker__sprite::after {
  content: '';

  @apply tw-absolute -tw-z-10;
}

.pokemon-picker__sprite::before:hover {
  @apply tw-w-1/2 tw-h-full tw-bg-white tw-left-1/4;
}

.pokemon-picker__sprite::after:hover {
  @apply tw-h-1/2 tw-w-full tw-bg-white tw-top-1/4;
} */
</style>
