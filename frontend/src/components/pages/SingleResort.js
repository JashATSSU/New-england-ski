import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SingleResort.css';
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
      // Fetch resort details from your backend
      const resortResponse = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resortview/${resort.slug}`);
      setResortDetails(resortResponse.data);

      // Fetch forecast from your backend (assuming you have a similar endpoint for forecasts)
      const forecastResponse = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resortview/${resort.slug}/forecast`);
      setForecast(forecastResponse.data);

      // Fetch hourly forecast from your backend (assuming you have a similar endpoint for hourly forecasts)
      const hourlyResponse = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resortview/${resort.slug}/hourly`);
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

  // Find the selected resort's motto and description
  const selectedResort = resortsList.find(r => r.name === resort.name);

  return (
    <div className="resort-details">
      <h3>{resort.name}</h3>
      <p>{selectedResort?.description || 'No description available.'}</p>
      <p><em>{selectedResort?.motto || 'No motto available.'}</em></p>

      <h4>Lift Status</h4>
      <p>{lifts ? `Open: ${lifts.stats.open}, Closed: ${lifts.stats.closed}` : 'No lift status available'}</p>

      {/* Five Day Forecast */}
      {forecast && forecast.forecast5Day && forecast.forecast5Day.length > 0 ? (
        <div>
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

          {/* Display additional summaries */}
          <div className="additional-summaries">
            <h4>3-Day Summary</h4>
            <p>{forecast.summary3Day}</p>

            <h4>Summary for Days 4-6</h4>
            <p>{forecast.summaryDays4To6}</p>
          </div>
        </div>
      ) : (
        <p>No 5-day forecast available.</p>
      )}

      {/* Hourly Forecast */}
      {hourlyForecast && hourlyForecast.forecast && hourlyForecast.forecast.length > 0 ? (
        <div>
          <h4>Hourly Forecast</h4>
          <div className="hourly-forecast">
            {hourlyForecast.forecast.map((hour, index) => (
              <div key={index} className="hourly-item">
                <p><strong>{hour.time}:</strong> {hour.summary} | Temp: {hour.maxTemp} | Wind: {hour.windSpeed} {hour.windDirection}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No hourly forecast available for this resort.</p>
      )}

      <a href={resort.href} target="_blank" rel="noopener noreferrer">
        Explore More at the Ski Resort!
      </a>
    </div>
  );
};

export default SingleResort;
