<!--
파일명: WeatherMockup.vue
코드 내용: Vue 기본 문법을 활용하여 지역별 날씨 정보를 카드 형태로 출력하고,
          도시 검색, 조건부 렌더링, 카드 클릭 이벤트, 상세보기 이벤트를 구현한다.
작성자: 김상우
작성일자: 2026-08-25
수정 이력:
- 2026-08-25 11:49 도시 검색 결과 필터링 및 검색 결과 없음 안내 추가
- 2026-08-25 14:04 날씨 카드 선택 표시와 재선택 시 선택 해제 추가
주요 기능:
1. ref를 이용한 날씨 데이터 및 상태 관리
2. v-for를 이용한 날씨 카드 반복 출력
3. v-if / v-else를 이용한 기온별 상태 표시
4. :value와 @input을 이용한 도시 검색 및 카드 필터링
5. @click과 :class를 이용한 카드 선택 및 선택 해제 표시
6. @click.stop을 이용한 이벤트 버블링 방지
-->

<script setup>
import { ref } from 'vue'

// 화면에서 사용할 지역별 날씨 데이터를 저장한다.
// 기본 도시인 서울, 수원, 부산 외에 개인 데이터로 인천을 추가하였다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 23, status: '흐림' },
])

// 검색창에 사용자가 입력한 도시 이름을 저장한다.
const searchCity = ref('')

// 사용자가 날씨 카드에서 선택한 도시 이름을 저장한다.
const selectedCity = ref('')

// input 이벤트가 발생하면 입력한 값을 검색 상태에 저장한다.
const handleInput = (event) => {
  searchCity.value = event.target.value
}

// 입력한 검색어가 도시 이름에 포함되는지 확인한다.
// 검색어가 비어 있으면 모든 도시 카드가 보이도록 한다.
const isSearchMatch = (cityName) => {
  return cityName.includes(searchCity.value)
}

// 입력한 검색어와 일치하는 도시가 하나라도 있는지 확인한다.
const hasSearchResult = () => {
  for (const weather of weatherList.value) {
    if (weather.name.includes(searchCity.value)) {
      return true
    }
  }

  return false
}

// 날씨 카드를 처음 클릭하면 도시를 선택하고, 같은 카드를 다시 클릭하면 선택을 해제한다.
const selectCity = (cityName) => {
  if (selectedCity.value === cityName) {
    selectedCity.value = ''
  } else {
    selectedCity.value = cityName
  }
}

// 상세보기 버튼을 클릭하면 선택한 도시의 날씨 상태를 알림창으로 보여준다.
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <!-- 전체 날씨 과제 화면 -->
  <main class="weather-container">
    <!-- 과제 제목 영역 -->
    <header class="title-area">
      <p class="assignment-label">VUE BASIC ASSIGNMENT</p>
      <h1>WeatherMockup</h1>
      <p class="title-description">도시별 현재 날씨와 기온을 확인해 보세요.</p>
    </header>

    <!-- 도시 검색 영역 -->
    <section class="search-box">
      <div class="section-title">
        <span class="section-icon">🔍</span>
        <div>
          <h2>도시 검색</h2>
          <p>궁금한 도시 이름을 입력해 보세요.</p>
        </div>
      </div>

      <label for="city-search">도시 이름</label>
      <input
        id="city-search"
        type="text"
        :value="searchCity"
        @input="handleInput"
        placeholder="검색할 도시 이름 입력"
      />
      <p class="search-status">검색 중인 도시: <strong>{{ searchCity }}</strong></p>
    </section>

    <!-- 지역별 날씨 현황 영역 -->
    <section class="weather-section">
      <div class="section-title weather-title">
        <span class="section-icon">🏙</span>
        <div>
          <h2>지역별 날씨 현황</h2>
          <p>카드를 클릭하면 도시를 선택할 수 있습니다.</p>
        </div>
      </div>

      <!-- 날씨 데이터 배열을 반복하여 출력하는 카드 목록 -->
      <div class="weather-list">
        <template v-for="weather in weatherList" :key="weather.id">
          <article
            v-if="isSearchMatch(weather.name)"
            class="weather-card"
            :class="{ 'selected-card': selectedCity === weather.name }"
            @click="selectCity(weather.name)"
          >
            <div class="card-heading">
              <div>
                <h3>{{ weather.name }}</h3>
                <p class="weather-status">{{ weather.status }}</p>
              </div>
              <span class="temperature">{{ weather.temp }}℃</span>
            </div>

            <!-- 25도를 기준으로 더움과 선선함 상태를 구분한다. -->
            <p v-if="weather.temp >= 25" class="temperature-label hot-label">
              🔥 더움 (25도 이상)
            </p>
            <p v-else class="temperature-label cool-label">❄️ 선선함 (25도 미만)</p>

            <!-- .stop을 사용하여 버튼 클릭 시 카드 클릭 이벤트가 실행되지 않게 한다. -->
            <button type="button" @click.stop="showDetail(weather.name, weather.status)">
              상세보기
            </button>
          </article>
        </template>

        <!-- 검색어와 일치하는 도시가 없을 때 안내 문구를 표시한다. -->
        <p v-if="searchCity && !hasSearchResult()" class="no-result">
          '{{ searchCity }}'에 해당하는 도시가 없습니다.
        </p>
      </div>
    </section>

    <!-- 현재 선택된 도시 상태 표시 영역 -->
    <section class="selected-box">
      <span class="selected-icon">📍</span>
      <div>
        <p class="selected-label">현재 선택</p>
        <p v-if="selectedCity" class="selected-message">
          <strong>{{ selectedCity }}</strong>이 선택되었습니다.
        </p>
        <p v-else class="selected-message">카드를 클릭하거나 검색해 보세요.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* 전체 과제 화면 */
.weather-container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 56px 24px 64px;
  box-sizing: border-box;
}

/* 과제 제목 영역 */
.title-area {
  margin-bottom: 32px;
  text-align: center;
}

.assignment-label {
  margin: 0 0 10px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.title-area h1 {
  margin: 0;
  color: #172033;
  font-size: 36px;
}

.title-description {
  margin: 12px 0 0;
  color: #64748b;
}

/* 검색 영역과 공통 영역 제목 */
.search-box,
.weather-section,
.selected-box {
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(45, 62, 90, 0.07);
}

.search-box {
  margin-bottom: 24px;
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: #eff6ff;
  border-radius: 12px;
  font-size: 20px;
}

.section-title h2 {
  margin: 0 0 4px;
  color: #1e293b;
  font-size: 21px;
}

.section-title p {
  margin: 0;
  color: #7b8799;
  font-size: 14px;
}

.search-box label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.search-box input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  box-sizing: border-box;
  color: #1e293b;
  background: #ffffff;
  font: inherit;
  outline: none;
}

.search-box input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px #dbeafe;
}

.search-status {
  min-height: 24px;
  margin: 12px 0 0;
  color: #64748b;
  font-size: 14px;
}

.search-status strong {
  color: #2563eb;
}

/* 지역별 날씨 카드 목록 */
.weather-section {
  padding: 24px;
}

.weather-title {
  margin-bottom: 18px;
}

.weather-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.no-result {
  grid-column: 1 / -1;
  margin: 0;
  padding: 36px 20px;
  color: #64748b;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  text-align: center;
}

.weather-card {
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
}

.weather-card:hover {
  border-color: #93c5fd;
}

/* 사용자가 선택한 날씨 카드의 테두리를 강조한다. */
.weather-card.selected-card {
  background: #eff6ff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px #bfdbfe;
}

.card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.card-heading h3 {
  margin: 0 0 4px;
  color: #172033;
  font-size: 22px;
}

.weather-status {
  margin: 0;
  color: #64748b;
  font-size: 15px;
}

.temperature {
  color: #1d4ed8;
  font-size: 28px;
  font-weight: 800;
}

.temperature-label {
  display: inline-block;
  margin: 20px 0;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}

.hot-label {
  color: #c2410c;
  background: #fff1e6;
}

.cool-label {
  color: #1d4ed8;
  background: #eaf2ff;
}

.weather-card button {
  width: 100%;
  padding: 10px 14px;
  color: #ffffff;
  background: #2563eb;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.weather-card button:hover {
  background: #1d4ed8;
}

.weather-card button:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

/* 현재 선택된 도시 상태 영역 */
.selected-box {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
  padding: 22px 24px;
  background: #eff6ff;
  border-color: #bfdbfe;
}

.selected-icon {
  font-size: 27px;
}

.selected-label {
  margin: 0 0 3px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.selected-message {
  margin: 0;
  color: #334155;
}

.selected-message strong {
  color: #1d4ed8;
}

/* 작은 화면에서 날씨 카드를 한 줄에 하나씩 표시한다. */
@media (max-width: 640px) {
  .weather-container {
    padding: 36px 16px 44px;
  }

  .title-area h1 {
    font-size: 28px;
  }

  .search-box,
  .weather-section {
    padding: 20px;
  }

  .weather-list {
    grid-template-columns: 1fr;
  }
}
</style>
