//useLeafletMap.js
import { ref, onUnmounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icon fix for bundlers
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
});

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
        console.log(`[useLeafletMap] Attempting to create/update map for ID '${mapContainerId}'`);
        console.log(`[useLeafletMap] Coords: [${lat}, ${lon}], Zoom: ${zoom}, Popup: "${popupText}"`);

        await nextTick(); // Ensure the DOM element is ready

        const mapElement = document.getElementById(mapContainerId);
        if (!mapElement) {
            console.error(`[useLeafletMap] Map container with ID '${mapContainerId}' not found in the DOM.`);
            return;
        }

        // If a map instance already exists on this element, remove it first
        if (mapInstance.value) {
            console.log('[useLeafletMap] Removing existing map instance.');
            mapInstance.value.remove();
            mapInstance.value = null;
        }

        try {
            // This is where your example logic fits in, using our parameters:
            console.log(`[useLeafletMap] Initializing L.map on '${mapContainerId}'...`);
            mapInstance.value = L.map(mapContainerId).setView([lat, lon], zoom);
            console.log('[useLeafletMap] Map view set.');

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // Using {s} for subdomain, common practice
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
            }).addTo(mapInstance.value);
            console.log('[useLeafletMap] Tile layer added.');

            // Add marker if lat/lon are valid numbers
            if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
                L.marker([lat, lon]) // Uses L.Icon.Default, which is the standard pin
                    .addTo(mapInstance.value)
                    .bindPopup(popupText) // This is the text you liked
                    .openPopup(); // Opens the popup immediately
                console.log(`[useLeafletMap] Marker with popup added: "${popupText}"`);
            } else {
                console.warn('[useLeafletMap] Invalid lat/lon for marker, marker not added.');
            }

            console.log('[useLeafletMap] Map created/updated successfully.');

        } catch (e) {
            console.error("[useLeafletMap] CRITICAL Error initializing Leaflet map:", e);
            if (mapInstance.value) { // Clean up if map creation failed partially
                mapInstance.value.remove();
                mapInstance.value = null;
            }
        }
    };

    const removeMap = () => {
        if (mapInstance.value) {
            console.log('[useLeafletMap] removeMap called, removing instance.');
            mapInstance.value.remove();
            mapInstance.value = null;
        } else {
            console.log('[useLeafletMap] removeMap called, no instance to remove.');
        }
    };

    onUnmounted(() => {
        console.log('[useLeafletMap] Component unmounted, calling removeMap.');
        removeMap();
    });

    return {
        createOrUpdateMap,
        removeMap,
    };
}