<template>
  <div class="tw-w-72 tw-flex tw-flex-col tw-items-center">
    <div class="tw-w-full tw-flex tw-mb-1">
      <strong v-if="default">In Use</strong>
      <span class="tw-ml-auto"><strong>{{ pokemon.length }}/{{ storageLimit }}</strong> pokemon</span>
    </div>
    <div class="tw-h-60 tw-w-72 tw-flex tw-flex-wrap tw-content-start tw-mb-2 tw-rounded tw-border-2 tw-border-gray-800 tw-box-content">
      <PokemonTile v-for="(pokemon, key) in pokemon" :key="key" :pokemon="pokemon" options-enabled />
    </div>
    <div class="tw-flex tw-justify-center tw-flex-wrap">
      <button class="tw-w-full tw-mb-2">Use Box</button>
      <button class="tw-mr-2">Edit</button>
      <button class="tw-mr-2">Randomize</button>
      <button>Remove all</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PokemonTile from './PokemonTile.vue';
import { Pokemon } from '../util/interfaces';
import { POKEMON_STORAGE_LIMIT } from '../util/constants';

export default defineComponent({
  components: {
    PokemonTile,
  },
  props: {
    default: {
      type: Boolean,
      default: false,
    },
    pokemon: {
      type: Array<Pokemon>,
      default: () => [],
    },
  },
  data() {
    return {
      isOptionsVisible: false,
      storageLimit: POKEMON_STORAGE_LIMIT,
    };
  },
});
</script>
