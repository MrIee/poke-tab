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
            ['filter__button--' + formatToClass(selected) + '-bg']: selected,
          }"
        >
          {{ selected }}
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
        <li class="tw-inline-block tw-w-full tw-bg-white" v-for="(value, key) in generations" :key="key">
          <button
            :class="{['filter__button filter__button--' + formatToClass(value as string)]: true}"
            @click="onClickFilter(parseInt(key as string, 10))"
          >
            {{ value }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chevron from './icons/Chevron.vue';
import { SPECIAL_POKEMON_CATEGORIES } from '../util/constants';

export default defineComponent({
  components: {
    ChevronIcon: Chevron,
  },
  data() {
    return {
      generations: { 1: 'GEN I', 2: 'GEN II', 3: 'GEN III', 4: 'GEN IV', 5: 'GEN V', 6: 'GEN VI', 7: 'GEN VII', 8: 'GEN VIII', 9: 'GEN IX', ...SPECIAL_POKEMON_CATEGORIES },
      isVisible: false,
      selected: '',
    };
  },
  mounted(): void {
    this.selected = this.generations[1];
  },
  methods: {
    onClickFilter(generation: number): void {
      this.isVisible = false;
      const key: string = generation.toString();
      this.selected = this.generations[key as keyof typeof this.generations] as string;
      this.$emit('filter', generation);
    },
    formatToClass(label: string): string {
      return label.replace(/\s/g, '').toLowerCase();
    },
  },
});
</script>

<style>
span.filter__button--geni-bg,
.filter__button--geni:hover {
  @apply tw-bg-gradient-to-r tw-from-red-500 tw-via-blue-500 tw-to-yellow-500;
}

span.filter__button--genii-bg,
.filter__button--genii:hover {
  @apply tw-bg-gradient-to-r tw-from-yellow-600 tw-via-gray-300 tw-to-teal-400;
}

span.filter__button--geniii-bg,
.filter__button--geniii:hover {
  @apply tw-bg-gradient-to-r tw-from-red-500 tw-via-blue-500 tw-to-green-500;
}

span.filter__button--geniv-bg,
.filter__button--geniv:hover {
  @apply tw-bg-gradient-to-r tw-from-blue-300 tw-via-pink-300 tw-to-gray-400;
}

span.filter__button--genv-bg,
.filter__button--genv:hover {
  @apply tw-bg-gradient-to-r tw-from-black tw-to-white;
}

span.filter__button--genvi-bg,
.filter__button--genvi:hover {
  @apply tw-bg-gradient-to-r tw-from-blue-600 tw-to-red-600;
}

span.filter__button--genvii-bg,
.filter__button--genvii:hover {
  @apply tw-bg-gradient-to-r tw-from-indigo-600 tw-to-orange-600;
}

span.filter__button--genviii-bg,
.filter__button--genviii:hover {
  @apply tw-bg-gradient-to-r tw-from-sky-400 tw-to-red-400;
}

span.filter__button--genix-bg,
.filter__button--genix:hover {
  @apply tw-bg-gradient-to-r tw-from-red-500 tw-to-violet-500;
}

span.filter__button--redblue-bg,
.filter__button--redblue:hover {
  @apply tw-bg-gradient-to-r tw-from-red-500 tw-to-blue-500;
}

span.filter__button--yellow-bg,
.filter__button--yellow:hover {
  @apply tw-bg-yellow-500;
}

span.filter__button--special-bg,
.filter__button--special:hover {
  @apply tw-bg-gold;
}
</style>
