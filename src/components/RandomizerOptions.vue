<template>
  <div class="tw:flex tw:flex-col">
    <label class="tw:inline-flex tw:items-center tw:cursor-pointer" for="js-random-include-extras">
      <input
        id="js-random-include-extras"
        class="tw:mr-2 tw:cursor-pointer"
        type="checkbox"
        v-model="includeExtras"
      />
      <span>Include Extras</span>
    </label>
    <label class="tw:inline-flex tw:items-center tw:cursor-pointer" for="js-random-include-forms">
      <input
        id="js-random-include-forms"
        class="tw:mr-2 tw:cursor-pointer"
        type="checkbox"
        v-model="includeForms"
      />
      <span>Include Forms</span>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useSettingsStore } from '../store/settingsStore';

export default defineComponent({
  computed: {
    ...mapState(useSettingsStore, ['randomizerOptions']),
    includeExtras: {
      get(): boolean {
        return this.randomizerOptions.includeExtras;
      },
      set(isExtras: boolean) {
        this.setRandomIncludeExtras(isExtras);
      },
    },
    includeForms: {
      get(): boolean {
        return this.randomizerOptions.includeForms;
      },
      set(isForms: boolean) {
        this.setRandomIncludeForms(isForms);
      },
    },
  },
  methods: {
    ...mapActions(useSettingsStore, {
      setRandomIncludeExtras: 'setRandomIncludeExtras',
      setRandomIncludeForms: 'setRandomIncludeForms',
    }),
  },
});
</script>