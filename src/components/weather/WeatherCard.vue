<!--
============================================================
파일명      : WeatherCard.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 13:30 실제 API 응답 카드의 LIVE API 표시 추가
  - 2026-08-27 15:00 Element Plus el-card, el-tag, el-button 적용
설명        : 부모에게 받은 도시 객체를 카드로 표시하고,
              카드 선택 및 상세보기 이벤트를 부모에게 전달한다.
주요 기능   :
  1. props로 도시 정보와 선택 상태 전달받기
  2. select-card 이벤트 전달
  3. click-detail 이벤트 전달
  4. 상세보기 버튼의 이벤트 버블링 방지
============================================================
-->

<script setup>
import { computed } from 'vue'
import { getTemperatureClass, getWeatherClass } from '../../utils/weatherStyle.js'

// 부모로부터 도시 객체, 선택 상태, 온도 단위 상태를 전달받는다.
const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  useFahrenheit: {
    type: Boolean,
    default: false,
  },
})

// 카드 선택과 상세보기 동작을 부모에게 전달하기 위한 이벤트를 선언한다.
const emit = defineEmits(['select-card', 'click-detail'])

// 현재 온도 단위에 맞는 기온 표시 문구를 계산한다.
const displayTemperature = computed(() => {
  if (props.useFahrenheit) {
    return Math.round((props.city.temp * 9) / 5 + 32) + '℉'
  }

  return props.city.temp + '℃'
})

// 카드가 클릭되면 현재 도시 객체를 부모에게 전달한다.
const selectCard = () => {
  emit('select-card', props.city)
}

// 상세보기 버튼이 클릭되면 현재 도시 객체를 부모에게 전달한다.
const clickDetail = () => {
  emit('click-detail', props.city)
}
</script>

<template>
  <!-- 부모가 전달한 도시 정보를 표시하는 개별 날씨 카드 -->
  <el-card
    class="weather-card"
    :class="{ 'selected-card': props.isSelected }"
    shadow="hover"
    @click="selectCard"
  >
    <div class="card-heading">
      <div>
        <h3>{{ props.city.name }}</h3>
        <el-tag
          class="weather-tag"
          :class="getWeatherClass(props.city.status)"
          round
        >
          {{ props.city.status }}
        </el-tag>
        <el-tag
          v-if="props.city.source === 'api'"
          class="source-badge"
          type="primary"
          size="small"
          effect="light"
        >
          LIVE API
        </el-tag>
      </div>
      <strong
        class="temperature"
        :class="getTemperatureClass(props.city.temp)"
      >
        {{ displayTemperature }}
      </strong>
    </div>

    <!-- 원본 섭씨 기온 25도를 기준으로 날씨 상태 Badge를 표시한다. -->
    <el-tag v-if="props.city.temp >= 25" class="temperature-label" type="warning">
      🔥 더움 (25도 이상)
    </el-tag>
    <el-tag v-else class="temperature-label" type="primary">
      ❄️ 선선함 (25도 미만)
    </el-tag>

    <!-- .stop을 사용하여 상세보기 시 카드 선택 이벤트가 함께 실행되지 않게 한다. -->
    <el-button type="primary" @click.stop="clickDetail">상세보기</el-button>
  </el-card>
</template>

<style scoped>
/* 개별 지역 날씨 카드 */
.weather-card {
  height: 100%;
  background: #f8fafc;
  border-color: #e2e8f0;
  border-radius: 12px;
  box-sizing: border-box;
  cursor: pointer;
}

.weather-card :deep(.el-card__body) {
  padding: 20px;
}

.weather-card:hover {
  border-color: #93c5fd;
}

/* 부모가 선택 상태를 전달한 카드 */
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

.source-badge {
  margin-left: 6px;
}

.temperature {
  color: #2563eb;
  font-size: 28px;
}

/* 기온 조건에 따른 상태 Badge */
.temperature-label {
  margin: 20px 0;
  font-weight: 700;
}

/* 상세보기 버튼 */
.weather-card :deep(.el-button) {
  width: 100%;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
}
</style>
