<template>
  <div class="footer">
    <span>Pokémon are registered trademarks of The Pokemon Company.</span>
  </div>
</template>

<style>
@reference "../tailwind.css";

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