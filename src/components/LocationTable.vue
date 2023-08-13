<template>
  <div>
    <a-button @click="deleteSelected" danger style="margin-bottom: 16px;">Delete Selected</a-button>
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
  },
  {
    title: 'Search Time',
    dataIndex: 'date',
    key: 'date',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.key - b.key,
  }
];

const rowSelectionComputed = computed(() => ({
  selectedRowKeys: selectedRows.value,
  onChange: (selectedRowKeys, rows) => {
    selectedRows.value = rows.map(row => row.key);
  },
}));

const deleteSelected = () => {
  locationState.searchedLocations = locationState.searchedLocations.filter(location => !selectedRows.value.includes(location.key));
  selectedRows.value = []; 
};

const rowClick = (record) => ({
  onClick: () => {
    focusOnMarker(record)
  },
  onChange: () => {
    focusOnMarker(record)
  }
});

const focusOnMarker = (location) => {
  if (locationState.markers && locationState.markers[location.key]) {
    const marker = locationState.markers[location.key];
    const latLng = marker.getPosition();
    const map = marker.getMap();
    if (map) {
      map.setCenter(latLng);
      map.setZoom(15);
    }
  }
};

</script>
