import React, { useState } from 'react';
import axios from 'axios';
import SingleResort from './SingleResort';
import Sidebar from './Sidebar'; // Import the Sidebar component

const cache = {}; // In-memory cache object

const SearchSkiResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResorts = async (searchQuery) => {
    setLoading(true);
    setError(null);
    setResorts([]);
    
    // Check if data is in cache
    if (cache[searchQuery]) {
      console.log('Cache hit for:', searchQuery); // Cache hit
      setResorts(cache[searchQuery]);
      setLoading(false);
      return;
    }

    console.log('Cache miss for:', searchQuery); // Cache miss

    try {
      const response = await axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${searchQuery}`, {
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
        },
      });
  
      console.log('API Response:', response.data);

      const resortData = response.data;
      const resortsArray = Array.isArray(resortData.data) ? resortData.data : [resortData.data];
      cache[searchQuery] = resortsArray;
     
      setResorts(resortsArray);
    } catch (error) {
      console.error('Error fetching the resort:', error.message);
      setError('Failed to fetch resorts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      fetchResorts(query);
    } else {
      setError("Please enter a valid search query.");
    }
  };

  const handleSelectResort = (resort) => {
    setQuery(resort);
    fetchResorts(resort);
  };

  return (
    <div className="search-container">
      <Sidebar onSelect={handleSelectResort} /> {/* Include Sidebar here */}
      <div className="main-content">
        <h2>Search for New England Ski Resorts</h2>
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter resort name"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>

        {loading ? (
          <p className="loading-text">Loading resort details...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : resorts.length > 0 ? (
          <ul className="resort-list">
            {resorts.map((resort, index) => (
              <SingleResort key={index} resort={resort} />
            ))}
          </ul>
        ) : (
          <p className="no-results-text">No resort found. Try a different search.</p>
        )}
      </div>

      <style jsx>{`
        .search-container {
          display: flex;
        }

        .main-content {
          flex: 1;
          margin-left: 260px; /* Adjust according to sidebar width */
          padding: 20px;
        }

        h2 {
          color: #333;
          margin-bottom: 20px;
        }

        .search-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          margin-right: 10px;
          outline: none;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          border-color: #007bff;
        }

        .search-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #007bff;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .search-button:hover {
          background-color: #0056b3;
        }

        .loading-text,
        .error-text,
        .no-results-text {
          color: #555;
        }

        .resort-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .resort-list li {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
};

export default SearchSkiResorts;
