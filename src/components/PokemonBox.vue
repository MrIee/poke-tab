<template>
  <div class="tw-w-72 tw-flex tw-flex-col tw-items-center">
    <div class="tw-w-full tw-flex tw-mb-1">
      <strong v-if="default">In Use</strong>
      <span class="tw-ml-auto"><strong>{{ pokemon.length }}/{{ storageLimit }}</strong> pokemon</span>
    </div>
    <button class="tw-w-full tw-mb-2">Use Box</button>
    <div class="tw-h-60 tw-w-72 tw-flex tw-flex-wrap tw-content-start tw-mb-2 tw-rounded tw-border-2 tw-border-gray-800 tw-box-content">
      <PokemonTile
        v-for="pokemon in pokemon"
        :key="pokemon.id"
        :id="pokemon.id"
        :img-url="pokemon.imgUrl"
        :name="pokemon.name"
        @select="onSelect"
      />
    </div>
    <div class="tw-flex tw-justify-center tw-flex-wrap">
      <button class="tw-mr-2 tw-mb-2 tw-flex-grow" @click="onAdd">Add</button>
      <button class="alert tw-mb-2 tw-flex-grow" :disabled="idsToRemove.length === 0" @click="onRemove">
        Remove Selected
      </button>
      <button class="tw-w-[calc(50%-4px)] tw-mr-2">Randomize</button>
      <button class="alert tw-w-[calc(50%-4px)]">Remove all</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { usePokemonStore } from '../store/pokemonStore';
import PokemonTile from './PokemonTile.vue';
import { type Pokemon } from '../util/interfaces';
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
      idsToRemove: new Array<string>,
      isOptionsVisible: false,
      storageLimit: POKEMON_STORAGE_LIMIT,
    };
  },
  methods: {
    ...mapActions(usePokemonStore, { setIdsOfPokemonToRemove: 'setIdsOfPokemonToRemove' }),
    onSelect(id: string): void {
      const index: number = this.idsToRemove.indexOf(id);

      if (index === -1) {
        this.idsToRemove.push(id);
      } else {
        this.idsToRemove.splice(index, 1);
      }
    },
    onRemove(): void {
      if (this.idsToRemove.length > 0) {
        this.setIdsOfPokemonToRemove(this.idsToRemove);
        this.idsToRemove = [];
      }
    },
    onAdd(): void {
      this.$emit('add');
    },
  },
});
</script>
