<template>
  <div v-if="isVisible" class="reminder">
    <strong>Reminder</strong>
    <Cross class="tw-absolute tw-top-1 tw-right-1 tw-cursor-pointer" color="#1F2937" @click="isVisible = false" />
    <p class="tw-mb-3">{{ text }}</p>
    <img class="tw-mb-3" :src="imageUrl" alt="reminder image" />
    <label @click="dontShowAgain" for="js-reminder-check-box">
      <input class="tw-cursor-pointer" id="js-reminder-check-box" type="checkbox" />
      <span class="tw-ml-1 tw-cursor-pointer">Don't show this again</span>
    </label>

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
    text: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isVisible: true,
    };
  },
  methods: {
    dontShowAgain(): void {
      this.$emit('dontShowAgain');
    },
  },
});
</script>

<style>
.reminder {
  @apply tw-mx-auto
  tw-p-3
  tw-bg-yellow-100
  tw-rounded-md
  tw-border
  tw-border-gray-800
  tw-border-solid
  tw-absolute
  tw-top-0
  tw-left-0
  tw-right-0
  tw-z-10;
}
</style>
