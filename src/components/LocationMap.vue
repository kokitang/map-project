<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import locationState from '../models/locationState';
import { googleMapsInstance, initializeGoogleMaps } from '../services/locationService';

const mapContainer = ref(null);
let map;

onMounted(async () => {
  if (!googleMapsInstance.value) {
    await initializeGoogleMaps();
  }

  map = new googleMapsInstance.value.Map(mapContainer.value, {
    center: { lat: 0, lng: 0 },  // Default center, can be updated later
    zoom: 1 // Default zoom, can be updated later
  });
});

watch(() => locationState.currentLocation, (newLocation) => {
  if (newLocation && map) {
    const { lat, lng } = newLocation;
    const position = new googleMapsInstance.value.LatLng(lat, lng);

    // Center the map to the new location
    map.setCenter(position);
    map.setZoom(15);

    // Add a marker for the new location
    const marker = new googleMapsInstance.value.Marker({
      position,
      map,
      title: newLocation.name
    });

    locationState.markers[newLocation.key] = marker;
  }
});

watch(() => locationState.searchedLocations, (locations) => {
  // Clear existing markers
  for (let key in locationState.markers) {
    if (locationState.markers.hasOwnProperty(key)) {
      const marker = locationState.markers[key];
      marker.setMap(null);
      marker.setVisible(false);
    }
  }
  locationState.markers = {};

  locations.forEach(location => {
    const { lat, lng, name } = location;
    const position = new googleMapsInstance.value.LatLng(lat, lng);

    // Create a marker for each location
    const marker = new googleMapsInstance.value.Marker({
      position,
      map,
      title: name
    });

    locationState.markers[location.key] = marker;
  });
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
}
</style>
