/**
 * 파일명: router/index.js
 * 코드 내용: Weather Router 과제의 URL 경로와 View 연결 규칙을 설정한다.
 * 작성자: 김상우
 * 작성일자: 2026-08-26
 * 주요 기능:
 * 1. createWebHistory를 이용한 Router 생성
 * 2. 전체 View Lazy Loading
 * 3. 도시 상세 Dynamic Route 설정
 * 4. 존재하지 않는 주소를 처리하는 Catch-all Route 설정
 */

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'weather-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/about',
      name: 'weather-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/guide',
      name: 'weather-guide',
      component: () => import('../views/WeatherGuideView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
