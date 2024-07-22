<template>
  <div
    v-if="isVisible"
    :ref="pickerRef"
    class="tw-fixed tw-w-[403px] tw-h-[676px] tw-flex tw-flex-col tw-border tw-border-gray-800 tw-bg-white tw-z-10"
  >
    <div :ref="filterBarRef">
      <input
        class="tw-w-full tw-py-1 tw-px-2 tw-border tw-border-gray-800"
        type="text"
        :placeholder="searchPlaceholderText"
        v-model="searchText"
      >
      <Filter @filter="filterPokemonByType" />
    </div>
    <div :ref="pokemonListRef" class="tw-inline-block tw-overflow-auto">
      <div
        class="pokemon-picker__sprite"
        v-for="(pokemon, key) in pokemonResults"
        :key="key"
        @click="addPokemonToCanvas(pokemon.imgUrl)"
      >
        <img class="-tw-mb-2.5" :src="pokemon.imgUrl" :alt="pokemon.name" loading="lazy" />
        <span class="tw-text-sm">{{ pokemon.name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Filter from './Filter.vue';
import { type Ref, type Pokemon } from '../util/interfaces';
import { DrawApp } from '../util/drawApp';
import pokemonJSON from '../assets/json/pokemon.json';

let drawApp: DrawApp = new DrawApp();
const itemsPerPage = 24;

export default defineComponent({
  components: {
    Filter,
  },
  props: {
    canvasId: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      pickerRef: 'pickerRef',
      filterBarRef: 'filterBarRef',
      pokemonListRef: 'pokemonListRef',
      isVisible: false,
      allPokemon: pokemonJSON as Array<Pokemon>,
      pokemonResults: new Array<Pokemon>,
      searchPlaceholderText: 'Type a pokemon name here...',
      searchText: '',
      filteredPokemon: new Array<Pokemon>,
    };
  },
  watch: {
    searchText(text: string): void {
      this.pokemonResults = [];

      if (!text) {
        this.pokemonResults = this.filteredPokemon;
      } else {
        this.pokemonResults = this.filteredPokemon.filter((pokemon: Pokemon) => {
          return pokemon.name.toLowerCase().indexOf(text) !== -1;
        });
      }
    },
  },
  async mounted() {
    this.pokemonResults = this.allPokemon;
    this.filteredPokemon = this.allPokemon;
    const canvasEl = document.querySelector(`#${this.canvasId}`);
    drawApp.setCanvasElement(canvasEl);
    drawApp.animate();
    canvasEl?.addEventListener('click', this.setupPokemonPicker);
  },
  methods: {
    setupPokemonPicker(event: Event) {
      const e = event as PointerEvent;
      this.isVisible = !this.isVisible;

      this.$nextTick(() => {
        if (!this.isVisible) {
          return;
        }

        const refs = this.$refs;
        const pickerRef: Ref = this.pickerRef;
        const filterBarRef: Ref = this.filterBarRef;
        const pokemonListRef: Ref = this.pokemonListRef;
        const pickerEl: HTMLElement = refs[pickerRef] as HTMLElement;
        const searchBarEl: HTMLElement = refs[filterBarRef] as HTMLElement;
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
    },
    loadPokemon(fromArray: Array<Pokemon>): void {
      const loadedPokemonLength = this.pokemonResults.length;

      for (let i = loadedPokemonLength; i < itemsPerPage + loadedPokemonLength; i++) {
        if (fromArray[i]) {
          this.pokemonResults.push(fromArray[i]);
        }
      }
    },
    addPokemonToCanvas(imgSrc: string): void {
      const x = Math.floor(Math.random() * window.innerWidth) + 1;
      const y = Math.floor(Math.random() * window.innerHeight) + 1;
      drawApp.addPokemon(imgSrc, {x, y});
    },
    filterPokemonByType(type: string): void {
      if (type) {
        this.pokemonResults = this.allPokemon.filter((pokemon: Pokemon): boolean => {
          return pokemon.type.some((t: string) => t === type);
        });
        this.filteredPokemon = this.pokemonResults;
      } else {
        this.pokemonResults = this.allPokemon;
        this.filteredPokemon = this.allPokemon;
      }
    },
  },
});
</script>

<style>
.pokemon-sprite {
  @apply tw-fixed;
}

.pokemon-picker__sprite {
  @apply
  tw-inline-block
  tw-h-24
  tw-w-24
  tw-text-center
  tw-cursor-pointer
  tw-rounded-lg
  tw-relative
  tw-z-10;
}

/* Pokeball hover effect */
/* .pokemon-picker__sprite::before {
  content: '';
  background-image: url(../assets//images/pokeball.png);

  @apply tw-h-full tw-w-full tw-absolute tw-top-0 tw-left-0 tw-opacity-0 hover:tw-opacity-20 -tw-z-10;
} */


/* Fancy border hover effect */
/* .pokemon-picker__sprite:hover {
  box-shadow: inset 0 0 0 4px rgb(75, 85, 99);
}

.pokemon-picker__sprite::before,
.pokemon-picker__sprite::after {
  content: '';

  @apply tw-absolute -tw-z-10;
}

.pokemon-picker__sprite::before:hover {
  @apply tw-w-1/2 tw-h-full tw-bg-white tw-left-1/4;
}

.pokemon-picker__sprite::after:hover {
  @apply tw-h-1/2 tw-w-full tw-bg-white tw-top-1/4;
} */
</style>
