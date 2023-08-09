<template>
  <div class="location-search">
    <a-space align="center" size="large">
      <a-button @click="fetchCurrentLocation" type="primary" shape="circle" :icon="h(EnvironmentOutlined)"></a-button>
      <a-input-search placeholder="Enter location" v-model:value="searchQuery" @search="searchLocation" enterButton />
    </a-space>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue';
import { EnvironmentOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { searchLocationByName, getCurrentLocation } from '../services/locationService';
import locationState from '../models/locationState';


const searchQuery = ref('');

onMounted(async () => {
  fetchCurrentLocation();
});

const fetchCurrentLocation = async () => {
  try {
    handleLocationMessage.start();
    const location = await getCurrentLocation();
    console.log("Current location:", location);
    if (location) {
      handleLocationMessage.success();
      location.key = locationState.searchedLocations.length;
      locationState.currentLocation = location;
      locationState.searchedLocations.push(location);
    }
    // Clear the search text
    searchQuery.value = '';
  } catch (error) {
    console.error("Error fetching default current location:", error.message);

    if (error.code === error.PERMISSION_DENIED) {
      handleLocationMessage.error("Location access was denied. Please enable location permissions to use this feature.");
    } else {
      handleLocationMessage.error("Error fetching current location. Please try again.");
    }
  }
};

const searchLocation = async () => {
  handleLocationMessage.start();
  try {
    const location = await searchLocationByName(searchQuery.value);
    if (!location) {
      throw new Error('No results found for your query.');
    }
    location.key = locationState.searchedLocations.length;
    handleLocationMessage.success();
    locationState.currentLocation = location;
    locationState.searchedLocations.push(location);
  } catch (error) {
    console.error("Error searching for location:", error.message);
    if (error.message.includes('No results found')) {
      handleLocationMessage.error('No results found for your query. Please try again.');
    } else {
      handleLocationMessage.error('Error searching for location. Please try again.');
    }
  }
};

const loadingMsgKey = ref(null);

const handleLocationMessage = {
  start: () => {
    loadingMsgKey.value = "loading"; // Unique key for the loading message
    message.loading({ content: "Fetching position...", key: loadingMsgKey.value });
  },
  success: () => {
    message.success({ content: "Location fetched successfully!", key: loadingMsgKey.value, duration: 2 });
    loadingMsgKey.value = null;
  },
  error: (errMsg) => {
    message.error({ content: errMsg, key: loadingMsgKey.value, duration: 2 });
    loadingMsgKey.value = null;
  }
};
</script>

<style scoped>
.location-search {
  text-align: center;
}
</style>
