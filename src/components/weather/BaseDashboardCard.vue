<!--
============================================================
파일명      : BaseDashboardCard.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 15:00 공통 영역에 Element Plus el-card 적용
설명        : 검색 영역과 날씨 목록 영역에서 공통으로 사용하는
              카드 디자인을 제공하는 컴포넌트이다.
주요 기능   :
  1. 공통 Dashboard Card 디자인 제공
  2. slot을 이용한 부모 화면 내용 표시
============================================================
-->

<template>
  <!-- 부모가 전달한 검색 영역 또는 날씨 목록 영역을 slot에 표시한다. -->
  <el-card class="dashboard-card" shadow="never">
    <slot></slot>
  </el-card>
</template>

<style scoped>
/* 검색 영역과 날씨 목록 영역에서 공통으로 사용하는 바깥 카드 */
.dashboard-card {
  border-color: #dbe4f0;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(45, 62, 90, 0.07);
}

.dashboard-card > :deep(.el-card__body) {
  padding: 24px;
}

@media (max-width: 650px) {
  .dashboard-card > :deep(.el-card__body) {
    padding: 20px;
  }
}
</style>
