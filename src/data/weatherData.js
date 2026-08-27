/**
 * 파일명: weatherData.js
 * 코드 내용: Router 과제의 메인 목록과 상세 View에서 함께 사용하는 날씨 Mock Data
 * 작성자: 김상우
 * 작성일자: 2026-08-26
 * 수정 이력:
 * - 2026-08-27 13:30 Axios 실패 대비용 체감온도, 좌표, 데이터 출처 추가
 * - 2026-08-27 15:20 3D Location Globe 예비 데이터용 국가 코드 추가
 * - 2026-08-27 16:00 예비 데이터용 현지 시간과 일출·일몰 값 추가
 */

const KOREA_TIMEZONE = 9 * 60 * 60

// API 실패 시에도 현재 날짜를 기준으로 오전 6시와 오후 6시를 예비 일출·일몰로 사용한다.
const createFallbackSunTimes = (timezone) => {
  const nowUnix = Math.floor(Date.now() / 1000)
  const localDayStart = Math.floor((nowUnix + timezone) / (24 * 60 * 60)) * (24 * 60 * 60)
  const utcDayStart = localDayStart - timezone

  return {
    timezone,
    sunrise: utcDayStart + 6 * 60 * 60,
    sunset: utcDayStart + 18 * 60 * 60,
  }
}

const koreaTimeData = createFallbackSunTimes(KOREA_TIMEZONE)

// 메인 카드와 상세 화면에서 같은 정보를 사용하도록 날씨 데이터를 한곳에 정의한다.
const weatherData = [
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    feelsLike: 29,
    status: '맑음',
    region: '대한민국 서울특별시',
    humidity: 55,
    windSpeed: 2.5,
    latitude: 37.5665,
    longitude: 126.978,
    country: 'KR',
    ...koreaTimeData,
    source: 'mock',
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    feelsLike: 24,
    status: '비',
    region: '대한민국 경기도 수원시',
    humidity: 78,
    windSpeed: 3.1,
    latitude: 37.2636,
    longitude: 127.0286,
    country: 'KR',
    ...koreaTimeData,
    source: 'mock',
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    feelsLike: 27,
    status: '구름',
    region: '대한민국 부산광역시',
    humidity: 68,
    windSpeed: 4.0,
    latitude: 35.1796,
    longitude: 129.0756,
    country: 'KR',
    ...koreaTimeData,
    source: 'mock',
  },
  {
    id: 'city_04',
    name: '인천',
    temp: 23,
    feelsLike: 23,
    status: '흐림',
    region: '대한민국 인천광역시',
    humidity: 72,
    windSpeed: 3.7,
    latitude: 37.4563,
    longitude: 126.7052,
    country: 'KR',
    ...koreaTimeData,
    source: 'mock',
  },
]

export default weatherData
