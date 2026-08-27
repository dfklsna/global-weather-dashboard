/**
 * 파일명: weatherApi.js
 * 코드 내용: Axios를 사용하여 OpenWeatherMap의 현재 날씨와 단기 예보를 요청한다.
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 * 작성시간: 13:30
 * 수정 이력:
 * - 2026-08-27 15:00 OpenWeatherMap 상태 코드를 자연스러운 한글 날씨 문구로 변환
 * - 2026-08-27 15:20 3D Location Globe용 국가 코드 추가
 * - 2026-08-27 16:00 검색 도시 현지 시간용 timezone·sunrise·sunset 추가
 */

import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// OpenWeatherMap의 어색한 한글 번역 대신 날씨 상태 코드를 기준으로 문구를 정리한다.
export const formatWeatherStatus = (weather) => {
  const weatherId = weather.id

  if (weatherId >= 200 && weatherId <= 232) return '천둥번개'
  if (weatherId >= 300 && weatherId <= 321) return '이슬비'
  if (weatherId >= 500 && weatherId <= 531) return '비'
  if (weatherId >= 600 && weatherId <= 622) return '눈'

  if (weatherId === 701) return '박무'
  if (weatherId === 711) return '연기'
  if (weatherId === 721) return '연무'
  if ([731, 751, 761].includes(weatherId)) return '먼지'
  if (weatherId === 741) return '안개'
  if (weatherId === 762) return '화산재'
  if (weatherId === 771) return '돌풍'
  if (weatherId === 781) return '토네이도'

  if (weatherId === 800) return '맑음'
  if (weatherId === 801) return '약간 흐림'
  if (weatherId === 802) return '구름 조금'
  if (weatherId === 803) return '구름 많음'
  if (weatherId === 804) return '흐림'

  return weather.description
}

// API Key가 없을 때 서버 요청 전에 이해하기 쉬운 안내 오류를 만든다.
const checkApiKey = () => {
  if (!API_KEY || API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    throw new Error('OpenWeatherMap API Key가 설정되지 않았습니다. .env 파일을 확인해 주세요.')
  }
}

// 입력한 도시 이름을 기준으로 현재 날씨를 요청한다.
export const getCurrentWeather = async (cityName) => {
  checkApiKey()

  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: cityName,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return response.data
}

// 상세 URL에 직접 접근했을 때 도시 ID로 현재 날씨를 다시 요청한다.
export const getCurrentWeatherById = async (cityId) => {
  checkApiKey()

  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      id: cityId,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return response.data
}

// 선택 도시의 좌표로 5일간 3시간 단위 예보를 요청한다.
export const getForecast = async (latitude, longitude) => {
  checkApiKey()

  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat: latitude,
      lon: longitude,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return response.data
}

// OpenWeatherMap 응답 중 화면에서 사용하는 값만 간단한 도시 객체로 정리한다.
export const formatCurrentWeather = (data) => {
  return {
    id: String(data.id),
    name: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    status: formatWeatherStatus(data.weather[0]),
    region: [data.name, data.sys.country].filter(Boolean).join(', '),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    latitude: data.coord.lat,
    longitude: data.coord.lon,
    country: data.sys.country,
    timezone: data.timezone,
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    source: 'api',
  }
}

// 전체 예보 중 화면에 표시할 앞의 6개 항목만 정리한다.
export const formatForecast = (data) => {
  return data.list.slice(0, 6).map((item) => {
    return {
      id: item.dt,
      dateTime: item.dt_txt,
      temp: Math.round(item.main.temp),
      status: formatWeatherStatus(item.weather[0]),
    }
  })
}
