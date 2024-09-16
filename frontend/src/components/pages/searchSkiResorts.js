import React, { useState } from 'react';
import axios from 'axios';
import SingleResort from './SingleResort';

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
      // If the data is an object with a `data` field or directly an array
      const resortsArray = Array.isArray(resortData.data) ? resortData.data : [resortData.data];
      // Cache the data
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

  return (
    <div>
      <h2>Search for New England Ski Resorts</h2>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter resort name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading resort details...</p>
      ) : error ? (
        <p>{error}</p>
      ) : resorts.length > 0 ? (
        <ul>
          {resorts.map((resort, index) => (
            <SingleResort key={index} resort={resort} />
          ))}
        </ul>
      ) : (
        <p>No resort found. Try a different search.</p>
      )}
    </div>
  );
};

export default SearchSkiResorts;
