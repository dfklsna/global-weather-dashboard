/**
 * 파일명: vite.config.js
 * 코드 내용: Global Weather Dashboard의 Vue Plugin을 설정한다.
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 * 작성시간: 16:29
 */

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
})
