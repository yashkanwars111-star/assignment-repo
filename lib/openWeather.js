const axios = require('axios');

/**
 * Fetch current weather for a city from OpenWeatherMap.
 * @param {string} city - City name (e.g., "London", "San Francisco").
 * @param {Object} [opts]
 * @param {string} [opts.apiKey] - OpenWeatherMap API key (defaults to process.env.OPENWEATHERMAP_API_KEY)
 * @param {string} [opts.units] - Units to request ("metric" or "imperial"), default "metric"
 * @param {number} [opts.timeout] - Axios timeout in ms (default 10000)
 * @returns {Promise<Object>} Parsed weather object: { name, country, temp, feels_like, description, humidity, wind }
 * @throws {Error} Throws if city not found or on network/error responses
 */
async function fetchWeather(city, opts = {}) {
  if (!city || typeof city !== 'string') throw new TypeError('city must be a non-empty string');
  const apiKey = opts.apiKey || process.env.OPENWEATHERMAP_API_KEY;
  const units = opts.units || 'metric';
  const timeout = typeof opts.timeout === 'number' ? opts.timeout : 10000;
  const retries = typeof opts.retries === 'number' ? opts.retries : 2;

  if (!apiKey) {
    const e = new Error('OPENWEATHERMAP_API_KEY is required (pass as opts.apiKey or set process.env.OPENWEATHERMAP_API_KEY)');
    e.code = 'MISSING_API_KEY';
    throw e;
  }

  const url = 'https://api.openweathermap.org/data/2.5/weather';

  let attempt = 0;
  while (true) {
    try {
      const res = await axios.get(url, {
        timeout,
        params: {
          q: city,
          appid: apiKey,
          units,
        },
      });

      const d = res.data;
      return {
        name: d.name || null,
        country: d.sys && d.sys.country ? d.sys.country : null,
        temp: d.main && typeof d.main.temp !== 'undefined' ? d.main.temp : null,
        feels_like: d.main && typeof d.main.feels_like !== 'undefined' ? d.main.feels_like : null,
        description: d.weather && d.weather[0] ? d.weather[0].description : null,
        humidity: d.main && typeof d.main.humidity !== 'undefined' ? d.main.humidity : null,
        wind: d.wind && typeof d.wind.speed !== 'undefined' ? d.wind.speed : null,
        raw: d,
      };
    } catch (err) {
      attempt++;
      // HTTP error responses
      if (err.response) {
        if (err.response.status === 404) {
          const e = new Error('City not found');
          e.code = 'CITY_NOT_FOUND';
          throw e;
        }

        // Retry on server errors (5xx)
        if (err.response.status >= 500 && attempt <= retries) {
          const backoff = 200 * Math.pow(2, attempt);
          await new Promise(r => setTimeout(r, backoff));
          continue;
        }

        const e = new Error(`OpenWeatherMap API error: ${err.response.status} ${err.response.statusText}`);
        e.code = 'API_ERROR';
        e.status = err.response.status;
        throw e;
      }

      // Network or timeout errors (no response)
      const netCode = err.code === 'ECONNABORTED' ? 'TIMEOUT' : 'NETWORK_ERROR';

      if (attempt <= retries) {
        const backoff = 200 * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, backoff));
        continue;
      }

      const e = new Error(err.message || 'Network error');
      e.code = netCode;
      throw e;
    }
  }
}

module.exports = { fetchWeather };
