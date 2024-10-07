import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { resortsList } from './resortsData'; // Import the resorts list
import { WiDaySunny, WiRain, WiSnow, WiCloudy, WiStrongWind } from 'react-icons/wi'; // Weather icons

const weatherIcons = {
  sunny: <WiDaySunny className="w-6 h-6 text-yellow-500" />,
  rain: <WiRain className="w-6 h-6 text-blue-500" />,
  snow: <WiSnow className="w-6 h-6 text-white" />,
  cloudy: <WiCloudy className="w-6 h-6 text-gray-500" />,
  wind: <WiStrongWind className="w-6 h-6 text-gray-600" />,
};

const SingleResort = ({ resort }) => {
  const [resortDetails, setResortDetails] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResortDetails = async () => {
    setError(null);
    
    try {
      const [resortResponse, forecastResponse, hourlyResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resortview/${resort.slug}`),
        axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resortview/${resort.slug}/forecast`),
        axios.get(`${process.env.REACT_APP_BACKEND_SERVER_URI}/api/resortview/${resort.slug}/hourly`)
      ]);

      setResortDetails(resortResponse.data);
      setForecast(forecastResponse.data);
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

  if (loading) return (
    <div className="text-center">
      <div className="loader"></div> {/* Custom Loader */}
      <p>Loading resort details...</p>
    </div>
  );
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!resortDetails) return <p className="text-center">No details available</p>;

  const { lifts } = resortDetails.data;
  const selectedResort = resortsList.find(r => r.name === resort.name);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-8">
        {/* Navigation Buttons */}
        <div className="flex justify-around mb-4">
          <button onClick={() => document.getElementById('lift-status').scrollIntoView({ behavior: 'smooth' })} className="bg-blue-600 text-white rounded px-4 py-2">Lift Status</button>
          <button onClick={() => document.getElementById('five-day-forecast').scrollIntoView({ behavior: 'smooth' })} className="bg-green-600 text-white rounded px-4 py-2">Five Day Forecast</button>
          <button onClick={() => document.getElementById('hourly-forecast').scrollIntoView({ behavior: 'smooth' })} className="bg-yellow-600 text-white rounded px-4 py-2">Hourly Forecast</button>
          <button onClick={() => document.getElementById('summary').scrollIntoView({ behavior: 'smooth' })} className="bg-purple-600 text-white rounded px-4 py-2">Summary</button>
        </div>

        <h3 className="text-4xl font-bold text-center text-blue-600 mb-2">{resort.name}</h3>
        <p className="text-lg text-center text-gray-700">{selectedResort?.description || 'No description available.'}</p>
        <p className="text-center italic text-gray-500">{selectedResort?.motto || 'No motto available.'}</p>

        {/* Lift Status Section */}
        <section id="lift-status" className="my-6 p-4 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h4 className="text-2xl font-semibold text-blue-800">Lift Status</h4>
          <p className="text-lg">{lifts ? `Open: ${lifts.stats.open}, Closed: ${lifts.stats.closed}` : 'No lift status available'}</p>
        </section>

        {/* 5 Day Forecast Section */}
        <section id="five-day-forecast" className="my-6 p-4 border-2 border-green-500 rounded-lg bg-green-50">
          <h4 className="text-2xl font-semibold text-green-800">Five Day Forecast</h4>
          {forecast && forecast.forecast5Day ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {forecast.forecast5Day.map((day, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                  <h5 className="text-lg font-medium">{day.dayOfWeek}</h5>
                  <div className="flex items-center">
                    {weatherIcons[day.am.summary.toLowerCase()]} {/* Weather icon */}
                    <p className="ml-2">
                      <strong>AM:</strong> {day.am.summary} | Max: {day.am.maxTemp}° | Min: {day.am.minTemp}°
                    </p>
                  </div>
                  <div className="flex items-center">
                    {weatherIcons[day.pm.summary.toLowerCase()]} {/* Weather icon */}
                    <p className="ml-2">
                      <strong>PM:</strong> {day.pm.summary} | Max: {day.pm.maxTemp}° | Min: {day.pm.minTemp}°
                    </p>
                  </div>
                  <div className="flex items-center">
                    {weatherIcons[day.night.summary.toLowerCase()]} {/* Weather icon */}
                    <p className="ml-2">
                      <strong>Night:</strong> {day.night.summary} | Max: {day.night.maxTemp}° | Min: {day.night.minTemp}°
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No forecast data available</p>
          )}
        </section>

        {/* Hourly Forecast Section */}
        <section id="hourly-forecast" className="my-6 p-4 border-2 border-yellow-500 rounded-lg bg-yellow-50">
          <h4 className="text-2xl font-semibold text-yellow-800">Hourly Forecast</h4>
          {hourlyForecast && hourlyForecast.forecast ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hourlyForecast.forecast.map((hour, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                  <p className="flex-1">
                    <strong>{hour.time}:</strong> {hour.summary} | Temp: {hour.maxTemp}° | Wind: {hour.windSpeed} {hour.windDirection}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hourly forecast data available</p>
          )}
        </section>

        {/* Summary Section */}
        <section id="summary" className="my-6 p-4 border-2 border-purple-500 rounded-lg bg-purple-50">
          <h4 className="text-2xl font-semibold text-purple-800">Summary</h4>
          <h4 className="text-lg font-semibold">3-Day Summary</h4>
          <p>{forecast.summary3Day || 'No summary available.'}</p>

          <h4 className="text-lg font-semibold">Summary for Days 4-6</h4>
          <p>{forecast.summaryDays4To6 || 'No summary available.'}</p>
        </section>

        <div className="text-center mt-6">
          <a 
            href={resort.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800 transition duration-300 text-lg"
          >
            Explore More at the Ski Resort!
          </a>
        </div>

        {/* Back to Top Button */}
        <div className="text-center mt-4">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-gray-800 text-white rounded px-4 py-2">Back to Top</button>
        </div>
      </div>
    </div>
  );
};

export default SingleResort;
