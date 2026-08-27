<!--
============================================================
파일명      : WeatherHomeView.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 10:20 Pinia 전역 단위와 최근 확인 도시 기능 적용
  - 2026-08-27 13:30 Axios 기본 도시 실시간 조회와 검색·Loading·Error 처리 추가
  - 2026-08-27 14:00 대한민국 33개 도시의 한글 검색 변환 기능 추가
  - 2026-08-27 15:00 Element Plus 로딩·오류·빈 상태와 버튼·태그 적용
  - 2026-08-27 15:20 오른쪽 실제 3D Location Globe 패널과 선택 도시 위치 연결
  - 2026-08-27 15:20 공통 outer container에 맞춘 Dashboard Grid 정렬
  - 2026-08-27 16:29 최종 서비스명과 사용자용 Hero 문구 적용
설명        : Axios로 실제 도시 날씨를 검색하면서
              기존 Mock Data, Pinia, Router 기능을 함께 유지한다.
주요 기능   :
  1. 도시 검색과 날씨 카드 목록 관리
  2. 카드 선택 및 선택 해제
  3. Axios 현재 날씨 API Loading 및 Error 처리
  4. Pinia Store의 섭씨와 화씨 온도 단위 적용
  5. 실제 city id를 이용한 상세 View 이동
  6. 선택 도시의 실제 3D Location Globe 표시
============================================================
-->

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrentWeather, getCurrentWeather } from '../api/weatherApi.js'
import LocationGlobe from '../components/exercise/LocationGlobe.vue'
import BaseDashboardCard from '../components/weather/BaseDashboardCard.vue'
import SearchBar from '../components/weather/SearchBar.vue'
import WeatherCard from '../components/weather/WeatherCard.vue'
import WeatherStatus from '../components/weather/WeatherStatus.vue'
import { resolveKoreanCity } from '../data/koreanCityAliases.js'
import weatherData from '../data/weatherData.js'
import { useConfigStore } from '../stores/configStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'

// Programmatic Navigation을 사용하기 위한 Router 인스턴스를 가져온다.
const router = useRouter()

// 온도 단위 설정과 최근 확인한 도시를 전역 Store에서 가져온다.
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

// 기존 날씨 화면과 같은 검색어 및 선택 도시 상태를 관리한다.
const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([])

// 실제 API 요청 결과와 Loading, Error 상태를 별도로 관리한다.
const apiSearchResult = ref(null)
const loading = ref(true)
const errorMessage = ref('')

// 카드 이름은 기존 한글 디자인을 유지하고 날씨 값은 실제 API에서 조회한다.
const defaultCities = [
  { query: 'Seoul', name: '서울' },
  { query: 'Suwon', name: '수원' },
  { query: 'Busan', name: '부산' },
  { query: 'Incheon', name: '인천' },
]

// 화면이 처음 열릴 때 기본 네 도시의 실제 현재 날씨를 순서대로 가져온다.
const loadDefaultWeatherList = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const actualWeatherList = []

    for (const defaultCity of defaultCities) {
      const data = await getCurrentWeather(defaultCity.query)
      const city = formatCurrentWeather(data)

      city.name = defaultCity.name
      actualWeatherList.push(city)
    }

    weatherList.value = actualWeatherList
  } catch (error) {
    weatherList.value = weatherData

    if (error.message.includes('API Key')) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '기본 도시의 실제 날씨를 불러오지 못해 예비 데이터를 표시합니다.'
    }
  } finally {
    loading.value = false
  }
}

// 검색어가 비어 있으면 전체 목록을, 검색어가 있으면 일치하는 도시 목록을 반환한다.
const filteredWeatherList = computed(() => {
  if (apiSearchResult.value) {
    return [apiSearchResult.value]
  }

  if (searchQuery.value === '') {
    return weatherList.value
  }

  return weatherList.value.filter((weather) => {
    return weather.name.includes(searchQuery.value)
  })
})

// SearchBar에서 전달한 검색어를 부모 View 상태에 저장한다.
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
  apiSearchResult.value = null
  errorMessage.value = ''
}

// 한글 도시명은 영문명과 대한민국 국가 코드로 변환한 뒤 현재 날씨를 조회한다.
const searchWeather = async (cityName) => {
  if (cityName === '') {
    errorMessage.value = '검색할 도시 이름을 입력해 주세요.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const resolvedCity = resolveKoreanCity(cityName)
    const data = await getCurrentWeather(resolvedCity.query)
    const city = formatCurrentWeather(data)

    if (resolvedCity.displayName) {
      city.name = resolvedCity.displayName
    }

    apiSearchResult.value = city
    selectedCityInfo.value = city
    weatherStore.setSelectedCity(city)
  } catch (error) {
    if (error.message.includes('API Key')) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '날씨 정보를 불러오지 못했습니다. 도시 이름을 확인해 주세요.'
    }
  } finally {
    loading.value = false
  }
}

// WeatherCard에서 전달한 도시를 선택하거나 같은 도시를 다시 누르면 선택을 해제한다.
const handleSelectCard = (city) => {
  if (selectedCityInfo.value && selectedCityInfo.value.id === city.id) {
    selectedCityInfo.value = null
  } else {
    selectedCityInfo.value = city
    weatherStore.setSelectedCity(city)
  }
}

// 상세보기 이벤트를 받으면 선택한 도시의 Dynamic Route로 이동한다.
const goDetail = (city) => {
  weatherStore.setSelectedCity(city)
  router.push('/weather/' + city.id)
}

onMounted(loadDefaultWeatherList)
</script>

<template>
  <div class="dashboard-layout">
    <!-- Global Weather Dashboard의 중앙 메인 콘텐츠 -->
    <main class="home-container">
    <header class="title-area">
      <p class="assignment-label">REAL-TIME WEATHER PLATFORM</p>
      <h1>Global Weather Dashboard</h1>
      <p>
        전 세계 도시의 실시간 날씨와 예보,<br />
        대기질 및 위치·시간 정보를 한눈에 확인해 보세요.
      </p>
      <div class="syntax-list">
        <el-tag type="primary" effect="light" round>Vue 3</el-tag>
        <el-tag type="primary" effect="light" round>Element Plus</el-tag>
        <el-tag type="primary" effect="light" round>Axios</el-tag>
        <el-tag type="primary" effect="light" round>Pinia</el-tag>
        <el-tag type="primary" effect="light" round>Vue Router</el-tag>
      </div>
    </header>

    <!-- 기존 slot과 SearchBar 컴포넌트 구조를 그대로 사용한다. -->
    <div class="dashboard-spacing">
      <BaseDashboardCard>
        <div class="control-layout">
          <SearchBar
            :query="searchQuery"
            :loading="loading"
            :show-api-search="true"
            @update-query="handleUpdateQuery"
            @search-weather="searchWeather"
          />
        </div>
      </BaseDashboardCard>
    </div>

    <!-- 기존 WeatherCard를 재사용하고 상세보기 이벤트만 Router 이동으로 처리한다. -->
    <div class="dashboard-spacing">
      <BaseDashboardCard>
        <div class="section-heading">
          <div>
            <p class="section-label">LIVE WEATHER</p>
            <h2>지역별 날씨 현황</h2>
          </div>
          <el-tag class="result-count" type="primary" effect="light" round>
            검색 결과 {{ filteredWeatherList.length }}개
          </el-tag>
        </div>

        <!-- Axios 요청 중에는 Element Plus Skeleton으로 로딩 상태를 표시한다. -->
        <div v-if="loading" class="loading-state">
          <el-skeleton :rows="4" animated />
        </div>

        <template v-else>
          <!-- API 요청 오류는 Element Plus Alert로 표시한다. -->
          <el-alert
            v-if="errorMessage"
            class="error-state"
            :title="errorMessage"
            type="error"
            :closable="false"
            show-icon
          />

          <div v-if="filteredWeatherList.length > 0" class="weather-list">
            <WeatherCard
              v-for="city in filteredWeatherList"
              :key="city.id"
              :city="city"
              :is-selected="selectedCityInfo ? selectedCityInfo.id === city.id : false"
              :use-fahrenheit="configStore.unit === 'fahrenheit'"
              @select-card="handleSelectCard"
              @click-detail="goDetail"
            />
          </div>

          <!-- 검색 결과가 없으면 Element Plus Empty 상태를 표시한다. -->
          <el-empty
            v-else
            class="empty-result"
            :description="`${searchQuery} 검색 결과와 일치하는 도시가 없습니다.`"
          >
            <small>검색 버튼을 누르면 실제 OpenWeatherMap 날씨를 조회합니다.</small>
          </el-empty>
        </template>
      </BaseDashboardCard>
    </div>

    <WeatherStatus :selected-city-info="selectedCityInfo" />

    <!-- weatherStore의 State와 Getter를 실제 화면에서 함께 사용한다. -->
    <div v-if="weatherStore.hasViewedCity" class="recent-city">
      <div>
        <span>최근 확인한 도시</span>
        <strong>{{ weatherStore.lastViewedCity.name }}</strong>
      </div>
      <el-button type="primary" size="small" @click="goDetail(weatherStore.lastViewedCity)">
        다시 보기
      </el-button>
    </div>

    <p class="data-guide">
      서울, 수원, 부산, 인천 카드와 검색 결과는 OpenWeatherMap 실제 데이터를 사용합니다.
    </p>
    </main>

    <!-- 넓은 Desktop 화면의 오른쪽 공간에 선택 도시 위치를 표시한다. -->
    <aside class="location-sidebar" aria-label="선택 도시 위치">
      <LocationGlobe />
    </aside>
  </div>
</template>

<style scoped>
/* 기존 중앙 콘텐츠 폭을 유지하면서 Desktop 오른쪽에 보조 패널을 배치한다. */
.dashboard-layout {
  display: grid;
  grid-template-columns: minmax(0, 980px) 280px;
  align-items: start;
  gap: 24px;
  width: 100%;
  box-sizing: border-box;
}

/* Global Weather Dashboard 메인 날씨 대시보드 */
.home-container {
  width: 100%;
  max-width: 980px;
  margin: 0;
  padding: 42px 0 64px;
  box-sizing: border-box;
}

.location-sidebar {
  position: sticky;
  top: 20px;
  padding-top: 42px;
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

.syntax-list :deep(.el-tag) {
  font-size: 12px;
  font-weight: 700;
}

.dashboard-spacing {
  margin-bottom: 22px;
}

/* 기존 SearchBar 디자인을 유지하는 검색 영역 */
.control-layout {
  width: 100%;
}

/* 날씨 목록 제목과 결과 개수 */
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
  font-size: 13px;
  font-weight: 700;
}

.weather-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* Element Plus Loading 및 Error 안내 */
.loading-state,
.error-state {
  margin-bottom: 16px;
}

/* 검색 결과가 없을 때 표시하는 영역 */
.empty-result {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
}

.empty-result small {
  color: #64748b;
}

.data-guide {
  margin: 14px 0 0;
  color: #64748b;
  font-size: 12px;
  text-align: center;
}

/* 추가 weatherStore의 최근 확인 도시 표시 */
.recent-city {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 14px;
  padding: 13px 16px;
  background: #ffffff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
}

.recent-city div {
  display: flex;
  align-items: center;
  gap: 9px;
}

.recent-city span {
  color: #64748b;
  font-size: 13px;
}

.recent-city strong {
  color: #1d4ed8;
}

/* 좁은 화면에서는 기존 중앙 화면을 유지하고 Desktop 보조 패널을 숨긴다. */
@media (max-width: 1332px) {
  .dashboard-layout {
    grid-template-columns: minmax(0, 980px);
    justify-content: center;
    max-width: 1028px;
  }

  .location-sidebar {
    display: none;
  }
}

@media (max-width: 650px) {
  .home-container {
    padding: 34px 0 44px;
  }

  .title-area h1 {
    font-size: 29px;
  }

  .syntax-list {
    flex-wrap: wrap;
  }

  .weather-list {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
