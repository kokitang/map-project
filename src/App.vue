<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo">Simple Map</div>
    </a-layout-header>

    <a-layout-content class="content">
      <LocationSearch class="search" />
      <LocationTimeZone class="timezone" />
      <LocationMap class="map" />
      <LocationTable class="table" />
    </a-layout-content>

    <a-layout-footer style="text-align: center">
      Simple Map ©2023 by Kelvin Tang
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import LocationSearch from './components/LocationSearch.vue';
import LocationMap from './components/LocationMap.vue';
import LocationTable from './components/LocationTable.vue';
import LocationTimeZone from './components/LocationTimeZone.vue';
</script>

<style>
/* Add any global styles or overrides here */

.content {
  padding: 0 50px;
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.logo {
  color: white;
  font-size: 16px;
  font-weight: bold;
  min-width: 200px
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.map,
.table,
.search,
.timezone {
  flex-shrink: 0;
  margin: 16px 0;
}
</style>
