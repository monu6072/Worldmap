import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
import {statesData} from './Geo.js'

const center = [22.738437876049627, 79.31227549359568];
function MapSearch({ countryName }) {
  const map = useMap();
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (countryName) {
      const country = statesData.features.find(
        (state) => state.properties.name_en.toLowerCase() === countryName.toLowerCase()
      );
      console.log(country)

      if (country) {
        const coordinates = country.geometry.coordinates[0].map((item) => [item[1], item[0]]);
        const bounds = L.latLngBounds(coordinates);
        setSelectedCountry(country);
        map.flyToBounds(bounds);
      } else {
        setSelectedCountry(null);
        map.setView(center, 10);
      }
    }
  }, [countryName, map]);

  return selectedCountry ? (
    <Polygon
      pathOptions={{
        fillColor: '#FD8D3C',
        fillOpacity: 0.7,
        weight: 2,
        opacity: 1,
        dashArray: 3,
        color: 'white',
      }}
      positions={selectedCountry.geometry.coordinates[0]}
    >
      <Popup>
        <div>
          <h3>{selectedCountry.properties.admin}</h3>
          <p>Population: {selectedCountry.properties.population}</p>
          <p>Capital: {selectedCountry.properties.capital}</p>
        </div>
      </Popup>
    </Polygon>
  ) : null;
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.search.value.trim());
  };

  return (
    <div className="App">
      <form onSubmit={handleSearch} id='Search' style={{backgroundColor:"ghostwhite"}}>
        <input  type="text" name="search" placeholder="Search..."  />
        <button type="submit">Search</button>
      </form>
      <MapContainer id='Map' center={center} zoom={10} style={{ width: '100vw', height: '100vh' }}>
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=a9oLZQ0LBwtmPDiCKIln"
          attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a>'
        />
        <MapSearch countryName={searchTerm} />
      </MapContainer>
    </div>
  );
}

export default App;
