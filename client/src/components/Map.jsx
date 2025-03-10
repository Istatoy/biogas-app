// client/src/components/Map.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

function MapComponent() {
  const [digesters, setDigesters] = useState([]);
  const [selectedDigester, setSelectedDigester] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAMaDUBXsDuAm3VbT6cvoGSklR2Sgq9fN4' // замените на ваш ключ
  });

  useEffect(() => {
    axios.get('/api/digesters')
      .then(res => setDigesters(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  const center = digesters.length > 0
    ? { lat: parseFloat(digesters[0].lat), lng: parseFloat(digesters[0].lng) }
    : { lat: 0, lng: 0 };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5}
    >
      {digesters.map(d => (
        <Marker
          key={d.id}
          position={{ lat: parseFloat(d.lat), lng: parseFloat(d.lng) }}
          label={{
            text: `${d.lat}, ${d.lng}`,
            color: "black",
            fontSize: "10px",
            fontWeight: "bold"
          }}
          onClick={() => setSelectedDigester(d)}
        />
      ))}
      {selectedDigester && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedDigester.lat),
            lng: parseFloat(selectedDigester.lng)
          }}
          onCloseClick={() => setSelectedDigester(null)}
        >
          <div>
            <h3>{selectedDigester.external_id}</h3>
            <p>Type: {selectedDigester.type}</p>
            <p>Lat: {selectedDigester.lat}, Lng: {selectedDigester.lng}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default MapComponent;
