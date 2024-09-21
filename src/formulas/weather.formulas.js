import findKey from 'lodash/findKey';
const weatherInfluence = {
    'extreme': [],
    'sunny': ['grass', 'ground', 'fire'],
    'clear': ['grass', 'ground', 'fire'],
    'rain': ['water', 'electric', 'bug'],
    'windy': ['dragon', 'flying', 'psychic'],
    'snow': ['ice', 'steel'],
    'fog': ['dark', 'ghost'],
    'cloudy': ['fairy', 'fighting', 'poison'],
    'partlyCloudy': ['normal', 'rock'],
}

export function IsTypeBoostedByWeather(type, weather) {
    if (weather && weatherInfluence[weather]) {
        return weatherInfluence[weather].indexOf(type) !== -1 ? true : false;
    }
    return false;
}
export function GetWeatherList() {
    return Object.keys(weatherInfluence);
}
export function WeatherExists(weather) {
    return weatherInfluence.hasOwnProperty(weather);
}
export function GetWeatherInfluences(type1, type2) {
    let weather = [];
    weather[0] = findKey(weatherInfluence, (w) => {
        return w.indexOf(type1) !== -1;
    });

    if (type2) {
        weather[1] = findKey(weatherInfluence, (w) => {
            return w.indexOf(type2) !== -1;
        });

        if (weather[0] === weather[1])
            weather = weather.slice(0, 1);
    }
    return weather;
}

export default {
    IsTypeBoostedByWeather,
    GetWeatherList,
    WeatherExists,
    GetWeatherInfluences
}