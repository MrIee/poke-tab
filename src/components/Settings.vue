<template>
  <div class="tw:mb-4">
    <label class="tw:inline-flex tw:items-center tw:cursor-pointer">
      <input class="tw:mr-2 tw:cursor-pointer" type="checkbox" v-model="isRandom" />
      <span>Always random on new tab</span>
    </label>
  </div>
  <div class="tw:mb-4">
    <ColorPicker @confirm="setBackgroundColor" label="Background Color" />
  </div>
  <div class="tw:mb-4">
    <label>
      <span>Pokemon Speed</span>
      <br />
      <input
        class="tw:w-full tw:cursor-pointer"
        type="range"
        list="js-speed-values"
        min="2"
        max="14"
        step="3"
        v-model="pokemonSpeed"
      />
    </label>
    <datalist id="js-speed-values" class="tw:flex tw:justify-between">
      <option value="2" label="Slow"></option>
      <option value="5" label="Normal"></option>
      <option value="8" label="Fast"></option>
      <option value="11" label="Faster"></option>
      <option value="14" label="Very Fast"></option>
    </datalist>
  </div>
  <div class="tw:mb-4">
    <label>
      <span>Pokemon Size</span>
      <br />
      <input
        class="tw:w-full tw:cursor-pointer"
        type="range"
        list="js-size-values"
        min="72"
        max="144"
        step="24"
        v-model="pokemonSize"
      />
    </label>
    <datalist id="js-size-values" class="tw:flex tw:justify-between">
      <option value="72" label="Small"></option>
      <option value="96" label="Normal"></option>
      <option value="120" label="Large"></option>
      <option value="144" label="Extra Large"></option>
    </datalist>
  </div>
  <div>
    <label class="tw:cursor-pointer">
      <input class="tw:mr-2 tw:cursor-pointer" type="checkbox">
      <span>Enable Pokemon Red/Blue sprites</span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useAppStore } from '../store/appStore';
import ColorPicker from './ColorPicker.vue';

export default defineComponent({
  components: {
    ColorPicker,
  },
  data() {
    return {
      isRandom: false,
      color: '',
    };
  },
  computed: {
    ...mapState(useAppStore, {
      isRandomOnStartUp: 'isRandomOnStartUp',
      backgroundColor: 'backgroundColor',
      speed: 'speed',
      size: 'size',
    }),
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
  watch: {
    isRandom(isRandom: boolean): void {
      this.setAlwaysRandom(isRandom);
    },
  },
  mounted(): void {
    this.isRandom = this.isRandomOnStartUp;
  },
  methods: {
    ...mapActions(useAppStore, {
      setAlwaysRandom: 'setAlwaysRandom',
      setBackgroundColor: 'setBackgroundColor',
      setSpeed: 'setSpeed',
      setSize: 'setSize',
    }),
  },
});
</script>
