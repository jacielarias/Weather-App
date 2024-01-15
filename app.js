const contentWeather = document.querySelector('.weather')
const search = document.querySelector('.search-country');
const city = document.querySelector('.city');
const temp = document.querySelector('.temp');


let key = 'ee4fa800e7954762285286427c2798f1';
let searchCache = {};



const fetchWeather = async(country) =>{
   let data;

   try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${country}` + `&appid=${key}`)
        data = await res.json();

        if(data.cod === '404'){
            throw new Error ('No se encontraron resultados para el pais ingresado');
        }

    }catch(error){
        console.log(error);
        throw new Error('Ha ocurrido un error al buscar el clima del pais o ciudad ingresado')
    }

   console.log(data);
   return data;
}


async function getCountryWeather () {
    const searchValue = search.value.trim();

    if(searchValue === ''){
        contentWeather.innerHTML = 'Por favor ingrese un pais o ciudad';
        return;
    }

    contentWeather.innerHTML = '<p class="loading-msg">Buscando información...</p>';
    
    if(searchCache[searchValue]){
        const data = searchCache[searchValue];

       contentWeather.innerHTML = html(data);
       return;
    }

    let data;

    try {
        data = await fetchWeather(searchValue);

    } catch (error) {
        contentWeather.innerHTML = `<p class="error-msg">${error.message}</p>`;
        return;
    }

    // Store data in cache for future use
    searchCache[searchValue] = data;

    contentWeather.innerHTML = html(data);

}
/*
const getLocationButton = document.getElementById('getLocation');
const locationParagraph = document.getElementById('location');

getLocationButton.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Usamos el API de Google Maps Geocoding para obtener el nombre del lugar
                const geocodingApiKey = 'AIzaSyBlZg-Sw5WQBKCgu5cGymZyE3oFoXJvbI0';
                const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${geocodingApiKey}`;

                fetch(geocodingApiUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'OK') {
                            const address = data.results[9].formatted_address;
                            locationParagraph.textContent = `Estás en: ${address}`
                        } else {
                            locationParagraph.textContent = 'No se pudo obtener el nombre del lugar.';
                        }
                    })
                    .catch(error => {
                        console.error('Error en la solicitud de geocodificación:', error);
                        locationParagraph.textContent = 'No se pudo obtener el nombre del lugar.';
                    });
            },
            (error) => {
                console.error('Error al obtener la ubicación:', error);
                locationParagraph.textContent = 'No se pudo obtener la ubicación.';
            }
        );
    } else {
        locationParagraph.textContent = 'La geolocalización no es compatible con este navegador.';
    }
});

*/
const html = function(data){
    const html = `
        <img src="images/${data.weather[0].main.toLowerCase()}.png" class="weather-icon">
        <h1 class="temp">${Math.round(data.main.temp)}°C</h1>
        <h2 class="city">${data.name}</h2>
        <div class="details">
            <div class="col">
                <img src="images/humidity.png">
                <div>
                    <p class="humidity">${data.main.humidity}%</p>
                    <p>Humidity</p>
                </div>
            </div>
            <div class="col">
                <img src="images/wind.png">
                <div>
                    <p class="wind">${data.wind.speed} km/h</p>
                    <p>Wind Speed</p>
                </div>
            </div>
        </div>
    `;

    return html;
}


async function updateWeather() {
    try {
        await getCountryWeather();
    } catch (error) {
        console.log(error);
    }
}

const searchBtn = document.querySelector('.search-btn');

search.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      updateWeather();
    }
});

searchBtn.addEventListener('click', function(){
    updateWeather();
});