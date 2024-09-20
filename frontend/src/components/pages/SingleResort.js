import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SingleResort.css'; // Make sure to create this CSS file for styling
import { resortsList } from './resortsData'; // Import the resorts list

const SingleResort = ({ resort }) => {
  const [resortDetails, setResortDetails] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResortDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch lift status
      const resortResponse = await axios.get(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${resort.slug}`, {
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
        },
      });
      setResortDetails(resortResponse.data);

      // Fetch forecast
      const forecastResponse = await axios.get(`https://ski-resort-forecast.p.rapidapi.com/${resort.name}/forecast`, {
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.REACT_APP_RESORT_FORECAST_HOST,
        },
        params: {
          units: 'i',
          el: 'top',
        },
      });
      setForecast(forecastResponse.data);

      // Fetch hourly forecast
      const hourlyResponse = await axios.get(`https://ski-resort-forecast.p.rapidapi.com/${resort.name}/hourly`, {
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
          'X-RapidAPI-Host': process.env.REACT_APP_RESORT_FORECAST_HOST,
        },
        params: {
          units: 'i',
          el: 'top',
          c: false,
        },
      });
      setHourlyForecast(hourlyResponse.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
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

  const { lifts } = resortDetails.data;

  // Find the selected resort's motto
  const selectedResort = resortsList.find(r => r.name === resort.name);

  return (
    <li className="resort">
      <h3>{resort.name}</h3>
      <p>{selectedResort.description || 'No description available.'}</p>
      <p><em>{selectedResort.motto}</em></p> {/* Display the motto */}

      {/* Lift Status */}
      <h4>Lift Status</h4>
      <p>{lifts ? `Open: ${lifts.stats.open}, Closed: ${lifts.stats.closed}` : 'No lift status available'}</p>

      {/* Forecast */}
      <h4>Five Day Forecast</h4>
      <div className="forecast">
        {forecast.forecast5Day.map((day, index) => (
          <div key={index} className="forecast-day">
            <h5>{day.dayOfWeek}</h5>
            <div className="forecast-details">
              <p><strong>AM:</strong> {day.am.summary} | Max Temp: {day.am.maxTemp} | Min Temp: {day.am.minTemp}</p>
              <p><strong>PM:</strong> {day.pm.summary} | Max Temp: {day.pm.maxTemp} | Min Temp: {day.pm.minTemp}</p>
              <p><strong>Night:</strong> {day.night.summary} | Max Temp: {day.night.maxTemp} | Min Temp: {day.night.minTemp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly Forecast */}
      <h4>Hourly Forecast</h4>
      <div className="hourly-forecast">
        {hourlyForecast.forecast.map((hour, index) => (
          <div key={index} className="hourly-item">
            <p><strong>{hour.time}:</strong> {hour.summary} | Temp: {hour.maxTemp} | Wind: {hour.windSpeed} {hour.windDirection}</p>
          </div>
        ))}
      </div>

      <a href={resort.href} target="_blank" rel="noopener noreferrer">
        More Details
      </a>
    </li>
  );
};

export default SingleResort;
