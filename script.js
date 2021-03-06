
const button = document.querySelector("#button");
const start = document.querySelector("#start");
const table = document.querySelector("table");


//Appel de l'API
async function openWeather() {
    let city = localStorage.getItem('city');
    start.style.display = "none";
    table.style.display = "revert";

    //-----------------------Partie 1 : météo actuelle-----------------------//
    const inputCity = document.querySelector("input").value;
    localStorage.setItem('city', inputCity);
    //Current weather
    let response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=metric&lang=fr&appid=dca94a662c37a21638d24f844a65bd9f`);
    let result = await response.json();
    let array = Object.values(result);
    
    //Weather table
    let arrayWeather = Object.values(array[1]);
    //Description du temps
    let weatherDescription= arrayWeather[0].description
    //Icône
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
    feelLikeDisplay.innerHTML = `Température ressentie : ${feelsLike.toFixed(1)}°c`; 
    //Humidité
    const humidityDisplay = document.querySelector("#humidity");
    humidityDisplay.innerHTML = `Humidité : ${humidity}%`; 
    //Vitesse du vent en km/h
    const speedDisplay = document.querySelector("#wind");
    speedDisplay.innerHTML = `Vent : ${Math.round(speed*3.6)} km/h`;


    //-----------------------Partie 2 : prévisions pour les 4 prochains jours-----------------------//
    //Forecast
    let responseForecast = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${inputCity}&units=metric&lang=fr&appid=dca94a662c37a21638d24f844a65bd9f`);
    let forecastResult = await responseForecast.json();
    let MainArray = Object.values(forecastResult);   
    let forecastArray = Object.values(MainArray[3]);
    console.log(MainArray);
    //Affichage des jours
    function toLocaleUTCDateString(date, locales, options) {
        const tempsDiff = date.getTimezoneOffset() * 60000;
        const ajustementDate = new Date(date.valueOf() + tempsDiff);
        return ajustementDate.toLocaleDateString(locales, options);
        }
    //Nous récupérons 5 jours de prévisions. Si il est 1h du matin, le 5ème jour n'a que 1h de prévision. On affiche donc les 4 prochains jours.
    for(let i=1; i<=4;i++){
        let cejour = new Date();
        cejour.setDate(cejour.getDate()+i);
        let options = {weekday: "long"};
        let date = toLocaleUTCDateString(cejour, "fr-FR", options);
        let dateheure = date;
        dateheure = dateheure.replace(/(^\w{1})|(\s+\w{1})/g, lettre => lettre.toUpperCase());
        const forecastSection = document.querySelector("#forecast");
        let newDiv = document.createElement("div");
        let day = document.createElement("h3");
        newDiv.classList.add(`day${i}`);
        let jour = dateheure.substring(0, 3);
        day.textContent = jour;
        newDiv.appendChild(day);
        forecastSection.appendChild(newDiv);

        //Affichage des prévisions dans le tableau
        const dayDisplay = document.querySelector(`#day${i}`);
        dayDisplay.appendChild(day);
    }

    //Affichage Forecast
    //Définir demain à 0h00
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    //demain 2h00 pour gmt+2
    console.log(array);
    tomorrow.setHours(2,0,0,0)
    //msTomorrow = millisecondes du jour suivant à 0h00
    let msTomorrow = Date.parse(tomorrow);
    //Millisecondes/jour
    let msDay = 86400000;
    //Le jour d'après =
    let dayAfter = msTomorrow + msDay;


    //Prévision jour 1/////////////////////////////////
    let tempMax = -100;
    let tempMin = 100;
    let icones = [];
    forecastArray.forEach((element, index) => {
        let time = element.dt*1000;
        if(time >= msTomorrow && time < dayAfter){
            //Récupérer les icônes
            icones.push(element.weather[0].icon);
            //Récupérer la température maximale      
            if(element.main.temp_max > tempMax){
            tempMax = element.main.temp_max;
            }
            //Récupérer la température minimale      
            if(element.main.temp_min < tempMin){
            tempMin = element.main.temp_min;
            }
        }   
    });
    let day1Display = document.querySelector("#minmax1");
    day1Display.innerHTML = 
    `<span id="min">Min : ${tempMin.toFixed(1)}°c</span> <br>
    <span id="max">Max : ${tempMax.toFixed(1)}°c</span>`;
    let forecastIcons = document.querySelector("#icones1");
    forecastIcons.innerHTML = `<span id="ico"><img src="src/img/${icones[3]}.png" alt=""></span> 
    <span id="ico"><img src="src/img/${icones[4]}.png" alt=""></span> 
    <span id="ico"><img src="src/img/${icones[6]}.png" alt=""></span>`;


    //Prévision jour 2/////////////////////////////////
    tempMax = -100;
    tempMin = 100;
    icones = [];
    forecastArray.forEach((element, index) => {
        let time = element.dt*1000;
        if(time >= (msTomorrow+msDay) && time < (dayAfter+msDay)){
            //Récupérer les icônes
            icones.push(element.weather[0].icon);
            //Récupérer la température maximale      
            if(element.main.temp_max > tempMax){
            tempMax = element.main.temp_max;
            }
            //Récupérer la température minimale      
            if(element.main.temp_min < tempMin){
            tempMin = element.main.temp_min;
            }
        }   
    });
    let day2Display = document.querySelector("#minmax2");
    day2Display.innerHTML = `<span id="min">Min : ${tempMin.toFixed(1)}°c</span> <br>
    <span id="max">Max : ${tempMax.toFixed(1)}°c</span>`;
    let forecastIcons2 = document.querySelector("#icones2");
    forecastIcons2.innerHTML = `<span id="ico"><img src="src/img/${icones[3]}.png" alt=""></span> 
    <span id="ico"><img src="src/img/${icones[4]}.png" alt=""></span> 
    <span id="ico"><img src="src/img/${icones[6]}.png" alt=""></span>`;

    //Prévision jour 3/////////////////////////////////
    tempMax = -100;
    tempMin = 100;
    icones = [];
    forecastArray.forEach((element, index) => {
        let time = element.dt*1000;
        if(time >= (msTomorrow+(msDay*2)) && time < (dayAfter+(msDay*2))){
            //Récupérer les icônes
            icones.push(element.weather[0].icon);
            //Récupérer la température maximale      
            if(element.main.temp_max > tempMax){
            tempMax = element.main.temp_max;
            }
            //Récupérer la température minimale      
            if(element.main.temp_min < tempMin){
            tempMin = element.main.temp_min;
            }
        }   
    });
    let day3Display = document.querySelector("#minmax3");
    day3Display.innerHTML = `<span id="min">Min : ${tempMin.toFixed(1)}°c</span> <br>
    <span id="max">Max : ${tempMax.toFixed(1)}°c</span>`;
    let forecastIcons3 = document.querySelector("#icones3");
    forecastIcons3.innerHTML = `<span id="ico"><img src="src/img/${icones[3]}.png" alt=""></span> 
    <span id="ico"><img src="src/img/${icones[4]}.png" alt=""></span> 
    <span id="ico"><img src="src/img/${icones[6]}.png" alt=""></span>`;

    //Prévision jour 4/////////////////////////////////
    tempMax = -100;
    tempMin = 100;
    icones = [];
    forecastArray.forEach((element, index) => {
        let time = element.dt*1000;
        if(time >= (msTomorrow+(msDay*3)) && time < (dayAfter+(msDay*3))){
            //Récupérer les icônes
            icones.push(element.weather[0].icon);
            //Récupérer la température maximale      
            if(element.main.temp_max > tempMax){
            tempMax = element.main.temp_max;
            }
            //Récupérer la température minimale      
            if(element.main.temp_min < tempMin){
            tempMin = element.main.temp_min;
            }
        }   
    });
   
    let day4Display = document.querySelector("#minmax4");
    day4Display.innerHTML = `<span id="min">Min : ${tempMin.toFixed(1)}°c</span> <br>
    <span id="max">Max : ${tempMax.toFixed(1)}°c</span>`;
    let forecastIcons4 = document.querySelector("#icones4");
    forecastIcons4.innerHTML = `<span id="ico"><img src="src/img/${icones[3]}.png" alt=""></span> 
    <span id="ico"><img src="src/img/${icones[4]}.png" alt=""></span> 
    <span id="ico"><img src="src/img/${icones[6]}.png" alt=""></span>`;
    ///////////////////////////////////////////////////////////////////////
}


//Executer openWeather quand on clique sur le bouton
button.addEventListener('click', openWeather);
// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      button.click();
    }
  });




//Extra :
//Remember the user choice on subsequent visits

//Allow the user to compare the weather in two cities

//Use the API of https://unsplash.com/ to show a photo of the city they entered in the form.

//Display a line graph of temperature over time using a library such as Chart.js

