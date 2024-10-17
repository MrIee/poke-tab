import { defineStore, StoreDefinition } from "pinia";
import { type Callout } from "../util/interfaces";
import { v4 as uuidv4 } from 'uuid';

export const useCalloutStore: StoreDefinition = defineStore('calloutStore', {
  state: () => ({
    callouts: new Array<Callout>,
  }),
  actions: {
    addCallout(callout: Callout): void {
      const id: string = callout.id ? callout.id : uuidv4();
      this.callouts.push({ id, ...callout });
    },
    removeCallout(callout: Callout): void {
      const index: number = this.callouts.findIndex((c: Callout) => c.id === callout.id);

      if (index > -1) {
        this.callouts.splice(index, 1);
      }
    },
  },
});
