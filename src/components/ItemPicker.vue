<template>
  <div class="item tw-relative tw-h-24 tw-w-24 tw-border-r last:tw-border-r-0 tw-border-gray-600">
    <div v-if="chosenItem.name" class="item__cross-container" @click="clearChosenItem">
      <div class="item__cross"></div>
    </div>
    <div
      v-if="items.length > 0"
      class="tw-h-full tw-w-full tw-relative hover:tw-cursor-pointer"
      @click="isVisible = !isVisible"
      v-click-outside="close"
    >
      <span v-if="!chosenItem.imgUrl">{{ chosenItem.name }}</span>
      <img v-else :src="chosenItem.imgUrl" :alt="chosenItem.name" />
    </div>
    <div v-if="isVisible" class="item__picker-box">
      <div
        v-for="(item, key) in items"
        :key="key"
        :class="{
          'item__picker-box-item': true,
          'hover:tw-cursor-pointer': chosenItem.name !== (item as Pokemon).name
        }"
        @click="chooseItem(item as Pokemon)"
      >
        <span :class="{ 'tw-opacity-30': chosenItem.name === (item as Pokemon).name }">
          <span v-if="!(item as Pokemon).imgUrl">{{ (item as Pokemon).name }}</span>
          <img v-else :src="(item as Pokemon).imgUrl" :alt="(item as Pokemon).name" />
        </span>
        <span class="item__hover-label">{{ (item as Pokemon).name }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { type Pokemon } from '../util/interfaces';

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      chosenItem: {} as Pokemon,
      isVisible: false,
      onChooseItemEvent: 'chooseItem',
      onClearChosenItemEvent: 'clearItem'
    };
  },
  methods: {
    close() {
      if (this.isVisible) {
        this.isVisible = false;
      }
    },
    chooseItem(item: Pokemon) {
      const chosenItem: Pokemon = this.chosenItem;

      if (chosenItem && chosenItem.name !== item.name) {
        this.clearChosenItem();
        this.$emit(this.onChooseItemEvent, item);
        this.chosenItem = item;
        this.close();
      }
    },
    clearChosenItem() {
      this.$emit(this.onClearChosenItemEvent, this.chosenItem);
      this.chosenItem = {} as Pokemon;
    }
  }
});
</script>

<style>
.item:hover .item__cross-container {
  @apply tw-block;
}

.item__cross-container {
  height: 1.0625rem;
  width: 1.0625rem;
  @apply tw-absolute;
  @apply tw-top-0;
  @apply tw-right-0;
  @apply tw-hidden;
  @apply tw-rounded-full;
  @apply tw-bg-white;
  @apply tw-cursor-pointer;
  @apply tw-z-10;
}

.item__cross {
  @apply tw-absolute;
  @apply tw-top-px;
  @apply tw-right-px;
  @apply tw-h-4;
  @apply tw-w-4;
  @apply tw-rounded-full;
  @apply tw-border-2;
  @apply tw-border-gray-600;
}

.item__cross::before {
  content: '';
  right: 5px;
  @apply tw-absolute tw--top-px tw-h-3.5 tw-w-0.5 tw-bg-gray-600 tw-transform tw-rotate-45;
}

.item__cross::after {
  content: '';
  left: 5px;
  @apply tw-absolute tw--top-px tw-h-3.5 tw-w-0.5 tw-bg-gray-600 tw-transform tw--rotate-45;
}

.item__picker-box {
  width: 24.25rem;
  @apply tw-absolute;
  @apply tw-top-full;
  @apply tw--left-px;
  @apply tw-flex;
  @apply tw-flex-row;
  @apply tw-flex-wrap;
  @apply tw-border-2;
  @apply tw-border-gray-600;
  @apply tw-rounded-lg;
  @apply tw-bg-white tw-z-10;
}

.item__picker-box-item:hover .item__hover-label {
  @apply tw-inline;
}

.item__picker-box-item {
  @apply tw-relative tw-flex tw-justify-center;
}

.item__hover-label {
  @apply tw-hidden;
  @apply tw-absolute;
  @apply tw-top-full;
  @apply tw-border-2;
  @apply tw-border-gray-600;
  @apply tw-rounded-md;
  @apply tw-px-1.5;
  @apply tw-bg-white;
  @apply tw-z-10;
}
</style>
