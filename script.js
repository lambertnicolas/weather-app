
const button = document.querySelector("#button");


//Appel de l'API
async function openWeather() {
    const inputCity = document.querySelector("input").value;
    //Current weather
    let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=metric&lang=fr&appid=dca94a662c37a21638d24f844a65bd9f`);
    let result = await response.json();
    let array = Object.values(result);
    
    //Forecast
    let responseForecast = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&units=metric&lang=fr&appid=dca94a662c37a21638d24f844a65bd9f`);
    let forecastResult = await responseForecast.json();
    let forecastArray = Object.values(forecastResult);
console.log(forecastArray);
    //Weather table
    let arrayWeather = Object.values(array[1]);
    let weatherDescription= arrayWeather[0].description
    let weatherIcon= arrayWeather[0].icon


    //Temperature
    let temperature = array[3].temp
    //Humidité
    let humidity = array[3].humidity;
    //Température ressentie
    let feelsLike = array[3].feels_like;
    //Vitesse du vent
    let speed = array[5].speed;



    //Affichage :
    //Température
    const temperatureDisplay = document.querySelector("#temp");
    temperatureDisplay.innerHTML = Math.round(temperature) + "°c";

    //Description
    const weatherDescriptionDisplay = document.querySelector("#weatherDescription");
    weatherDescriptionDisplay.innerHTML = weatherDescription;

    //image
    const iconDisplay = document.querySelector("#icon");
    iconDisplay.innerHTML = `<img src="src/img/${weatherIcon}.png" alt="${weatherDescription}">`;
    
    //Température ressentie
    const feelLikeDisplay = document.querySelector("#feel_like");
    feelLikeDisplay.innerHTML = `Température ressentie : ${feelsLike}°c`; 

    //Humidité
    const humidityDisplay = document.querySelector("#humidity");
    humidityDisplay.innerHTML = `Humidité : ${humidity}%`; 

    //Vitesse du vent en km/h
    const speedDisplay = document.querySelector("#wind");
    speedDisplay.innerHTML = `Vent : ${Math.round(speed*3.6)} km/h`;
}

//appel de la fonction openWeather
button.addEventListener('click', openWeather);
document.addEventListener('keydown', (event) => {
    if (event.code == "Enter") {
      openWeather();
    }
});


function toLocaleUTCDateString(date, locales, options) {
    const tempsDiff = date.getTimezoneOffset() * 60000;
    const ajustementDate = new Date(date.valueOf() + tempsDiff);
    return ajustementDate.toLocaleDateString(locales, options);
    }
    let cejour = new Date();
    let options = {weekday: "long"};
    let date = toLocaleUTCDateString(cejour, "fr-FR", options);
    let dateheure = date;
    dateheure = dateheure.replace(/(^\w{1})|(\s+\w{1})/g, lettre => lettre.toUpperCase());
    console.log(dateheure.substring(0, 3));
    console.log(Date());

//Afficher la météo de la ville quand on clic sur le bouton ou quand on press -enter-


//Extra :
//Remember the user choice on subsequent visits

//Allow the user to compare the weather in two cities

//Use the API of https://unsplash.com/ to show a photo of the city they entered in the form.

//Display a line graph of temperature over time using a library such as Chart.js

