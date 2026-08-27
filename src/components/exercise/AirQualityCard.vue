<!--
============================================================
파일명      : AirQualityCard.vue
작성자      : 김상우
작성일      : 2026-08-27
작성시간    : 13:30
수정 이력   :
  - 2026-08-27 15:00 Element Plus el-card와 el-tag 적용
설명        : Open-Meteo에서 받은 현재 미세먼지 정보를 표시한다.
주요 기능   : props로 PM10과 PM2.5 값을 전달받아 카드로 출력
============================================================
-->

<script setup>
const props = defineProps({
  airQuality: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="air-quality-grid">
    <el-card class="air-item" shadow="never">
      <el-tag type="primary" size="small">PM10</el-tag>
      <strong>{{ props.airQuality.pm10 }} <small>μg/m³</small></strong>
    </el-card>
    <el-card class="air-item" shadow="never">
      <el-tag type="info" size="small">PM2.5</el-tag>
      <strong>{{ props.airQuality.pm2_5 }} <small>μg/m³</small></strong>
    </el-card>
  </div>
</template>

<style scoped>
.air-quality-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.air-item {
  background: #eff6ff;
  border-color: #bfdbfe;
  border-radius: 11px;
}

.air-item :deep(.el-card__body) {
  padding: 16px;
}

.air-item strong {
  display: block;
  margin-top: 6px;
  color: #1d4ed8;
  font-size: 22px;
}

.air-item small {
  font-size: 11px;
}
</style>
