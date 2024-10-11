import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SingleResort from './SingleResort';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { getUserInfo } from '../../utilities/decodeJwt';
import { useNavigate } from 'react-router-dom';

const cache = {}; // In-memory cache object

const SearchSkiResorts = () => {
  const [resorts, setResorts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUserInfo());
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <h4 className="text-2xl text-gray-800">Log in to view this page.</h4>
      </div>
    );
  }

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
      const response = await axios.get(
        `http://localhost:8081/api/resortview/${searchQuery}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
          },
        }
      );

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
      setError('Please enter a valid search query.');
    }
  };

  const handleSelectResort = (resort) => {
    setQuery(resort);
    fetchResorts(resort);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onSelect={handleSelectResort} /> {/* Include Sidebar here */}
      <div className="flex-1 ml-64 p-8">
        <h2 className="text-3xl text-gray-800 mb-6">Search for Ski Resorts</h2>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter resort name"
            className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleSearch}
            className="ml-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading resort details...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : resorts.length > 0 ? (
          <ul className="list-none p-0">
            {resorts.map((resort, index) => (
              <SingleResort key={index} resort={resort} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No resort found. Try a different search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchSkiResorts;
