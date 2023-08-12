<template>
  <div class="location-time-zone">
    <a-space block>
      <span><strong>Time Zone:</strong> {{ timeZone }}</span>
      <span><strong>Local Time:</strong> {{ localTime }}</span>
    </a-space>
    
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { defineProps } from 'vue';
import locationState from '../models/locationState';

const props = defineProps(['location']);

const timeZone = ref('N/A');
const localTime = ref('N/A');

watch(() => locationState.currentLocation, async (newLocation) => {
  if (newLocation) {
    const timeZoneData = newLocation.timeZone;
    timeZone.value = timeZoneData.timeZoneId;
    localTime.value = timeZoneData.localTime;
  }
});
</script>

<style scoped>
.location-time-zone {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
