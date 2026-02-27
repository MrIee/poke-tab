<template>
  <select
    class="tw:mr-2 tw:rounded tw:border-2 tw:border-gray-800 tw:cursor-pointer"
    v-model="value"
  >
    <option v-for="(index, key) in maxNumBoxes" :key="key" :value="key">Box {{ index }}</option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MAX_NUM_BOXES } from '../util/constants';

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      maxNumBoxes: MAX_NUM_BOXES,
    };
  },
  computed: {
    value: {
      get(): number {
        return this.modelValue;
      },
      set(value: number): void {
        this.$emit('update:modelValue', value);
      }
    }
  },
});
</script>