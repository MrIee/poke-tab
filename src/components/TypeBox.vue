<template>
  <div class="tw-h-24 tw-w-24 tw-border-l tw-border-gray-600">
    <span v-if="!imgUrl" class="tw-mr-2">{{ label }}</span>
    <img v-else class="tw-mr-2" :src="imgUrl" :alt="label" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      default: undefined
    },
    imgUrl: {
      type: String,
      default: undefined
    }
  }
});
</script>
