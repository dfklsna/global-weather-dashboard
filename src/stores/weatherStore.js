/**
 * 파일명: weatherStore.js
 * 코드 내용: 사용자가 선택한 API 도시와 최근 확인한 도시를 전역 상태로 관리하는 Pinia Store
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 * 수정 이력:
 * - 2026-08-27 13:30 Axios 검색 결과를 공유하는 selectedCity 상태와 Action 추가
 */

import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    // 실제 API 검색 결과 중 상세보기로 이동할 도시를 저장한다.
    selectedCity: null,

    // 아직 상세 페이지를 확인하지 않았을 때는 최근 도시가 없다.
    lastViewedCity: null,
  }),

  getters: {
    // 상세 화면에서 재사용할 선택 도시가 있는지 알려준다.
    hasSelectedCity: (state) => {
      return state.selectedCity !== null
    },

    // 최근 확인한 도시가 저장되어 있는지 알려준다.
    hasViewedCity: (state) => {
      return state.lastViewedCity !== null
    },
  },

  actions: {
    // 실제 API 검색 결과 중 선택한 도시를 상세 화면과 공유한다.
    setSelectedCity(city) {
      this.selectedCity = city
    },

    // 상세 페이지에서 확인한 도시를 최근 도시로 저장한다.
    setLastViewedCity(city) {
      this.lastViewedCity = city
    },
  },
})
