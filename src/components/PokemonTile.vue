<template>
  <div
    :class="{
      'tw:inline-flex tw:flex-col tw:justify-center tw:items-center tw:h-24 tw:w-24 tw:text-center tw:cursor-pointer tw:relative': true,
      'tw:bg-blue-200': isSelectable && isSelected,
    }"
  >
    <span v-if="forms.length > 0" class="pokemon-tile__form-icon">+</span>
    <img
      :class="{
        'tw:-mb-2.5': label,
        'tw:brightness-0 tw:opacity-30 tw:pointer-events-none': locked,
      }"
      :src="imgUrl"
      :alt="name"
      loading="lazy"
      @click="onClick"
    />
    <span
      v-if="label && !locked"
      :class="{
        'tw:inline-block': true,
        [getLabelClass(label)]: true,
      }"
    >
      {{ label }}
    </span>
    <div v-if="forms.length > 0 && isFormsPanelVisible" class="pokemon-tile__forms-wrapper">
      <span class="pokemon-tile__forms-label">{{ name }} forms</span>
      <span class="pokemon-tile-forms-cross" @click="isFormsPanelVisible = false"><Cross /></span>
      <PokemonTile
        v-for="(pokemon, index) in forms"
        :key="index"
        :img-url="pokemon.imgUrl"
        :name="pokemon.name"
        :label="pokemon.name"
        :forms="pokemon.forms"
        @on-click-pokemon="setPokemonToAdd(pokemon)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'pinia';
import { useAppStore } from '../store/appStore';
import Cross from './icons/Cross.vue';
import { type Pokemon } from '../util/interfaces';

export default defineComponent({
  components: {
    Cross,
  },
  props: {
    isSelectable: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
    imgUrl: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    forms: {
      type: Array<Pokemon>,
      default: () => [],
    },
    locked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSelected: false,
      isFormsPanelVisible: false,
    };
  },
  methods: {
    ...mapActions(useAppStore, { setPokemonToAdd: 'setPokemonToAdd' }),
    onSelect(): void {
      this.isSelected = !this.isSelected;
      this.$emit('select', this.id);
    },
    onClick(): void {
      if (!this.locked) {
        if (this.isSelectable) {
          this.onSelect();
        } else {
          if (this.forms.length > 0) {
            this.isFormsPanelVisible = !this.isFormsPanelVisible;
          } else {
            this.$emit('on-click-pokemon');
          }
        }
      }
    },
    getLabelClass(label: string): string {
      const maxLabelLength = 10;
      return label.length > maxLabelLength ? 'tw:text-xs' : 'tw:text-sm';
    },
  },
});
</script>

<style>
@reference "../tailwind.css";

.pokemon-tile__forms-wrapper {
  box-shadow: inset 0 0 0 2px theme('colors.blue.400');

  @apply tw:flex
  tw:flex-wrap
  tw:w-96
  tw:py-4
  tw:-mt-[126px]
  tw:rounded-lg
  tw:bg-white
  tw:fixed
  tw:left-0
  tw:z-10;
}

.pokemon-tile__forms-label {
  @apply tw:px-2
  tw:text-white
  tw:rounded-tl-lg
  tw:rounded-br-lg
  tw:bg-blue-400
  tw:absolute
  tw:top-0
  tw:left-0;
}

.pokemon-tile-forms-cross {
  @apply tw:h-6
  tw:flex
  tw:justify-center
  tw:items-center
  tw:px-1.5
  tw:rounded-bl-lg
  tw:rounded-tr-lg
  tw:bg-blue-400
  tw:absolute
  tw:top-0
  tw:right-0;
}

.pokemon-tile__form-icon {
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;

  @apply tw:text-blue-400 tw:text-xl tw:font-bold tw:leading-none tw:absolute tw:top-0 tw:right-0.5;
}

/* Pokeball hover effect */
/* .pokemon-tile::before {
  content: '';
  background-image: url(../assets//images/pokeball.png);

  @apply tw:h-full tw:w-full tw:absolute tw:top-0 tw:left-0 tw:opacity-0 tw:hover:opacity-20 tw:-z-10;
} */


/* Fancy border hover effect */
/* .pokemon-tile:hover {
  box-shadow: inset 0 0 0 4px theme('colors.gray.800');

  @apply tw:rounded-lg tw:relative tw:z-10;
}

.pokemon-tile::before,
.pokemon-tile::after {
  content: '';

  @apply tw:absolute tw:-z-10;
}

.pokemon-tile::before:hover {
  @apply tw:w-1/2 tw:h-full tw:bg-white tw:left-1/4;
}

.pokemon-tile::after:hover {
  @apply tw:h-1/2 tw:w-full tw:bg-white tw:top-1/4 tw:left-0;
} */
</style>
