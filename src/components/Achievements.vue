<template>
  <div class="tw:flex tw:flex-col tw:h-28 tw:px-2 tw:py-1 tw:mb-3 tw:rounded-md tw:border-2 tw:border-blue-400">
    <strong>{{ title }}</strong>
    <span>{{ description }}</span>
    <span v-if="unlock" class="tw:mt-auto">
      <strong class="tw:mr-1">Unlocks:</strong><span>{{ unlock }}</span>
    </span>
  </div>
  <div class="tw:flex tw:flex-wrap">
    <div
      v-for="(achievement, key) in achievements"
      :key="key"
      class="tw:p-1 tw:cursor-pointer tw:relative"
      @mouseenter="updateTooltip(achievement.name, achievement.description, achievement.unlock)"
      @mouseleave="updateTooltip('', defaultDescription)"
    >
      <img
        :class="{
          'tw:brightness-0 tw:opacity-30 tw:pointer-events-none': unlockedAchievements.indexOf(achievement.name) === -1,
        }"
        :src="achievement.imgUrl"
        :alt="achievement.name"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useAchievementStore } from '../store/achievementStore';
import achievementsJSON from '../assets/json/achievements.json';

export default defineComponent({
  data() {
    return {
      achievements: achievementsJSON,
      achievementNames: Object.keys(achievementsJSON),
      description: '',
      unlock: '',
      defaultDescription: 'Hover over an achievement to find out more about it.',
      title: '',
    };
  },
  computed: {
  ...mapState(useAchievementStore, {
    unlockedAchievements: 'unlockedAchievements',
    }),
  },
  mounted(): void {
    this.description = this.defaultDescription;
  },
  methods: {
    updateTooltip(title: string, description: string, unlock = ''): void {
      this.title = title;
      this.description = description;
      this.unlock = unlock;
    },
  },
});
</script>

