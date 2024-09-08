<template>
  <Transition name="callout">
    <Callout v-if="isCalloutVisible" :label="calloutLabel" @close="isCalloutVisible = false" />
  </Transition>
  <div
    :ref="canvasRef"
    class="tw-absolute tw-top-0 tw-left-0 tw-bottom-12 tw-right-0 tw-overflow-hidden tw-select-none"
    :style="{ backgroundColor: backgroundColorStyle }"
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
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useAppStore } from './store/appStore';
import Callout from './components/Callout.vue';
import Options from './components/Options.vue';
import Footer from './components/Footer.vue';
import {
  type VueComponent,
  type Pokemon,
  type PokemonBox,
  type DockedEvent,
  type Padding,
} from './util/interfaces';
import { PokemonObject, DrawApp } from './util/drawApp';
import {
  getUniqueRandomItems,
  positionElementAtCursor,
  makeElementDraggable,
  makeElementDockable,
  applyDockedStyles,
  removeDockedStyles,
  makePokemonShiny,
} from './util/helpers';
import { saveToLocal, loadFromLocal } from './util/localStorage';
import {
  POKEMON_STORAGE_LIMIT,
  MAX_NUM_BOXES,
  OPTIONS_DRAGBAR_ID,
  LOCAL_OPTIONS_DOCK,
  LOCAL_SAVED_POKEMON,
  LOCAL_OPTIONS_ALWAYS_RANDOM,
  LOCAL_OPTIONS_BACKGROUND_COLOR,
  LOCAL_OPTIONS_SPEED,
  LOCAL_OPTIONS_SIZE,
} from './util/constants';
import { v4 as uuidv4 } from 'uuid';

let drawApp: DrawApp = new DrawApp();

export default defineComponent({
  components: {
    Callout,
    Options,
    Footer,
  },
  data() {
    return {
      optionsRef: 'optionsRef',
      canvasRef: 'canvasRef',
      isOptionsVisible: false,
      savedPokemon: new Array<PokemonBox>,
      selectedBox: 0,
      isCalloutVisible: false,
      calloutLabel: '',
      calloutDescription: '',
      backgroundColorStyle: '',
    };
  },
  computed: {
    ...mapState(useAppStore, [
      'allPokemon',
      'pokemonToAdd',
      'pokemonIdsToRemove',
      'randomizeBoxId',
      'shouldRandomizeBox',
      'defaultBoxId',
      'isRandomOnStartUp',
      'backgroundColor',
      'speed',
      'size',
    ]),
  },
  watch: {
    defaultBoxId(id: number, prevId: number): void {
      if (id >= 0 && id < MAX_NUM_BOXES) {
        this.usePokemonBox(id, prevId);
      }
    },
    pokemonToAdd(pokemon: Pokemon): void {
      if (pokemon) {
        this.addPokemonToSelectedBox(pokemon);
      }
    },
    pokemonIdsToRemove(ids: Array<string>): void {
      if (ids.length > 0) {
        this.removePokemonFromBox();
      }
    },
    shouldRandomizeBox(): void {
      if (this.randomizeBoxId >= 0) {
        this.randomizeBox(this.randomizeBoxId);
      }
    },
    backgroundColor(color: string): void {
      this.backgroundColorStyle = color;
    },
    speed(speed: number): void {
      drawApp.setSpeed(speed);
    },
    size(size: number): void {
      drawApp.setSize(size);
    },
  },
  async mounted(): Promise<void> {
    const canvasEl: HTMLElement = this.$refs[this.canvasRef] as HTMLElement;
    const loadedPokemon: Array<PokemonBox> = await loadFromLocal(LOCAL_SAVED_POKEMON);
    const alwaysRandom: boolean = await loadFromLocal(LOCAL_OPTIONS_ALWAYS_RANDOM);
    let defaultBoxId: number = 0;

    drawApp.intialize(canvasEl);
    this.initializeSavedPokemonArray();
    this.setAlwaysRandom(alwaysRandom);

    if (!loadedPokemon) {
      this.saveRandomPokemon(0, true);
      await saveToLocal(LOCAL_SAVED_POKEMON, this.savedPokemon);
    } else {
      this.savedPokemon = loadedPokemon;
      const defaultBoxId: number = this.savedPokemon.findIndex((box: PokemonBox,) => box.default);
      this.setDefaultBoxId(defaultBoxId);
      this.selectedBox = defaultBoxId;
    }

    this.addSavedPokemonToCanvas(this.savedPokemon[defaultBoxId].pokemon);

    // Using $nextTick to run the enclosed block of code after the defaultBoxId watcher is fired, since
    // watchers are asynchronous
    this.$nextTick(async () => {
      if (this.isRandomOnStartUp) {
        // this.loadRandomPokemonToCanvas();
        this.selectedBox = MAX_NUM_BOXES;
        this.randomizeBox(this.selectedBox);
        this.setDefaultBoxId(this.selectedBox);
      }
      await this.loadAllSettings();
    });
  },
  methods: {
    ...mapActions(useAppStore, {
      setPokemonToAdd: 'setPokemonToAdd',
      setIdsOfPokemonToRemove: 'setIdsOfPokemonToRemove',
      setRandomizeBox: 'setRandomizeBox,',
      setDefaultBoxId: 'setDefaultBoxId',
      setAlwaysRandom: 'setAlwaysRandom',
      setBackgroundColor: 'setBackgroundColor',
      setSpeed: 'setSpeed',
      setSize: 'setSize',
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
        const padding: Padding = { top: 0, right: 0, bottom: 32, left: 0 };

        if (optionsDock && optionsDock.docked) {
          applyDockedStyles(optionsEl, drawApp.canvas as HTMLElement, { side: optionsDock.side, padding });
        } else {
          positionElementAtCursor(optionsEl, event as PointerEvent, padding);
        }

        makeElementDraggable(optionsEl, dragBarEl as HTMLElement, padding);
        makeElementDockable(optionsEl, { handleElement: dragBarEl, backgroundElement: drawApp.canvas, padding });

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
      for (let i = 0; i < MAX_NUM_BOXES + 1; i++) {
        this.savedPokemon.push({ pokemon: [], default: false });
      }
    },
    saveRandomPokemon(saveToIndex: number = 0, isDefault: boolean = false): void {
      this.savedPokemon[saveToIndex].default = isDefault;
      this.savedPokemon[saveToIndex].pokemon = getUniqueRandomItems(this.allPokemon, POKEMON_STORAGE_LIMIT, makePokemonShiny);
    },
    addSavedPokemonToCanvas(pokemon?: Array<Pokemon>): void {
      const pokemonToAdd: Array<Pokemon> = pokemon || this.savedPokemon[0].pokemon;

      pokemonToAdd.forEach((pokemon: Pokemon) => {
        const pokemonObj: PokemonObject = this.addPokemonToCanvas(pokemon);
        pokemon.id = pokemonObj.id;
      });
    },
    addPokemonToCanvas(pokemon: Pokemon): PokemonObject {
      const height: number = drawApp.canvas?.offsetHeight || window.innerHeight;
      const width: number = drawApp.canvas?.offsetWidth || window.innerWidth;
      const x = Math.floor(Math.random() * width) + 1;
      const y = Math.floor(Math.random() * height) + 1;
      const imgUrl = pokemon.isShiny ? pokemon.shinyImgUrl : pokemon.imgUrl;
      return drawApp.addPokemonToCanvas(imgUrl, {x, y});
    },
    addPokemonToSelectedBox(pokemon: Pokemon): void {
      let id: string = '';
      const pokemonInBox: Array<Pokemon> = this.savedPokemon[this.selectedBox].pokemon;

      if (pokemonInBox.length === POKEMON_STORAGE_LIMIT) {
        drawApp.removePokemonFromCanvas(pokemonInBox[pokemonInBox.length - 1].id as string);
        this.savedPokemon[this.selectedBox].pokemon.pop();
      }

      if (this.savedPokemon[this.selectedBox].default) {
        id = this.addPokemonToCanvas(pokemon).id;
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
    randomizeBox(boxId: number, loadPokemonToCanvas: boolean = true) {
      this.savedPokemon[boxId].pokemon = [];
      this.saveRandomPokemon(boxId, this.savedPokemon[boxId].default);

      if (loadPokemonToCanvas && (this.defaultBoxId === this.selectedBox || boxId === MAX_NUM_BOXES)) {
        drawApp.removeAllPokemonFromCanvas();
        this.addSavedPokemonToCanvas(this.savedPokemon[boxId].pokemon);
      }
    },
    usePokemonBox(boxId: number, prevBoxId: number): void {
      this.selectedBox = boxId;
      this.savedPokemon[prevBoxId].default = false;
      this.savedPokemon[boxId].default = true;
      drawApp.removeAllPokemonFromCanvas();
      this.addSavedPokemonToCanvas(this.savedPokemon[boxId].pokemon);
    },
    loadRandomPokemonToCanvas(): void {
      const randomPokemon: Array<Pokemon> = getUniqueRandomItems(this.allPokemon, POKEMON_STORAGE_LIMIT, makePokemonShiny);
      this.selectedBox = this.defaultBoxId;
      drawApp.removeAllPokemonFromCanvas();
      this.addSavedPokemonToCanvas(randomPokemon);
    },
    async saveAllSettings(): Promise<void> {
      await saveToLocal(LOCAL_OPTIONS_ALWAYS_RANDOM, this.isRandomOnStartUp);
      await saveToLocal(LOCAL_SAVED_POKEMON, this.savedPokemon);
      await saveToLocal(LOCAL_OPTIONS_BACKGROUND_COLOR, this.backgroundColor);
      await saveToLocal(LOCAL_OPTIONS_SPEED, this.speed);
      await saveToLocal(LOCAL_OPTIONS_SIZE, this.size);
      this.isCalloutVisible = true;
      this.calloutLabel = 'Settings saved!';
    },
    async loadAllSettings(): Promise<void> {
      const bgColor: string = await loadFromLocal(LOCAL_OPTIONS_BACKGROUND_COLOR);
      const speed: number = await loadFromLocal(LOCAL_OPTIONS_SPEED);
      const size: number = await loadFromLocal(LOCAL_OPTIONS_SIZE);

      this.setBackgroundColor(bgColor);
      this.setSpeed(speed);
      this.setSize(size);
    },
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
