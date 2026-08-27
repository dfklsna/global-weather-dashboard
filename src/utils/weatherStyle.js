/**
 * 파일명: weatherStyle.js
 * 코드 내용: 날씨 상태와 원본 섭씨 온도에 맞는 공통 색상 클래스 이름을 반환한다.
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 * 작성시간: 15:00
 * 수정 이력:
 * - 2026-08-27 15:20 3D Location Globe Marker용 공통 온도 색상 값 추가
 */

// 메인, 상세, 단기예보에서 같은 날씨 상태 색상을 사용하도록 분류한다.
export const getWeatherClass = (condition) => {
  const value = String(condition ?? '').toLowerCase()

  if (value.includes('맑') || value.includes('clear')) {
    return 'weather-clear'
  }

  if (value.includes('흐') || value.includes('구름') || value.includes('cloud')) {
    return 'weather-clouds'
  }

  if (value.includes('비') || value.includes('rain') || value.includes('drizzle')) {
    return 'weather-rain'
  }

  if (value.includes('눈') || value.includes('snow')) {
    return 'weather-snow'
  }

  return 'weather-default'
}

// 화면에 표시되는 단위와 관계없이 원본 섭씨값으로 온도 색상을 분류한다.
export const getTemperatureClass = (temperature) => {
  if (temperature >= 26) {
    return 'temperature-hot'
  }

  if (temperature <= 0) {
    return 'temperature-freezing'
  }

  if (temperature <= 10) {
    return 'temperature-cold'
  }

  return 'temperature-normal'
}

// 기존 온도 분류 결과와 CSS 색상을 3D Marker에서도 동일하게 재사용한다.
const temperatureColors = {
  'temperature-hot': '#e53935',
  'temperature-normal': '#1f5fe0',
  'temperature-cold': '#38a9e0',
  'temperature-freezing': '#0f8f8f',
}

export const getTemperatureColor = (temperature) => {
  return temperatureColors[getTemperatureClass(temperature)]
}
