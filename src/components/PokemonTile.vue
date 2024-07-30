<template>
  <div
    :class="{
      'tw-h-1/5 tw-w-1/6': true,
      'tw-bg-blue-200': isSelected,
    }"
  >
    <img
      class="tw-cursor-pointer"
      :src="imgUrl"
      :alt="name"
      @click="onSelect"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    id: {
      type: String,
      default: '',
    },
    imgUrl: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isSelected: false,
    };
  },
  methods: {
    onSelect(): void {
      this.isSelected = !this.isSelected;
      this.$emit('select', this.id);
    },
  },
});
</script>
