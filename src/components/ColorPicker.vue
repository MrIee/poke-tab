<template>
  <div class="tw:flex tw:relative">
    <div v-if="isVisible" class="color-picker__wrapper">
      <Vue3ColorPicker
        class="disable-button-styles tw:rounded-bl-none tw:rounded-br-none tw:shadow-none"
        v-model="color"
        mode="solid"
        :show-picker-mode="false"
        :show-input-menu="false"
        :show-color-list="false"
      />
      <div class="tw:flex tw:justify-between tw:p-2 tw:bg-white">
        <span
          v-for="(c, index) in colorPalette"
          :key="index"
          class="tw:h-5 tw:w-5 tw:rounded tw:border tw:border-gray-400 tw:cursor-pointer"
          :style="{backgroundColor: c}"
          @click="color = c"
        >
        </span>
      </div>
      <div class="tw:flex">
        <button
          class="tw:w-full tw:rounded-tl-none! tw:rounded-tr-none! tw:rounded-br-none!"
          @click="onConfirm"
        >
          Confirm
        </button>
        <button
          class="tw:w-full tw:rounded-tl-none! tw:rounded-tr-none! tw:rounded-bl-none!"
          @click="onCancel"
        >
          Cancel
        </button>
      </div>
    </div>
    <div class="tw:flex tw:items-center tw:cursor-pointer" @click="isVisible = !isVisible">
      <span class="color-picker__preview" :style="{ backgroundColor: previewColor }"></span>
      <span>{{ label }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker';

export default defineComponent({
  components: {
    Vue3ColorPicker,
  },
  props: {
    label: {
      type: String,
      default: 'Color',
    },
  },
  data() {
    return {
      colorPalette: {
        white: 'rgb(255, 255, 255)',
        black: 'rgb(0, 0, 0)',
        red: 'rgb(248, 113, 113)',
        orange: 'rgb(253, 186, 116)',
        yellow: 'rgb(253, 224, 71)',
        green: 'rgb(134, 239, 172)',
        blue: 'rgb(125, 211, 252)',
        indigo: 'rgb(165, 180, 252)',
        violet: 'rgb(196, 181, 253)',
        pink: 'rgb(249, 168, 212)',
      },
      color: '#ffffff',
      isVisible: false,
      prevPreviewColor: '#ffffff',
      previewColor: '#ffffff',
    };
  },
  watch: {
    color(color: string): void {
      this.previewColor = color;
    },
    isVisible(isVisible: boolean): void {
      if (isVisible) {
        this.prevPreviewColor = this.previewColor;
      }
    },
  },
  methods: {
    onConfirm(): void {
      this.previewColor = this.color;
      this.$emit('confirm', this.color);
      this.isVisible = false;
    },
    onCancel() {
      this.isVisible = !this.isVisible;
      this.previewColor = this.prevPreviewColor;
      this.color = this.previewColor;
    },
  },
});
</script>

<style>
 @reference "../tailwind.css";

.color-picker__wrapper {
  box-shadow: 0 0 34px 1px var(--cp-container-shadow);

  @apply tw:rounded-md tw:absolute tw:top-7 tw:left-0;
}

.color-picker__preview {
  box-shadow: inset 0 0 0 3px white;

  @apply tw:h-7 tw:w-12 tw:mr-2 tw:rounded tw:border-2 tw:border-gray-300;
}
</style>
