import { WeatherAPICurrentWeather } from '../../typings';

export function roundTemp(weather: WeatherAPICurrentWeather['current']) {
    const c = Math.round(weather.temp_c);
    const f = Math.round(weather.temp_f);
    const feelsLikeC = Math.round(weather.feelslike_c);
    const feelsLikeF = Math.round(weather.feelslike_f);

    return { c, f, feelsLikeC, feelsLikeF };
}
