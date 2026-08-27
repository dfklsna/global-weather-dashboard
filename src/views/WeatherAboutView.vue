<!--
============================================================
파일명      : WeatherAboutView.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 15:00 Element Plus 소개 카드·기술 태그·버튼 적용
  - 2026-08-27 16:00 3D Location Globe와 현지 시간 기능 소개 추가
  - 2026-08-27 16:29 Global Weather Dashboard 최종 서비스 소개 적용
설명        : Global Weather Dashboard의
              현재 기능과 사용 기술을 소개하는 정적 View이다.
주요 기능   :
  1. 서비스 소개 표시
  2. RouterLink를 이용한 메인 이동
============================================================
-->

<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="info-container">
    <el-card class="info-card" shadow="never">
      <el-tag class="page-label" type="primary" effect="plain">ABOUT SERVICE</el-tag>
      <h1>ℹ️ 서비스 소개</h1>
      <p class="description">
        Global Weather Dashboard는 전 세계 도시의 현재 날씨와 예보, 대기질, 위치와
        현지 시간을 한눈에 확인할 수 있는 Vue 3 기반 실시간 날씨 서비스입니다.
      </p>

      <div class="technology-list" aria-label="사용 기술">
        <el-tag>Vue 3</el-tag>
        <el-tag>Vue Router</el-tag>
        <el-tag>Pinia</el-tag>
        <el-tag>Axios</el-tag>
        <el-tag>Element Plus</el-tag>
        <el-tag>OpenWeatherMap</el-tag>
        <el-tag>Open-Meteo</el-tag>
        <el-tag>Globe.gl</el-tag>
        <el-tag>Three.js</el-tag>
      </div>

      <el-divider />

      <ul>
        <li>독립적인 날씨 Component의 props 및 emits 연동</li>
        <li>OpenWeatherMap 실제 날씨와 단기 예보 조회</li>
        <li>Open-Meteo 대기질 정보 조회</li>
        <li>Pinia를 이용한 섭씨와 화씨 단위 공유</li>
        <li>Globe.gl과 Three.js를 이용한 검색 도시 3D 위치 표시</li>
        <li>검색 도시의 현지 시간, 일출·일몰과 낮·밤 진행도 표시</li>
        <li>Dynamic Route Parameter를 활용한 지역별 상세 페이지</li>
        <li>Catch-all Route를 이용한 잘못된 주소 처리</li>
      </ul>

      <RouterLink class="home-link" to="/">
        <el-button type="primary">대시보드 홈으로 이동</el-button>
      </RouterLink>
    </el-card>
  </main>
</template>

<style scoped>
/* 서비스 소개 View */
.info-container {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 54px 24px 70px;
  box-sizing: border-box;
}

.info-card {
  border-color: #dbe4f0;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(45, 62, 90, 0.08);
}

.info-card > :deep(.el-card__body) {
  padding: 34px;
}

.page-label {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.info-card h1 {
  margin: 0;
  color: #172033;
  font-size: 30px;
}

.description {
  margin: 12px 0 18px;
  color: #64748b;
  line-height: 1.7;
}

.technology-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-card ul {
  margin: 0 0 28px;
  padding: 20px 20px 20px 40px;
  color: #334155;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  line-height: 1.9;
}

.home-link {
  display: inline-block;
  text-decoration: none;
}

@media (max-width: 620px) {
  .info-container {
    padding: 36px 16px 50px;
  }

  .info-card > :deep(.el-card__body) {
    padding: 24px 20px;
  }
}
</style>
