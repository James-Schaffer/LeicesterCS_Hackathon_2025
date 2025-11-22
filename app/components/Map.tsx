'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';  // Make sure Leaflet's CSS is imported

const Map = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize the map
    const map = L.map('map', {
      center: [52.6100, -1.1140],  // University of Leicester coordinates
      zoom: 15,  // Zoom level
    });

    // Set up OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a marker at University of Leicester
    L.marker([52.6100, -1.1140]).addTo(map)
      .bindPopup('University of Leicester')
      .openPopup();

    // Cleanup on component unmount
    return () => map.remove();
  }, []);

  return (
    <div id="map" style={{ height: '100vh', width: '100%' }}></div>  // Ensure full screen height
  );
};

export default Map;
