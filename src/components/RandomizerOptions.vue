<template>
  <div class="tw-flex tw-flex-col">
    <label class="tw-inline-flex tw-items-center tw-cursor-pointer" for="js-random-include-extras">
      <input
        id="js-random-include-extras"
        class="tw-mr-2 tw-cursor-pointer"
        type="checkbox"
        :checked="randomizerOptions.includeExtras"
        @change="handleOnChangeIncludeExtras"
      />
      <span>Include Extras</span>
    </label>
    <label class="tw-inline-flex tw-items-center tw-cursor-pointer" for="js-random-include-forms">
      <input
        id="js-random-include-forms"
        class="tw-mr-2 tw-cursor-pointer"
        type="checkbox"
        :checked="randomizerOptions.includeForms"
        @change="handleOnChangeIncludeForms"
      />
      <span>Include Forms</span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useAppStore } from '../store/appStore';

export default defineComponent({
  computed: {
    ...mapState(useAppStore, ['randomizerOptions']),
  },
  methods: {
    ...mapActions(useAppStore, {
      setRandomIncludeExtras: 'setRandomIncludeExtras',
      setRandomIncludeForms: 'setRandomIncludeForms',
    }),
    handleOnChangeIncludeExtras(e: Event): void {
      if (e.target instanceof HTMLInputElement) {
        this.setRandomIncludeExtras(e.target.checked);
      }
    },
    handleOnChangeIncludeForms(e: Event): void {
      if (e.target instanceof HTMLInputElement) {
        this.setRandomIncludeForms(e.target.checked);
      }
    },
  },
});
</script>