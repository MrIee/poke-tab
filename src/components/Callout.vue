<template>
  <div class="callout">
    <img v-if="imgUrl" class="tw:h-10 tw:w-10 tw:mt-1.25 tw:mr-2" :src="imgUrl" alt="Callout Icon" />
    <div class="tw:flex tw:flex-col tw:gap-2">
      <strong>{{ label }}</strong>
      <p v-if="description" v-html="description" class="tw:text-sm"></p>
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
    label: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    imgUrl: {
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
@reference '../tailwind.css';

.callout {
  background-color: #D3AF37;

  @apply tw:w-full
  tw:sm:w-101.25
  tw:flex
  tw:justify-between
  tw:p-3
  tw:mx-auto
  tw:text-white
  tw:rounded-lg
  tw:border
  tw:border-gray-800
  /* tw:bg-green-500; */
}
</style>
