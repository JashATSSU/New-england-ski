const mapWeatherConditionToIcon = (condition) => {
    if (condition.includes('clear')) return 'wi wi-day-sunny'; // Clear day
    if (condition.includes('cloud') && condition.includes('rain')) return 'wi wi-rain'; // Rainy day
    if (condition.includes('cloud')) return 'wi wi-cloudy'; // Cloudy day
    if (condition.includes('snow')) return 'wi wi-snow'; // Snowy day
    if (condition.includes('fog')) return 'wi wi-fog'; // Foggy day
    if (condition.includes('thunderstorm')) return 'wi wi-thunderstorm'; // Thunderstorm
    if (condition.includes('haze')) return 'wi wi-day-haze'; // Hazy
    if (condition.includes('partly cloudy')) return 'wi wi-day-cloudy'; // Partly cloudy day
    if (condition.includes('partly sunny')) return 'wi wi-day-cloudy'; // Partly sunny day
    if (condition.includes('showers')) return 'wi wi-showers'; // Showers
    if (condition.includes('rain')) return 'wi wi-rain'; // Rain
    return 'wi wi-na'; // Default icon for unknown conditions
  };
  
  export default mapWeatherConditionToIcon;
  