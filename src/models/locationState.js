import { reactive, watch } from 'vue';

const locationState = reactive({
  currentLocation: null,       // Holds the latest searched location details.
  searchedLocations: [],       // Array of all searched locations.
  markers: {},                 // Array of all markers on the map.
  // Add other states related to location if needed.
});

watch(() => locationState.searchedLocations, (newSearchedLocations) => {
  console.log("New searched locations:", newSearchedLocations);
}, { deep: true });


export default locationState;
