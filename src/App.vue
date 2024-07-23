<template>
  <div
    :ref="canvasRef"
    class="tw-absolute tw-top-0 tw-left-0 tw-bottom-0 tw-right-0 tw-overflow-hidden tw-select-none"
    @click="openPokemonPicker"
  >
  </div>
  <PokemonPicker
    v-if="isPickerVisible"
    :ref="pickerRef"
    :pokemon="allPokemon"
    @close="isPickerVisible = false"
    @add-to-canvas="addPokemonToCanvas"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PokemonPicker from './components/PokemonPicker.vue';
import { type VueComponent, type Pokemon } from './util/interfaces';
import { DrawApp } from './util/drawApp';
import { positionElementAtCursor } from './util/helpers';
import pokemonJSON from './assets/json/pokemon.json';

let drawApp: DrawApp = new DrawApp();
const pokemonDefaultAmount = 30;

export default defineComponent({
  components: {
    PokemonPicker,
  },
  data() {
    return {
      pickerRef: 'pickerRef',
      canvasRef: 'canvasRef',
      isPickerVisible: false,
      allPokemon: pokemonJSON as Array<Pokemon>,
      savedPokemon: new Array<Pokemon>,
    }
  },
  mounted(): void {
    const canvasEl: HTMLElement = this.$refs[this.canvasRef] as HTMLElement;
    drawApp.intialize(canvasEl);
    this.saveInitialPokemon();
    this.addSavedPokemonToCavvas();
  },
  methods: {
    openPokemonPicker(event: Event): void {
      this.isPickerVisible = !this.isPickerVisible;

      this.$nextTick(() => {
        if (!this.isPickerVisible) {
          return;
        }

        const pickerEl: HTMLElement = (this.$refs[this.pickerRef] as VueComponent).$el;
        positionElementAtCursor(pickerEl, event as PointerEvent);
      });
    },
    saveInitialPokemon(): void {
      for (let i = 0; i < pokemonDefaultAmount; i++) {
        const randomIndex: number = Math.floor(Math.random() * this.allPokemon.length);
        this.savedPokemon.push(this.allPokemon[randomIndex]);
      };
    },
    addSavedPokemonToCavvas(): void {
      this.savedPokemon.forEach((pokemon: Pokemon) => {
        this.addPokemonToCanvas(pokemon.imgUrl);
      });
    },
    addPokemonToCanvas(imgUrl: string): void {
      const x = Math.floor(Math.random() * window.innerWidth) + 1;
      const y = Math.floor(Math.random() * window.innerHeight) + 1;
      drawApp.addPokemonToCanvas(imgUrl, {x, y});
    },
  },
});
</script>
