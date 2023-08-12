import { ref } from 'vue';
import { Loader } from "@googlemaps/js-api-loader";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let googleMapsInstance = ref(null);

const initializeGoogleMaps = async () => {
  const loader = new Loader({
    apiKey,
    version: "weekly"
  });

  await loader.load();

  if (window.google && window.google.maps) {
    googleMapsInstance.value = window.google.maps;
    const { AutocompleteService } = await google.maps.importLibrary("places")
    googleMapsInstance.value.places.AutocompleteService = AutocompleteService;
  }
};

const searchLocationByName = async (query) => {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return appendTimeZone({
        name: data.results[0].formatted_address,
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
      });
    } else {
      console.warn("No results found for your query.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
};

const searchLocationByLatLng = async (lat, lng) => {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return appendTimeZone({
        name: data.results[0].formatted_address,
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng
      });
    } else {
      console.warn("No results found for your query.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching location details:", error);
    return null;
  }
};

const fetchTimeZone = async (lat, lng) => {
  const endpoint = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(Date.now() / 1000)}&key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    const result = await response.json()
    const timeZoneId = result.timeZoneId;
    const date = new Date();
    const localDate = new Date(date.toLocaleString("en-US", { timeZone: timeZoneId }));
    const localTime = localDate.toLocaleTimeString();
    return { timeZoneId, localTime };
  } catch (error) {
    console.error("Error fetching time zone information:", error);
    return null;
  }
};

const getCurrentLocation = async () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const location = searchLocationByLatLng(lat, lng);
        resolve(location);
      },
      (error) => {
        console.error("Error fetching current location:", error.message);
        reject(error);
      }
    );
  });
};

const appendTimeZone = async (location) => {
  const { lat, lng } = location;
  const timeZone = await fetchTimeZone(lat, lng);
  return { ...location, timeZone };
}

const fetchPlaceSuggestions = async (query) => {
  if (!googleMapsInstance.value) {
    await initializeGoogleMaps();
  }

  if (query.length < 3) return [];  // Only search if the input has 3 or more characters

  const autocompleteService = new googleMapsInstance.value.places.AutocompleteService();

  return new Promise((resolve, reject) => {
    autocompleteService.getPlacePredictions({ input: query }, (results, status) => {
      if (status === googleMapsInstance.value.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject(new Error("Failed to fetch place suggestions"));
      }
    });
  });
};

export {
  searchLocationByName,
  searchLocationByLatLng,
  fetchTimeZone,
  getCurrentLocation,
  initializeGoogleMaps,
  googleMapsInstance,
  fetchPlaceSuggestions
};
