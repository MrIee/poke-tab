<template>
  <div
    v-if="isVisible"
    :ref="pickerRef"
    class="tw-fixed tw-w-[403px] tw-h-[676px] tw-flex tw-flex-col tw-border tw-border-gray-800 tw-bg-white tw-z-10"
  >
    <input
      :ref="searchBarRef"
      class="tw-w-full tw-py-1 tw-px-2 tw-border tw-border-gray-800"
      type="text"
      v-model="searchText"
    >
    <div :ref="pokemonListRef" class="tw-inline-block tw-overflow-auto">
      <div
        class="tw-inline-block tw-h-24 tw-w-24 tw-cursor-pointer"
        v-for="(pokemon, key) in pokemonResults"
        :key="key"
        @click="addPokemonToCanvas(getImageUrl(pokemon.imgUrl))"
      >
        <img :src="getImageUrl(pokemon.imgUrl)" :alt="pokemon.name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import  { getCanvas, Canvas } from '../util/canvas';
import { type Ref, type CanvasObject, type Pokemon } from '../util/interfaces';
import pokemonJSON from '../assets/json/pokemon.json';

let canvasObj: CanvasObject = {} as CanvasObject;
let canvasApp: Canvas = {} as Canvas;

export default defineComponent({
  data() {
    return {
      pickerRef: 'pickerRef',
      searchBarRef: 'searchBarRef',
      pokemonListRef: 'pokemonListRef',
      isVisible: false,
      pokemon: pokemonJSON as Array<Pokemon>,
      pokemonResults: new Array<Pokemon>,
      searchText: '',
    };
  },
  watch: {
    searchText(text: string): void {
      if (!text) {
        this.pokemonResults = this.pokemon;
      } else {
        this.pokemonResults = this.pokemon.filter((pokemon: Pokemon) => {
          return pokemon.name.toLowerCase().indexOf(text) !== -1;
        });
      }
    },
  },
  mounted() {
    this.pokemonResults = this.pokemon;
    canvasObj = getCanvas();
    canvasApp = new Canvas(canvasObj.canvas, canvasObj.ctx);
    canvasApp.animate();
    canvasApp.canvas.addEventListener('click', (e): void => {
      this.isVisible = !this.isVisible;

      this.$nextTick(() => {
        if (!this.isVisible) {
          return;
        }

        const refs = this.$refs;
        const pickerRef: Ref = this.pickerRef;
        const searchBarRef: Ref = this.searchBarRef;
        const pokemonListRef: Ref = this.pokemonListRef;
        const pickerEl: HTMLElement = refs[pickerRef] as HTMLElement;
        const searchBarEl: HTMLElement = refs[searchBarRef] as HTMLElement;
        const pokemonListEl: HTMLElement = refs[pokemonListRef] as HTMLElement;
        const pickerRect: DOMRect = pickerEl.getBoundingClientRect();
        const searchBarRect: DOMRect = searchBarEl.getBoundingClientRect();

        pickerEl.style.top = `${e.clientY}px`;
        pickerEl.style.left = `${e.clientX}px`;
        pokemonListEl.style.height = `${pickerRect.height - searchBarRect.height}px`;

        if (e.clientY + pickerRect.height > window.innerHeight) {
          pickerEl.style.top = `${window.innerHeight - pickerRect.height}px`;
        }

        if (e.clientX + pickerRect.width > window.innerWidth) {
          pickerEl.style.left = `${window.innerWidth - pickerRect.width}px`;
        }
      });
    });
  },
  methods: {
    getImageUrl(imageName: string) {
      return new URL(`../assets/images/pokemon/${imageName}.png`, import.meta.url).href
    },
    addPokemonToCanvas(imgSrc: string): void {
      const x = Math.floor(Math.random() * window.innerWidth) + 1;
      const y = Math.floor(Math.random() * window.innerHeight) + 1;
      canvasApp.addPokemon(imgSrc, {x, y});
    },
  },
});
</script>
