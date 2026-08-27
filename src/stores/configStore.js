/**
 * 파일명: configStore.js
 * 코드 내용: 날씨 온도 단위 및 화면 설정을 전역 상태로 관리하는 Pinia Store
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 */

import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    // 모든 날씨 화면에서 함께 사용하는 온도 단위
    unit: 'celsius',

    // 상세 화면의 습도와 풍속 표시 여부를 관리하는 개인 설정
    showExtraInfo: true,
  }),

  getters: {
    // 현재 온도 단위에 맞는 기호를 제공한다.
    unitSymbol: (state) => {
      return state.unit === 'celsius' ? '℃' : '℉'
    },

    // 추가 상세정보가 표시되는 상태인지 설명하는 문구를 제공한다.
    extraInfoText: (state) => {
      return state.showExtraInfo ? '상세 정보 표시 중' : '상세 정보 숨김'
    },
  },

  actions: {
    // 섭씨와 화씨 단위를 서로 전환한다.
    toggleUnit() {
      this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius'
    },

    // 습도와 풍속 상세정보의 표시 상태를 전환한다.
    toggleExtraInfo() {
      this.showExtraInfo = !this.showExtraInfo
    },
  },
})
