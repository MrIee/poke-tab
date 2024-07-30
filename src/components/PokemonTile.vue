<template>
  <div class="tw-h-1/5 tw-w-1/6 tw-relative" v-click-outside="() => isOptionsVisible = false">
    <img
      class="tw-cursor-pointer"
      :src="pokemon.imgUrl"
      :alt="pokemon.name"
      @click="isOptionsVisible = !isOptionsVisible"
    />
    <ul v-if="optionsEnabled && isOptionsVisible" class="tw-absolute tw-top-full tw-z-10">
      <li><button class="btn-sm" @click="onRemove(pokemon.id)">Remove</button></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia'
import { usePokemonStore } from '../store/pokemonStore';

export default defineComponent({
  props: {
    pokemon: {
      type: Object,
      default: () => ({}),
    },
    optionsEnabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOptionsVisible: false,
    };
  },
  methods: {
    ...mapActions(usePokemonStore, { setIdOfPokemonToRemove: 'setIdOfPokemonToRemove' }),
    onRemove(id: string): void {
      this.setIdOfPokemonToRemove(id);
      this.isOptionsVisible = false;
    },
  },
});
</script>
