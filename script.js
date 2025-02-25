let BASE_URL = `https://wttr.in/`;
const form = document.querySelector("form");
const results = document.querySelector(".results");
const article1 = document.getElementById("article1");
const article2 = document.getElementById("article2");
const article3 = document.getElementById("article3");
const sectionContent = document.getElementById("choose-location");
const newParagraph = document.createElement("p");
const sideBarList = document.querySelector(".search-list");
const temperatureUnitF = "°F";
const hidden = document.querySelectorAll(".hidden");
const locationSearch = document.getElementById("location");
const conversionForm = document.querySelector(".conversion");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelectorAll(".results img").forEach((item) => {
    item.remove();
  });
  const { location } = event.target;
  getlocation(location.value);
  hidden.forEach((item) => item.remove());
});

//created a helper function for my form to have a dynamic URL
function getlocation(input) {
  fetch(`${BASE_URL}${input}?format=j1`)
    .then((Response) => Response.json())
    .then((data) => {
      currentWeather(data);
      weatherForecast(data);
      weatherConditions(data);
      previousSearches(data, input);
      locationSearch.value = "";
    })
    .catch((error) => {
      console.log(error);
    });
}

//Creating HTML elements from the API data to be displayed on the webpage. These are the main weather results for the location input
/**
 * This function populates the webpage with current weather information.
 * @param {object} data - represents the weather API data 
 */

function currentWeather(data) {
  document.querySelectorAll(".firstHeading").forEach((item) => item.remove());
  results.append(weatherConditions(data));

  let areaName = document.createElement("h2");
  areaName.setAttribute("class", "firstHeading");
  areaName.innerHTML = `<strong>${locationSearch.value}</strong>`;
  results.append(areaName);

  let regionName = document.createElement("p");
  regionName.setAttribute("class", "firstHeading");
  regionName.innerHTML = `<strong>Region:</strong> ${data.nearest_area[0].region[0].value}`;
  results.append(regionName);

  let countryName = document.createElement("p");
  countryName.setAttribute("class", "firstHeading");
  countryName.innerHTML = `<strong>Country:</strong> ${data.nearest_area[0].country[0].value}`;
  results.append(countryName);

  let currentTemperatureF = document.createElement("p");
  currentTemperatureF.setAttribute("class", "firstHeading");
  currentTemperatureF.innerHTML = `<strong>Currently Feels Like:</strong> ${data.current_condition[0].FeelsLikeF} ${temperatureUnitF}`;
  results.append(currentTemperatureF);

  let area = document.createElement("p");
  area.setAttribute("class", "firstHeading");
  if (locationSearch.value === data.nearest_area[0].areaName[0].value) {
    area.innerHTML = `<strong>Area:</strong>${locationSearch.value}`;
    results.append(area);
  } else {
    let nearestArea = document.createElement("p");
    nearestArea.setAttribute("class", "firstHeading");
    nearestArea.innerHTML = `<strong>Nearest Area:</strong>${data.nearest_area[0].areaName[0].value}`;
    results.append(nearestArea);
  }
}

//Creating HTML elements from the API data to be displayed on the webpage. These are the 3 day forcast results based off the users location input
/**
 * This function populates the webpage with todays, tomorrows, and day after tomorrows weather information.
 * @param {object} data - represents the weather API data 
 */
function weatherForecast(data) {
  //defined 3 separate objects that represent average, max, and min temparature for each day on the forecast.
  const todaysWeather = {
    "Average Temp": `${data.weather[0].avgtempF}`,
    "Max Temp": `${data.weather[0].maxtempF}`,
    "Min Temp": `${data.weather[0].mintempF}`,
  };

  const tomorrowsWeather = {
    "Average Temp": `${data.weather[1].avgtempF}`,
    "Max Temp": `${data.weather[1].maxtempF}`,
    "Min Temp": `${data.weather[1].mintempF}`,
  };

  const dayAfterTomorrowsWeather = {
    "Average Temp": `${data.weather[2].avgtempF}`,
    "Max Temp": `${data.weather[2].maxtempF}`,
    "Min Temp": `${data.weather[2].mintempF}`,
  };

  document.querySelector("#article1").innerHTML = "<h3>Today</h3>";
  document.querySelector("#article2").innerHTML = "<h3>Tomorrow</h3>";
  document.querySelector("#article3").innerHTML = "<h3>Day After Tomorrow</h3>";

  //loop through each object and append each (key:value) pair inside its own article. 
  for (const property in todaysWeather) {
    article1.append(
      `${property}: ${todaysWeather[property]} ${temperatureUnitF} `
    );
    const newBreak = document.createElement("br");
    article1.append(newBreak);
  }
  for (const property in tomorrowsWeather) {
    article2.append(
      `${property}: ${tomorrowsWeather[property]} ${temperatureUnitF}`
    );
    const newBreak = document.createElement("br");
    article2.append(newBreak);
  }
  for (const property in dayAfterTomorrowsWeather) {
    article3.append(
      `${property}: ${dayAfterTomorrowsWeather[property]} ${temperatureUnitF}`
    );
    const newBreak = document.createElement("br");
    article3.append(newBreak);
  }
}

//Creating previous searches list to be displayed on right side of the webpage. 
//This section holds each previously searched location in a list.
/**
 * This function populates the webpage with previously searched locations.
 * @param {object} data - represents the weather API data 
 * @param {string} input - location name
 */

function previousSearches(data, input) {
  let listItem = document.createElement("li");
  let anchorTag = document.createElement("a");
  let currentTemperatureF = ` - ${data.current_condition[0].FeelsLikeF} ${temperatureUnitF}`;

  anchorTag.href = "";
  anchorTag.textContent = `${input}`;
  listItem.append(anchorTag, currentTemperatureF);
  sideBarList.append(listItem);

  anchorTag.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelectorAll(".results img").forEach((item) => {
      item.remove();
    });
    fetch(`${BASE_URL}${input}?format=j1`)
      .then((Response) => Response.json())
      .then((data) => {
        currentWeather(data);
        weatherForecast(data);
        weatherConditions(data);
        input = "";
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

/**
 * This function populates the webpage with a specific weather icon. 
 * The specific weather icon that is chosen is determined from the current weather conditions provided by the API.
 * @param {object} data - represents the weather API data 
 * @returns {string} icon - The image source URL.
 */
function weatherConditions(object) {
  document
    .querySelectorAll(".secondHeading")
    .forEach((item) => (item.textContent = ""));

  let chanceOfSunshine = object.weather[0].hourly[0].chanceofsunshine;
  let chanceOfSunshineParagraph = document.createElement("p");

  chanceOfSunshineParagraph.setAttribute("class", "secondHeading");
  chanceOfSunshineParagraph.innerHTML = `<strong>Chance of Sunshine:</strong>${chanceOfSunshine}`;
  results.append(chanceOfSunshineParagraph);

  let chanceOfRain = object.weather[0].hourly[0].chanceofrain;
  let chanceOfRainParagraph = document.createElement("p");

  chanceOfRainParagraph.setAttribute("class", "secondHeading");
  chanceOfRainParagraph.innerHTML = `<strong>Chance of Rain:</strong>${chanceOfRain}`;
  results.append(chanceOfRainParagraph);

  let chanceOfSnow = object.weather[0].hourly[0].chanceofsnow;
  let chanceOfSnowParagraph = document.createElement("p");

  chanceOfSnowParagraph.setAttribute("class", "secondHeading");
  chanceOfSnowParagraph.innerHTML = `<strong>Chance of Snow:</strong>${chanceOfSnow}`;
  results.append(chanceOfSnowParagraph);

  let icon = document.createElement("img");
  icon.id = "weatherIcon";
  if (chanceOfSunshine > 50) {
    icon.setAttribute("alt", "sun");
    icon.src = "./assets/icons8-summer.gif";
  } else if (chanceOfRain > 50) {
    icon.setAttribute("alt", "rain");
    icon.src = "./assets/icons8-torrential-rain.gif";
  } else if (chanceOfSnow > 50) {
    icon.setAttribute("alt", "snow");
    icon.src = "./assets/icons8-light-snow.gif";
  }
  return icon;
}

// This event listener represents the conversion form on the left side of the webpage.
// It converts a number from Celcius to Farenheit and vice versa once the convert button is submitted. 
conversionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let result = document.querySelector("#result");
  let convertC = document.getElementById("to-c");
  let convertF = document.getElementById("to-f");
  let inputNumber = document.querySelector("#temp-to-convert");

  if (convertC.checked) {
    let number = ((5 / 9) * (inputNumber.value - 32)).toFixed(2);
    result.textContent = number + "°C";
  } else if (convertF.checked) {
    let number = ((9 / 5) * inputNumber.value + 32).toFixed(2);
    result.textContent = number + "°F";
  }
});
