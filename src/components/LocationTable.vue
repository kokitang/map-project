<template>
  <div>
    <a-button @click="deleteSelected" type="danger" style="margin-bottom: 16px;">Delete Selected</a-button>
    <a-table :dataSource="locationState.searchedLocations" :rowSelection="rowSelectionComputed" :columns="columns"
      :scroll="{ x: 'max-content' }" :customRow="rowClick"></a-table>
  </div>
</template>

<script setup>
import locationState from '../models/locationState';
import { ref, computed } from 'vue';

const selectedRows = ref([]);

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '200px'
  },
  {
    title: 'Latitude',
    dataIndex: 'lat',
    key: 'lat'
  },
  {
    title: 'Longitude',
    dataIndex: 'lng',
    key: 'lng'
  }
];

const rowSelectionComputed = computed(() => ({
  selectedRowKeys: selectedRows.value,
  onChange: (selectedRowKeys, rows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', rows);
    selectedRows.value = rows.map(row => row.key);
  },
}));

const deleteSelected = () => {
  locationState.searchedLocations = locationState.searchedLocations.filter(location => !selectedRows.value.includes(location.key));
  selectedRows.value = []; 
};

const rowClick = (record) => ({
  onClick: () => {
    console.log("Row clicked:", record);
    focusOnMarker(record)
  },
  onChange: () => {
    console.log("Row changed:", record);
    focusOnMarker(record)
  }
});

const focusOnMarker = (location) => {
  console.log("Focus on marker:", location);
  console.log("Markers:", locationState.markers);
  if (locationState.markers && locationState.markers[location.key]) {
    const marker = locationState.markers[location.key];
    const latLng = marker.getPosition();
    const map = marker.getMap();
    console.log("Marker found:", marker);
    if (map) {
      console.log("Map found, focusing on marker");
      map.setCenter(latLng);
      map.setZoom(15);
    }
  }
};

</script>
