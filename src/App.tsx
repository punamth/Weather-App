import React, { useEffect, useState } from 'react';
import WeatherCard from './components/WeatherCard';

const App: React.FC = () => {
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');
  const [useCoords, setUseCoords] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    const denied = localStorage.getItem('locationDenied');
    const shown = localStorage.getItem('locationPromptShown');

    if (!shown && denied !== 'true') {
      setShowLocationPrompt(true);
    }
  }, []);

  const handleSearch = () => {
    if (location.trim()) {
      setQuery(location);
      setUseCoords(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      setLocationDenied(true);
      setShowLocationPrompt(false);
      localStorage.setItem('locationPromptShown', 'true');
      localStorage.setItem('locationDenied', 'true');
      return;
    }

    console.log('Requesting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Location success:', position);
        const coords = `${position.coords.latitude},${position.coords.longitude}`;
        setQuery(coords);
        setUseCoords(true);
        setShowLocationPrompt(false);
        setLocationDenied(false);
        localStorage.setItem('locationPromptShown', 'true');
        localStorage.setItem('locationDenied', 'false');
      },
      (error) => {
        console.warn('Location error:', error);
        setLocationDenied(true);
        setShowLocationPrompt(false);
        localStorage.setItem('locationPromptShown', 'true');
        localStorage.setItem('locationDenied', 'true');
      }
    );
  };

  const resetPermissions = () => {
    localStorage.removeItem('locationPromptShown');
    localStorage.removeItem('locationDenied');
    setLocationDenied(false);
    setShowLocationPrompt(true);
  };

  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center p-4">
      <h1 className="mb-4">🌤️ Weather Now</h1>

      {/* Location prompt */}
      {showLocationPrompt && (
        <div className="alert alert-info text-center" style={{ maxWidth: '500px' }}>
          <p>🌍 Allow location access to get local weather?</p>
          <button className="btn btn-success me-2" onClick={requestLocation}>
            Yes, use my location
          </button>
          <button className="btn btn-secondary" onClick={() => setShowLocationPrompt(false)}>
            No, I’ll search manually
          </button>
        </div>
      )}

      {/* Location denied message */}
      {locationDenied && (
        <div className="alert alert-warning text-center" style={{ maxWidth: '500px' }}>
          Location access was denied. Please search manually or <button className="btn btn-sm btn-link text-warning" onClick={resetPermissions}>try again</button>.
        </div>
      )}

      {/* Success message */}
      {useCoords && !showLocationPrompt && !locationDenied && (
        <div className="alert alert-success text-center" style={{ maxWidth: '500px' }}>
          ✅ Using your current location to show weather.
        </div>
      )}

      {/* Search input */}
      <div className="input-group mb-4" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Weather card */}
      {query && <WeatherCard location={query} useCoords={useCoords} />}
    </div>
  );
};

export default App;
