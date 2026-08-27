<!--
============================================================
파일명      : WeatherStatus.vue
작성자      : 김상우
작성일      : 2026-08-26
설명        : 부모에게 받은 선택 도시 정보를 이용하여
              화면 하단의 현재 선택 상태를 표시한다.
주요 기능   :
  1. props로 선택된 도시 정보 전달받기
  2. 선택 여부에 따른 상태 문구 표시
============================================================
-->

<script setup>
// 부모로부터 선택된 도시의 전체 정보를 전달받는다.
const props = defineProps({
  selectedCityInfo: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <!-- 현재 선택된 도시를 보여주는 상태바 -->
  <section class="status-bar">
    <div class="status-icon">📍</div>
    <div>
      <p class="status-label">CURRENT STATUS</p>
      <p v-if="props.selectedCityInfo" class="status-message">
        <strong>{{ props.selectedCityInfo.name }}</strong>이 선택되었습니다.
        현재 날씨는 {{ props.selectedCityInfo.status }}입니다.
      </p>
      <p v-else class="status-message">날씨 카드를 선택해 주세요.</p>
    </div>
  </section>
</template>

<style scoped>
/* 현재 선택된 도시를 표시하는 하단 상태바 */
.status-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 21px 24px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(45, 62, 90, 0.06);
}

.status-icon {
  font-size: 27px;
}

.status-label {
  margin: 0 0 4px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.status-message {
  margin: 0;
  color: #334155;
}

.status-message strong {
  color: #1d4ed8;
}
</style>
