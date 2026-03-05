<template>
  <div class="options">
    <div class="tw:h-8 tw:flex tw:text-white tw:bg-blue-400 tw:justify-center tw:items-center tw:rounded-tl-lg tw:rounded-tr-lg tw:relative">
      <div
        :id="dragBarId"
        class="tw:w-full tw:cursor-grab tw:active:cursor-grabbing tw:absolute tw:top-0 tw:right-8 tw:bottom-0 tw:left-0"
      >
      </div>
      <div class="tw:flex tw:justify-center tw:items-center tw:relative tw:pointer-events-none">
        <DragIndicator class="tw:hidden tw:sm:block tw:absolute tw:-translate-y-1/2 tw:top-1/2 tw:-left-7" />
        <strong>Options</strong>
      </div>
      <div class="tw:flex tw:items-center tw:h-full tw:p-1 tw:cursor-pointer tw:absolute tw:right-0" @click="onClose">
        <Cross class="tw:h-6 tw:w-6" />
      </div>
    </div>
    <div class="tw:flex">
      <span
        :class="{
          'options__tab': true,
          'active': activeTab === tabPokemon,
        }"
        @click="activeTab = tabPokemon"
      >
        Pokemon
      </span>
      <span
        :class="{
          'options__tab': true,
          'active': activeTab === tabSettings,
        }"
        @click="activeTab = tabSettings"
      >
        Settings
      </span>
    </div>
    <div class="tw:h-full tw:sm:h-162.5 tw:p-3 tw:overflow-auto">
      <div v-if="activeTab === tabSettings">
        <Settings />
      </div>
      <div v-if="activeTab === tabPokemon">
        <p class="tw:mb-3">
          You may store up to 10 sets of pokemon to use in your new tab(s).
        </p>
        <div class="tw:w-72">
          <div class="tw:flex tw:justify-between tw:items-center tw:mb-1">
            <BoxDropdown v-model="selectedBoxId" />
            <div v-if="hasShinyCharm" class="shiny-charm-container">
              <img :src="shinyCharmImg" alt="shiny charm icon" />
              <div class="star-orbit-container tw:hidden tw:h-10 tw:w-10 tw:absolute tw:top-0 tw:left-0">
                <div class="star star--orbit tw:h-7.5 tw:w-7.5"></div>
              </div>
            </div>
          </div>
          <PokemonBox
            :id="selectedBoxId"
            :default="savedPokemon[selectedBoxId].default"
            :pokemon="savedPokemon[selectedBoxId].pokemon"
            @add="openPicker"
          />
        </div>
      </div>
    </div>
    <div v-if="isWindowVisible" class="tw:h-full tw:w-full tw:rounded-bl-lg tw:rounded-br-lg tw:absolute tw:top-8 tw:z-10">
      <div class="tw:h-8 tw:flex tw:items-center tw:bg-blue-400 tw:border-t tw:border-gray-800 tw:relative">
        <span class="tw:px-1 tw:cursor-pointer tw:absolute tw:left-1.5" @click="closePicker">
          <Chevron class="tw:h-2.5 tw:w-4 tw:fill-white tw:-rotate-90" />
        </span>
        <span class="tw:w-full tw:text-center tw:text-white">{{ tabTitle }}</span>
      </div>
      <PokemonPicker v-if="isPickerVisible" class="tw:h-[calc(100%-64px)]!" />
    </div>
    <button class="tw:mt-auto tw:m-3" @click="onSave">Save Settings</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useAppStore } from '../store/appStore';
import { useSettingsStore } from '../store/settingsStore';
import { type PokemonBox } from '../util/interfaces';
import { MAX_NUM_BOXES, OPTIONS_DRAGBAR_ID } from '../util/constants';
import shinyCharmImg from  '../../public/images/shiny-charm.png';
import DragIndicator from './icons/DragIndicator.vue';
import Cross from './icons/Cross.vue';
import Chevron from './icons/Chevron.vue';
import Settings from './Settings.vue';
import PokemonBoxComponent from './PokemonBox.vue';
import PokemonPicker from './PokemonPicker.vue';
import BoxDropdown from './BoxDropdown.vue';

export default defineComponent({
  components: {
    DragIndicator,
    Cross,
    Chevron,
    PokemonBox: PokemonBoxComponent,
    PokemonPicker,
    Settings,
    BoxDropdown,
  },
  props: {
    savedPokemon: {
      type: Array<PokemonBox>,
      default: () => [],
    },
  },
  data() {
    return {
      shinyCharmImg,
      selectedBoxId: 0,
      isRandom: false,
      dragBarId: OPTIONS_DRAGBAR_ID,
      isPickerVisible: false,
      isWindowVisible: false,
      tabTitle: '',
      activeTab: '',
      tabPokemon: 'pokemon',
      tabSettings: 'settings',
      maxNumBoxes: MAX_NUM_BOXES,
    };
  },
  computed: {
    ...mapState(useAppStore, ['defaultBoxId']),
    ...mapState(useSettingsStore, ['hasShinyCharm']),
  },
  watch: {
    selectedBoxId(id: number): void {
      this.$emit('select-box', id);
    },
  },
  mounted(): void {
    this.selectedBoxId = this.defaultBoxId > MAX_NUM_BOXES ? this.defaultBoxId : 0;
    this.activeTab = this.tabPokemon;
  },
  methods: {
    onClose(): void {
      this.$emit('close');
    },
    openPicker(): void {
      this.tabTitle = 'Pokemon Picker';
      this.isWindowVisible = true;
      this.isPickerVisible = true;
    },
    closePicker(): void {
      this.isWindowVisible = false;
      this.isPickerVisible = false;
    },
    onSave(): void {
      this.$emit('save');
    },
  },
});
</script>

<style>
@reference '../tailwind.css';

.options {
  @apply tw:fixed
  tw:h-full
  tw:w-full
  tw:sm:h-auto
  tw:sm:w-101.25
  tw:flex
  tw:flex-col
  tw:border
  tw:border-gray-800
  tw:bg-white
  tw:rounded-lg
  tw:z-10;
}

.options__tab {
  @apply tw:h-8 tw:flex tw:justify-center tw:items-center tw:grow tw:font-bold tw:border-b-2 tw:border-b-blue-400 tw:bg-gray-300 tw:cursor-pointer;
}

.options__tab.active {
  @apply tw:border-b-0 tw:bg-white;
}

.shiny-charm-container {
  @apply tw:h-10 tw:w-10 tw:relative;
}

.shiny-charm-container:hover > .star-orbit-container {
  @apply tw:block;
}
</style>
