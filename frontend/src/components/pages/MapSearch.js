import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../utilities/decodeJwt';

// List of ski map images
const skiMaps = [
  "Attitash.png",
  "Bolten Valley.png",
  "Bretton Woods.png",
  "Burke Mountain.jpeg",
  "Cannon.png",
  "Jay Peak.png",
  "Killington.png",
  "Loon Mountain.png",
  "Mount Snow.png",
  "Okemo.png",
  "Stowe.png",
  "Stratton.png",
  "Sugarloaf.png",
  "Wildcat.png",
  "Windham.png"
];

const MapSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMap, setSelectedMap] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  // Render a message if the user is not logged in
  if (!user) {
    return (
      <div style={styles.container}>
        <h4 style={styles.message}>Log in to view this page.</h4>
      </div>
    );
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleMapSelect = (map) => {
    setSelectedMap(map);
  };

  const handlePrint = () => {
    if (!selectedMap) return; // Ensure there's a selected map

    const imgElement = document.getElementById('map-image');
    if (!imgElement.complete) {
      imgElement.onload = () => {
        createPDF(imgElement);
      };
    } else {
      createPDF(imgElement);
    }
  };

  const createPDF = (imgElement) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF();
    doc.addImage(imgData, 'PNG', 10, 10);
    doc.save(`${selectedMap.split('.')[0]}.pdf`);
  };

  // Filter maps based on the search term
  const filteredMaps = skiMaps.filter((map) =>
    map.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="md:w-1/4 p-4 bg-white shadow-md">
        <h2 className="font-bold text-lg mb-4">Ski Maps</h2>
        <input
          type="text"
          placeholder="Search maps..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        {/* Scrollable list container with scrollbar */}
        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200">
          <ul className="space-y-2">
            {filteredMaps.map((map) => (
              <li
                key={map}
                onClick={() => handleMapSelect(map)}
                className="cursor-pointer hover:bg-gray-200 p-2 rounded transition duration-200"
              >
                {map.split('.')[0]} {/* Display map name without extension */}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:w-3/4 p-4 flex flex-col items-center justify-center">
        {selectedMap && (
          <div className="text-center mb-4">
            <h2 className="font-bold text-xl mb-4">{selectedMap.split('.')[0]}</h2>
            <img
              id="map-image"
              src={`/SkiMaps/${selectedMap}`} // Correct path to match the "SkiMaps" folder
              alt={selectedMap}
              className="max-w-full max-h-[400px] object-contain mb-4 border border-gray-300 shadow-md rounded"
            />
            <button
              onClick={handlePrint}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Have a map on us! (Print PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  message: {
    color: '#333',
    fontSize: '1.5rem',
  },
};

export default MapSearch;
