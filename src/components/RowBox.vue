<template>
  <div class="tw-flex tw-flex-row tw-border-t tw-border-gray-800 tw-ml-px">
    <div class="tw-h-24 tw-w-24 tw-border-r tw-border-gray-600">
      <img v-if="imgUrl" class="tw-mr-2" :src="imgUrl" :alt="label" />
      <span v-else class="tw-mr-2">{{ label }}</span>
    </div>
    <slot name="content" />
    <slot name="end" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      default: undefined,
    },
    imgUrl: {
      type: String,
      default: undefined,
    },
  },
});
</script>
