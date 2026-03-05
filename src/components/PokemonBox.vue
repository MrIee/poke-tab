<template>
  <div class="tw:flex tw:flex-col tw:items-center">
    <div class="tw:w-full tw:flex tw:mb-1">
      <strong v-if="default">In Use</strong>
      <span class="tw:ml-auto"><strong>{{ pokemon.length }}/{{ storageLimit }}</strong> pokemon</span>
    </div>
    <button class="tw:w-full tw:mb-2" :disabled="defaultBoxId === id" @click="handleOnUse">Use Box</button>
    <div class="tw:h-60 tw:w-72 tw:flex tw:flex-wrap tw:content-start tw:mb-2 tw:rounded tw:border-2 tw:border-gray-800 tw:box-content">
      <PokemonTile
        class="tw:max-h-12 tw:max-w-12"
        v-for="p in pokemon"
        :key="p.id"
        is-selectable
        :id="p.id"
        :img-url="getImgUrl(p)"
        :name="p.name"
        @select="handleOnSelect"
      />
    </div>
    <div class="tw:w-full tw:flex tw:flex-wrap tw:gap-2 tw:mb-2">
      <button class="tw:grow" @click="handleOnAdd">Add</button>
      <button class="alert tw:grow" :disabled="selectedIds.length === 0" @click="handleOnRemove">
        Remove
      </button>
    </div>
    <div class="tw:w-full tw:flex tw:gap-2 tw:mb-2">
      <button class="tw:grow" @click="handleOnRandomize">Randomize</button>
      <button class="alert tw:grow" @click="handleOnRemoveAll">Remove all</button>
    </div>
    <RandomizerOptions class="tw:self-start tw:mb-2" />
  </div>
  <div class="tw:w-full tw:flex tw:items-center tw:gap-2">
    <button class="tw:grow" @click="handleOnTransfer">Transfer</button>
    <button class="alert tw:grow" @click="handleOnClone">Clone</button>
    <BoxDropdown v-model="selectedBoxId" />
  </div>
  <span v-if="transferErrorMsg" class="tw:text-red-500">{{ transferErrorMsg }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useAppStore } from '../store/appStore';
import { type Pokemon } from '../util/interfaces';
import { POKEMON_STORAGE_LIMIT } from '../util/constants';
import PokemonTile from './PokemonTile.vue';
import RandomizerOptions from './RandomizerOptions.vue';
import BoxDropdown from './BoxDropdown.vue';

export default defineComponent({
  components: {
    PokemonTile,
    RandomizerOptions,
    BoxDropdown,
  },
  props: {
    id: {
      type: Number,
      default: 0,
    },
    default: {
      type: Boolean,
      default: false,
    },
    pokemon: {
      type: Array<Pokemon>,
      default: () => [],
    },
  },
  emits: ['add'],
  data() {
    return {
      selectedIds: new Array<string>,
      isOptionsVisible: false,
      storageLimit: POKEMON_STORAGE_LIMIT,
      selectedBoxId: 0,
    };
  },
  computed: {
    ...mapState(useAppStore, ['defaultBoxId', 'transferErrorMsg']),
  },
  methods: {
    ...mapActions(useAppStore, {
      setDefaultBoxId: 'setDefaultBoxId',
      setIdsOfPokemonToRemove: 'setIdsOfPokemonToRemove',
      setRandomizeBoxId: 'setRandomizeBoxId',
      dispatchTransferPokemonEvent: 'dispatchTransferPokemonEvent',
      setTransferToBoxId: 'setTransferToBoxId',
    }),
    getImgUrl(pokemon: Pokemon): string {
      return pokemon.isShiny ? pokemon.shinyImgUrl : pokemon.imgUrl;
    },
    handleOnUse(): void {
      if (this.id !== this.defaultBoxId) {
        this.setDefaultBoxId(this.id);
      }
    },
    handleOnSelect(id: string): void {
      const index: number = this.selectedIds.indexOf(id);

      if (index === -1) {
        this.selectedIds.push(id);
      } else {
        this.selectedIds.splice(index, 1);
      }
    },
    handleOnAdd(): void {
      this.$emit('add');
    },
    handleOnRemove(): void {
      if (this.selectedIds.length > 0) {
        this.setIdsOfPokemonToRemove(this.selectedIds);
        this.selectedIds = [];
      }
    },
    handleOnRandomize(): void {
      this.setRandomizeBoxId(this.id);
    },
    handleOnRemoveAll(): void {
      this.setIdsOfPokemonToRemove(this.pokemon.map((pokemon: Pokemon): string => pokemon.id as string));
    },
    handleOnTransfer(): void {
      this.dispatchTransferPokemonEvent(this.selectedBoxId, this.selectedIds);
    },
    handleOnClone(): void {
      this.dispatchTransferPokemonEvent(this.selectedBoxId, this.selectedIds, true);
    },
  },
});
</script>
