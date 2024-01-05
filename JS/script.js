let datalistOptions = document.querySelector("#datalistOptions");
let search = document.querySelector("#search");
let searchBtn = document.querySelector("#searchBtn");
let row = document.querySelector("#row");
search.addEventListener('input', function () {
    findLocation(search.value);
    if (search.value.length >= 3) {
        getData(search.value);
    }
});
async function findLocation(value) {
    let data = await fetch(`http://api.weatherapi.com/v1/search.json?key=1cd8df4417a64c0f976144621240401&q=${value}`);
    var jsonData = await data.json();
    addSuggest(jsonData);
}
function addSuggest(jsonData) {
    let cartoona = ``;
    for (let i = 0; i < jsonData.length; i++) {
        console.log(jsonData[i]);
        cartoona += `<option>${jsonData[i].region}</option>`;
    }
    datalistOptions.innerHTML = cartoona;
}

searchBtn.addEventListener("click", function () {
    getData(search.value);
})
const weekDayes = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthes = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", 'November', "December"]
async function getData(cityName) {
    var data = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=1cd8df4417a64c0f976144621240401&q=${cityName}&days=3`,
        {
            headers: {
                "Accept": "application/json"
            }
        });
    if (data.status === 200) {
        var jsonData = await data.json();
        if (data) {
            row.classList.remove("d-none");
        }
        console.log(jsonData);
        console.log(cityName);
        setTodayCard(jsonData.location, jsonData.current, jsonData.forecast.forecastday)
        setDayesCard(jsonData.forecast.forecastday);
    } else {
        console.log(data.status);
    }
}


function setTodayCard(location, current, forecast) {
    let dateAndTime = new Date(current.last_updated);
    let hourData = forecast[0].hour[dateAndTime.getHours()];
    row.innerHTML = `    <div class="col-lg-4">
    <div class="custom-card text-white-50 rounded-3">
        <div class="card-header d-flex justify-content-between mb-3 p-2 bg-dark  rounded-3">
            <span>${weekDayes[dateAndTime.getDay()]}</span>
            <span>${dateAndTime.getDay()} ${monthes[dateAndTime.getMonth()]}</span>
        </div>
        <div class="card-content px-3 pb-5">
            <p class="m-0">${location.name} - ${location.country}</p>
            <div class="temp-logo d-flex justify-content-around align-items-center text-white">
                <div class="temp">
                    <span class="temp-number">${hourData.temp_c}</span>
                    <span class="temp-symbol">o</span>
                    <span class="temp-number tempType">C</span>
                </div>
                <div>
                <image src="${hourData.condition.icon}" class="w-100"></image>
                </div>
            </div>
            <p  class="text-info">${hourData.condition.text}</p>
            <div class="info d-flex justify-content-between align-items-center">
                <div class="info-item">
                    <i class="fa fa-umbrella"></i>
                    <span>${hourData.chance_of_rain}</span>
                </div>
                <div class="info-item">
                    <i class="fa-solid fa-wind"></i>
                    <span">${hourData.wind_kph}</span>
                </div>
                <div class="info-item">
                    <i class="fa-regular fa-compass"></i>
                    <span>${getWindDirection(hourData.wind_dir)}</span>
                </div>
            </div>
        </div>
    </div>

</div>`;

}
function setDayesCard(forecast) {
    for (let i = 1; i < forecast.length; i++) {
        let dateAndTime = new Date(forecast[i].date);
        let hourData = forecast[i].hour[dateAndTime.getHours()];
        let div = document.createElement("div");
        div.classList.add(["col-lg-4"]);
        div.innerHTML = ` <div class="custom-card text-white-50 rounded-3 min-height">
        <div class="card-header d-flex justify-content-center mb-3 p-2 bg-dark  rounded-3">
            <span>${weekDayes[dateAndTime.getDay()]}</span>
        </div>
        <div class="card-content px-3 d-flex flex-column justify-content-center align-items-center">
            <div class="text-center pt-4 image-width ">
               <image src="${hourData.condition.icon}" class="w-100"></image>
            </div>
            <div class="temp-logo d-flex justify-content-around align-items-center text-white flex-column">
                <div class="temp">
                    <span class="fs-1">${hourData.temp_c}</span>
                    <span class="temp-symbol-alt">o</span>
                    <span class="fs-1 tempType">C</span>
                </div>
                <div>
                <span>${hourData.temp_f}</span>
                <span>o</span>
                <span>F</span>
            </div>
            </div>
            <p></p>
            <div class="text-center">
                <span class="text-info">${hourData.condition.text}</span>
            </div>
        </div>
    </div>`;
        row.appendChild(div)
    }

}
function getWindDirection(windDir) {
    switch (windDir) {
        case "SSE":
            return "South-Southeast";
        case "S":
            return "South";
        case "SSW":
            return "South-Southwest";
        case "SW":
            return "Southwest ";
        case "WSW":
            return "west-southwest";
        case "W":
            return "West";
        case "WNW":
            return "West-Northwest ";
        case "NW":
            return "Northwest";
        case "NNW":
            return "North-Northwest";
        case "ENE":
            return "East-northeas";
        case "N":
            return "North ";
        default:
            return "--";
    }

}