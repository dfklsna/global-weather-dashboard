/*
파일명: main.js
코드 내용: Vue 애플리케이션을 생성하고 Pinia와 Router를 등록한 뒤 App.vue를 실행한다.
작성자: 김상우
작성일자: 2026-08-25
수정 이력:
- 2026-08-25 17:29 Weather Composition 화면 연결
- 2026-08-26 14:20 Weather Component 화면 연결
- 2026-08-26 16:20 Vue Router 등록 및 App 연결
- 2026-08-27 10:20 Pinia 등록
- 2026-08-27 15:00 Element Plus와 기본 스타일 등록
*/

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

// 앱 전체에서 같은 Store와 Router를 사용할 수 있도록 순서대로 등록한다.
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
