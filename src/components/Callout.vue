<template>
  <div class="callout">
    <strong>{{ label }}</strong>
    <Cross class="tw-h-6 tw-w-6 tw-cursor-pointer" @click="onClose" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Cross from './icons/Cross.vue';

export default defineComponent({
  components: {
    Cross,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  mounted() {
    setTimeout(this.onClose, 10000);
  },
  methods: {
    onClose(): void {
      this.$emit('close');
    },
  },
});
</script>

<style>
.callout {
  @apply tw-flex
  tw-justify-between
  tw-w-full
  sm:tw-w-[405px]
  tw-p-3
  tw-mx-auto
  tw-text-white
  tw-rounded-lg
  tw-bg-green-500
  tw-fixed
  tw-top-0
  tw-right-0
  tw-left-0
  tw-z-50;
}
</style>
