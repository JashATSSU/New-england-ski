import React, { useState } from 'react';
import axios from 'axios';
import SingleResort from './SingleResort'; // Import the SingleResort component

const SearchSkiResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResorts = async (searchQuery) => {
    setLoading(true);
    setError(null);
    setResorts([]);
  
    try {
      const response = await axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${searchQuery}`, {
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
        },
      });
  
      // Log the entire response and its structure
      console.log('API Response:', response.data);
  
      const resortsData = response.data;
  
      // Handle response based on whether it's an array or an object
      if (Array.isArray(resortsData)) {
        // If it's an array
        const filteredResorts = resortsData.filter(resort =>
          ['New Hampshire', 'Vermont', 'Maine', 'Massachusetts', 'Connecticut', 'Rhode Island'].includes(resort.state)
        );
        setResorts(filteredResorts.length > 0 ? filteredResorts : []);
      } else if (resortsData && typeof resortsData === 'object') {
        // If it's an object, check the fields and their types
        console.log('Object fields:', Object.keys(resortsData)); // Log the keys of the object
  
        // Modify the condition based on the actual structure
        const key = Object.keys(resortsData)[0]; // Adjust based on the actual field name
        if (Array.isArray(resortsData[key])) {
          const filteredResorts = resortsData[key].filter(resort =>
            ['New Hampshire', 'Vermont', 'Maine', 'Massachusetts', 'Connecticut', 'Rhode Island'].includes(resort.state)
          );
          setResorts(filteredResorts.length > 0 ? filteredResorts : []);
        } else {
          setError(`Unexpected format: '${key}' field is not an array`);
        }
      } else {
        setError('Unexpected format: Response data is neither an array nor an object with an array field');
      }
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
