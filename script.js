const form = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const searchButton = document.querySelector('#search-button');
const loading = document.querySelector('#loading');
const errorMessage = document.querySelector('#error');
const weatherCard = document.querySelector('#weather-card');

// Open-Meteo's weather codes: https://open-meteo.com/en/docs
function weatherDetails(code) {
  if (code === 0) return { description: 'Clear sky', icon: '☀️' };
  if (code <= 2) return { description: 'Partly cloudy', icon: '🌤️' };
  if (code === 3) return { description: 'Cloudy', icon: '☁️' };
  if (code <= 48) return { description: 'Foggy', icon: '🌫️' };
  if (code <= 57) return { description: 'Drizzle', icon: '🌦️' };
  if (code <= 67) return { description: 'Rainy', icon: '🌧️' };
  if (code <= 77) return { description: 'Snowy', icon: '❄️' };
  if (code <= 82) return { description: 'Rain showers', icon: '🌦️' };
  if (code <= 86) return { description: 'Snow showers', icon: '🌨️' };
  if (code >= 95) return { description: 'Thunderstorm', icon: '⛈️' };
  return { description: 'Current conditions', icon: '🌤️' };
}

// Both network requests use async/await and explicit HTTP error handling.
async function getJson(url) {
  const response = await fetch(url);
  if (response.status === 429) {
    throw new Error('Too many requests. Please wait and try again.');
  }
  if (!response.ok) {
    throw new Error('Weather service is unavailable. Please try again later.');
  }
  return await response.json();
}

async function searchWeather(city) {
  loading.hidden = false;
  errorMessage.hidden = true;
  weatherCard.hidden = true;
  searchButton.disabled = true;

  try {
    if (!city) throw new Error('Please enter a city name.');

    // Find the city's latitude and longitude first.
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const locationData = await getJson(geoUrl);
    if (!locationData.results || locationData.results.length === 0) {
      throw new Error('City not found. Please check the spelling and try again.');
    }

    const place = locationData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;
    const weatherData = await getJson(weatherUrl);
    const current = weatherData.current;
    if (!current || typeof current.temperature_2m !== 'number') {
      throw new Error('Weather data is unavailable for this city.');
    }

    const details = weatherDetails(current.weather_code);
    document.querySelector('#city-name').textContent = `${place.name}, ${place.country}`;
    document.querySelector('#temperature').textContent = Math.round(current.temperature_2m);
    document.querySelector('#description').textContent = details.description;
    document.querySelector('#weather-icon').textContent = details.icon;
    document.querySelector('#weather-icon').setAttribute('aria-label', details.description);
    document.querySelector('#feels-like').textContent = `${Math.round(current.apparent_temperature)}°C`;
    document.querySelector('#humidity').textContent = `${current.relative_humidity_2m}%`;
    document.querySelector('#wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    weatherCard.hidden = false;
  } catch (error) {
    errorMessage.textContent = error instanceof TypeError
      ? 'Network error. Please check your internet connection and try again.'
      : error.message;
    errorMessage.hidden = false;
  } finally {
    loading.hidden = true;
    searchButton.disabled = false;
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  searchWeather(cityInput.value.trim());
});

// Show weather automatically when the page opens.
searchWeather(cityInput.value.trim());
