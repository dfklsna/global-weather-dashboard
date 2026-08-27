<!--
============================================================
파일명      : App.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 10:20 Pinia UnitToggle을 공통 Navigation 영역에 추가
  - 2026-08-27 13:30 Weather Axios 제목과 API 과제 설명으로 변경
  - 2026-08-27 15:00 Element Plus el-card를 공통 Navigation에 적용
  - 2026-08-27 15:20 Navigation과 Dashboard가 공유하는 outer container 적용
설명        : Global Weather Dashboard의 공통 Layout으로
              Navigation Bar, 단위 설정, View 표시 영역을 구성한다.
주요 기능   :
  1. RouterLink를 이용한 메뉴 이동
  2. RouterView를 이용한 페이지별 View 표시
  3. 현재 선택된 메뉴의 시각적 구분
  4. 존재하지 않는 주소로 이동하여 404 View 확인
  5. Pinia Store를 사용하는 온도 단위 변경 UI 배치
============================================================
-->

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggle from './components/exercise/UnitToggle.vue'
</script>

<template>
  <div class="router-app">
    <!-- Navigation과 현재 View가 같은 가로 기준선을 공유하는 전체 Container -->
    <div class="page-container">
      <!-- 모든 View에서 공통으로 표시되는 상단 Navigation Bar -->
      <header class="header-shell">
        <el-card class="site-header" shadow="never">
          <div class="header-content">
            <RouterLink class="brand-link" to="/">🌤 Global Weather Dashboard</RouterLink>

            <div class="header-actions">
              <nav class="navigation" aria-label="주요 메뉴">
                <RouterLink to="/">🌦 날씨 대시보드</RouterLink>
                <RouterLink to="/about">ℹ️ 서비스 소개</RouterLink>
                <RouterLink to="/guide">📘 이용 안내</RouterLink>
                <RouterLink to="/favorites">⭐ 즐겨찾기</RouterLink>
              </nav>

              <!-- 모든 View가 공유하는 Pinia 온도 단위 설정 -->
              <UnitToggle />
            </div>
          </div>
        </el-card>
      </header>

      <!-- 현재 URL과 연결된 View가 표시되는 영역 -->
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
/* Global Weather Dashboard 전체 Layout */
.router-app {
  min-height: 100vh;
}

/* Navigation과 Home의 main + sidebar가 공유하는 단일 가로 Container */
.page-container {
  width: 100%;
  max-width: 1332px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
}

/* Element Plus Card를 사용한 공통 상단 Navigation Bar */
.header-shell {
  width: 100%;
  margin: 20px auto 0;
}

.site-header {
  border-color: #dbe4f0;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(45, 62, 90, 0.07);
}

.site-header :deep(.el-card__body) {
  padding: 14px 18px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-sizing: border-box;
}

.brand-link {
  color: #172033;
  font-size: 18px;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navigation a {
  padding: 8px 11px;
  color: #64748b;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.navigation a:hover {
  color: #1d4ed8;
  background: #eff6ff;
}

.navigation a.router-link-exact-active {
  color: #ffffff;
  background: #2563eb;
}

@media (max-width: 980px) {
  .header-content {
    flex-wrap: wrap;
  }

  .header-actions {
    justify-content: space-between;
    width: 100%;
  }
}

@media (max-width: 720px) {
  .page-container {
    padding: 0 16px;
  }

  .header-content {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .brand-link {
    text-align: center;
  }

  .header-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .navigation {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .navigation a {
    padding: 8px 5px;
    text-align: center;
  }
}
</style>
