<template>
  <div v-click-outside="() => isVisible = false">
    <span>Filter by Type:</span>
    <div class="disable-button-styles tw-relative">
      <div
        class="tw-flex tw-justify-between tw-items-center tw-rounded-lg tw-cursor-pointer tw-relative"
        @click="isVisible = !isVisible"
      >
        <span
          :class="{
            'type-filter__button tw-h-8': true,
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
        <li class="tw-inline-block tw-w-1/3 tw-bg-white">
          <button class="type-filter__button" @click="onClickFilter(null)">All</button>
        </li>
        <li class="tw-inline-block tw-w-1/3 tw-bg-white" v-for="(type, key) in types" :key="key">
          <button :class="{['type-filter__button ' + type]: true}" @click="onClickFilter(type)">
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
.type-filter__button {
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;

  @apply
  tw-h-8
  tw-w-[calc(100%-1px)]
  tw-flex
  tw-justify-center
  tw-items-center
  tw-px-2
  tw-mx-px
  tw-text-white
  tw-text-xs
  tw-font-bold
  tw-uppercase
  tw-align-middle
  tw-rounded-lg
  tw-border
  tw-border-gray-800
  tw-bg-white
  tw-cursor-pointer
  tw-select-none;
}

.type-filter__button.normal {
  @apply tw-bg-zinc-300;
}

.type-filter__button.fire {
  @apply tw-bg-orange-400;
}

.type-filter__button.water {
  @apply tw-bg-blue-400;
}

.type-filter__button.grass {
  @apply tw-bg-green-400;
}

.type-filter__button.electric {
  @apply tw-bg-yellow-400;
}

.type-filter__button.ice {
  @apply tw-bg-teal-200;
}

.type-filter__button.fighting {
  @apply tw-bg-red-700;
}

.type-filter__button.poison {
  @apply tw-bg-fuchsia-500;
}

.type-filter__button.ground {
  @apply tw-bg-yellow-500;
}

.type-filter__button.flying {
  @apply tw-bg-indigo-300;
}

.type-filter__button.psychic {
  @apply tw-bg-pink-400;
}

.type-filter__button.bug {
  @apply tw-bg-lime-400;
}

.type-filter__button.rock {
  @apply tw-bg-yellow-600;
}

.type-filter__button.ghost {
  @apply tw-bg-indigo-500;
}

.type-filter__button.dragon {
  @apply tw-bg-purple-600;
}

.type-filter__button.dark {
  @apply tw-bg-orange-950;
}

.type-filter__button.steel {
  @apply tw-bg-slate-400;
}

.type-filter__button.fairy {
  @apply tw-bg-pink-300;
}
</style>
