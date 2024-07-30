<template>
  <div
    :ref="canvasRef"
    class="tw-absolute tw-top-0 tw-left-0 tw-bottom-0 tw-right-0 tw-overflow-hidden tw-select-none"
    @click="openOptions"
  >
  </div>
  <Options
    v-if="isOptionsVisible"
    :ref="optionsRef"
    :pokemon="allPokemon"
    :saved-pokemon="savedPokemon"
    @close="closeOptions"
    @selectBox="selectedBox = $event"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { usePokemonStore } from './store/pokemonStore';
import Options from './components/Options.vue';
import { type VueComponent, type Pokemon, type PokemonBox, type DockedEvent } from './util/interfaces';
import { PokemonObject, DrawApp } from './util/drawApp';
import { positionElementAtCursor, makeElementDraggable, makeElementDockable, applyDockedStyles, removeDockedStyles } from './util/helpers';
import { saveToLocal, loadFromLocal } from './util/localStorage';
import { POKEMON_STORAGE_LIMIT, OPTIONS_DRAGBAR_ID, LOCAL_OPTIONS_DOCK } from './util/constants';
import pokemonJSON from './assets/json/pokemon.json';

let drawApp: DrawApp = new DrawApp();

const savePokemonArrayLimit: number = 10;

export default defineComponent({
  components: {
    Options,
  },
  data() {
    return {
      optionsRef: 'optionsRef',
      canvasRef: 'canvasRef',
      isOptionsVisible: false,
      allPokemon: pokemonJSON as Array<Pokemon>,
      savedPokemon: new Array<PokemonBox>,
      selectedBox: 0,
    };
  },
  computed: {
    ...mapState(usePokemonStore, ['idOfPokemonToRemove'])
  },
  watch: {
    idOfPokemonToRemove(id) {
      drawApp.removePokemonFromCanvas(id);
      const index: number = this.savedPokemon[this.selectedBox].pokemon.findIndex((pokemon: Pokemon) => pokemon.id === id);

      if (index > -1) {
        this.savedPokemon[this.selectedBox].pokemon.splice(index, 1);
      }
    },
  },
  mounted(): void {
    const canvasEl: HTMLElement = this.$refs[this.canvasRef] as HTMLElement;
    drawApp.intialize(canvasEl);
    this.initializeSavedPokemonArray();
    this.saveRandomPokemon(0, true);
    this.addSavedPokemonToCanvas();
  },
  methods: {
    async openOptions(event: Event): Promise<void> {
      this.isOptionsVisible = !this.isOptionsVisible;

      this.$nextTick(async () => {
        if (!this.isOptionsVisible) {
          return;
        }

        const optionsEl: HTMLElement = (this.$refs[this.optionsRef] as VueComponent).$el;
        const dragBarEl: HTMLElement | null = document.getElementById(OPTIONS_DRAGBAR_ID);
        const optionsDock: DockedEvent = await loadFromLocal(LOCAL_OPTIONS_DOCK);

        if (optionsDock && optionsDock.docked) {
          applyDockedStyles(optionsEl, drawApp.canvas as HTMLElement, optionsDock.side);
        } else {
          positionElementAtCursor(optionsEl, event as PointerEvent);
        }

        makeElementDraggable(optionsEl, dragBarEl as HTMLElement);
        makeElementDockable(optionsEl, { handleElement: dragBarEl, backgroundElement: drawApp.canvas });

        optionsEl.removeEventListener('docked', this.saveDockedDetailsToLocal);
        optionsEl.removeEventListener('undocked', this.saveDockedDetailsToLocal);

        optionsEl.addEventListener('docked', this.saveDockedDetailsToLocal);
        optionsEl.addEventListener('undocked', this.saveDockedDetailsToLocal);
      });
    },
    saveDockedDetailsToLocal(event: Event): void {
      const e = event as CustomEvent;
      saveToLocal(LOCAL_OPTIONS_DOCK, e.detail);
    },
    closeOptions(): void {
      this.isOptionsVisible = false;
      const optionsEl: HTMLElement = (this.$refs[this.optionsRef] as VueComponent).$el;
      removeDockedStyles(optionsEl, drawApp.canvas as HTMLElement);
    },
    initializeSavedPokemonArray() {
      for (let i = 0; i < savePokemonArrayLimit; i++) {
        this.savedPokemon.push({ pokemon: [], default: false });
      }
    },
    saveRandomPokemon(saveToIndex: number = 0, isDefault: boolean = false): void {
      const unique: Array<number> = [];
      let i: number = 0;

      while (i < POKEMON_STORAGE_LIMIT) {
        const randomIndex: number = Math.floor(Math.random() * this.allPokemon.length);

        if (unique.indexOf(randomIndex) === -1) {
          this.savedPokemon[saveToIndex].pokemon.push(this.allPokemon[randomIndex]);
          this.savedPokemon[saveToIndex].default = isDefault;
          i++;
        }

        unique.push(randomIndex);
      };
    },
    addSavedPokemonToCanvas(loadFromIndex: number = 0): void {
      this.savedPokemon[loadFromIndex].pokemon.forEach((pokemon: Pokemon) => {
        const pokemonObj = this.addPokemonToCanvas(pokemon.imgUrl);
        pokemon.id = pokemonObj.id;
      });
    },
    addPokemonToCanvas(imgUrl: string): PokemonObject {
      const height: number = drawApp.canvas?.offsetHeight || window.innerHeight;
      const width: number = drawApp.canvas?.offsetWidth || window.innerWidth;
      const x = Math.floor(Math.random() * width) + 1;
      const y = Math.floor(Math.random() * height) + 1;
      return drawApp.addPokemonToCanvas(imgUrl, {x, y});
    },
  },
});
</script>
