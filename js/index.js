let currentData = {};
let locationData = {};
let forecastFor3Days = [];

const searchInput = document.getElementById('search')
const submitSearch = document.getElementById('submit')

submitSearch.addEventListener('click', () => {
    search();
})


async function loadData(city, numberOfDays) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=7d77b96c972b4d119a3151101212704&q=${city}&days=${Number(numberOfDays)}`;

    try {
        const data = await fetch(url, { method: "GET" });

        data.json().then(data => {
            if (data.error) {
                alert(data.error.message);
                return
            }
            locationData = data.location
            currentData = data.current;
            forecastFor3Days = data.forecast.forecastday;
            display()
        })

    }
    catch (error) {
        console.log(error)
    }
}

function display() {
    console.log(todayDev())
    const parentDev = document.getElementById('forecast-data')
    parentDev.innerHTML = `${todayDev()}${next2DaysDev()}`
}


function todayDev() {
    const data = extractCurrentData()
    return `<div class="forecast-today col-sm-12 col-md-4">
                    <div class="date row p-3 d-flex">
                        <span class="day-name col-6"> ${data.day}</span>
                        <span class="day-date col-6 text-end"> ${data.dayMonth}</span>
                    </div>
                    <div class="forecast-content ps-4 pb-4">
                        <h5 class="location mt-4">${data.city}</h5>
                        <div class="degree">
                            <div class="num fw-bold"> ${data.temp}<sup>o</sup>C
                                <img src="https://${data.conditionImage}">
                            </div>
                        </div>
                        <div class="f-icon">
                        </div>
                        <div class="w-condition mt-3 pb-3">
                        ${data.condition}
                        </div>
                        <span>
                            <i class="fa-light fa-umbrella"></i>
                            ${data.cloud}%</span>
                        <span>
                            <i class="fa-regular fa-wind ms-3"></i>${data.wind}km/h</span>
                        <span> <i class="fa-regular fa-compass ms-3"></i>${data.windDegree}${data.windDirection}</span>
                    </div>

                </div>`
}

function next2DaysDev() {
    const [day1, day2] = extractNext2DaysData();

    return `<div class="forecast-2 col-md-4 col-sm-12">
                    <div class="date row p-3 text-center ">
                        <span class="day-name">${day1.day}</span>
                    </div>
                    <div class="f-content  pt-4 text-center">
                        <div class="f-icon">
                            <img src="https://${day1.conditionImage}">
                        </div>
                        <div class="degree pt-3">
                            <div class=" fw-bold"> ${day1.maxTemp}<sup>o</sup>C
                            </div>
                        </div>
                        <div class="s-degree">
                            <div> ${day1.minTemp}<sup>o</sup>C</div>
                        </div>
                        <div class=" w-condition mt-3 pb-3">
                        ${day1.condition}
                        </div>
                    </div>


                </div>
                <div class="forecast-3 col-sm-12 col-md-4 ">
                    <div class="date row p-3 text-center">
                        <span class="day-name">${day2.day}</span>
                    </div>
                    <div class="f-content text-center  pt-4 ">
                        <div class="f-icon">
                            <img src="https://${day2.conditionImage}">
                        </div>
                        <div class="degree pt-3">
                            <div class=" fw-bold"> ${day2.maxTemp}<sup>o</sup>C</div>
                        </div>
                        <div> ${day2.minTemp}<sup>o</sup>C
                        </div>
                        <div class=" w-condition mt-3 pb-3">
                        ${day2.condition}
                        </div>

                    </div>


                </div>`
}


function getDayName(date) {
    return new Date(date).toLocaleString('en-us', { weekday: 'long' });
}

function dayMonthFormat(date) {
    const day = new Date(date).getDate();
    const month = new Date(date).toLocaleString('default', { month: 'short' });
    return `${day}${month}`
}

function search() {
    const searchText = searchInput.value
    loadData(searchText, 3)
}

function extractCurrentData() {
    return {
        day: getDayName(new Date()),
        dayMonth: dayMonthFormat(new Date()),
        city: locationData.name,
        temp: currentData.temp_c,
        condition: currentData.condition.text,
        conditionImage: currentData.condition.icon.replace("file", '').replace(":", '').replace("//", ''),
        wind: currentData.wind_kph,
        windDirection: currentData.wind_dir,
        windDegree: currentData.wind_degree,
        cloud: currentData.cloud
    }
}

function extractNext2DaysData() {
    const [_today, ...other2Days] = forecastFor3Days

    return other2Days.map(day => {
        return {
            day: getDayName(day.date),
            maxTemp: day.day.maxtemp_c,
            minTemp: day.day.mintemp_c,
            condition: day.day.condition.text,
            conditionImage: day.day.condition.icon.replace("file", '').replace(":", '').replace("//", ''),
        }
    })
}



loadData('cairo', 3)