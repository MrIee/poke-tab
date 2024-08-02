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
    <div class="tw-h-full sm:tw-h-[650px] tw-p-3 tw-overflow-auto">
      <p class="tw-mb-3">
        <label class="tw-cursor-pointer" for="randomizeOnNewTab">
          <input id="randomizeOnNewTab" class="tw-mr-2" type="checkbox" v-model="isRandom" />
          <span>Always random on new tab</span>
        </label>
      </p>
      <p class="tw-mb-3">
        You may store up to 10 sets of pokemon to use in your new tab(s).
      </p>
      <div>
        <div class="tw-mb-1">
          <select
            class="tw-self-start tw-mr-2 tw-rounded tw-border-2 tw-border-gray-800 tw-cursor-pointer"
            v-model="selectedBoxId"
          >
            <option v-for="(index, key) in savedPokemon.length" :key="key" :value="key">Box {{ index }}</option>
          </select>
        </div>
        <PokemonBox
          :id="selectedBoxId"
          :default="savedPokemon[selectedBoxId].default"
          :pokemon="savedPokemon[selectedBoxId].pokemon"
          @add="openPicker"
        />
      </div>
    </div>
    <div v-if="isTabVisible" class="tw-h-full tw-w-full tw-rounded-bl-lg tw-rounded-br-lg tw-absolute tw-top-8 tw-z-10">
      <div class="tw-h-8 tw-flex tw-items-center tw-bg-blue-400 tw-border-t tw-border-gray-800 tw-relative">
        <span class="tw-px-1 tw-cursor-pointer tw-absolute tw-left-1.5" @click="closePicker">
          <Chevron class="tw-h-2.5 tw-w-4 tw-fill-white -tw-rotate-90" />
        </span>
        <span class="tw-w-full tw-text-center tw-text-white">{{ tabTitle }}</span>
      </div>
      <PokemonPicker v-if="isPickerVisible" class="tw-h-[calc(100%-64px)]" />
    </div>
    <button class="tw-mt-auto tw-m-3" @click="onSave">Save Settings</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { usePokemonStore } from '../store/pokemonStore';
import DragIndicator from './icons/DragIndicator.vue';
import Cross from './icons/Cross.vue';
import Chevron from './icons/Chevron.vue';
import PokemonBoxComponent from './PokemonBox.vue';
import PokemonPicker from './PokemonPicker.vue';
import { type PokemonBox } from '../util/interfaces';
import { OPTIONS_DRAGBAR_ID } from '../util/constants';

export default defineComponent({
  components: {
    DragIndicator,
    Cross,
    Chevron,
    PokemonBox: PokemonBoxComponent,
    PokemonPicker,
  },
  props: {
    savedPokemon: {
      type: Array<PokemonBox>,
      default: () => [],
    },
  },
  data() {
    return {
      title: 'Options',
      selectedBoxId: 0,
      isRandom: false,
      dragBarId: OPTIONS_DRAGBAR_ID,
      isPickerVisible: false,
      isTabVisible: false,
      tabTitle: '',
    };
  },
  computed: {
    ...mapState(usePokemonStore, ['defaultBoxId', 'isRandomOnStartUp']),
  },
  watch: {
    isRandomOnStartUp(isRandom: boolean): void {
      this.setAlwaysRandom(isRandom);
    },
    selectedBoxId(id: number): void {
      this.$emit('selectBox', id);
    },
  },
  mounted(): void {
    this.selectedBoxId = this.defaultBoxId;
    this.isRandom = this.isRandomOnStartUp;
  },
  methods: {
    ...mapActions(usePokemonStore, { setAlwaysRandom: 'setAlwaysRandom' }),
    onClose(): void {
      this.$emit('close');
    },
    openPicker(): void {
      this.tabTitle = 'Pokemon Picker';
      this.isTabVisible = true;
      this.isPickerVisible = true;
    },
    closePicker(): void {
      this.isTabVisible = false;
      this.isPickerVisible = false;
    },
    onSave(): void {
      this.$emit('save');
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
  sm:tw-w-[405px]
  tw-flex
  tw-flex-col
  tw-border
  tw-border-gray-800
  tw-bg-white
  tw-rounded-lg
  tw-z-10;
}
</style>