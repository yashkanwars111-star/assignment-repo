#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
  console.log('Usage: weather <city name>');
  console.log('Example: weather "New York"');
  process.exit(0);
}
const city = args.join(' ');
const { fetchWeather } = require('../lib/openWeather');

(async () => {
  try {
    const weather = await fetchWeather(city, { timeout: 10000 });
    const name = `${weather.name}${weather.country ? ', ' + weather.country : ''}`;
    console.log(`${name} — ${weather.description || 'N/A'}`);
    console.log(`Temperature: ${weather.temp} °C (feels like ${weather.feels_like} °C)`);
    console.log(`Humidity: ${weather.humidity}%`);
    console.log(`Wind speed: ${weather.wind} m/s`);
  } catch (err) {
    if (err.code === 'CITY_NOT_FOUND') {
      console.error('City not found. Check spelling and try again.');
      process.exit(2);
    }

    if (err.code === 'MISSING_API_KEY') {
      console.error('Missing API key. Set OPENWEATHERMAP_API_KEY in your environment or .env file.');
      process.exit(4);
    }

    if (err.code === 'TIMEOUT') {
      console.error('Request timed out. Please try again later.');
      process.exit(3);
    }

    if (err.code === 'NETWORK_ERROR') {
      console.error('Network error. Check your internet connection and try again.');
      process.exit(3);
    }

    if (err.code === 'API_ERROR') {
      if (err.status && err.status >= 500) {
        console.error('Weather service is currently unavailable. Please try again later.');
        process.exit(5);
      }
      console.error(`API error ${err.status || ''}: ${err.message}`);
      process.exit(1);
    }

    console.error('Error fetching weather:', err.message);
    process.exit(1);
  }
})();
