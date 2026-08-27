/**
 * 파일명: koreanCityAliases.js
 * 코드 내용: 한글 도시 검색어를 OpenWeatherMap의 대한민국 도시 조회어로 변환한다.
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 * 작성시간: 14:00
 */

// 과제에서 지원하는 한글 도시명과 OpenWeatherMap 검색용 영문명을 연결한다.
export const koreanCityAliases = [
  { korean: '서울', english: 'Seoul' },
  { korean: '부산', english: 'Busan' },
  { korean: '인천', english: 'Incheon' },
  { korean: '대구', english: 'Daegu' },
  { korean: '대전', english: 'Daejeon' },
  { korean: '광주', english: 'Gwangju' },
  { korean: '울산', english: 'Ulsan' },
  { korean: '수원', english: 'Suwon' },
  { korean: '성남', english: 'Seongnam' },
  { korean: '고양', english: 'Goyang' },
  { korean: '용인', english: 'Yongin' },
  { korean: '부천', english: 'Bucheon' },
  { korean: '안산', english: 'Ansan' },
  { korean: '안양', english: 'Anyang' },
  { korean: '평택', english: 'Pyeongtaek' },
  { korean: '화성', english: 'Hwaseong' },
  { korean: '춘천', english: 'Chuncheon' },
  { korean: '강릉', english: 'Gangneung' },
  { korean: '원주', english: 'Wonju' },
  { korean: '청주', english: 'Cheongju' },
  { korean: '천안', english: 'Cheonan' },
  { korean: '전주', english: 'Jeonju' },
  { korean: '익산', english: 'Iksan' },
  { korean: '목포', english: 'Mokpo' },
  { korean: '여수', english: 'Yeosu' },
  { korean: '순천', english: 'Suncheon' },
  { korean: '포항', english: 'Pohang' },
  { korean: '경주', english: 'Gyeongju' },
  { korean: '구미', english: 'Gumi' },
  { korean: '창원', english: 'Changwon' },
  { korean: '김해', english: 'Gimhae' },
  { korean: '진주', english: 'Jinju' },
  { korean: '제주', english: 'Jeju' },
]

// 입력값이 지원 목록의 한글 도시이면 영문 도시명과 대한민국 국가 코드를 반환한다.
export const resolveKoreanCity = (cityName) => {
  const normalizedCityName = cityName.trim()
  const matchedCity = koreanCityAliases.find((city) => {
    return city.korean === normalizedCityName
  })

  if (!matchedCity) {
    return {
      query: normalizedCityName,
      displayName: null,
    }
  }

  return {
    query: `${matchedCity.english},KR`,
    displayName: matchedCity.korean,
  }
}
