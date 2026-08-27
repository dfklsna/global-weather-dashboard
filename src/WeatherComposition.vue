<!--
파일명: WeatherComposition.vue
코드 내용: Vue Composition API의 computed, watch, watchEffect를 활용하여
          도시 검색, 날씨 카드 선택, 상태 변화 감시 기능을 구현한다.
작성자: 김상우
작성일자: 2026-08-25
주요 기능:
1. ref를 이용한 검색어, 선택 도시, 날씨 데이터 상태 관리
2. computed를 이용한 검색 결과 목록 관리
3. watch를 이용한 선택 도시 상태 변화 감시
4. watchEffect를 이용한 검색어 상태 변화 감시
5. 개인 추가 기능으로 섭씨와 화씨 단위 전환
-->

<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

// 사용자가 검색창에 입력한 도시 이름을 저장한다.
const searchQuery = ref('')

// 사용자가 선택한 도시의 전체 정보를 저장한다.
const selectedCityInfo = ref(null)

// 화면에서 사용할 지역별 날씨 데이터를 반응형 상태로 저장한다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 23, status: '흐림' },
])

// 개인 추가 반응형 상태로 화씨 단위 사용 여부를 저장한다.
const useFahrenheit = ref(false)

// 검색어가 비어 있으면 전체 목록을 반환하고, 검색어가 있으면 일치하는 도시만 반환한다.
const filteredWeatherList = computed(() => {
  if (searchQuery.value === '') {
    return weatherList.value
  }

  return weatherList.value.filter((weather) => {
    return weather.name.includes(searchQuery.value)
  })
})

// 개인 추가 computed로 현재 선택된 온도 단위의 이름을 만든다.
const temperatureUnitLabel = computed(() => {
  if (useFahrenheit.value) {
    return '화씨(℉)'
  }

  return '섭씨(℃)'
})

// selectedCityInfo가 바뀔 때마다 화면의 상태바와 같은 문구를 콘솔에 출력한다.
watch(selectedCityInfo, (newCityInfo) => {
  if (newCityInfo) {
    console.log(`상태바 문구: ${newCityInfo.name}이 선택되었습니다.`)
  } else {
    console.log('상태바 문구: 날씨 카드를 선택해 주세요.')
  }
})

// searchQuery를 추적하여 사용자가 검색어를 입력할 때마다 콘솔에 출력한다.
watchEffect(() => {
  console.log(`현재 도시 검색어: ${searchQuery.value}`)
})

// 개인 추가 watcher로 온도 단위가 바뀔 때마다 변경된 단위를 콘솔에 출력한다.
watch(useFahrenheit, (newValue) => {
  if (newValue) {
    console.log('온도 표시 단위가 화씨(℉)로 변경되었습니다.')
  } else {
    console.log('온도 표시 단위가 섭씨(℃)로 변경되었습니다.')
  }
})

// input 이벤트가 발생하면 사용자가 입력한 값을 searchQuery에 저장한다.
const handleInput = (event) => {
  searchQuery.value = event.target.value
}

// 카드를 처음 클릭하면 도시를 선택하고, 같은 카드를 다시 클릭하면 선택을 해제한다.
const selectCity = (weather) => {
  if (selectedCityInfo.value && selectedCityInfo.value.id === weather.id) {
    selectedCityInfo.value = null
  } else {
    selectedCityInfo.value = weather
  }
}

// 상세보기 버튼을 클릭하면 해당 도시의 현재 날씨를 알림창으로 보여준다.
const showDetail = (weather) => {
  window.alert(`${weather.name}의 현재 날씨는 [${weather.status}] 상태입니다.`)
}

// 개인 추가 기능으로 섭씨와 화씨 표시 상태를 서로 변경한다.
const changeTemperatureUnit = () => {
  useFahrenheit.value = !useFahrenheit.value
}

// 현재 단위에 맞게 기온 숫자와 단위 기호를 반환한다.
const showTemperature = (temperature) => {
  if (useFahrenheit.value) {
    return Math.round((temperature * 9) / 5 + 32) + '℉'
  }

  return temperature + '℃'
}
</script>

<template>
  <!-- 전체 Weather Composition API 과제 화면 -->
  <main class="composition-container">
    <!-- 과제 제목 영역 -->
    <header class="title-area">
      <p class="assignment-label">HANDS ON · COMPOSITION API</p>
      <h1>Weather Composition API</h1>
      <p>반응형 상태와 계산된 값, 상태 감시 기능을 활용한 날씨 화면입니다.</p>
      <div class="syntax-list">
        <span>computed</span>
        <span>watch</span>
        <span>watchEffect</span>
      </div>
    </header>

    <!-- 도시 검색 및 개인 추가 온도 단위 설정 영역 -->
    <section class="control-box">
      <div class="search-area">
        <label for="composition-city-search">도시 검색</label>
        <input
          id="composition-city-search"
          type="text"
          :value="searchQuery"
          @input="handleInput"
          placeholder="검색할 도시 이름 입력"
        />
        <p>현재 검색어: <strong>{{ searchQuery }}</strong></p>
      </div>

      <div class="unit-area">
        <p class="unit-label">현재 온도 단위</p>
        <strong>{{ temperatureUnitLabel }}</strong>
        <button type="button" @click="changeTemperatureUnit">단위 변경</button>
      </div>
    </section>

    <!-- computed로 계산된 검색 결과 표시 영역 -->
    <section class="weather-section">
      <div class="section-heading">
        <div>
          <p class="section-label">COMPUTED RESULT</p>
          <h2>지역별 날씨 현황</h2>
        </div>
        <span class="result-count">검색 결과 {{ filteredWeatherList.length }}개</span>
      </div>

      <!-- 검색 결과가 있을 때 filteredWeatherList의 날씨 카드를 출력한다. -->
      <div v-if="filteredWeatherList.length > 0" class="weather-list">
        <article
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          class="weather-card"
          :class="{
            'selected-card': selectedCityInfo && selectedCityInfo.id === weather.id,
          }"
          @click="selectCity(weather)"
        >
          <div class="card-heading">
            <div>
              <h3>{{ weather.name }}</h3>
              <p>{{ weather.status }}</p>
            </div>
            <strong class="temperature">{{ showTemperature(weather.temp) }}</strong>
          </div>

          <p v-if="weather.temp >= 25" class="temperature-label hot-label">
            🔥 더움 (25도 이상)
          </p>
          <p v-else class="temperature-label cool-label">❄️ 선선함 (25도 미만)</p>

          <button type="button" @click.stop="showDetail(weather)">상세보기</button>
        </article>
      </div>

      <!-- 검색어와 일치하는 데이터가 없을 때 안내 문구를 출력한다. -->
      <div v-else class="empty-result">
        <span>🔎</span>
        <p><strong>{{ searchQuery }}</strong> 검색 결과와 일치하는 도시가 없습니다.</p>
      </div>
    </section>

    <!-- watch로 감시하는 선택 도시 상태바 영역 -->
    <section class="status-bar">
      <div class="status-icon">📍</div>
      <div>
        <p class="status-label">WATCH STATUS</p>
        <p v-if="selectedCityInfo" class="status-message">
          <strong>{{ selectedCityInfo.name }}</strong>이 선택되었습니다.
          현재 날씨는 {{ selectedCityInfo.status }}입니다.
        </p>
        <p v-else class="status-message">날씨 카드를 선택해 주세요.</p>
      </div>
    </section>

    <p class="console-guide">
      검색어, 선택 도시, 온도 단위의 변화 내용은 브라우저 콘솔에서도 확인할 수 있습니다.
    </p>
  </main>
</template>

<style scoped>
/* 전체 Composition API 과제 화면 */
.composition-container {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  padding: 52px 24px 64px;
  box-sizing: border-box;
}

/* 과제 제목 영역 */
.title-area {
  margin-bottom: 30px;
  text-align: center;
}

.assignment-label,
.section-label,
.status-label {
  margin: 0 0 7px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.title-area h1 {
  margin: 0;
  color: #172033;
  font-size: 38px;
}

.title-area > p:not(.assignment-label) {
  margin: 10px 0 0;
  color: #64748b;
}

.syntax-list {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.syntax-list span {
  padding: 6px 10px;
  color: #1d4ed8;
  background: #eff6ff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

/* 검색창과 온도 단위 설정 영역 */
.control-box,
.weather-section,
.status-bar {
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(45, 62, 90, 0.07);
}

.control-box {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 22px;
  margin-bottom: 22px;
  padding: 24px;
}

.search-area label,
.unit-label {
  display: block;
  margin: 0 0 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.search-area input {
  width: 100%;
  padding: 12px 14px;
  color: #1e293b;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  box-sizing: border-box;
  font: inherit;
  outline: none;
}

.search-area input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px #dbeafe;
}

.search-area p {
  min-height: 21px;
  margin: 9px 0 0;
  color: #64748b;
  font-size: 13px;
}

.search-area strong {
  color: #2563eb;
}

.unit-area {
  padding-left: 22px;
  border-left: 1px solid #e2e8f0;
}

.unit-area > strong {
  display: block;
  margin-bottom: 10px;
  color: #172033;
  font-size: 20px;
}

.unit-area button,
.weather-card button {
  padding: 9px 14px;
  color: #ffffff;
  background: #2563eb;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.unit-area button:hover,
.weather-card button:hover {
  background: #1d4ed8;
}

/* computed 검색 결과 및 날씨 카드 영역 */
.weather-section {
  padding: 24px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 0;
  color: #1e293b;
  font-size: 23px;
}

.result-count {
  padding: 7px 11px;
  color: #1d4ed8;
  background: #eff6ff;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.weather-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
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

.card-heading p {
  margin: 0;
  color: #64748b;
}

.temperature {
  color: #2563eb;
  font-size: 28px;
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
}

.empty-result {
  padding: 42px 20px;
  color: #64748b;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  text-align: center;
}

.empty-result span {
  font-size: 28px;
}

.empty-result p {
  margin: 10px 0 0;
}

.empty-result strong {
  color: #1d4ed8;
}

/* watch로 감시하는 선택 도시 상태바 */
.status-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
  padding: 21px 24px;
  background: #eff6ff;
  border-color: #bfdbfe;
}

.status-icon {
  font-size: 27px;
}

.status-message {
  margin: 0;
  color: #334155;
}

.status-message strong {
  color: #1d4ed8;
}

.console-guide {
  margin: 14px 0 0;
  color: #64748b;
  font-size: 12px;
  text-align: center;
}

/* 작은 화면에서 검색 영역과 날씨 카드를 한 줄로 표시한다. */
@media (max-width: 650px) {
  .composition-container {
    padding: 36px 16px 44px;
  }

  .title-area h1 {
    font-size: 29px;
  }

  .control-box,
  .weather-list {
    grid-template-columns: 1fr;
  }

  .unit-area {
    padding: 18px 0 0;
    border-top: 1px solid #e2e8f0;
    border-left: 0;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
