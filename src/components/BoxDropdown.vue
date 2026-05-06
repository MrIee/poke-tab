<template>
  <select class="tw:w-24 tw:mr-2 tw:rounded tw:border-2 tw:border-gray-800 tw:cursor-pointer" @change="handleOnChangeDropdown">
    <option v-for="(index, key) in numBoxes" :key="key" :value="key" :selected="modelValue === index - 1">
      {{ index === maxNumBoxes + 1 ? 'Random' : `Box ${index}` }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useSettingsStore } from '../store/settingsStore';
import { MAX_NUM_BOXES } from '../util/constants';

export default defineComponent({
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    defaultBox: {
      type: Number,
      default: 0,
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      maxNumBoxes: MAX_NUM_BOXES,
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['alwaysRandom']),
    numBoxes(): number {
      return this.alwaysRandom ? MAX_NUM_BOXES + 1 : MAX_NUM_BOXES;
    },
  },
  methods: {
    handleOnChangeDropdown(event: Event): void {
      const target = event.target as HTMLInputElement;
      this.$emit('update:modelValue', parseInt(target.value, 10));
    }
  }
});
</script>