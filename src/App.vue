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
    :saved-pokemon="savedPokemon"
    @close="closeOptions"
    @selectBox="selectedBox = $event"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { usePokemonStore } from './store/pokemonStore';
import Options from './components/Options.vue';
import { type VueComponent, type Pokemon, type PokemonBox, type DockedEvent } from './util/interfaces';
import { PokemonObject, DrawApp } from './util/drawApp';
import {
  getUniqueRandomItems,
  positionElementAtCursor,
  makeElementDraggable,
  makeElementDockable,
  applyDockedStyles,
  removeDockedStyles,
} from './util/helpers';
import { saveToLocal, loadFromLocal } from './util/localStorage';
import { POKEMON_STORAGE_LIMIT, OPTIONS_DRAGBAR_ID, LOCAL_OPTIONS_DOCK } from './util/constants';
import { v4 as uuidv4 } from 'uuid';

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
      savedPokemon: new Array<PokemonBox>,
      selectedBox: 0,
    };
  },
  computed: {
    ...mapState(usePokemonStore, [
      'allPokemon',
      'pokemonToAdd',
      'pokemonIdsToRemove',
      'randomizeBoxId',
      'shouldRandomizeBox',
      'defaultBoxId',
    ]),
  },
  watch: {
    defaultBoxId(id: number, prevId: number): void {
      if (id >= 0) {
        this.usePokemonBox(id, prevId);
      }
    },
    pokemonToAdd(pokemon: Pokemon): void {
      if (pokemon) {
        this.addPokemonToBox(pokemon);
      }
    },
    pokemonIdsToRemove(ids: Array<string>): void {
      if (ids.length > 0) {
        this.removePokemonFromBox();
      }
    },
    shouldRandomizeBox(): void {
      if (this.randomizeBoxId >= 0) {
        this.randomizeBox();
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
    ...mapActions(usePokemonStore, {
      setPokemonToAdd: 'setPokemonToAdd',
      setIdsOfPokemonToRemove: 'setIdsOfPokemonToRemove',
      setRandomizeBox: 'setRandomizeBox,'
    }),
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
      this.savedPokemon[saveToIndex].default = isDefault;
      this.savedPokemon[saveToIndex].pokemon = getUniqueRandomItems(this.allPokemon, POKEMON_STORAGE_LIMIT);
    },
    addSavedPokemonToCanvas(loadFromIndex: number = 0): void {
      this.savedPokemon[loadFromIndex].pokemon.forEach((pokemon: Pokemon) => {
        const pokemonObj: PokemonObject = this.addPokemonToCanvas(pokemon.imgUrl);
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
    addPokemonToBox(pokemon: Pokemon): void {
      let id: string = '';
      const pokemonInBox: Array<Pokemon> = this.savedPokemon[this.selectedBox].pokemon;

      if (pokemonInBox.length === POKEMON_STORAGE_LIMIT) {
        drawApp.removePokemonFromCanvas(pokemonInBox[pokemonInBox.length - 1].id as string);
        this.savedPokemon[this.selectedBox].pokemon.pop();
      }

      if (this.savedPokemon[this.selectedBox].default) {
        id = this.addPokemonToCanvas(pokemon.imgUrl).id;
      } else {
        id = uuidv4();
      }

      this.savedPokemon[this.selectedBox].pokemon.unshift({ ...pokemon, id });
      this.setPokemonToAdd(null);
    },
    removePokemonFromBox(): void {
      this.pokemonIdsToRemove.forEach((id: string): void => {
        const index: number =
          this.savedPokemon[this.selectedBox].pokemon.findIndex((pokemon: Pokemon) => pokemon.id === id);

        if (index > -1) {
          this.savedPokemon[this.selectedBox].pokemon.splice(index, 1);
        }

        if (this.savedPokemon[this.selectedBox].default) {
          drawApp.removePokemonFromCanvas(id);
        }
      });

      this.setIdsOfPokemonToRemove([]);
    },
    randomizeBox() {
      const id: number = this.randomizeBoxId;
      this.savedPokemon[id].pokemon = [];
      drawApp.removeAllPokemonFromCanvas();
      this.saveRandomPokemon(id, this.savedPokemon[id].default);
      this.addSavedPokemonToCanvas(id);
    },
    usePokemonBox(boxId: number, prevBoxId: number): void {
      this.savedPokemon[prevBoxId].default = false;
      this.savedPokemon[boxId].default = true;
      drawApp.removeAllPokemonFromCanvas();
      this.addSavedPokemonToCanvas(boxId);
    }
  },
});
</script>
