<!--
============================================================
파일명      : WeatherDetailView.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 10:20 Pinia 전역 단위, 상세정보 설정, 최근 도시 기능 적용
  - 2026-08-27 13:30 Axios 현재 날씨 재조회, 단기 예보, 대기질 기능 추가
  - 2026-08-27 15:00 Element Plus 상세 카드·태그·버튼·상태 UI 적용
  - 2026-08-27 16:29 최종 사용자용 실시간·예비 데이터 문구 적용
설명        : URL의 cityId로 현재 날씨를 다시 조회하고
              단기 예보와 대기질 정보를 함께 표시한다.
주요 기능   :
  1. route.params.cityId 읽기
  2. Store, Mock Data, Axios 순서로 현재 도시 확인
  3. OpenWeatherMap 단기 예보 API 호출
  4. Open-Meteo 대기질 API 호출
  5. Loading, Error 및 Pinia 전역 단위 적용
============================================================
-->

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getAirQuality } from '../api/airQualityApi.js'
import {
  formatCurrentWeather,
  formatForecast,
  getCurrentWeatherById,
  getForecast,
} from '../api/weatherApi.js'
import AirQualityCard from '../components/exercise/AirQualityCard.vue'
import ForecastList from '../components/exercise/ForecastList.vue'
import weatherData from '../data/weatherData.js'
import { useConfigStore } from '../stores/configStore.js'
import { useWeatherStore } from '../stores/weatherStore.js'
import { getTemperatureClass, getWeatherClass } from '../utils/weatherStyle.js'

// 현재 URL에 포함된 Dynamic Route Parameter를 읽는다.
const route = useRoute()

// 메인과 같은 단위 설정을 공유하고 최근 확인한 도시를 저장한다.
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

// 현재 날씨, 단기 예보, 대기질과 각 요청 상태를 나누어 관리한다.
const selectedCity = ref(null)
const detailLoading = ref(false)
const detailError = ref('')
const forecasts = ref([])
const forecastLoading = ref(false)
const forecastError = ref('')
const airQuality = ref(null)
const airQualityLoading = ref(false)
const airQualityError = ref('')

// 원본 섭씨 데이터는 유지하고 화면에 표시할 값만 Store 설정에 따라 계산한다.
const displayTemperature = computed(() => {
  if (!selectedCity.value) {
    return ''
  }

  const rawTemperature = selectedCity.value.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemperature * 9) / 5 + 32)
  }

  return rawTemperature
})

// 체감 온도에도 현재 Pinia 단위를 동일하게 적용한다.
const displayFeelsLike = computed(() => {
  if (!selectedCity.value) {
    return ''
  }

  const rawTemperature = selectedCity.value.feelsLike ?? selectedCity.value.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemperature * 9) / 5 + 32)
  }

  return rawTemperature
})

// OpenWeatherMap에서 앞의 6개 단기 예보를 가져온다.
const loadForecast = async () => {
  forecastLoading.value = true
  forecastError.value = ''

  try {
    const data = await getForecast(
      selectedCity.value.latitude,
      selectedCity.value.longitude,
    )
    forecasts.value = formatForecast(data)
  } catch (error) {
    if (error.message.includes('API Key')) {
      forecastError.value = error.message
    } else {
      forecastError.value = '단기 예보를 불러올 수 없습니다.'
    }
  } finally {
    forecastLoading.value = false
  }
}

// Open-Meteo에서 현재 PM10과 PM2.5 정보를 가져온다.
const loadAirQuality = async () => {
  airQualityLoading.value = true
  airQualityError.value = ''

  try {
    airQuality.value = await getAirQuality(
      selectedCity.value.latitude,
      selectedCity.value.longitude,
    )
  } catch {
    airQualityError.value = '대기질 정보를 불러올 수 없습니다.'
  } finally {
    airQualityLoading.value = false
  }
}

// Store나 Mock Data가 없으면 cityId를 이용해 현재 날씨 API를 다시 요청한다.
const loadDetail = async () => {
  detailLoading.value = true
  detailError.value = ''

  try {
    const cityId = String(route.params.cityId)
    const storedCity = weatherStore.selectedCity
    const mockCity = weatherData.find((city) => city.id === cityId)

    if (storedCity && String(storedCity.id) === cityId) {
      selectedCity.value = storedCity
    } else if (mockCity) {
      selectedCity.value = mockCity
    } else {
      const data = await getCurrentWeatherById(cityId)
      selectedCity.value = formatCurrentWeather(data)
    }

    weatherStore.setSelectedCity(selectedCity.value)
    weatherStore.setLastViewedCity(selectedCity.value)
  } catch (error) {
    if (error.message.includes('API Key')) {
      detailError.value = error.message
    } else {
      detailError.value = '요청하신 도시의 날씨 정보를 찾을 수 없습니다.'
    }
  } finally {
    detailLoading.value = false
  }

  if (selectedCity.value) {
    await loadForecast()
    await loadAirQuality()
  }
}

onMounted(loadDetail)
</script>

<template>
  <main class="detail-container">
    <el-card v-if="detailLoading" class="detail-card loading-card" shadow="never">
      <el-skeleton :rows="7" animated />
    </el-card>

    <!-- 올바른 cityId가 전달된 경우 상세 날씨를 표시한다. -->
    <el-card v-else-if="selectedCity" class="detail-card" shadow="never">
      <el-tag class="page-label" type="primary" effect="plain">
        {{ selectedCity.source === 'api' ? 'LIVE WEATHER' : 'FALLBACK WEATHER' }} ·
        {{ selectedCity.id }}
      </el-tag>
      <h1>📊 지역별 상세 기상 관측 정보</h1>
      <p class="region">📍 지정 지역: {{ selectedCity.region }}</p>

      <div class="extra-setting">
        <div>
          <span>Pinia 화면 설정</span>
          <strong>{{ configStore.extraInfoText }}</strong>
        </div>
        <el-button type="primary" size="small" @click="configStore.toggleExtraInfo">
          {{ configStore.showExtraInfo ? '상세정보 숨기기' : '상세정보 보기' }}
        </el-button>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">실시간 기온</span>
          <strong
            class="detail-temperature"
            :class="getTemperatureClass(selectedCity.temp)"
          >
            {{ displayTemperature }}{{ configStore.unitSymbol }}
          </strong>
        </div>
        <div class="detail-item">
          <span class="detail-label">체감 온도</span>
          <strong>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</strong>
        </div>
        <div class="detail-item">
          <span class="detail-label">기상 현황</span>
          <el-tag
            class="weather-tag"
            :class="getWeatherClass(selectedCity.status)"
            round
          >
            {{ selectedCity.status }}
          </el-tag>
        </div>
        <template v-if="configStore.showExtraInfo">
          <div class="detail-item">
            <span class="detail-label">대기 습도</span>
            <strong>{{ selectedCity.humidity }}%</strong>
          </div>
          <div class="detail-item">
            <span class="detail-label">현재 풍속</span>
            <strong>{{ selectedCity.windSpeed }}m/s</strong>
          </div>
        </template>
      </div>

      <section class="api-section">
        <div class="api-heading">
          <div>
            <p>OPENWEATHERMAP FORECAST</p>
            <h2>📅 단기 예보</h2>
          </div>
          <el-tag type="primary" effect="plain">5일 / 3시간</el-tag>
        </div>

        <el-skeleton v-if="forecastLoading" :rows="3" animated />
        <el-alert
          v-else-if="forecastError"
          :title="forecastError"
          type="error"
          :closable="false"
          show-icon
        />
        <ForecastList v-else-if="forecasts.length > 0" :forecasts="forecasts" />
        <el-empty v-else description="표시할 단기 예보가 없습니다." :image-size="72" />
      </section>

      <section class="api-section">
        <div class="api-heading">
          <div>
            <p>OPEN-METEO AIR QUALITY</p>
            <h2>🌫 대기질 정보</h2>
          </div>
          <el-tag type="primary" effect="plain">현재 관측값</el-tag>
        </div>

        <el-skeleton v-if="airQualityLoading" :rows="2" animated />
        <el-alert
          v-else-if="airQualityError"
          :title="airQualityError"
          type="error"
          :closable="false"
          show-icon
        />
        <AirQualityCard v-else-if="airQuality" :air-quality="airQuality" />
      </section>

      <RouterLink class="home-link" to="/">
        <el-button type="primary">← 메인 대시보드로 돌아가기</el-button>
      </RouterLink>
    </el-card>

    <!-- 존재하지 않는 cityId가 전달된 경우 오류 없이 안내 화면을 표시한다. -->
    <el-card v-else class="detail-card missing-card" shadow="never">
      <el-empty
        :description="detailError || '요청하신 도시 코드와 일치하는 날씨 정보가 없습니다.'"
      >
        <RouterLink to="/">
          <el-button type="primary">날씨 메인으로 이동</el-button>
        </RouterLink>
      </el-empty>
    </el-card>
  </main>
</template>

<style scoped>
/* 상세 View 전체 배치 */
.detail-container {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 54px 24px 70px;
  box-sizing: border-box;
}

.detail-card {
  border-color: #dbe4f0;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(45, 62, 90, 0.08);
}

.detail-card > :deep(.el-card__body) {
  padding: 36px;
}

.page-label {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.detail-card h1 {
  margin: 0;
  color: #172033;
  font-size: 30px;
}

.region {
  margin: 12px 0 26px;
  color: #64748b;
}

.extra-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
  padding: 13px 15px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 11px;
}

.extra-setting div {
  display: flex;
  flex-direction: column;
}

.extra-setting span {
  color: #64748b;
  font-size: 11px;
}

.extra-setting strong {
  color: #1d4ed8;
  font-size: 14px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 28px;
}

.detail-item {
  padding: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.detail-item > .detail-label {
  display: block;
  margin-bottom: 5px;
  color: #64748b;
  font-size: 13px;
}

.detail-item strong {
  color: #1d4ed8;
  font-size: 22px;
}

/* Forecast와 Air Quality API 결과 영역 */
.api-section {
  margin-top: 20px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 13px;
}

.api-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 15px;
}

.api-heading p {
  margin: 0 0 4px;
  color: #2563eb;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.api-heading h2 {
  margin: 0;
  color: #1e293b;
  font-size: 20px;
}

.home-link {
  display: inline-block;
  margin-top: 24px;
  text-decoration: none;
}

.missing-card {
  text-align: center;
}

.missing-card p {
  margin: 12px 0 24px;
  color: #64748b;
}

.loading-card {
  text-align: center;
}

@media (max-width: 620px) {
  .detail-container {
    padding: 36px 16px 50px;
  }

  .detail-card > :deep(.el-card__body) {
    padding: 24px 20px;
  }

  .detail-card h1 {
    font-size: 24px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .extra-setting {
    align-items: stretch;
    flex-direction: column;
  }

  .api-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
