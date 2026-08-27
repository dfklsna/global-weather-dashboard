<!--
============================================================
파일명      : WeatherParent.vue
작성자      : 김상우
작성일      : 2026-08-26
설명        : 날씨 화면의 부모 컴포넌트로 검색어, 도시 목록,
              선택된 도시, 온도 단위 등의 반응형 데이터를 관리한다.
주요 기능   :
  1. 검색어와 검색 결과 상태 관리
  2. SearchBar와 WeatherCard에 props 전달
  3. 자식 컴포넌트에서 전달한 emits 이벤트 처리
  4. BaseDashboardCard의 slot을 이용한 공통 화면 구성
  5. 선택 상태, 상세보기, 온도 단위 변경 기능 유지
============================================================
-->

<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import WeatherStatus from './WeatherStatus.vue'

// 사용자가 검색창에 입력한 도시 이름을 부모에서 관리한다.
const searchQuery = ref('')

// 사용자가 선택한 도시의 전체 정보를 부모에서 관리한다.
const selectedCityInfo = ref(null)

// 지역별 날씨 원본 데이터를 부모의 반응형 상태로 관리한다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 23, status: '흐림' },
])

// 기존 Composition 과제의 섭씨와 화씨 단위 변경 상태를 유지한다.
const useFahrenheit = ref(false)

// 검색어가 비어 있으면 전체 목록을, 검색어가 있으면 일치하는 도시 목록을 반환한다.
const filteredWeatherList = computed(() => {
  if (searchQuery.value === '') {
    return weatherList.value
  }

  return weatherList.value.filter((weather) => {
    return weather.name.includes(searchQuery.value)
  })
})

// 화면에 표시할 현재 온도 단위 이름을 계산한다.
const temperatureUnitLabel = computed(() => {
  if (useFahrenheit.value) {
    return '화씨(℉)'
  }

  return '섭씨(℃)'
})

// 기존 기능과 같이 선택 도시가 바뀔 때마다 상태바 문구를 콘솔에 기록한다.
watch(selectedCityInfo, (newCityInfo) => {
  if (newCityInfo) {
    console.log(`상태바 문구: ${newCityInfo.name}이 선택되었습니다.`)
  } else {
    console.log('상태바 문구: 날씨 카드를 선택해 주세요.')
  }
})

// 기존 기능과 같이 검색어가 변경될 때마다 현재 검색어를 콘솔에 기록한다.
watchEffect(() => {
  console.log(`현재 도시 검색어: ${searchQuery.value}`)
})

// 기존 기능과 같이 온도 단위가 바뀌면 변경된 단위를 콘솔에 기록한다.
watch(useFahrenheit, (newValue) => {
  if (newValue) {
    console.log('온도 표시 단위가 화씨(℉)로 변경되었습니다.')
  } else {
    console.log('온도 표시 단위가 섭씨(℃)로 변경되었습니다.')
  }
})

// SearchBar의 update-query 이벤트로 전달된 검색어를 부모 상태에 저장한다.
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}

// WeatherCard의 select-card 이벤트를 받아 도시 선택 또는 선택 해제를 처리한다.
const handleSelectCard = (city) => {
  if (selectedCityInfo.value && selectedCityInfo.value.id === city.id) {
    selectedCityInfo.value = null
  } else {
    selectedCityInfo.value = city
  }
}

// WeatherCard의 click-detail 이벤트를 받아 기존 상세보기 알림을 실행한다.
const handleClickDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}

// 기존 섭씨와 화씨 단위 변경 기능을 실행한다.
const changeTemperatureUnit = () => {
  useFahrenheit.value = !useFahrenheit.value
}
</script>

<template>
  <!-- 전체 Weather Component 과제 화면 -->
  <main class="component-container">
    <!-- 과제 제목 영역 -->
    <header class="title-area">
      <p class="assignment-label">HANDS ON · VUE COMPONENT</p>
      <h1>Weather Component</h1>
      <p>기존 날씨 기능을 부모와 자식 컴포넌트 역할에 맞게 분리한 화면입니다.</p>
      <div class="syntax-list">
        <span>props</span>
        <span>emits</span>
        <span>slot</span>
        <span>scoped CSS</span>
      </div>
    </header>

    <!-- slot을 이용하여 검색과 온도 단위 영역을 공통 카드 안에 배치한다. -->
    <div class="dashboard-spacing">
      <BaseDashboardCard>
        <div class="control-layout">
          <SearchBar :query="searchQuery" @update-query="handleUpdateQuery" />

          <!-- 기존 개인 기능인 온도 단위 변경 영역 -->
          <div class="unit-area">
            <p class="unit-label">현재 온도 단위</p>
            <strong>{{ temperatureUnitLabel }}</strong>
            <button type="button" @click="changeTemperatureUnit">단위 변경</button>
          </div>
        </div>
      </BaseDashboardCard>
    </div>

    <!-- slot을 이용하여 검색 결과와 날씨 카드 목록을 공통 카드 안에 배치한다. -->
    <div class="dashboard-spacing">
      <BaseDashboardCard>
        <div class="section-heading">
          <div>
            <p class="section-label">COMPONENT RESULT</p>
            <h2>지역별 날씨 현황</h2>
          </div>
          <span class="result-count">검색 결과 {{ filteredWeatherList.length }}개</span>
        </div>

        <!-- 검색 결과가 있으면 WeatherCard를 반복하여 사용한다. -->
        <div v-if="filteredWeatherList.length > 0" class="weather-list">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city="city"
            :is-selected="selectedCityInfo ? selectedCityInfo.id === city.id : false"
            :use-fahrenheit="useFahrenheit"
            @select-card="handleSelectCard"
            @click-detail="handleClickDetail"
          />
        </div>

        <!-- 검색어와 일치하는 도시가 없을 때 안내 문구를 표시한다. -->
        <div v-else class="empty-result">
          <span>🔎</span>
          <p><strong>{{ searchQuery }}</strong> 검색 결과와 일치하는 도시가 없습니다.</p>
        </div>
      </BaseDashboardCard>
    </div>

    <!-- 추가 Component로 분리한 현재 선택 상태 영역 -->
    <WeatherStatus :selected-city-info="selectedCityInfo" />

    <p class="console-guide">
      검색어, 선택 도시, 온도 단위의 변화 내용은 브라우저 콘솔에서도 확인할 수 있습니다.
    </p>
  </main>
</template>

<style scoped>
/* 전체 Weather Component 과제 화면 */
.component-container {
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
.section-label {
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

/* 공통 Dashboard Card 사이 간격 */
.dashboard-spacing {
  margin-bottom: 22px;
}

/* SearchBar와 온도 단위 영역 배치 */
.control-layout {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 22px;
}

.unit-area {
  padding-left: 22px;
  border-left: 1px solid #e2e8f0;
}

.unit-label {
  margin: 0 0 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.unit-area > strong {
  display: block;
  margin-bottom: 10px;
  color: #172033;
  font-size: 20px;
}

.unit-area button {
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

.unit-area button:hover {
  background: #1d4ed8;
}

/* 지역별 날씨 목록 제목 */
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

/* WeatherCard 목록 배치 */
.weather-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* 검색 결과가 없을 때 표시하는 영역 */
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

.console-guide {
  margin: 14px 0 0;
  color: #64748b;
  font-size: 12px;
  text-align: center;
}

/* 작은 화면에서 자식 컴포넌트를 한 줄로 배치한다. */
@media (max-width: 650px) {
  .component-container {
    padding: 36px 16px 44px;
  }

  .title-area h1 {
    font-size: 29px;
  }

  .syntax-list {
    flex-wrap: wrap;
  }

  .control-layout,
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
