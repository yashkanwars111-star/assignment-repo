const chalk = require('chalk');

function emojiFor(desc = '') {
  const d = desc.toLowerCase();
  if (d.includes('clear')) return '☀️';
  if (d.includes('cloud')) return '☁️';
  if (d.includes('rain')) return '🌧️';
  if (d.includes('drizzle')) return '🌦️';
  if (d.includes('thunder')) return '⛈️';
  if (d.includes('snow')) return '❄️';
  if (d.includes('mist') || d.includes('fog') || d.includes('haze')) return '🌫️';
  return '🔍';
}

/**
 * Build a pretty, colored string for terminal output.
 * @param {Object} w - weather object returned by fetchWeather
 * @returns {string}
 */
function prettyPrintWeather(w) {
  const cityLine = `${chalk.bold.cyan(`${w.name}${w.country ? ', ' + w.country : ''}`)} ${chalk.dim('—')} ${chalk.yellow.bold(`${w.description || 'N/A'} ${emojiFor(w.description || '')}`)}`;

  const tempLine = `${chalk.bold('Temperature:')} ${chalk.magenta(`${w.temp} °C`)} ${chalk.dim(`(feels like ${w.feels_like} °C)`)}`;
  const humidityLine = `${chalk.bold('Humidity:')} ${chalk.blue(`${w.humidity}%`)}`;
  const windLine = `${chalk.bold('Wind speed:')} ${chalk.green(`${w.wind} m/s`)}`;

  const lines = [cityLine, tempLine, humidityLine, windLine];
  return lines.join('\n');
}

module.exports = { prettyPrintWeather };
