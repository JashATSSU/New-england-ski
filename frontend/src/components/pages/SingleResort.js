import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SingleResort = ({ resort }) => {
  const [resortDetails, setResortDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResortDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${resort.slug}`, {
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
        },
      });

      console.log('Resort Details:', response.data);
      setResortDetails(response.data);
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
      <p>
        {lifts ? `Open: ${lifts.stats.open}, Closed: ${lifts.stats.closed}` : 'No lift status available'}
      </p>
      <h4>Weather</h4>
      <p>{weather || 'No weather data available'}</p>
      <h4>Conditions</h4>
      <p>{conditions || 'No conditions available'}</p>
      <a href={resort.href} target="_blank" rel="noopener noreferrer">More Details</a>
    </li>
  );
};

export default SingleResort;
