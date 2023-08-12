<template>
  <div class="location-search">
    <a-space align="center" size="large">
      <a-button @click="fetchCurrentLocation" type="primary" shape="circle" :icon="h(EnvironmentOutlined)"></a-button>
      <a-input-search placeholder="Enter location" v-model:value="searchQuery" @search="searchLocation" enterButton />
    </a-space>
    <div v-if="suggestions.length && !isSelectedSuggestion" class="suggestions-dropdown">
      <div v-for="suggestion in suggestions" :key="suggestion.place_id" @click="selectPlace(suggestion)">
        {{ suggestion.description }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, h, watch, onMounted } from 'vue';
import { EnvironmentOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { searchLocationByName, getCurrentLocation, fetchPlaceSuggestions } from '../services/locationService';
import locationState from '../models/locationState';
import { debounce, throttle } from '../utils/utils';

const searchQuery = ref('');
const isLoading = ref(false);
const loadingMsgKey = ref(null);
const suggestions = ref([]);
const isSelectedSuggestion = ref(false);

onMounted(async () => {
  fetchCurrentLocation();
});

const fetchCurrentLocation = async () => {
  if (isLoading.value) {
    return;
  }
  try {
    isLoading.value = true;
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
  } finally {
    isLoading.value = false;
  }
};

const searchLocation = async (value, event) => {
  console.log(event);
  if (isLoading.value) {
    return;
  }
  try {
    isLoading.value = true;
    handleLocationMessage.start();
    const location = await searchLocationByName(searchQuery.value);
    if (!location) {
      throw new Error('No results found for your query.');
    }
    location.key = locationState.searchedLocations.length;
    handleLocationMessage.success();
    locationState.currentLocation = location;
    locationState.searchedLocations.push(location);
    if (event && event.type === 'keydown') {
      throttle(() => {
        console.log("Set true");
        isSelectedSuggestion.value = true;
      }, 1000, true)();
    }
  } catch (error) {
    console.error("Error searching for location:", error.message);
    if (error.message.includes('No results found')) {
      handleLocationMessage.error('No results found for your query. Please try again.');
    } else {
      handleLocationMessage.error('Error searching for location. Please try again.');
    }
  } finally {
    isLoading.value = false;
  }
};

const fetchSuggestions = debounce(async () => {
  try {
    if (isSelectedSuggestion.value) {
      throttle(() => {
        console.log("Set false");
        isSelectedSuggestion.value = false;
      }, 1000)();
    }
    suggestions.value = await fetchPlaceSuggestions(searchQuery.value);
  } catch (error) {
    // Skip suggestions if there is an error
    console.error("Error fetching suggestions:", error.message);
  }
}, 300);

const selectPlace = async (suggestion) => {
  searchQuery.value = suggestion.description;
  await searchLocation();
  throttle(() => {
    console.log("Set true");
    isSelectedSuggestion.value = true;
  }, 1000)();
};

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

watch(searchQuery, fetchSuggestions);
</script>

<style scoped>
.location-search {
  text-align: center;
}

.suggestions-dropdown {
  position: absolute;
  /* width: 100%; */
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  z-index: 10;
  /* center horizontally */
  left: 50%;
  transform: translateX(-50%);
}

.suggestions-dropdown div {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestions-dropdown div:hover {
  background-color: #f5f5f5;
}
</style>
../utils/utils