// ResortDetails.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResortDetails = () => {
  const { name } = useParams();
  const [resortData, setResortData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResortDetails = async () => {
      try {
        const response = await axios.get('https://ski-resorts-and-conditions.p.rapidapi.com/v1/resorts', {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'ski-resorts-and-conditions.p.rapidapi.com'
          },
          params: { search: name },
        });
        setResortData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResortDetails();
  }, [name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!resortData) return <p>No data found</p>;

  const { liftStatus, weather, snowConditions } = resortData;

  return (
    <div>
      <h1>Resort Details for {name}</h1>
      <h2>Lift Status</h2>
      <p>{liftStatus || 'No lift status available'}</p>

      <h2>Weather</h2>
      <p>{weather || 'No weather data available'}</p>

      <h2>Snow Conditions</h2>
      <p>{snowConditions || 'No snow conditions available'}</p>
    </div>
  );
};

export default ResortDetails;
