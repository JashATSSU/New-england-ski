import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SingleResort = ({ resort }) => { 
  const [resortDetails, setResortDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResortDetails = async () => {
    setLoading(true);
    const options = {
      method: 'GET',
      url: `https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${resort.slug}`, // Use the correct endpoint
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.REACT_APP_RAPIDAPI_HOST,
      },
    };

    try {
      const response = await axios.request(options);
      setResortDetails(response.data); // Save the detailed resort data
    } catch (error) {
      console.error('Error fetching resort details:', error);
      setError('Failed to fetch resort details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResortDetails();
  }, [resort.slug]);

  if (loading) return <p>Loading resort details...</p>;
  if (error) return <p>{error}</p>;
  if (!resortDetails) return <p>No details available</p>;

  const { lifts, weather, conditions } = resortDetails;

  return (
    <li>
      <h3>{resort.name}</h3>
      <p>{resort.description || 'No description available.'}</p>
      <h4>Lift Status</h4>
      <p>{lifts || 'No lift status available'}</p>
      <h4>Weather</h4>
      <p>{weather || 'No weather data available'}</p>
      <h4>Conditions</h4>
      <p>{conditions || 'No conditions available'}</p>
    </li>
  );
};

export default SingleResort;
