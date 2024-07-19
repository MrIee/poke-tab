<template>
  <PokemonPicker />
  <canvas id="canvas">
  </canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PokemonPicker from './components/PokemonPicker.vue';
import  { getCanvas, Canvas } from './util/canvas';

export default defineComponent({
  components: {
    PokemonPicker,
  },
  mounted(): void {
    const canvasObj = getCanvas();
    const canvasMaker = new Canvas(canvasObj.canvas, canvasObj.ctx);
    canvasMaker.intialize();
  },
});
</script>
