<template>
  <div :id="canvasId" class="tw-absolute tw-top-0 tw-left-0 tw-bottom-0 tw-right-0 tw-overflow-hidden">
  </div>
  <PokemonPicker :canvas-id="canvasId" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PokemonPicker from './components/PokemonPicker.vue';

export default defineComponent({
  components: {
    PokemonPicker,
  },
  data() {
    return {
      canvasId: 'canvas',
    }
  },
});
</script>
