<template>
  <CalloutQueue />
  <div
    :ref="canvasRef"
    class="tw:absolute tw:top-0 tw:left-0 tw:bottom-12 tw:right-0 tw:overflow-hidden tw:select-none"
    :style="{ backgroundColor }"
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
import { useSettingsStore } from './store/settingsStore';
import { useCalloutStore } from './store/calloutStore';
import CalloutQueue from './components/CalloutQueue.vue';
import Options from './components/Options.vue';
import Footer from './components/Footer.vue';
import type {
  VueComponent,
  Pokemon,
  PokemonBox,
  DockedEvent,
  Padding,
  Callout,
  RandomizerOptions,
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
  EXTRA_GENERATION,
  LOCAL_OPTIONS_DOCK,
  LOCAL_SAVED_POKEMON,
} from './util/constants';
import { v4 as uuidv4 } from 'uuid';

let drawApp: DrawApp = new DrawApp();

export default defineComponent({
  components: {
    CalloutQueue,
    Options,
    Footer,
  },
  data() {
    return {
      optionsRef: 'optionsRef',
      canvasRef: 'canvasRef',
      isOptionsVisible: false,
      savedPokemon: new Array<PokemonBox>,
      sortedPokemon: new Array<Pokemon>,
      selectedBox: 0,
      isCalloutVisible: false,
      calloutLabel: '',
      calloutDescription: '',
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
    ]),
    ...mapState(useSettingsStore, [
      'randomizerOptions',
      'alwaysRandom',
      'backgroundColor',
      'speed',
      'size',
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
        this.randomizeBox(this.randomizeBoxId, true, this.randomizerOptions);
      }
    },
    speed(newSpeed: number): void {
      drawApp.setSpeed(newSpeed);
    },
    size(newSize: number): void {
      drawApp.setSize(newSize);
    },
    ['randomizerOptions.includeExtras'](): void {
      this.sortedPokemon = [];
    },
    ['randomizerOptions.includeForms'](): void {
      this.sortedPokemon = [];
    },
  },
  async mounted(): Promise<void> {
    const canvasEl: HTMLElement = this.$refs[this.canvasRef] as HTMLElement;
    const loadedPokemon: Array<PokemonBox> = await loadFromLocal(LOCAL_SAVED_POKEMON);
    let defaultBoxId: number = 0;

    drawApp.initialize(canvasEl);
    await this.loadSettings();
    this.initializeSavedPokemonArray();

    if (!loadedPokemon) {
      this.saveRandomPokemonToBox(0, true);
      await saveToLocal(LOCAL_SAVED_POKEMON, this.savedPokemon);
    } else {
      this.savedPokemon = loadedPokemon;
      const defaultBoxId: number = this.savedPokemon.findIndex((box: PokemonBox,) => box.default);
      this.setDefaultBoxId(defaultBoxId);
      this.selectedBox = defaultBoxId;
    }

    this.addSavedPokemonToCanvas(this.savedPokemon[defaultBoxId].pokemon);

    if (this.alwaysRandom) {
      this.selectedBox = MAX_NUM_BOXES;
      this.randomizeBox(this.selectedBox, true, this.randomizerOptions);
      this.setDefaultBoxId(this.selectedBox);
    }

    this.$nextTick(async () => {
      this.applySettings();
    });
  },
  methods: {
    ...mapActions(useCalloutStore, { addCallout: 'addCallout', removeCallout: 'removeCallout'  }),
    ...mapActions(useAppStore, {
      setPokemonToAdd: 'setPokemonToAdd',
      setIdsOfPokemonToRemove: 'setIdsOfPokemonToRemove',
      setRandomizeBox: 'setRandomizeBox,',
      setDefaultBoxId: 'setDefaultBoxId',
    }),
    ...mapActions(useSettingsStore, {
      saveSettings: 'saveSettings',
      loadSettings: 'loadSettings',
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
    saveRandomPokemonToBox(saveToIndex: number = 0, isDefault: boolean = false, options?: RandomizerOptions): void {
      this.savedPokemon[saveToIndex].default = isDefault;
      let pokemon: Array<Pokemon> = [];

      if (this.sortedPokemon.length === 0) {
        this.sortedPokemon = [ ...this.allPokemon ];

        if (!options?.includeExtras) {
          pokemon = this.sortedPokemon.filter((p: Pokemon) => p.generation !== EXTRA_GENERATION);
        } else {
          pokemon = [ ...this.allPokemon ];
        }

        if (options?.includeForms) {
          this.sortedPokemon.forEach((p: Pokemon) => {
            if (p.forms && p.forms.length > 0) {
              p.forms.forEach((form: Pokemon) => pokemon.push(form));
            } else {
              pokemon.push(p);
            }
          });
        }

        this.sortedPokemon = [ ...pokemon ];
      } else {
        if (this.sortedPokemon.length > 0) {
          pokemon = [ ...this.sortedPokemon ];
        } else {
          pokemon = pokemon.length > 0 ? pokemon : [ ...this.allPokemon];
        }
      }

      const randomPokemon: Array<Pokemon> = getUniqueRandomItems(pokemon, POKEMON_STORAGE_LIMIT, makePokemonShiny);
      this.savedPokemon[saveToIndex].pokemon = randomPokemon;
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
      return drawApp.addPokemonToCanvas(imgUrl, {x, y}, pokemon.isShiny);
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
    randomizeBox(boxId: number, loadPokemonToCanvas: boolean = true, options?: RandomizerOptions): void {
      this.savedPokemon[boxId].pokemon = [];
      this.saveRandomPokemonToBox(boxId, this.savedPokemon[boxId].default, options);

      if (loadPokemonToCanvas && (boxId === this.defaultBoxId)) {
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
    async saveAllSettings(): Promise<void> {
      await this.saveSettings();
      const callout: Callout = { id: 'save', label: 'Settings saved!' };
      this.removeCallout(callout);
      this.$nextTick(() => this.addCallout(callout));
    },
    applySettings(): void {
      drawApp.setSpeed(this.speed);
      drawApp.setSize(this.size);
    },
  },
});
</script>


