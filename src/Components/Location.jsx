import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MyLocationMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Custom marker icon
  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  const showLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!mapInitialized) {
          mapRef.current = L.map('map').setView([latitude, longitude], 16);
          setMapInitialized(true);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
          }).addTo(mapRef.current);
        }

        if (!markerRef.current) {
          markerRef.current = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapRef.current)
            .bindPopup("Creator's Location")
            .openPopup();
        } else {
          markerRef.current.setLatLng([latitude, longitude]).openPopup();
        }

        mapRef.current.setView([latitude, longitude], 16);
      },
      (err) => {
        alert('Error getting location: ' + err.message);
      }
    );
  };

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        setMapInitialized(false);
      }
    };
  }, []);

  return (
    <div>
      <h2>My Live Location</h2>
      <button onClick={showLocation}>Show My Location</button>
      <div id="map" style={{ height: '400px', marginTop: '1rem' }}></div>
    </div>
  );
};

export default MyLocationMap;