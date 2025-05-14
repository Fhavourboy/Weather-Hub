const API_KEY = '235036b15f3d433da63102807251305';
const citySearch = document.getElementById('city-search');
const searchButton = document.getElementById('search-button');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const currentTemperature = document.getElementById('current-temperature');
const weatherIcon = document.getElementById('weather-icon');
const weatherCondition = document.getElementById('weather-condition');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const forecastContainer = document.getElementById('forecast-container');
searchButton.addEventListener('click', () => {
  const city = citySearch.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

citySearch.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = citySearch.value.trim();
    if (city) {
      getWeatherData(city);
    }
  }
});
function formatDate(dateString) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}
function getDayName(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' });
}
async function getWeatherData(city) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=no&alerts=no`);
    
    if (!response.ok) {
      throw new Error('City not found');
    }
    
    const data = await response.json();
    displayCurrentWeather(data);
    displayForecast(data);
  } catch (error) {
    alert(error.message);
  }
}
function displayCurrentWeather(data) {
  const current = data.current;
  const location = data.location;
  
  cityName.textContent = `${location.name}, ${location.country}`;
  currentDate.textContent = formatDate(location.localtime);
  currentTemperature.textContent = Math.round(current.temp_c);
  weatherIcon.src = current.condition.icon;
  weatherCondition.textContent = current.condition.text;
  feelsLike.textContent = Math.round(current.feelslike_c);
  humidity.textContent = current.humidity;
  windSpeed.textContent = current.wind_kph;
}
function displayForecast(data) {
  forecastContainer.innerHTML = '';
  
  data.forecast.forecastday.forEach(day => {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');
    
    const dayDate = new Date(day.date);
    const dayName = getDayName(day.date);
    const formattedDate = dayDate.getDate() + '/' + (dayDate.getMonth() + 1);
    
    forecastCard.innerHTML = `
      <div class="forecast-date">
        <div>${dayName}</div>
        <div>${formattedDate}</div>
      </div>
      <div class="forecast-icon">
        <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
      </div>
      <div class="forecast-temp">
        <span class="max">${Math.round(day.day.maxtemp_c)}°</span>
        <span class="min">${Math.round(day.day.mintemp_c)}°</span>
      </div>
      ${day.day.daily_chance_of_rain > 0 ? `<div class="forecast-rain">${day.day.daily_chance_of_rain}% chance</div>` : ''}
    `;
    
    forecastContainer.appendChild(forecastCard);
  });
}
window.addEventListener('load', () => {
  getWeatherData('Calabar');
});
