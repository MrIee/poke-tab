<template>
  <div
    :class="{
      'callout': true,
      'tw:bg-green-500': type === 'success',
      'tw:bg-gold': type === 'achievement',
    }"
  >
    <div class="tw:flex">
      <img v-if="imgUrl" class="tw:mr-2.5" :src="imgUrl" :alt="label">
      <div>
        <strong>{{ label }}</strong>
        <p>{{ description }}</p>
      </div>
    </div>
    <Cross class="tw:h-6 tw:w-6 tw:cursor-pointer" @click="onClose" />
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
    type: {
      type: String,
      default: 'success',
      validator(value: string) {
        return ['success', 'achievement'].includes(value)
      },
    },
    imgUrl: {
      type: String,
      default: '',
    },
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
    // setTimeout(this.onClose, 10000);
  },
  methods: {
    onClose(): void {
      this.$emit('close');
    },
  },
});
</script>

<style>
 @reference "../tailwind.css";

.callout {
  @apply tw:flex
  tw:justify-between
  tw:w-full
  tw:sm:w-[405px]
  tw:p-3
  tw:mx-auto
  tw:text-white
  tw:rounded-lg
  tw:border
  tw:border-gray-800;
}
</style>
