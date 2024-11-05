import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserInfo } from '../../utilities/decodeJwt';

const resorts = [
  { name: 'Attitash Mountain', webcam: ['https://www.youtube.com/embed/B32BbIXgHWw'] },
  { name: 'Bolton Valley', webcam: ['https://www.youtube.com/embed/xWdZHDUHjv8'] },
  { name: 'Loon Mountain', webcam: ['https://www.youtube.com/embed/5NUYOuzzZwc', 'https://www.youtube.com/embed/1ulgeNTlFJc'] },
  { name: 'Mad River Glen', webcam: ['https://www.youtube.com/embed/zMuhC48767w'] },
  { name: 'Mount Katahdin', webcam: ['https://www.youtube.com/embed/yPyOLnDcrHA'] },
  { name: 'Mount Washington', webcam: ['https://www.youtube.com/embed/5qVHjf7hKZU'] },
  { name: 'Pats Peak', webcam: ['https://www.youtube.com/embed/ZLsh8WsISr0', 'https://www.youtube.com/embed/KFjl8wPJvyg'] },
  { name: 'Stowe', webcam: ['https://www.youtube.com/embed/AhcH03HwuH0'] },
  { name: 'Stratton Mountain', webcam: ['https://www.youtube.com/embed/AhcH03HwuH0', 'https://www.youtube.com/embed/VPQaZffyviI'] },
  { name: 'Sugarbush', webcam: ['https://www.youtube.com/embed/tdQOYaEQC3o'] },
  { name: 'Sugarloaf', webcam: ['https://www.youtube.com/embed/K77ahIkmPGw'] },
  { name: 'Sunday River', webcam: ['https://www.youtube.com/embed/J98tW5YX4Z8'] }
];

const SkiResortWebcam = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResort, setSelectedResort] = useState(null);

  useEffect(() => {
    const loggedUser = getUserInfo();
    setUser(loggedUser);
  }, []);

  if (!user) return (
    <div style={styles.container}>
        <h4 style={styles.message}>Log in to view this page.</h4>
    </div>
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectResort = (resort) => {
    setSelectedResort(resort);
  };

  const filteredResorts = resorts.filter((resort) =>
    resort.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-white shadow-lg overflow-y-auto max-h-screen scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <h2 className="text-xl font-bold mb-4">Ski Resorts</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search resorts"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <ul className="list-none">
          {filteredResorts.map((resort, index) => (
            <li 
              key={index} 
              className="cursor-pointer hover:bg-gray-200 p-2 rounded transition"
              onClick={() => handleSelectResort(resort)}
            >
              {resort.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl text-gray-800 mb-6">Webcam Feed</h1>

        {selectedResort ? (
          <div className="text-center">
            <h2 className="text-2xl mb-4">{selectedResort.name} Webcams</h2>
            <div className="flex justify-center gap-4">
              {selectedResort.webcam.map((url, index) => (
                <iframe
                  key={index}
                  src={url}
                  title={`${selectedResort.name} Webcam ${index + 1}`}
                  width="600"
                  height="400"
                  frameBorder="0"
                  allowFullScreen
                  className="border-2 border-gray-300 rounded-lg"
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Select a resort to view its webcam feed.</p>
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

export default SkiResortWebcam;
