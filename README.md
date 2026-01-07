# Weather CLI 🌤️

A tiny Node.js CLI that fetches current weather for a city using OpenWeatherMap API.

## Requirements

- Node.js (>= 16)
- An OpenWeatherMap API key (https://openweathermap.org/api)

## Setup 🔧

1. Copy `.env.example` to `.env` and set your API key:

```
OPENWEATHERMAP_API_KEY=your_api_key_here
```

2. Install dependencies:

```
npm install
```

## Usage ✅

Run directly with npm:

```
npm start -- "New York"
```

Or (after installing globally) use the `weather` command:

```
weather "San Francisco"
```

Example output:

```
San Francisco, US — clear sky
Temperature: 12 °C (feels like 11 °C)
Humidity: 71%
Wind speed: 3.6 m/s
```

## Notes

- The CLI reads the `OPENWEATHERMAP_API_KEY` environment variable from your environment or from a `.env` file.
- If a city is not found, the CLI exits with an error message.

Enjoy! ✨
