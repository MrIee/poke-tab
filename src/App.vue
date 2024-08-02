<template>
  <Transition name="callout">
    <Callout v-if="isCalloutVisible" :label="calloutLabel" @close="isCalloutVisible = false" />
  </Transition>
  <div
    :ref="canvasRef"
    class="tw-absolute tw-top-0 tw-left-0 tw-bottom-0 tw-right-0 tw-overflow-hidden tw-select-none"
    @click="toggleOptions"
  >
  </div>
  <Options
    v-if="isOptionsVisible"
    :ref="optionsRef"
    :saved-pokemon="savedPokemon"
    @close="closeOptions"
    @select-box="selectedBox = $event"
    @save="saveAllSettings"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { usePokemonStore } from './store/pokemonStore';
import Callout from './components/Callout.vue';
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
import {
  POKEMON_STORAGE_LIMIT,
  OPTIONS_DRAGBAR_ID,
  LOCAL_OPTIONS_DOCK,
  LOCAL_SAVED_POKEMON,
  LOCAL_OPTIONS_ALWAYS_RANDOM,
} from './util/constants';
import { v4 as uuidv4 } from 'uuid';

let drawApp: DrawApp = new DrawApp();

export default defineComponent({
  components: {
    Callout,
    Options,
  },
  data() {
    return {
      optionsRef: 'optionsRef',
      canvasRef: 'canvasRef',
      isOptionsVisible: false,
      savedPokemon: new Array<PokemonBox>,
      selectedBox: 0,
      savePokemonArrayLimit: 9,
      isCalloutVisible: false,
      calloutLabel: '',
      calloutDescription: '',
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
      'isRandomOnStartUp',
    ]),
  },
  watch: {
    defaultBoxId(id: number, prevId: number): void {
      if (id >= 0 && id < this.savePokemonArrayLimit) {
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
  async mounted(): Promise<void> {
    const canvasEl: HTMLElement = this.$refs[this.canvasRef] as HTMLElement;
    const isRandom: boolean = await loadFromLocal(LOCAL_OPTIONS_ALWAYS_RANDOM);
    const localSavedPokemon: Array<PokemonBox> = await loadFromLocal(LOCAL_SAVED_POKEMON);

    this.setAlwaysRandom(isRandom);
    drawApp.intialize(canvasEl);
    this.initializeSavedPokemonArray();

    if (!localSavedPokemon) {
      this.saveRandomPokemon(0, true);
      await saveToLocal(LOCAL_SAVED_POKEMON, this.savedPokemon);
    } else {
      this.savedPokemon = localSavedPokemon;
      const defaultBoxId: number = this.savedPokemon.findIndex((box: PokemonBox,) => box.default);

      if (defaultBoxId) {
        this.setDefaultBoxId(defaultBoxId);
        this.selectedBox = defaultBoxId;
      }
    }

    if (isRandom) {
      this.loadRandomPokemonToCanvas();
    } else {
      this.addSavedPokemonToCanvas();
    }
  },
  methods: {
    ...mapActions(usePokemonStore, {
      setPokemonToAdd: 'setPokemonToAdd',
      setIdsOfPokemonToRemove: 'setIdsOfPokemonToRemove',
      setRandomizeBox: 'setRandomizeBox,',
      setDefaultBoxId: 'setDefaultBoxId',
      setAlwaysRandom: 'setAlwaysRandom',
    }),
    async toggleOptions(event: Event): Promise<void> {
      if (this.isOptionsVisible) {
        this.closeOptions();
        return;
      } else {
        this.isOptionsVisible = true;
      }

      this.$nextTick(async () => {
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
      for (let i = 0; i < this.savePokemonArrayLimit + 1; i++) {
        this.savedPokemon.push({ pokemon: [], default: false });
      }
    },
    saveRandomPokemon(saveToIndex: number = 0, isDefault: boolean = false): void {
      this.savedPokemon[saveToIndex].default = isDefault;
      this.savedPokemon[saveToIndex].pokemon = getUniqueRandomItems(this.allPokemon, POKEMON_STORAGE_LIMIT);
    },
    addSavedPokemonToCanvas(pokemon?: Array<Pokemon>): void {
      const pokemonToAdd: Array<Pokemon> = pokemon || this.savedPokemon[0].pokemon;
      pokemonToAdd.forEach((pokemon: Pokemon) => {
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
      const boxId: number = this.randomizeBoxId;
      this.savedPokemon[boxId].pokemon = [];
      this.saveRandomPokemon(boxId, this.savedPokemon[boxId].default);

      if (this.defaultBoxId === this.selectedBox) {
        drawApp.removeAllPokemonFromCanvas();
        this.addSavedPokemonToCanvas(this.savedPokemon[boxId].pokemon);
      }
    },
    usePokemonBox(boxId: number, prevBoxId: number): void {
      this.savedPokemon[prevBoxId].default = false;
      this.savedPokemon[boxId].default = true;
      drawApp.removeAllPokemonFromCanvas();
      this.addSavedPokemonToCanvas(this.savedPokemon[boxId].pokemon);
    },
    loadRandomPokemonToCanvas(): void {
      const randomBoxId: number = this.savePokemonArrayLimit;
      const randomPokemon: Array<Pokemon> = getUniqueRandomItems(this.allPokemon, POKEMON_STORAGE_LIMIT);
      this.selectedBox = randomBoxId;
      this.setDefaultBoxId(randomBoxId);
      drawApp.removeAllPokemonFromCanvas();
      this.addSavedPokemonToCanvas(randomPokemon);
    },
    async saveAllSettings(): Promise<void> {
      saveToLocal(LOCAL_OPTIONS_ALWAYS_RANDOM, this.isRandomOnStartUp);
      await saveToLocal(LOCAL_SAVED_POKEMON, this.savedPokemon);
      this.isCalloutVisible = true;
      this.calloutLabel = 'Settings saved!';
    }
  },
});
</script>

<style>
.callout-enter-active,
.callout-leave-active {
  @apply tw-transition-opacity tw-duration-500;
}

.callout-enter-from,
.callout-leave-to {
  @apply tw-opacity-0;
}
</style>
