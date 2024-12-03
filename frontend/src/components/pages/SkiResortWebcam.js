import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserInfo } from '../../utilities/decodeJwt';

const SkiResortWebcam = () => {
  const [user, setUser] = useState(null);
  const [resorts, setResorts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResort, setSelectedResort] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loggedUser = getUserInfo();
        setUser(loggedUser);

        const response = await axios.get('/resort/getAll');
        setResorts(response.data);
      } catch (error) {
        console.error('Error fetching resorts:', error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h4>Log in to view this page.</h4>
      </div>
    );
  }

  const filteredResorts = resorts.filter((resort) =>
    resort.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-white shadow-lg overflow-y-auto max-h-screen">
        <h2 className="text-xl font-bold mb-4">Ski Resorts</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resorts"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <ul>
          {filteredResorts.map((resort) => (
            <li
              key={resort.id}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => setSelectedResort(resort)}
            >
              {resort.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl mb-6">Webcam Feed</h1>
        {selectedResort ? (
          <div className="text-center">
            <h2 className="text-2xl mb-4">{selectedResort.name} Webcams</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {selectedResort.webcam.map((url, index) => (
                <iframe
                  key={index}
                  src={url}
                  title={`Webcam ${index + 1}`}
                  width="600"
                  height="400"
                  className="border-2 rounded-lg"
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center">Select a resort to view its webcam feed.</p>
        )}
      </div>
    </div>
  );
};

export default SkiResortWebcam;
