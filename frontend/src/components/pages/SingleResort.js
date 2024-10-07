import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
      const resortResponse = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resortview/${resort.slug}`);
      setResortDetails(resortResponse.data);

      const forecastResponse = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resortview/${resort.slug}/forecast`);
      setForecast(forecastResponse.data);

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

  if (loading) return <p className="text-center">Loading resort details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!resortDetails) return <p className="text-center">No details available</p>;

  const { lifts } = resortDetails.data;
  const selectedResort = resortsList.find(r => r.name === resort.name);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-3xl font-bold text-center">{resort.name}</h3>
        <p className="text-lg text-center">{selectedResort?.description || 'No description available.'}</p>
        <p className="text-center italic">{selectedResort?.motto || 'No motto available.'}</p>
        
        {/* Lift Status Section */}
        <div className="my-4 p-2 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h4 className="text-xl font-semibold">Lift Status</h4>
          <p className="text-lg">{lifts ? `Open: ${lifts.stats.open}, Closed: ${lifts.stats.closed}` : 'No lift status available'}</p>
        </div>

        {/* 5 Day Forecast Section */}
        <div className="my-4 p-2 border-2 border-green-500 rounded-lg bg-green-50">
          <h4 className="text-xl font-semibold">Five Day Forecast</h4>
          {forecast && forecast.forecast5Day ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {forecast.forecast5Day.map((day, index) => (
                <div key={index} className="bg-white p-2 rounded-lg shadow-md">
                  <h5 className="text-lg font-medium">{day.dayOfWeek}</h5>
                  <div className="forecast-details">
                    <p><strong>AM:</strong> {day.am.summary} | Max Temp: {day.am.maxTemp} | Min Temp: {day.am.minTemp}</p>
                    <p><strong>PM:</strong> {day.pm.summary} | Max Temp: {day.pm.maxTemp} | Min Temp: {day.pm.minTemp}</p>
                    <p><strong>Night:</strong> {day.night.summary} | Max Temp: {day.night.maxTemp} | Min Temp: {day.night.minTemp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No forecast data available</p>
          )}
          <div className="mt-2">
            <h4 className="text-lg font-semibold">3-Day Summary</h4>
            <p>{forecast.summary3Day}</p>

            <h4 className="text-lg font-semibold">Summary for Days 4-6</h4>
            <p>{forecast.summaryDays4To6}</p>
          </div>
        </div>

        {/* Hourly Forecast Section */}
        <div className="my-4 p-2 border-2 border-yellow-500 rounded-lg bg-yellow-50">
          <h4 className="text-xl font-semibold">Hourly Forecast</h4>
          {hourlyForecast && hourlyForecast.forecast ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {hourlyForecast.forecast.map((hour, index) => (
                <div key={index} className="bg-white p-2 rounded-lg shadow-md">
                  <p><strong>{hour.time}:</strong> {hour.summary} | Temp: {hour.maxTemp} | Wind: {hour.windSpeed} {hour.windDirection}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hourly forecast data available</p>
          )}
        </div>

        <div className="text-center">
          <a href={resort.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
            Explore More at the Ski Resort!
          </a>
        </div>
      </div>
    </div>
  );
};

export default SingleResort;
