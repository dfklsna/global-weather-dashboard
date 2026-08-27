<!--
============================================================
파일명      : UnitToggle.vue
작성자      : 김상우
작성일      : 2026-08-27
수정 이력   :
  - 2026-08-27 15:00 Element Plus el-button 적용
설명        : configStore의 전역 온도 단위를 표시하고 변경한다.
주요 기능   :
  1. 현재 섭씨 또는 화씨 단위 표시
  2. configStore의 toggleUnit Action 실행
============================================================
-->

<script setup>
import { useConfigStore } from '../../stores/configStore.js'

// App과 모든 View가 함께 사용하는 화면 설정 Store를 가져온다.
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggle" aria-label="날씨 온도 단위 설정">
    <div class="unit-copy">
      <span>날씨 단위</span>
      <strong>
        {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }}
        ({{ configStore.unitSymbol }})
      </strong>
    </div>

    <el-button type="primary" size="small" @click="configStore.toggleUnit">
      단위 변경
    </el-button>
  </div>
</template>

<style scoped>
/* 기존 Navigation Bar와 어울리는 파란색 단위 설정 영역 */
.unit-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 7px 6px 11px;
  background: #f8fafc;
  border: 1px solid #dbe4f0;
  border-radius: 10px;
  white-space: nowrap;
}

.unit-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.unit-copy span {
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}

.unit-copy strong {
  color: #1e293b;
  font-size: 12px;
}

.unit-toggle :deep(.el-button) {
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 720px) {
  .unit-toggle {
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
