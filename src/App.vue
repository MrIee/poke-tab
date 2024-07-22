<template>
  <div :ref="canvasRef" class="tw-absolute tw-top-0 tw-left-0 tw-bottom-0 tw-right-0 tw-overflow-hidden">
  </div>
  <PokemonPicker
    v-if="isPickerVisible"
    :ref="pickerRef"
    :pokemon="allPokemon"
    @add-to-canvas="addPokemonToCanvas"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PokemonPicker from './components/PokemonPicker.vue';
import { type VueComponent, type Pokemon } from './util/interfaces';
import { DrawApp } from './util/drawApp';
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
  mounted() {
    const canvasEl: HTMLElement = this.$refs[this.canvasRef] as HTMLElement;
    drawApp.intialize(canvasEl);
    canvasEl.addEventListener('click', this.setupPokemonPicker);
    this.saveInitialPokemon();
    this.addSavedPokemonToCavvas();
  },
  methods: {
    setupPokemonPicker(event: Event) {
      const e = event as PointerEvent;
      this.isPickerVisible = !this.isPickerVisible;

      this.$nextTick(() => {
        if (!this.isPickerVisible) {
          return;
        }

        const pickerEl: HTMLElement = (this.$refs[this.pickerRef] as VueComponent).$el;
        const pickerRect: DOMRect = pickerEl.getBoundingClientRect();

        pickerEl.style.top = `${e.clientY}px`;
        pickerEl.style.left = `${e.clientX}px`;

        if (e.clientY + pickerRect.height > window.innerHeight) {
          pickerEl.style.top = `${window.innerHeight - pickerRect.height}px`;
        }

        if (e.clientX + pickerRect.width > window.innerWidth) {
          pickerEl.style.left = `${window.innerWidth - pickerRect.width}px`;
        }
      });
    },
    saveInitialPokemon() {
      for (let i = 0; i < pokemonDefaultAmount; i++) {
        const randomIndex: number = Math.floor(Math.random() * this.allPokemon.length);
        this.savedPokemon.push(this.allPokemon[randomIndex]);
      };
    },
    addSavedPokemonToCavvas() {
      this.savedPokemon.forEach((pokemon: Pokemon) => {
        this.addPokemonToCanvas(pokemon.imgUrl);
      });
    },
    addPokemonToCanvas(imgUrl: string) {
      const x = Math.floor(Math.random() * window.innerWidth) + 1;
      const y = Math.floor(Math.random() * window.innerHeight) + 1;
      drawApp.addPokemonToCanvas(imgUrl, {x, y});
    },
  },
});
</script>
