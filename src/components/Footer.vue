<template>
  <div class="footer">
    <span>Pokémon are registered trademarks of The Pokemon Company.</span>
    <span v-if="version" class="tw:absolute tw:right-3">{{ version }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    version() {
      return chrome.runtime && 'v' + chrome.runtime.getManifest().version;
    },
  }
});
</script>

<style>
@reference '../tailwind.css';

.footer {
  @apply tw:h-8
  tw:w-full
  tw:flex
  tw:justify-center
  tw:items-center
  tw:text-sm
  tw:text-white
  tw:bg-gray-800
  tw:absolute
  tw:bottom-0;
}
</style>