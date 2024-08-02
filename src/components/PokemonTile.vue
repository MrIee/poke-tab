<template>
  <div
    :class="{
      'tw-inline-block tw-h-24 tw-w-24 tw-text-center tw-cursor-pointer': true,
      'tw-bg-blue-200': selectable && isSelected,
    }"
  >
    <img
      :class="{ '-tw-mb-2.5': label }"
      :src="imgUrl"
      :alt="name"
      loading="lazy"
      @click="onSelect"
    />
    <span v-if="label" class="tw-text-sm">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    selectable: {
      type: Boolean,
      default: false,
    },
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
    label: {
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

<style>
/* Pokeball hover effect */
/* .pokemon-tile::before {
  content: '';
  background-image: url(../assets//images/pokeball.png);

  @apply tw-h-full tw-w-full tw-absolute tw-top-0 tw-left-0 tw-opacity-0 hover:tw-opacity-20 -tw-z-10;
} */


/* Fancy border hover effect */
/* .pokemon-tile:hover {
  box-shadow: inset 0 0 0 4px theme('colors.gray.800');

  @apply tw-rounded-lg tw-relative tw-z-10;
}

.pokemon-tile::before,
.pokemon-tile::after {
  content: '';

  @apply tw-absolute -tw-z-10;
}

.pokemon-tile::before:hover {
  @apply tw-w-1/2 tw-h-full tw-bg-white tw-left-1/4;
}

.pokemon-tile::after:hover {
  @apply tw-h-1/2 tw-w-full tw-bg-white tw-top-1/4 tw-left-0;
} */
</style>
