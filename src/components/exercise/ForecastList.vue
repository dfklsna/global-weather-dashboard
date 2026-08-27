<!--
============================================================
파일명      : ForecastList.vue
작성자      : 김상우
작성일      : 2026-08-27
작성시간    : 13:30
수정 이력   :
  - 2026-08-27 15:00 Element Plus el-card와 el-tag 적용
설명        : OpenWeatherMap에서 받은 단기 예보 목록을 표시한다.
주요 기능   :
  1. props로 예보 배열 전달받기
  2. Pinia 온도 단위를 예보 기온에도 적용하기
============================================================
-->

<script setup>
import { useConfigStore } from '../../stores/configStore.js'
import { getTemperatureClass, getWeatherClass } from '../../utils/weatherStyle.js'

const props = defineProps({
  forecasts: {
    type: Array,
    required: true,
  },
})

const configStore = useConfigStore()

// 원본 섭씨 예보값은 유지하고 현재 Store 단위에 맞는 값만 반환한다.
const displayTemperature = (temperature) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temperature * 9) / 5 + 32)
  }

  return temperature
}

// API 날짜 문자열을 수업 화면에서 읽기 쉬운 형태로 바꾼다.
const displayDateTime = (dateTime) => {
  return dateTime.slice(5, 16).replace('-', '/')
}

</script>

<template>
  <div class="forecast-list">
    <el-card
      v-for="forecast in props.forecasts"
      :key="forecast.id"
      class="forecast-item"
      shadow="never"
    >
      <span class="forecast-time">{{ displayDateTime(forecast.dateTime) }}</span>
      <strong
        class="forecast-temperature"
        :class="getTemperatureClass(forecast.temp)"
      >
        {{ displayTemperature(forecast.temp) }}{{ configStore.unitSymbol }}
      </strong>
      <el-tag
        class="weather-tag"
        :class="getWeatherClass(forecast.status)"
        round
      >
        {{ forecast.status }}
      </el-tag>
    </el-card>
  </div>
</template>

<style scoped>
.forecast-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.forecast-item {
  background: #f8fafc;
  border-color: #e2e8f0;
  border-radius: 10px;
}

.forecast-item :deep(.el-card__body) {
  padding: 14px;
}

.forecast-time {
  display: block;
  color: #64748b;
  font-size: 12px;
}

.forecast-item strong {
  display: block;
  margin-top: 6px;
  color: #1d4ed8;
  font-size: 20px;
}

.weather-tag {
  margin-top: 6px;
}

@media (max-width: 620px) {
  .forecast-list {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
