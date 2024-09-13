// SearchSkiResorts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchSkiResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to fetch resorts based on the search query
  const fetchResorts = async (searchQuery) => {
    setLoading(true);
    try {
      // Send a GET request to the RapidAPI endpoint
      const response = await axios.get('https://ski-resorts-and-conditions.p.rapidapi.com/v1/resorts', {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'ski-resorts-and-conditions.p.rapidapi.com'
        },
        params: { search: searchQuery },
      });
      // Update state with the data received
      setResorts(response.data);
    } catch (error) {
      // Log any errors that occur
      console.error('Error fetching the resorts:', error.message);
    } finally {
      // Ensure that loading state is set to false after the request completes
      setLoading(false);
    }
  };

  // Handle search action
  const handleSearch = () => {
    fetchResorts(query);
  };

  // Fetch resorts on component mount
  useEffect(() => {
    fetchResorts('');
  }, []);

  return (
    <div>
      <h2>Mountain Resort Details</h2>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter resort name or location"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {loading ? (
        <p>Loading resort details...</p>
      ) : (
        resorts.length > 0 ? (
          resorts.map((resort, index) => (
            <div key={index} onClick={() => navigate(`/resortDetails/${resort.name}`)}>
              <h3>{resort.name}</h3>
              <p>{resort.description || 'No description available.'}</p>
            </div>
          ))
        ) : (
          <p>No resort details available.</p>
        )
      )}
    </div>
  );
};

export default SearchSkiResorts;
