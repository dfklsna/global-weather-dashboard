/**
 * 파일명: airQualityApi.js
 * 코드 내용: Axios를 사용하여 Open-Meteo의 현재 대기질 정보를 요청한다.
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 * 작성시간: 13:30
 */

import axios from 'axios'

const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

// 선택 도시의 좌표를 이용해 현재 PM10과 PM2.5 정보를 요청한다.
export const getAirQuality = async (latitude, longitude) => {
  const response = await axios.get(AIR_QUALITY_URL, {
    params: {
      latitude,
      longitude,
      current: 'pm10,pm2_5',
    },
  })

  return {
    pm10: response.data.current.pm10,
    pm2_5: response.data.current.pm2_5,
    time: response.data.current.time,
  }
}
