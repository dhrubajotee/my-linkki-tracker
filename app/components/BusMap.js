'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

// Optional bus icon
const busIcon = new L.Icon({
  iconUrl: '/bus-icon.png', // replace with your icon or remove for default
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function BusMap() {
  const [vehicles, setVehicles] = useState([]);

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/waltti/jyvaskyla/vehicleposition');
      const data = await res.json();
      const vehicleData = data.entity
        .filter(e => e.vehicle)
        .map(e => e.vehicle);
      setVehicles(vehicleData);
    } catch (err) {
      console.error('Failed to fetch vehicle positions', err);
    }
  };

  return (
    <div>
      {/* Button to fetch updates */}
      <button
        onClick={fetchVehicles}
        style={{ marginBottom: '10px', padding: '8px 12px' }}
      >
        Show Latest Buses
      </button>

      <MapContainer
        center={[62.242, 25.747]} // Jyväskylä center
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {vehicles.map((v, idx) => (
          <Marker
            key={idx}
            position={[v.position.latitude, v.position.longitude]}
            icon={busIcon}
          >
            <Popup>
              <strong>Trip:</strong> {v.trip.tripId} <br />
              <strong>Route:</strong> {v.trip.routeId} <br />
              <strong>Speed:</strong> {v.position.speed || 'N/A'} m/s
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
