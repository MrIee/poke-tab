<template>
  <div class="tw-mb-4">
    <label class="tw-inline-flex tw-items-center tw-cursor-pointer" for="js-randomize-on-new-tab">
      <input id="js-randomize-on-new-tab" class="tw-mr-2 tw-cursor-pointer" type="checkbox" v-model="randomOnStartup" />
      <span>Always random on new tab</span>
    </label>
    <RandomizerOptions class="tw-ml-4" />
  </div>
  <div class="tw-mb-4">
    <ColorPicker @confirm="setBackgroundColor" label="Background Color" :default-color="backgroundColor" />
  </div>
  <div class="tw-mb-4">
    <label for="js-speed">
      <span>Pokemon Speed</span>
      <br />
      <input
        id="js-speed"
        class="tw-w-full tw-cursor-pointer"
        type="range"
        list="js-speed-values"
        min="2"
        max="14"
        step="3"
        v-model="pokemonSpeed"
      />
    </label>
    <datalist id="js-speed-values" class="tw-flex tw-justify-between">
      <option value="2" label="Slow"></option>
      <option value="5" label="Normal"></option>
      <option value="8" label="Fast"></option>
      <option value="11" label="Faster"></option>
      <option value="14" label="Very Fast"></option>
    </datalist>
  </div>
  <div>
    <label for="js-size">
      <span>Pokemon Size</span>
      <br />
      <input
        id="js-size"
        class="tw-w-full tw-cursor-pointer"
        type="range"
        list="js-size-values"
        min="72"
        max="144"
        step="24"
        v-model="pokemonSize"
      />
    </label>
    <datalist id="js-size-values" class="tw-flex tw-justify-between">
      <option value="72" label="Small"></option>
      <option value="96" label="Normal"></option>
      <option value="120" label="Large"></option>
      <option value="144" label="Extra Large"></option>
    </datalist>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useSettingsStore } from '../store/settingsStore';
import RandomizerOptions from './RandomizerOptions.vue';
import ColorPicker from './ColorPicker.vue';

export default defineComponent({
  components: {
    RandomizerOptions,
    ColorPicker,
  },
  computed: {
    ...mapState(useSettingsStore, [
      'randomizerOptions',
      'alwaysRandom',
      'backgroundColor',
      'speed',
      'size',
    ]),
    randomOnStartup: {
      get(): boolean {
        return this.alwaysRandom;
      },
      set(isRandom: boolean) {
        this.setAlwaysRandom(isRandom);
      },
    },
    pokemonSpeed: {
      get(): number {
        return this.speed;
      },
      set(speed: string): void {
        this.setSpeed(parseInt(speed));
      },
    },
    pokemonSize: {
      get(): number {
        return this.size;
      },
      set(size: string): void {
        this.setSize(parseInt(size));
      },
    },
  },
  methods: {
    ...mapActions(useSettingsStore, {
      setAlwaysRandom: 'setAlwaysRandom',
      setBackgroundColor: 'setBackgroundColor',
      setSpeed: 'setSpeed',
      setSize: 'setSize',
    }),
  },
});
</script>
