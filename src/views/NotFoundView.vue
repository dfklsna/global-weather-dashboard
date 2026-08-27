<!--
============================================================
파일명      : NotFoundView.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 15:00 Element Plus el-card, el-empty, el-button 적용
설명        : Catch-all Route와 연결되어 존재하지 않는
              URL에 접근했을 때 안내 화면을 표시한다.
주요 기능   :
  1. 404 안내 문구 표시
  2. RouterLink를 이용한 메인 이동
============================================================
-->

<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="not-found-container">
    <el-card class="not-found-card" shadow="never">
      <el-tag class="error-code" type="primary" effect="plain">404 NOT FOUND</el-tag>
      <el-empty description="페이지를 찾을 수 없습니다." :image-size="120">
      <p>
        요청하신 주소가 존재하지 않거나<br />
        아직 개발되지 않은 페이지입니다.
      </p>
        <RouterLink class="home-link" to="/">
          <el-button type="primary">날씨 메인으로 이동</el-button>
        </RouterLink>
      </el-empty>
    </el-card>
  </main>
</template>

<style scoped>
/* Catch-all Route 404 화면 */
.not-found-container {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 70px 24px;
  box-sizing: border-box;
}

.not-found-card {
  border-color: #dbe4f0;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(45, 62, 90, 0.08);
  text-align: center;
}

.not-found-card > :deep(.el-card__body) {
  padding: 38px 30px;
}

.error-code {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.not-found-card p {
  margin: 0 0 18px;
  color: #64748b;
  line-height: 1.7;
}

.home-link {
  display: inline-block;
  text-decoration: none;
}
</style>
