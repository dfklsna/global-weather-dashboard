<!--
============================================================
파일명      : WeatherGuideView.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 15:00 Element Plus 안내 카드·단계 태그·버튼 적용
  - 2026-08-27 16:00 Location Globe와 현지 시간 확인 단계 추가
설명        : Global Weather Dashboard의
              기본적인 이용 순서를 안내한다.
주요 기능   :
  1. 대시보드 이용 순서 표시
  2. RouterLink를 이용한 메인 이동
============================================================
-->

<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="guide-container">
    <el-card class="guide-card" shadow="never">
      <el-tag class="page-label" type="primary" effect="plain">USER GUIDE</el-tag>
      <h1>📘 날씨 대시보드 이용 안내</h1>
      <p class="description">아래 순서대로 실제 날씨와 추가 API 정보를 확인할 수 있습니다.</p>

      <ol>
        <li>
          <el-tag type="primary" round>1</el-tag>
          <strong>도시 검색</strong>
          <span>메인 화면에서 한글 또는 영문 도시 이름을 입력하고 검색합니다.</span>
        </li>
        <li>
          <el-tag type="primary" round>2</el-tag>
          <strong>도시 선택</strong>
          <span>날씨 카드를 클릭하여 현재 선택 상태를 확인합니다.</span>
        </li>
        <li>
          <el-tag type="primary" round>3</el-tag>
          <strong>위치와 현지 시간 확인</strong>
          <span>
            넓은 데스크톱 화면의 오른쪽 Location Globe에서 도시 위치, 좌표, 현지 시간과
            낮·밤 진행도를 확인합니다.
          </span>
        </li>
        <li>
          <el-tag type="primary" round>4</el-tag>
          <strong>상세정보 이동</strong>
          <span>상세보기에서 단기 예보와 대기질 정보를 함께 확인합니다.</span>
        </li>
        <li>
          <el-tag type="primary" round>5</el-tag>
          <strong>온도 단위 변경</strong>
          <span>상단 단위 변경 버튼으로 모든 화면의 ℃와 ℉를 전환합니다.</span>
        </li>
      </ol>

      <RouterLink class="home-link" to="/">
        <el-button type="primary">날씨 대시보드 시작하기</el-button>
      </RouterLink>
    </el-card>
  </main>
</template>

<style scoped>
/* 추가 이용 안내 View */
.guide-container {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  padding: 54px 24px 70px;
  box-sizing: border-box;
}

.guide-card {
  border-color: #dbe4f0;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(45, 62, 90, 0.08);
}

.guide-card > :deep(.el-card__body) {
  padding: 34px;
}

.page-label {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.guide-card h1 {
  margin: 0;
  color: #172033;
  font-size: 30px;
}

.description {
  margin: 12px 0 22px;
  color: #64748b;
}

.guide-card ol {
  display: grid;
  gap: 12px;
  margin: 0 0 28px;
  padding: 0;
  list-style: none;
}

.guide-card li {
  display: grid;
  grid-template-columns: 34px 120px 1fr;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 11px;
}

.guide-card strong {
  color: #1e293b;
}

.guide-card span {
  color: #64748b;
  font-size: 14px;
}

.home-link {
  display: inline-block;
  text-decoration: none;
}

@media (max-width: 650px) {
  .guide-container {
    padding: 36px 16px 50px;
  }

  .guide-card > :deep(.el-card__body) {
    padding: 24px 20px;
  }

  .guide-card li {
    grid-template-columns: 34px 1fr;
  }

  .guide-card li span {
    grid-column: 2;
  }
}
</style>
