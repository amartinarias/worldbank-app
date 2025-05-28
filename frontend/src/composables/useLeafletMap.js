//useLeafletMap.js
import { ref, onUnmounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * A Vue 3 Composable for managing a Leaflet map instance.
 * @param {string} mapContainerId 
 */
export function useLeafletMap(mapContainerId) {
    const mapInstance = ref(null);

    /**
     * Creates or updates the Leaflet map.
     * @param {number} lat - Latitude.
     * @param {number} lon - Longitude.
     * @param {string} [popupText='Location Details'] - Text for the marker popup.
     * @param {number} [zoom=5] - Initial zoom level for the map.
     */
    const createOrUpdateMap = async (lat, lon, popupText = 'Location Details', zoom = 5) => {

        await nextTick();

        const mapElement = document.getElementById(mapContainerId);
        if (!mapElement) {
            console.error(`[useLeafletMap] Map container with ID '${mapContainerId}' not found in the DOM.`);
            return;
        }

        // If a map instance already exists on this element, remove it first
        if (mapInstance.value) {
            mapInstance.value.remove();
            mapInstance.value = null;
        }

        try {
            mapInstance.value = L.map(mapContainerId).setView([lat, lon], zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
            }).addTo(mapInstance.value);

            // Add marker if lat/lon are valid numbers
            if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
                L.circle([lat, lon])
                    .addTo(mapInstance.value)
                    .bindPopup(popupText)
                    .openPopup();
            } else {
                console.warn('[useLeafletMap] Invalid lat/lon for marker, marker not added.');
            }


        } catch (e) {
            console.error("[useLeafletMap] CRITICAL Error initializing Leaflet map:", e);
            if (mapInstance.value) {
                mapInstance.value.remove();
                mapInstance.value = null;
            }
        }
    };

    const removeMap = () => {
        if (mapInstance.value) {
            mapInstance.value.remove();
            mapInstance.value = null;
        }
    };

    onUnmounted(() => {
        removeMap();
    });

    return {
        createOrUpdateMap,
        removeMap,
    };
}