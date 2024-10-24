<template>
  <div class="tw-flex tw-flex-col tw-fixed tw-top-0 tw-right-0 tw-left-0 tw-z-50">
    <Callout
      v-for="callout in callouts"
      :key="callout.id"
      :type="callout.type"
      :img-url="callout.imgUrl"
      :label="callout.label"
      :description="callout.description"
      @close="removeCallout(callout)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'pinia';
import { useCalloutStore } from '../store/calloutStore';
import CalloutComponent from './Callout.vue';

export default defineComponent({
  components: {
    Callout: CalloutComponent,
  },
  computed: {
    ...mapState(useCalloutStore, ['callouts']),
  },
  methods: {
    ...mapActions(useCalloutStore, ['removeCallout']),
  },
});
</script>
