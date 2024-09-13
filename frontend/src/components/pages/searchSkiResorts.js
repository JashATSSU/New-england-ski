import { useState, useEffect } from 'react';
import axios from 'axios';

const SearchSkiResorts = () => {
  const [resort, setResort] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchResort = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await axios.get('localhost:8096//ski-resorts-and-conditions.p.rapidapi.com/v1/resort', {
        params: { search: searchQuery },
        headers: {
          'X-RapidAPI-Host': 'ski-resorts-and-conditions.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
        },
      });
      setResort(response.data);
    } catch (error) {
      console.error('Error fetching the resort:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchResort(query);
  };

  useEffect(() => {
    // Optionally, you can fetch default data here if needed
    fetchResort('');
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
        resort ? (
          <div>
            <h3>{resort.name}</h3>
            <p>{resort.description || 'No description available.'}</p>
            {/* Add more details based on the response structure */}
          </div>
        ) : (
          <p>No resort details available.</p>
        )
      )}
    </div>
  );
};

export default SearchSkiResorts;
