import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SkiResortWebcam = () => {
  const [selectedResort, setSelectedResort] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // state for search query
  const [resorts, setResorts] = useState([]);
  // Fetch resorts data from the backend API
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resorts`) // Adjust the URL to match your server setup
      .then(response => response.json())
      .then(data => setResorts(data))
      .catch(error => console.error('Error fetching resorts:', error));
  }, []);

  // Handle resort selection
  const handleSelectResort = (resortId) => {
    const resort = resorts.find((r) => r.id === resortId);
    setSelectedResort(resort);
  };

  // Filter resorts based on the search query
  const filteredResorts = resorts.filter((resort) =>
    resort.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <div className="row">
        {/* Sidebar */}
        <div className="col-3">
          <h3>Ski Resorts</h3>
          <input
            type="text"
            className="form-control"
            placeholder="Search resorts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ul className="list-group mt-3">
            {filteredResorts.map((resort) => (
              <li
                key={resort.id}
                className="list-group-item cursor-pointer" // Add the 'cursor-pointer' class here
                onClick={() => handleSelectResort(resort.id)}
              >
                {resort.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <div className="col-9">
          <h3>Webcam Feed</h3>
          {selectedResort ? (
            <div>
              <h4>{selectedResort.name} Webcams</h4>
              <div>
                {selectedResort.webcam.map((url, index) => (
                  <iframe
                    key={index}
                    src={url}
                    width="600"
                    height="400"
                    frameBorder="0"
                    allowFullScreen
                    title={`Webcam ${index + 1}`}
                  ></iframe>
                ))}
              </div>
            </div>
          ) : (
            <p>Select a resort to view its webcam feed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkiResortWebcam;
