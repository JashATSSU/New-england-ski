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
        const response = await axios.get(`/api/resortview/${name}`);
        console.log("Full Resort Data:", response.data); // Log the full response to inspect the structure
        setResortData(response.data); // Set the resort data
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

  // Replace these keys with the actual keys from the API response
  const { lifts, weather, conditions } = resortData;

  return (
    <div>
      <h1>Resort Details for {name}</h1>
      <h2>Lift Status</h2>
      <p>{lifts || 'No lift status available'}</p>

      <h2>Weather</h2>
      <p>{weather || 'No weather data available'}</p>

      <h2>Snow Conditions</h2>
      <p>{conditions || 'No snow conditions available'}</p>
    </div>
  );
};

export default ResortDetails;
