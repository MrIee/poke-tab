<template>
  <div v-click-outside="() => isVisible = false">
    <span class="tw-text-sm">Filter by Generation:</span>
    <div class="disable-button-styles tw-relative">
      <div
        class="tw-flex tw-justify-between tw-items-center tw-rounded-lg tw-cursor-pointer tw-relative"
        @click="isVisible = !isVisible"
      >
        <span
          :class="{
            'filter__button': true,
            ['filter__button--gen' + selected + '-bg']: selected,
          }"
        >
          Gen {{ selected }}
        </span>
        <chevron-icon
          :class="{
            'tw-absolute tw-right-2 tw-transition-all tw-duration-300': true,
            'tw-rotate-180': !isVisible,
          }"
        />
      </div>
      <ul
        :class="{
          'tw-w-full tw-overflow-auto tw-absolute tw-z-10': true,
          'tw-hidden': !isVisible,
        }"
      >
        <li class="tw-inline-block tw-w-full tw-bg-white" v-for="(generation, key) in generations" :key="key">
          <button
            :class="{['filter__button filter__button--gen' + generation]: true}"
            @click="onClickFilter(generation)"
          >
            Gen {{ generation }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chevron from './icons/Chevron.vue';

export default defineComponent({
  components: {
    ChevronIcon: Chevron,
  },
  data() {
    return {
      generations: ['I', 'II', 'III', 'IV'],
      isVisible: false,
      selected: '',
    };
  },
  mounted(): void {
    this.selected = this.generations[0];
  },
  methods: {
    onClickFilter(generation: string | null): void {
      this.isVisible = false;
      this.selected = generation as string;
      this.$emit('filter', this.generations.indexOf(this.selected) + 1);
    },
  },
});
</script>

<style>
span.filter__button--genI-bg,
.filter__button--genI:hover {
  @apply tw-bg-gradient-to-r tw-from-red-500 tw-via-blue-500 tw-to-yellow-500;
}

span.filter__button--genII-bg,
.filter__button--genII:hover {
  @apply tw-bg-gradient-to-r tw-from-yellow-600 tw-via-gray-300 tw-to-teal-400;
}

span.filter__button--genIII-bg,
.filter__button--genIII:hover {
  @apply tw-bg-gradient-to-r tw-from-red-500 tw-via-blue-500 tw-to-green-500;
}

span.filter__button--genIV-bg,
.filter__button--genIV:hover {
  @apply tw-bg-gradient-to-r tw-from-blue-300 tw-via-pink-300 tw-to-gray-400;
}
</style>
