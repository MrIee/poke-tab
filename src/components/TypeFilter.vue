<template>
  <div v-click-outside="() => isVisible = false">
    <span class="tw-text-sm">Filter by Type:</span>
    <div class="disable-button-styles tw-relative">
      <div
        class="tw-flex tw-justify-between tw-items-center tw-rounded-lg tw-cursor-pointer tw-relative"
        @click="isVisible = !isVisible"
      >
        <span
          :class="{
            'filter__button': true,
            [selected]: selected,
          }"
        >
          {{ selected || 'All' }}
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
        <li class="tw-inline-block tw-w-1/2 tw-bg-white">
          <button class="filter__button" @click="onClickFilter(null)">All</button>
        </li>
        <li class="tw-inline-block tw-w-1/2 tw-bg-white" v-for="(type, key) in types" :key="key">
          <button :class="{['filter__button filter__button--' + type]: true}" @click="onClickFilter(type)">
            {{ type }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Chevron from './icons/Chevron.vue';
import typesJSON from '../assets/json/types.json';

export default defineComponent({
  components: {
    ChevronIcon: Chevron,
  },
  data() {
    return {
      types: typesJSON,
      isVisible: false,
      selected: '',
    };
  },
  methods: {
    onClickFilter(name: string | null): void {
      this.isVisible = false;
      this.selected = name as string;
      this.$emit('filter', name);
    },
  },
});
</script>

<style>
button.filter__button--normal {
  @apply tw-bg-zinc-300;
}

button.filter__button--fire {
  @apply tw-bg-orange-400;
}

button.filter__button--water {
  @apply tw-bg-blue-400;
}

button.filter__button--grass {
  @apply tw-bg-green-400;
}

button.filter__button--electric {
  @apply tw-bg-yellow-400;
}

button.filter__button--ice {
  @apply tw-bg-teal-200;
}

button.filter__button--fighting {
  @apply tw-bg-red-700;
}

button.filter__button--poison {
  @apply tw-bg-fuchsia-500;
}

button.filter__button--ground {
  @apply tw-bg-yellow-500;
}

button.filter__button--flying {
  @apply tw-bg-indigo-300;
}

button.filter__button--psychic {
  @apply tw-bg-pink-400;
}

button.filter__button--bug {
  @apply tw-bg-lime-400;
}

button.filter__button--rock {
  @apply tw-bg-yellow-600;
}

button.filter__button--ghost {
  @apply tw-bg-indigo-500;
}

button.filter__button--dragon {
  @apply tw-bg-purple-600;
}

button.filter__button--dark {
  @apply tw-bg-orange-950;
}

button.filter__button--steel {
  @apply tw-bg-slate-400;
}

button.filter__button--fairy {
  @apply tw-bg-pink-300;
}
</style>
