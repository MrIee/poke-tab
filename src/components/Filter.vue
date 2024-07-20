<template>
  <ul class="tw-text-center">
    <li class="tw-inline-block">
      <button class="filter__button" @click="onClickFilter(null)">All</button>
    </li>
    <li class="tw-inline-block" v-for="(type, key) in types" :key="key">
      <button :class="{['filter__button ' + type]: true}" @click="onClickFilter(type)">
        {{ type }}
      </button>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import typesJSON from '../assets/json/types.json';

export default defineComponent({
  data() {
    return {
      types: typesJSON,
    };
  },
  methods: {
    onClickFilter(name: string | null): void {
      this.$emit('filter', name);
    },
  },
});
</script>

<style>
.filter__button.normal {
  @apply tw-bg-zinc-300;
}

.filter__button.fire {
  @apply tw-bg-orange-400;
}

.filter__button.water {
  @apply tw-bg-blue-400;
}

.filter__button.grass {
  @apply tw-bg-green-400;
}

.filter__button.electric {
  @apply tw-bg-yellow-400;
}

.filter__button.ice {
  @apply tw-bg-teal-200;
}

.filter__button.fighting {
  @apply tw-bg-red-700;
}

.filter__button.poison {
  @apply tw-bg-fuchsia-500;
}

.filter__button.ground {
  @apply tw-bg-yellow-500;
}

.filter__button.flying {
  @apply tw-bg-indigo-300;
}

.filter__button.psychic {
  @apply tw-bg-pink-400;
}

.filter__button.bug {
  @apply tw-bg-lime-400;
}

.filter__button.rock {
  @apply tw-bg-yellow-600;
}

.filter__button.ghost {
  @apply tw-bg-indigo-500;
}

.filter__button.dragon {
  @apply tw-bg-purple-600;
}

.filter__button.dark {
  @apply tw-bg-orange-950;
}

.filter__button.steel {
  @apply tw-bg-slate-400;
}

.filter__button.fairy {
  @apply tw-bg-pink-300;
}

.filter__button {
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;

  @apply
  tw-h-5
  tw-flex
  tw-justify-center
  tw-items-center
  tw-px-2
  tw-mx-px
  tw-rounded-lg
  tw-text-xs
  tw-align-middle
  tw-font-bold
  tw-text-white
  tw-bg-black
  tw-uppercase
  tw-cursor-pointer;
}
</style>
