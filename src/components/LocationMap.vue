<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { Loader } from "@googlemaps/js-api-loader";
import locationState from '../models/locationState';

const mapContainer = ref(null);
let map;

onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    version: "weekly"
  });

  await loader.load();

  map = new google.maps.Map(mapContainer.value, {
    center: { lat: 0, lng: 0 },  // Default center, can be updated later
    zoom: 1 // Default zoom, can be updated later
  });
});

watch(() => locationState.currentLocation, (newLocation) => {
  if (newLocation && map) {
    const { lat, lng } = newLocation;
    const position = new google.maps.LatLng(lat, lng);

    // Center the map to the new location
    map.setCenter(position);
    map.setZoom(15);

    // Add a marker for the new location
    const marker = new google.maps.Marker({
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
    if (locationState.markers.hasOwnProperty(key)) { // This check ensures you're not iterating over inherited properties
      const marker = locationState.markers[key];
      marker.setMap(null);
      marker.setVisible(false)
    }
  }
  locationState.markers = {};

  locations.forEach(location => {
    const { lat, lng, name } = location;
    const position = new google.maps.LatLng(lat, lng);

    // Create a marker for each location
    const marker = new google.maps.Marker({
      position,
      map,
      title: name
    });

    locationState.markers[location.key] = marker;
  });
});
</script>

<style>
.map-container {
  width: 100%;
  height: 500px;
}
</style>
