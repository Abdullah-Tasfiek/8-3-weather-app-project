let BASE_URL = `https://wttr.in/`;
const form = document.querySelector("form");
const results = document.querySelector(".results");
const article1 = document.getElementById("article1");
const article2 = document.getElementById("article2");
const article3 = document.getElementById("article3");
const sectionContent = document.getElementById("#choose-location");
const newParagraph = document.createElement("p");
const sideBarList = document.querySelector(".search-list");
const temperatureUnitF = "°F";
const hidden = document.querySelectorAll(".hidden");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const { location } = event.target;
  getlocation(location.value);
  hidden.forEach((item) => item.remove());
});

//created a helper function for my form to make a dynamic URL
function getlocation(input) {
  fetch(`${BASE_URL}${input}?format=j1`)
    .then((Response) => Response.json())
    .then((data) => {
      currentWeather(data);
      weatherForecast(data);
      previousSearches(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

//creating HTML elements for the API data to be displayed on the webpage. These are the main weather results for the location input
function currentWeather(data) {
  document
    .querySelectorAll(".firstHeading")
    .forEach((item) => (item.textContent = ""));

  let areaName = document.createElement("h2");
  areaName.setAttribute("class", "firstHeading");
  areaName.innerHTML = `<strong>${data.nearest_area[0].areaName[0].value}</strong>`;
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
}

function weatherForecast(data) {
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

  document.querySelector("#article1").innerHTML = "<h2>Today</h2>";
  document.querySelector("#article2").innerHTML = "<h2>Tomorrow</h2>";
  document.querySelector("#article3").innerHTML = "<h2>Day After Tomorrow</h2>";

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

function previousSearches(data) {
  let listItem = document.createElement("li");
  let inputLocation = data.nearest_area[0].areaName[0].value;
  let currentTemperatureF = data.current_condition[0].FeelsLikeF;

  listItem.innerHTML = `<a href="">${inputLocation}</a>`;
  `${sideBarList.append(listItem)} ${sideBarList.append(
    currentTemperatureF
  )} ${sideBarList.append(temperatureUnitF)}`;
}