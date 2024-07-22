<template>
  <div class="tw-fixed tw-w-[403px] tw-h-[676px] tw-flex tw-flex-col tw-border tw-border-gray-800 tw-bg-white tw-z-10">
    <div>
      <input
        class="tw-w-full tw-py-1 tw-px-2 tw-border tw-border-gray-800"
        type="text"
        :placeholder="searchPlaceholderText"
        v-model="searchText"
      >
      <Filter @filter="filterPokemonByType" />
    </div>
    <div class="tw-inline-block tw-overflow-auto">
      <div
        class="pokemon-picker__sprite"
        v-for="(pokemon, key) in pokemonResults"
        :key="key"
        @click="onAddPokemonToCanvas(pokemon.imgUrl)"
      >
        <img class="-tw-mb-2.5" :src="pokemon.imgUrl" :alt="pokemon.name" loading="lazy" />
        <span class="tw-text-sm">{{ pokemon.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Filter from './Filter.vue';
import { type Pokemon } from '../util/interfaces';

export default defineComponent({
  components: {
    Filter,
  },
  props: {
    canvasId: {
      type: String,
      default: undefined,
    },
    pokemon: {
      type: Array<Pokemon>,
      default: () => [],
    },
  },
  data() {
    return {
      pokemonResults: new Array<Pokemon>,
      searchPlaceholderText: 'Type a pokemon name here...',
      searchText: '',
      filteredPokemon: new Array<Pokemon>,
    };
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
  async mounted() {
    this.pokemonResults = this.pokemon;
    this.filteredPokemon = this.pokemon;
  },
  methods: {
    onAddPokemonToCanvas(imgUrl: string): void {
      this.$emit('addToCanvas', imgUrl);
    },
    filterPokemonByType(type: string): void {
      if (type) {
        this.pokemonResults = this.pokemon.filter((pokemon: Pokemon): boolean => {
          return pokemon.type.some((t: string) => t === type);
        });
        this.filteredPokemon = this.pokemonResults;
      } else {
        this.filteredPokemon = this.pokemon;
        this.pokemonResults = this.filteredPokemon;
      }
    },
  },
});
</script>

<style>
.pokemon-sprite {
  @apply tw-fixed;
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
  box-shadow: inset 0 0 0 4px rgb(75, 85, 99);
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
