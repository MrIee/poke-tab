<template>
  <div class="options">
    <div class="tw-h-8 tw-flex tw-text-white tw-bg-blue-400 tw-justify-center tw-items-center tw-rounded-tl-lg tw-rounded-tr-lg tw-relative">
      <div
        :id="dragBarId"
        class="tw-w-full tw-cursor-grab active:tw-cursor-grabbing tw-absolute tw-top-0 tw-right-8 tw-bottom-0 tw-left-0"
      >
      </div>
      <div class="tw-flex tw-justify-center tw-items-center tw-relative tw-pointer-events-none">
        <DragIndicator class="tw-hidden sm:tw-block tw-absolute -tw-translate-y-1/2 tw-top-1/2 -tw-left-7" />
        <strong>{{ title }}</strong>
      </div>
      <div class="tw-flex tw-items-center tw-h-full tw-p-1 tw-cursor-pointer tw-absolute tw-right-0" @click="onClose">
        <Cross class="tw-h-6 tw-w-6" />
      </div>
    </div>
    <div class="tw-h-full sm:tw-h-[550px] tw-overflow-auto">
      <p class="tw-mb-2">
        You may store up to 10 sets of pokemon to use in your new tab(s).
      </p>
      <div class="tw-mb-1">
        <select
          class="tw-self-start tw-mr-2 tw-rounded tw-border-2 tw-border-gray-800 tw-cursor-pointer"
          v-model="selectedBoxId"
        >
          <option v-for="(index, key) in savedPokemon.length" :key="key" :value="key">Box {{ index }}</option>
        </select>
      </div>
      <PokemonBox :default="savedPokemon[selectedBoxId].default" :pokemon="savedPokemon[selectedBoxId].pokemon" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DragIndicator from './icons/DragIndicator.vue';
import Cross from './icons/Cross.vue';
import PokemonBoxComponent from './PokemonBox.vue';
import { type PokemonBox } from '../util/interfaces';
import { OPTIONS_DRAGBAR_ID } from '../util/constants';

export default defineComponent({
  components: {
    DragIndicator,
    Cross,
    PokemonBox: PokemonBoxComponent,
  },
  props: {
    pokemon: {
      type: Object,
      default: () => ({}),
    },
    savedPokemon: {
      type: Array<PokemonBox>,
      default: () => [],
    },
  },
  data() {
    return {
      title: 'Options',
      selectedBoxId: 0,
      dragBarId: OPTIONS_DRAGBAR_ID,
    };
  },
  watch: {
    selectedBoxId(id: number): void {
      this.$emit('selectBox', id);
    },
  },
  methods: {
    onClose(): void {
      this.$emit('close');
    },
  },
});
</script>

<style>
.options {
  @apply tw-fixed
  tw-h-full
  tw-w-full
  sm:tw-h-auto
  sm:tw-w-[403px]
  tw-flex
  tw-flex-col
  tw-border
  tw-border-gray-800
  tw-bg-white
  tw-rounded-lg
  tw-z-10;
}
</style>