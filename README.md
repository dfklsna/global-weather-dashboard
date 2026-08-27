# Global Weather Dashboard

Global Weather Dashboard는 Vue 3 기반의 실시간 세계 날씨 대시보드입니다.
OpenWeatherMap과 Open-Meteo를 이용하여 현재 날씨, 단기 예보와 대기질 정보를 제공하고, 검색 도시의 위치를 3D Globe로 시각화합니다.
도시별 현지 시간, 일출·일몰과 낮·밤 진행도를 함께 제공하여 지역별 기상 정보를 직관적으로 확인할 수 있도록 구현했습니다.

![Global Weather Dashboard 대표 이미지](public/og.png)

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [주요 기능](#2-주요-기능)
3. [기술 스택](#3-기술-스택)
4. [화면 구성](#4-화면-구성)
5. [프로젝트 구조](#5-프로젝트-구조)
6. [API 구성](#6-api-구성)
7. [상태관리](#7-상태관리)
8. [Routing](#8-routing)
9. [Location Globe](#9-location-globe)
10. [Local Time & Daylight Progress](#10-local-time--daylight-progress)
11. [환경변수 설정](#11-환경변수-설정)
12. [설치 및 실행](#12-설치-및-실행)
13. [ESLint](#13-eslint)
14. [Production Build](#14-production-build)
15. [Deployment](#15-deployment)
16. [작성자](#16-작성자)

## 1. 프로젝트 소개

전 세계 도시를 한글 또는 영문으로 검색하고 현재 기상 정보, 단기 예보, 대기질, 위치와 현지 시간을 한 화면에서 확인하는 SPA 프로젝트입니다.
Vue의 반응형 상태, Component 통신, Pinia 전역 상태, Vue Router와 외부 API 연동을 단계적으로 적용한 뒤 ESLint, Production Build와 Hosting 과정까지 구성했습니다.

## 2. 주요 기능

- 대한민국 33개 도시 한글 검색과 전 세계 도시 영문 검색
- OpenWeatherMap 실시간 현재 날씨와 5일·3시간 단기 예보
- Open-Meteo 현재 PM10, PM2.5 대기질 정보
- 날씨 카드 선택·선택 해제와 도시 상세보기
- 섭씨·화씨 전환과 최근 확인 도시 상태 공유
- 날씨 상태별 Badge와 원본 섭씨 온도 구간별 색상
- Dynamic Route, Catch-all Route와 사용자용 404 화면
- 3D Location Globe, 도시 Marker, 국가와 위도·경도 표시
- 도시 현지 시간, 일출·일몰, 낮·밤 진행도와 남은 시간
- Loading, Error, Empty 상태와 반응형 Layout

## 3. 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | Vue 3, Vite |
| Routing | Vue Router |
| State | Pinia |
| HTTP | Axios |
| UI | Element Plus |
| Visualization | Globe.gl, Three.js |
| API | OpenWeatherMap, Open-Meteo |
| Quality | ESLint, eslint-plugin-vue |
| Deployment | Vercel |

## 4. 화면 구성

- 메인 대시보드: 도시 검색, 실시간 날씨 카드, 선택 상태와 최근 확인 도시
- Location Globe: 3D 지구, 도시 위치, 좌표, 현지 시간과 낮·밤 진행도
- 상세 화면: 현재 기상 관측값, 단기 예보와 대기질 정보
- 서비스 소개와 이용 안내: 적용 기술, 주요 기능과 사용 순서
- 404 화면: 존재하지 않는 주소와 즐겨찾기 메뉴 처리

## 5. 프로젝트 구조

| 경로 | 역할 |
|---|---|
| `src/api` | OpenWeatherMap 및 Open-Meteo API 요청 |
| `src/components/exercise` | 예보, 대기질, 단위 전환, Location Globe |
| `src/components/weather` | 검색, 날씨 카드와 공통 Dashboard Component |
| `src/data` | 한글 도시 별칭과 API 실패 시 예비 데이터 |
| `src/router` | 페이지 Route, Dynamic Route와 Catch-all Route |
| `src/stores` | 온도 단위, 선택 도시와 최근 도시 Pinia Store |
| `src/utils` | 날씨 상태와 온도 색상 규칙 |
| `src/views` | 메인, 상세, 소개, 안내와 404 View |
| `vercel.json` | Vercel SPA Route Fallback 설정 |

## 6. API 구성

- OpenWeatherMap Current Weather API: 검색 도시의 현재 날씨, 좌표, 국가, 시간대, 일출과 일몰
- OpenWeatherMap 5 Day / 3 Hour Forecast API: 상세 화면의 단기 예보
- Open-Meteo Air Quality API: 검색 도시 좌표 기준 현재 PM10과 PM2.5
- API 요청 실패 시 Loading·Error UI를 표시하며 기본 도시는 예비 데이터로 안전하게 전환합니다.

## 7. 상태관리

Pinia의 `configStore`에서 섭씨·화씨 단위와 상세정보 표시 상태를 관리합니다.
`weatherStore`에서는 검색하거나 선택한 도시와 최근 상세 화면에서 확인한 도시를 관리하여 메인, 상세와 Location Globe가 같은 데이터를 공유합니다.

## 8. Routing

| 주소 | 화면 |
|---|---|
| `/` | 메인 날씨 대시보드 |
| `/about` | 서비스 소개 |
| `/guide` | 이용 안내 |
| `/weather/:cityId` | 도시별 상세 날씨 |
| 그 외 주소 | 404 Not Found |

Vercel에서는 `vercel.json`의 SPA Rewrite가 모든 Vue Route를 `index.html`로 연결하므로 Dynamic Route를 직접 열거나 새로고침해도 해당 화면이 정상 표시됩니다.

## 9. Location Globe

Globe.gl과 Three.js를 이용해 실제 지구 표면을 3D로 표시합니다.
검색 또는 선택한 도시의 OpenWeatherMap 위도·경도를 사용해 카메라와 Marker를 이동하며, Marker는 원본 섭씨 온도 구간에 맞춰 색상이 변경됩니다.
지구 Texture는 외부 CDN에서 받아오므로 3D 지구 표면을 확인하려면 인터넷 연결이 필요합니다.

## 10. Local Time & Daylight Progress

OpenWeatherMap Current Weather 응답의 UTC Offset, 일출과 일몰 Unix Timestamp를 재사용합니다.
검색 도시의 현재 현지 시간과 UTC Offset을 표시하고, 낮에는 일출부터 일몰까지, 밤에는 일몰부터 다음 일출까지의 진행률과 남은 시간을 계산합니다.

## 11. 환경변수 설정

실제 OpenWeatherMap API Key는 Source Code나 README에 작성하지 않습니다.

```bash
cp .env.example .env
```

생성된 `.env`에 본인의 Key를 설정합니다.

```env
VITE_OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
```

`.env`와 로컬 환경변수 파일은 `.gitignore`에서 제외합니다.
단, Vite의 `VITE_*` 값은 Frontend Build 결과에서 브라우저가 API 요청에 사용하므로 완전한 Server Secret과는 다릅니다.

## 12. 설치 및 실행

```bash
npm install
npm run dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 열어 확인합니다.

## 13. ESLint

```bash
npm run lint
```

JavaScript와 Vue 파일의 문법 오류, 미정의 변수와 사용하지 않는 변수를 검사합니다.

## 14. Production Build

```bash
npm run build
```

완료된 정적 파일은 `dist/`에 생성되며 `index.html`과 `assets/`를 포함합니다.

```bash
npm run preview
```

위 명령으로 배포 전 Production Build 결과를 로컬에서 확인할 수 있습니다.

## 15. Deployment

Source Repository: [dfklsna/global-weather-dashboard](https://github.com/dfklsna/global-weather-dashboard)

Vercel은 Vite Production Build 결과를 Hosting하며, `vercel.json`의 Rewrite로 Vue Router 직접 접근과 새로고침을 처리합니다.
배포 환경에는 `VITE_OPENWEATHER_API_KEY`를 환경변수로 등록하며 실제 Key 값은 Repository와 README에 포함하지 않습니다.

Deployment URL: [Global Weather Dashboard](https://global-weather-dashboard-gules.vercel.app/)

## 16. 작성자

- 김상우
- GitHub: `dfklsna`

---

## Vue 수업 과제 작업 기록

이 문서는 Vue 수업 과제를 진행한 날짜와 시간, 작업 내용, 구현 방법을 순서대로 기록합니다.
새로운 과제나 기능을 만들 때 기존 기록은 남겨 두고 가장 아래에 새로운 작업 기록을 추가합니다.

## 파일 머리말 관리 기준

- `작성일`은 해당 파일이 과제에서 처음 만들어진 날짜를 유지합니다.
- 기존 파일을 다음 과제에서 다시 변경하면 작성일을 덮어쓰지 않고 날짜, 시간, 변경 내용을 `수정 이력`에 추가합니다.
- README 1번부터 13번까지의 작업 날짜와 실제 Vue, JavaScript, CSS, HTML 파일 머리말을 대조하였습니다.
- JSON과 Lock 파일처럼 주석을 허용하지 않는 파일은 머리말을 넣지 않고 각 작업의 파일 목록에서 변경 날짜를 관리합니다.

| 작업 기록 | 날짜 | 머리말 확인 내용 |
|---|---|---|
| 1~3. WeatherMockup | 2026-08-25 | 최초 작성일과 검색·카드 선택 수정 이력 |
| 4. Weather Composition | 2026-08-25 | Composition 파일 작성일과 main·index 수정 이력 |
| 5. Weather Component | 2026-08-26 | Component 파일 작성일과 연결 파일 수정 이력 |
| 6. Weather Router | 2026-08-26 | App, Router, Mock Data, View 파일 작성일 |
| 7. Weather Store | 2026-08-27 | Store, UnitToggle 작성일과 기존 View 수정 이력 |
| 8. Weather Axios | 2026-08-27 13:30 | API·예보·대기질 파일 작성일과 기존 파일 수정 이력 |
| 9. 한글 도시 검색 확장 | 2026-08-27 14:00 | 도시 별칭 파일 작성일과 메인 View 수정 이력 |
| 10. Weather UI Library | 2026-08-27 15:00 | Element Plus 적용 파일과 기존 파일 수정 이력 |
| 11. 3D Location Globe 패널 | 2026-08-27 15:20 | LocationGlobe 작성일과 App·API·Mock Data·메인 View 수정 이력 |
| 12. Location Globe 현지 시간과 낮·밤 진행도 | 2026-08-27 16:00 | LocationGlobe·API·Mock Data·소개·안내 View 수정 이력 |
| 13. Global Weather Dashboard 최종 배포 | 2026-08-27 16:29 | 최종 서비스명·ESLint·환경변수·Build·Vercel 배포 이력 |

## 공통 실행 방법

프로젝트 폴더에서 아래 명령어를 실행합니다.

```bash
npm install
npm run dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 열면 과제 화면을 확인할 수 있습니다.

---

## 작업 기록

### 1. 2026-08-25 (화요일) 11:44 - WeatherMockup 기본 화면 구현

#### 작업 목적

Vue의 기본 문법을 활용하여 지역별 날씨를 카드로 보여주는 WeatherMockup 화면을 구현하였습니다.
`v-for` 배열 렌더링, `v-if / v-else` 조건부 렌더링, 입력 및 클릭 이벤트 처리를 직접 사용하는 것을 목표로 하였습니다.

#### 작업한 내용

1. 서울, 수원, 부산의 기본 날씨 데이터와 개인 데이터인 인천을 추가하였습니다.
2. `v-for`와 `:key`를 사용하여 날씨 카드를 반복 출력하였습니다.
3. 25도를 기준으로 더움과 선선함 상태를 구분하였습니다.
4. `:value`와 `@input`을 사용하여 도시 검색어를 입력받았습니다.
5. 날씨 카드를 클릭하면 선택된 도시 이름이 하단에 표시되도록 하였습니다.
6. 상세보기 버튼을 클릭하면 `window.alert()`로 날씨 상태가 표시되도록 하였습니다.
7. `@click.stop`을 사용하여 상세보기 버튼 클릭 시 카드 클릭 이벤트가 실행되지 않게 하였습니다.

#### 사용한 주요 Vue 문법

- `ref()` : 날씨 데이터와 화면 상태 관리
- `v-for`, `:key` : 날씨 카드 반복 출력
- `v-if`, `v-else` : 기온에 따른 상태 구분
- `:value`, `@input` : 검색 입력값 처리
- `@click` : 날씨 카드 선택
- `@click.stop` : 이벤트 버블링 방지
- `{{ }}` : 데이터 화면 출력

#### 수정한 파일

- `src/WeatherMockup.vue`
- `src/main.js`
- `src/style.css`
- `index.html`
- `README.md`

#### 화면 구성

- 상단: WeatherMockup 제목과 도시 검색 영역
- 중앙: 서울, 수원, 부산, 인천의 날씨 카드 목록
- 하단: 현재 선택한 도시 상태 표시

---

### 2. 2026-08-25 (화요일) 11:49 - 도시 검색 기능 보완

#### 작업한 이유

처음에는 검색창에 입력한 글자만 화면에 표시되고 날씨 카드 목록은 바뀌지 않았습니다.
검색 기능이라는 이름에 맞게 입력한 도시와 일치하는 카드만 보이도록 기능을 보완하였습니다.

#### 작업 내용

- 검색창에 `서울`, `수원` 등의 도시 이름을 입력하면 일치하는 카드만 표시됩니다.
- 검색창을 비우면 모든 도시 카드가 다시 표시됩니다.
- 일치하는 도시가 없으면 검색 결과가 없다는 안내 문구가 표시됩니다.

#### 구현한 방법

- 입력한 검색어가 도시 이름에 포함되는지 확인하여 일치하는 카드만 표시하였습니다.
- 날씨 데이터를 순서대로 확인하여 검색 결과가 있는지 판단하였습니다.
- 검색 결과가 없을 때는 `v-if`로 안내 문구를 표시하였습니다.

#### 수정한 파일

- `src/WeatherMockup.vue`
- `README.md`

---

### 3. 2026-08-25 (화요일) 14:04 - 날씨 카드 선택 표시 및 선택 해제

#### 작업 내용

- 날씨 카드를 클릭하면 선택된 카드의 테두리, 배경색, 그림자가 파란색으로 강조됩니다.
- 선택된 카드를 다시 클릭하면 선택 상태가 해제됩니다.
- 선택이 해제되면 하단 상태 영역에 기본 안내 문구가 다시 표시됩니다.

#### 구현한 방법

- `selectCity` 함수에서 현재 선택된 도시와 클릭한 도시가 같은지 `if / else`로 확인하였습니다.
- 같은 도시를 다시 클릭하면 `selectedCity`를 빈 문자열로 변경하였습니다.
- `:class`로 선택된 카드에 `selected-card` 클래스를 적용하였습니다.

#### 수정한 파일

- `src/WeatherMockup.vue`
- `README.md`

---

### 4. 2026-08-25 (화요일) 17:29 - Weather Composition API 구현

#### 작업 목적

Composition API의 `computed`, `watch`, `watchEffect`를 활용하여 날씨 검색과 상태 변화 감시 기능을 구현하였습니다.

#### 작업 내용

- 검색어, 선택된 도시 정보, 지역별 날씨 데이터를 반응형 상태로 정의하였습니다.
- 검색어가 없으면 전체 날씨를 보여주고 검색어가 있으면 일치하는 도시만 보여주도록 구현하였습니다.
- 일치하는 도시가 없을 때 별도의 안내 화면이 표시되도록 하였습니다.
- 선택 도시가 바뀌면 상태바 문구를 콘솔에 기록하도록 하였습니다.
- 검색어가 바뀔 때마다 현재 검색어를 콘솔에 기록하도록 하였습니다.
- 선택한 카드를 다시 누르면 선택이 해제되는 기능을 유지하였습니다.
- 개인 기능으로 섭씨와 화씨 단위를 전환할 수 있도록 추가하였습니다.

#### 구현한 방법

- `filteredWeatherList`를 computed로 만들어 검색 결과 배열을 관리하였습니다.
- `selectedCityInfo`를 watch로 감시하여 상태바 변경 내용을 기록하였습니다.
- `searchQuery`를 watchEffect로 추적하여 검색어 변경 내용을 기록하였습니다.
- 개인 반응형 상태인 `useFahrenheit`, 계산된 단위 이름, 단위 변경 watcher를 추가하였습니다.

#### 수정한 파일

- `src/WeatherComposition.vue`
- `src/main.js`
- `index.html`
- `README.md`

#### 확인 결과

- 검색 전 전체 목록, 검색 결과 목록, 검색 결과 없음 화면이 조건에 맞게 표시됩니다.
- 카드 선택과 선택 해제, 상세보기, 온도 단위 변경 기능이 동작합니다.
- 상태 변화는 브라우저 콘솔에서 확인할 수 있습니다.

---

### 5. 2026-08-26 (수요일) 14:20 - Weather Component 실습

#### 프로젝트 소개

기존 날씨 화면의 기능과 디자인을 유지하면서 부모와 자식 Vue Component로 역할을 분리한 과제입니다.
부모가 데이터를 관리하고 자식이 화면과 이벤트를 담당하는 기본적인 Component 통신 구조를 직접 적용하였습니다.

#### 구현 목표

- Component별 역할 분리
- props를 이용한 부모에서 자식으로의 데이터 전달
- emits를 이용한 자식에서 부모로의 이벤트 전달
- slot을 이용한 공통 Dashboard Card 구현
- scoped CSS를 이용한 컴포넌트별 스타일 분리
- 기존 검색, 카드 선택, 상세보기, 온도 단위 변경 기능 유지

#### Component 구조

- `WeatherParent.vue`
  - `BaseDashboardCard.vue` 안에 `SearchBar.vue` 배치
  - `BaseDashboardCard.vue` 안에 여러 `WeatherCard.vue` 배치
  - 추가 Component인 `WeatherStatus.vue` 배치

#### Component별 역할

- `WeatherParent.vue`: 검색어, 날씨 목록, 선택 도시, 온도 단위를 관리하고 자식 이벤트를 처리합니다.
- `BaseDashboardCard.vue`: slot으로 전달된 검색 영역과 날씨 목록 영역에 공통 카드 디자인을 제공합니다.
- `SearchBar.vue`: 검색어를 props로 받아 input에 표시하고 변경된 검색어를 emits로 전달합니다.
- `WeatherCard.vue`: 도시 객체를 props로 받아 날씨를 표시하고 선택 및 상세보기 이벤트를 emits로 전달합니다.
- `WeatherStatus.vue`: 선택된 도시 정보를 props로 받아 화면 하단 상태 문구를 표시합니다.

#### 데이터 흐름

- 부모에서 SearchBar로 현재 검색어를 props로 전달합니다.
- SearchBar에서 부모로 `update-query` 이벤트를 전달합니다.
- 부모에서 WeatherCard로 도시 객체, 선택 상태, 온도 단위 상태를 props로 전달합니다.
- WeatherCard에서 부모로 `select-card`, `click-detail` 이벤트를 전달합니다.
- 부모에서 WeatherStatus로 선택된 도시 정보를 props로 전달합니다.
- BaseDashboardCard는 slot을 이용하여 검색 UI와 날씨 목록 UI를 감쌉니다.

#### 주요 기능

- 한글 도시 검색어 즉시 반영
- 검색어와 일치하는 지역별 날씨 카드 출력
- 검색 결과가 없을 때 안내 문구 표시
- 날씨 카드 선택 및 같은 카드 재선택 시 선택 해제
- 상세보기 버튼 클릭 시 현재 날씨 알림 표시
- 상세보기 버튼의 이벤트 버블링 방지
- 섭씨와 화씨 온도 단위 변경
- 검색어, 선택 도시, 온도 단위 변화의 콘솔 기록

#### 실제 폴더 구조

- `src/components/weather/WeatherParent.vue`
- `src/components/weather/BaseDashboardCard.vue`
- `src/components/weather/SearchBar.vue`
- `src/components/weather/WeatherCard.vue`
- `src/components/weather/WeatherStatus.vue`

#### 구현하면서 확인한 내용

- props는 부모가 가진 데이터를 자식 화면에 전달할 때 사용한다는 점을 확인하였습니다.
- emits는 자식에서 일어난 입력과 클릭 동작을 부모에게 알릴 때 사용하였습니다.
- slot을 사용하면 공통 카드 디자인은 유지하면서 안쪽 내용만 다르게 넣을 수 있었습니다.
- 각 컴포넌트에 scoped CSS를 작성하여 다른 컴포넌트 스타일에 영향을 주지 않도록 하였습니다.

#### 수정한 파일

- `src/components/weather/WeatherParent.vue`
- `src/components/weather/BaseDashboardCard.vue`
- `src/components/weather/SearchBar.vue`
- `src/components/weather/WeatherCard.vue`
- `src/components/weather/WeatherStatus.vue`
- `src/main.js`
- `index.html`
- 기존 `README.md`

#### 확인 결과

- 기존 날씨 화면의 검색, 선택, 상세보기, 온도 단위 변경 기능을 유지하였습니다.
- props, emits, slot이 각각 요구된 위치에서 사용됩니다.
- 모든 새 Component에 역할에 맞는 머리말, 주석, scoped CSS를 작성하였습니다.

#### 작성자

김상우

---

### 6. 2026-08-26 (수요일) 16:20 - Weather Router

#### 프로젝트 설명

Vue 3와 Vue Router 4를 활용하여 기존 날씨 대시보드를 여러 View로 확장한 과제입니다.
기존 WeatherMockup, WeatherComposition, Weather Component 파일은 삭제하거나 변경하지 않고 Router 전용 App, View, Mock Data를 새로 구성하였습니다.

#### 주요 기능

- 기존 도시 검색과 지역별 날씨 카드
- RouterLink를 이용한 상단 Navigation Bar
- RouterView를 이용한 View 전환
- router.push를 이용한 상세 페이지 이동
- `/weather/:cityId` Dynamic Route
- route.params를 이용한 도시 코드 확인
- 전체 View Lazy Loading
- Catch-all Route를 이용한 잘못된 주소 처리
- 상단의 `즐겨찾기` 메뉴를 이용한 404 화면 확인
- 지역별 상세 날씨, 서비스 소개, 이용 안내, 404 View

#### Routing Table

| 경로 | View | 설명 |
|---|---|---|
| `/` | WeatherHomeView | 메인 날씨 대시보드 |
| `/about` | WeatherAboutView | 서비스 소개 |
| `/weather/:cityId` | WeatherDetailView | 지역별 상세 날씨 |
| `/guide` | WeatherGuideView | 추가 이용 안내 View |
| `/:pathMatch(.*)*` | NotFoundView | 존재하지 않는 주소 안내 |

#### Router 파일 구조

- `src/App.vue`: 공통 Navigation Bar와 RouterView
- `src/router/index.js`: URL과 View 연결, Lazy Loading, Catch-all Route
- `src/data/weatherData.js`: 메인과 상세 View가 함께 사용하는 날씨 Mock Data
- `src/views/WeatherHomeView.vue`: 메인 날씨 대시보드
- `src/views/WeatherDetailView.vue`: Dynamic Route 지역별 상세 화면
- `src/views/WeatherAboutView.vue`: 서비스 소개
- `src/views/WeatherGuideView.vue`: 직접 추가한 이용 안내 View
- `src/views/NotFoundView.vue`: 잘못된 주소를 처리하는 404 View

#### 재사용한 기존 Component

- `BaseDashboardCard.vue`: 검색 영역과 날씨 목록의 공통 Layout
- `SearchBar.vue`: 검색어를 props로 받고 `update-query` 이벤트 전달
- `WeatherCard.vue`: 도시 객체를 표시하고 `select-card`, `click-detail` 이벤트 전달
- `WeatherStatus.vue`: 현재 선택된 도시 상태 표시

#### 데이터 및 이동 흐름

- SearchBar에서 전달한 검색어를 WeatherHomeView가 관리합니다.
- WeatherHomeView가 검색 결과와 선택 도시 상태를 계산하여 자식 Component에 전달합니다.
- WeatherCard의 상세보기 버튼은 `click-detail` 이벤트만 발생시킵니다.
- WeatherHomeView가 이벤트를 받아 `router.push`로 도시 상세 URL에 이동합니다.
- WeatherDetailView는 `route.params.cityId`로 도시를 찾고 상세 Mock Data를 표시합니다.
- 잘못된 cityId는 오류를 발생시키지 않고 별도 안내 화면을 표시합니다.

#### Router 개념별 구현 위치

- `RouterLink`: App의 상단 메뉴와 각 View의 메인 이동 버튼에 사용하였습니다.
- `RouterView`: App에서 현재 URL과 연결된 View를 표시합니다.
- `router.push()`: WeatherHomeView에서 상세보기 클릭 시 도시 상세 URL로 이동합니다.
- `route.params`: WeatherDetailView에서 현재 URL의 cityId를 읽습니다.
- Lazy Loading: router/index.js에서 모든 View를 동적 import 방식으로 연결했습니다.
- Catch-all Route: 등록되지 않은 주소를 NotFoundView로 연결했습니다.
- 404 확인 메뉴: 이용 안내 오른쪽의 `즐겨찾기`를 누르면 아직 등록되지 않은 `/favorites`로 이동하여 NotFoundView가 표시됩니다.

#### 기존 디자인과 기능 유지

- 기존 파란색 카드, 버튼, 선택 테두리 디자인을 유지하였습니다.
- 한글 도시 검색, 검색 결과 없음, 카드 선택과 해제, 섭씨와 화씨 단위 변경 기능을 유지하였습니다.
- 기존 WeatherCard의 props 및 emits와 BaseDashboardCard의 slot 구조를 그대로 재사용하였습니다.
- 상세보기 동작만 Router 과제 요구사항에 따라 alert에서 상세 View 이동으로 변경하였습니다.

#### 실행 방법

프로젝트 상단의 공통 실행 방법과 동일하게 `npm install` 후 `npm run dev`를 실행합니다.
터미널에 표시되는 Vite 주소에서 각 Router 경로를 확인할 수 있습니다.

#### 생성 및 수정한 파일

- `src/App.vue`
- `src/router/index.js`
- `src/data/weatherData.js`
- `src/views/WeatherHomeView.vue`
- `src/views/WeatherDetailView.vue`
- `src/views/WeatherAboutView.vue`
- `src/views/WeatherGuideView.vue`
- `src/views/NotFoundView.vue`
- `src/main.js`
- `index.html`
- 기존 `README.md`

#### 작성자

- 작성자: 김상우
- 작성일자: 2026-08-26

---

### 7. 2026-08-27 (목요일) 10:20 - Weather Store (Pinia)

#### 프로젝트 설명

Vue 3, Vue Router 4, Pinia를 이용하여 날씨 정보와 화면 설정을 관리하는 실습 프로젝트입니다.
기존 Router, 도시 검색, 카드 선택, 상세보기, Component 통신 구조는 유지하면서 전역 상태관리를 추가하였습니다.

#### 작업 목적

- Pinia의 State, Getter, Action 역할 이해
- 메인 화면과 상세 화면에서 같은 전역 상태 공유
- 원본 섭씨 데이터는 유지하고 표시 온도만 화씨로 계산
- 직접 만든 추가 Store를 실제 화면과 이동 과정에서 활용

#### 주요 기능

- Pinia 설치 및 Vue 앱 전체 등록
- 상단 Navigation Bar의 섭씨·화씨 단위 변경
- 메인 날씨 카드와 상세 날씨 화면의 단위 동기화
- 상세 화면의 습도·풍속 표시 및 숨김 설정
- 상세 페이지에서 최근 확인한 도시 저장
- 메인 화면에서 최근 확인한 도시 표시 및 다시 보기
- 기존 도시 검색, 카드 선택·해제, Dynamic Route, Catch-all Route 유지

#### Pinia Store 구조

| Store | State | Getter | Action | 역할 |
|---|---|---|---|---|
| configStore | `unit` | `unitSymbol` | `toggleUnit` | 섭씨와 화씨 온도 단위 관리 |
| configStore | `showExtraInfo` | `extraInfoText` | `toggleExtraInfo` | 상세 화면의 습도와 풍속 표시 설정 |
| weatherStore | `lastViewedCity` | `hasViewedCity` | `setLastViewedCity` | 최근 확인한 도시 관리 |

#### Pinia 개념 정리

- State: Store에서 관리하는 반응형 데이터입니다. 온도 단위, 상세정보 표시 상태, 최근 확인한 도시에 사용하였습니다.
- Getter: State를 기준으로 계산된 값을 제공합니다. 온도 기호, 상세정보 상태 문구, 최근 도시 존재 여부를 판단할 때 사용하였습니다.
- Action: State를 변경하는 동작입니다. 단위 변경, 상세정보 표시 전환, 최근 도시 저장에 사용하였습니다.

#### 화면별 Store 적용

- `App.vue`: UnitToggle을 Navigation Bar에 배치하여 어느 View에서도 단위를 변경할 수 있게 하였습니다.
- `WeatherHomeView.vue`: configStore의 단위를 WeatherCard에 전달하고 weatherStore의 최근 도시를 표시합니다.
- `WeatherCard.vue`: 전달받은 전역 단위 상태를 기준으로 표시 온도만 계산합니다.
- `WeatherDetailView.vue`: configStore의 단위와 상세정보 설정을 사용하고 weatherStore에 현재 도시를 저장합니다.
- `UnitToggle.vue`: configStore를 직접 사용하여 단위 이름과 기호를 표시하고 Action을 실행합니다.

#### 기존 기능 유지

- SearchBar의 props와 emits 구조를 변경하지 않았습니다.
- WeatherCard의 props, 선택 이벤트, 상세보기 이벤트를 유지하였습니다.
- BaseDashboardCard의 slot 구조를 그대로 사용하였습니다.
- 기존 RouterLink, RouterView, 상세 Dynamic Route, 소개, 이용 안내, 404 View를 유지하였습니다.
- 기존 파란색 카드, 버튼, 선택 테두리 디자인을 유지하였습니다.

#### 생성 및 수정한 파일

- `src/stores/configStore.js`
- `src/stores/weatherStore.js`
- `src/components/exercise/UnitToggle.vue`
- `src/main.js`
- `src/App.vue`
- `src/views/WeatherHomeView.vue`
- `src/views/WeatherDetailView.vue`
- `package.json`
- `package-lock.json`
- `index.html`
- 기존 `README.md`

#### 확인 결과

- 첫 화면에서 서울의 기온이 28℃로 표시됩니다.
- 단위 변경 후 서울을 포함한 모든 날씨 카드가 화씨로 함께 변경됩니다.
- 화씨 상태에서 서울 상세 화면으로 이동하면 82℉로 동일하게 표시됩니다.
- 단위를 다시 변경하면 메인과 상세 화면이 섭씨로 정상 복귀합니다.
- 상세정보 표시와 숨김 기능이 동작합니다.
- 상세 화면 방문 후 메인에 최근 확인한 도시가 표시됩니다.
- 도시 검색, 카드 선택과 해제, 소개, 이용 안내, 잘못된 도시 코드, 즐겨찾기 404가 정상 동작합니다.
- 브라우저 콘솔에서 JavaScript, Vue, Pinia, Router 오류와 경고가 발생하지 않았습니다.
- 프로젝트 빌드가 정상 완료되었습니다.

#### 작성자

- 작성자: 김상우
- 작성일자: 2026-08-27

---

### 8. 2026-08-27 (목요일) 13:30 - Weather Axios

#### 프로젝트 설명

Vue 3, Vue Router 4, Pinia, Axios를 사용하여 실제 날씨와 대기질 데이터를 조회하는 날씨 대시보드 과제입니다.
서울, 수원, 부산, 인천의 기본 카드부터 OpenWeatherMap 실제 데이터를 사용하며, 기존 Mock Data는 API 실패 시 사용할 예비 데이터로 유지하였습니다.

#### 사용 기술

- Vue 3 Composition API
- Vue Router 4
- Pinia
- Axios
- OpenWeatherMap API
- Open-Meteo Air Quality API

#### API 구성

| API | 사용 목적 |
|---|---|
| OpenWeatherMap Current Weather | 기본 네 도시, 검색 도시의 실제 현재 날씨 조회 및 cityId 상세 재조회 |
| OpenWeatherMap 5 Day / 3 Hour Forecast | 상세 화면에 앞의 6개 단기 예보 표시 |
| Open-Meteo Air Quality | 선택 도시 좌표의 현재 PM10 및 PM2.5 표시 |

#### 환경변수 설정

실제 API Key는 코드나 README에 작성하지 않고 프로젝트 루트의 `.env`에서 관리합니다.
먼저 `.env.example`을 복사하여 `.env`를 만듭니다.

```bash
cp .env.example .env
```

만든 `.env` 안의 예제 값을 본인이 발급받은 OpenWeatherMap Key로 변경합니다.

```env
VITE_OPENWEATHER_API_KEY=본인이_발급받은_API_KEY
```

환경변수를 추가하거나 변경한 뒤에는 개발 서버를 다시 실행해야 합니다.
`.env`와 `.env.local`은 `.gitignore`에 추가하여 Git에 포함되지 않도록 하였습니다.

#### Axios 사용 위치

- `src/api/weatherApi.js`: 현재 날씨, cityId 현재 날씨 재조회, 5일/3시간 단기 예보 요청
- `src/api/airQualityApi.js`: 좌표 기반 Open-Meteo 현재 대기질 요청
- API 응답은 화면에서 필요한 도시 이름, 기온, 체감온도, 기상 상태, 습도, 풍속, 좌표만 정리하여 사용합니다.

#### 데이터 흐름

1. WeatherHomeView가 화면에 표시되면 서울, 수원, 부산, 인천을 OpenWeatherMap에서 순서대로 조회합니다.
2. 실제 응답 데이터를 기존 한글 도시 이름과 연결하여 WeatherCard 네 장에 표시합니다.
3. 사용자가 SearchBar에서 다른 도시를 검색하면 해당 도시의 실제 현재 날씨를 다시 조회합니다.
4. 상세보기를 누르면 실제 cityId가 포함된 Dynamic Route로 이동합니다.
5. WeatherDetailView가 선택 도시 또는 cityId 재조회 결과를 사용합니다.
6. 선택 도시의 좌표로 Forecast API와 Open-Meteo 대기질 API를 요청합니다.
7. ForecastList와 AirQualityCard가 단기 예보와 미세먼지 정보를 표시합니다.

#### Loading 및 Error 처리

- 기본 네 도시와 검색 도시의 현재 날씨 요청 중에는 날씨 정보를 불러오는 중이라는 안내를 표시합니다.
- 도시가 없거나 요청에 실패하면 도시 이름을 확인하라는 오류 문구를 화면에 표시합니다.
- API Key가 없거나 기본 도시 요청이 실패하면 안내 문구와 함께 기존 Mock Data를 예비 화면으로 표시합니다.
- Forecast와 Air Quality 요청은 별도의 Loading 및 Error 상태를 사용합니다.
- 추가 API 하나가 실패해도 현재 날씨 상세 화면 전체가 사라지지 않도록 구성하였습니다.

#### Axios와 Pinia의 역할

- Axios: OpenWeatherMap과 Open-Meteo 외부 서버에서 실제 데이터를 가져옵니다.
- configStore: 섭씨와 화씨 단위 및 상세정보 표시 설정을 여러 View에서 공유합니다.
- weatherStore: API로 검색한 선택 도시와 최근 확인한 도시를 메인과 상세 View에서 공유합니다.
- Store 데이터가 없는 상세 URL 접근 시에는 route의 cityId로 현재 날씨를 다시 요청합니다.

#### 기존 기능 유지

- 기존 SearchBar의 입력값 전달과 즉시 필터링을 유지하면서 필터 대상만 실제 기본 도시 데이터로 변경하였습니다.
- 기존 WeatherCard의 props, 선택, 선택 해제, 상세보기 emits를 유지하였습니다.
- BaseDashboardCard의 slot 구조와 파란색 디자인을 유지하였습니다.
- Pinia 단위 변경을 실제 현재 날씨와 단기 예보에도 적용하였습니다.
- RouterLink, RouterView, Dynamic Route, 서비스 소개, 이용 안내, 즐겨찾기 404를 유지하였습니다.
- 기존 Mock Data는 API 실패 시 예비 데이터와 이전 과제 확인 용도로만 사용합니다.

#### 과제 요구사항 확인

1. OpenWeatherMap API를 통한 실제 날씨 적용: 메인 화면의 서울, 수원, 부산, 인천과 사용자가 검색한 도시에 Current Weather API를 적용하였습니다.
2. OpenWeatherMap 추가 API를 통한 기능 확장: 상세 화면에 5 Day / 3 Hour Forecast API의 앞 6개 예보를 표시하였습니다.
3. 기타 외부 API를 통한 기능 확장: Open-Meteo Air Quality API를 사용하여 상세 화면에 PM10과 PM2.5를 표시하였습니다.

#### 생성 및 수정한 파일

- `.env.example`
- `.gitignore`
- `src/api/weatherApi.js`
- `src/api/airQualityApi.js`
- `src/components/exercise/ForecastList.vue`
- `src/components/exercise/AirQualityCard.vue`
- `src/components/weather/SearchBar.vue`
- `src/components/weather/WeatherCard.vue`
- `src/stores/weatherStore.js`
- `src/data/weatherData.js`
- `src/views/WeatherHomeView.vue`
- `src/views/WeatherDetailView.vue`
- `src/App.vue`
- `package.json`
- `package-lock.json`
- `index.html`
- 기존 `README.md`

#### 확인 결과

- Axios가 설치되고 세 API 요청 함수가 작성되었습니다.
- 실제 Key를 코드, README, Console에 기록하지 않았습니다.
- Key가 없는 경우 화면에 `.env` 설정 안내가 표시됩니다.
- 서울, 수원, 부산, 인천의 실제 현재 날씨가 메인 카드에 적용됩니다.
- 실제 기본 도시 필터링, 카드 선택과 해제, 상세보기, Pinia 단위 변경, Router 기능이 유지됩니다.
- Open-Meteo 대기질 API가 별도 Key 없이 상세 화면에서 정상 요청됩니다.
- `.env` 설정 후 OpenWeatherMap 현재 날씨와 Forecast API가 모두 정상 응답하는 것을 확인하였습니다.
- README 1번부터 8번까지의 파일 작성일과 수정 이력을 실제 파일 머리말과 대조하였습니다.
- 프로젝트 빌드가 정상 완료되었습니다.

#### 작성자

- 작성자: 김상우
- 작성일자: 2026-08-27
- 작성시간: 13:30

---

### 9. 2026-08-27 (목요일) 14:00 - 한글 도시 검색 확장

#### 작업한 이유

OpenWeatherMap은 영문 도시명을 기준으로 검색하는 경우가 많아 국내 도시를 한글로 입력했을 때 조회가 일정하지 않을 수 있었습니다.
사용자가 익숙한 한글 도시명을 그대로 입력해도 대한민국의 해당 도시 날씨를 정확히 조회할 수 있도록 검색 기능을 확장하였습니다.

#### 추가한 기능

- 서울, 부산, 인천, 대구, 대전, 광주, 울산, 수원, 성남, 고양, 용인, 부천, 안산, 안양, 평택, 화성의 한글 검색을 지원합니다.
- 춘천, 강릉, 원주, 청주, 천안, 전주, 익산, 목포, 여수, 순천, 포항, 경주, 구미, 창원, 김해, 진주, 제주의 한글 검색을 지원합니다.
- 지원 도시를 한글로 검색하면 OpenWeatherMap 요청에는 대응하는 영문 도시명과 대한민국 국가 코드를 사용합니다.
- 실제 API 응답을 받은 뒤 날씨 카드와 선택 상태에는 사용자가 입력한 한글 도시명을 표시합니다.
- 목록에 없는 한글 또는 영문 검색어는 기존 방식대로 OpenWeatherMap에 전달합니다.

#### 구현한 방법

- 한글 도시명과 OpenWeatherMap 검색용 영문 도시명을 별도 데이터 배열로 관리하였습니다.
- 검색 버튼을 누르면 입력값이 지원 도시 목록에 있는지 확인합니다.
- 일치하는 한글 도시가 있으면 영문 도시명과 국가 코드 `KR`을 조합하여 대한민국 도시로 조회합니다.
- API 조회, Loading, Error, 카드 선택과 해제, 상세보기, Pinia 단위 변경 기능은 기존 구조를 그대로 유지하였습니다.

#### 생성 및 수정한 파일

- `src/data/koreanCityAliases.js`
- `src/views/WeatherHomeView.vue`
- 기존 `README.md`

#### 확인 결과

- 지정한 33개 한글 도시 검색어가 모두 대한민국 도시의 OpenWeatherMap 실제 데이터로 정상 응답하는 것을 확인하였습니다.
- 한글 검색 결과가 실제 OpenWeatherMap 날씨 카드로 표시됩니다.
- 검색 결과의 도시 이름은 한글로 유지됩니다.
- 기존 기본 도시 조회, 영문 도시 검색, 상세 페이지, 단기 예보, 대기질, Pinia 및 Router 기능을 유지하였습니다.
- 프로젝트 빌드가 정상 완료되었습니다.

#### 작성자

- 작성자: 김상우
- 작성일자: 2026-08-27
- 작성시간: 14:00

---

### 10. 2026-08-27 (목요일) 15:00 - Weather UI Library

#### 프로젝트 설명

Vue 3, Vue Router, Pinia, Axios, Element Plus를 사용하여 실제 날씨와 추가 정보를 조회하는 날씨 대시보드 과제입니다.
3일차 Axios 과제의 API와 상태관리 및 Router 기능은 그대로 유지하고, 기존 화면에 외부 UI Library를 자연스럽게 적용하였습니다.

#### 작업 목적

- Element Plus 설치와 Vue 앱 전체 등록
- 외부 UI Component Library의 기본 Component 사용 방법 확인
- 기존 props와 emits 및 API 데이터 흐름을 유지한 UI 개선
- Loading, Error, 검색 결과 없음 상태의 명확한 시각화
- 기존 파란색 Weather Dashboard 디자인 유지

#### 사용 기술

| 기술 | 사용 목적 |
|---|---|
| Vue 3 | 반응형 화면과 Component 구성 |
| Vue Router | View 이동, Dynamic Route, Catch-all Route |
| Pinia | 온도 단위와 선택·최근 도시 전역 상태 관리 |
| Axios | 외부 날씨·예보·대기질 API 통신 |
| Element Plus | Card, Input, Button 등 UI Component 제공 |
| OpenWeatherMap | 실제 현재 날씨와 5일·3시간 단기 예보 제공 |
| Open-Meteo | 현재 PM10과 PM2.5 대기질 정보 제공 |

#### Element Plus 등록

- Element Plus 패키지를 프로젝트 의존성에 추가하였습니다.
- `main.js`에서 Element Plus와 기본 CSS를 불러와 Vue 앱 전체에서 사용할 수 있도록 등록하였습니다.
- Router와 Pinia의 기존 등록 순서와 전역 CSS 연결은 유지하였습니다.
- Element Plus 기본 색상을 기존 화면의 파란색과 맞추어 과제 간 디자인이 갑자기 달라지지 않도록 하였습니다.

#### Element Plus 적용 내역

| Component | 적용 위치 | 사용 목적 |
|---|---|---|
| `el-input` | SearchBar | 한글과 영문 도시 검색어 입력 |
| `el-button` | 검색, 상세보기, 단위 변경, 메인 이동 | 사용자 클릭 동작 |
| `el-card` | Navigation, 공통 Dashboard, WeatherCard, 상세·소개·안내·404 | 정보 영역 구분 |
| `el-tag` | 날씨 상태, API 출처, 기술 목록, 예보·대기질 | 상태와 분류 표시 |
| `el-alert` | 메인·상세 API Error | 오류 안내 |
| `el-skeleton` | 메인 현재 날씨, 상세·예보·대기질 Loading | 요청 중 로딩 표시 |
| `el-empty` | 검색 결과 없음, 상세 데이터 없음, 404 | 빈 상태 안내 |
| `el-divider` | 서비스 소개 | 기술 목록과 주요 기능 구분 |

#### 화면별 작업 내용

- 공통 Navigation: 기존 RouterLink와 RouterView를 유지하고 Navigation 전체를 Element Plus Card로 구성하였습니다.
- SearchBar: 기존 `query`, `loading`, `showApiSearch` props와 `update-query`, `search-weather` emits를 유지하면서 Input과 Button을 변경하였습니다.
- WeatherCard: 카드 선택·해제와 상세보기 이벤트를 유지하면서 Card, 날씨 Tag, LIVE API Tag, Button을 적용하였습니다.
- 메인 화면: 실제 날씨 요청 중 Skeleton, 오류 발생 시 Alert, 검색 결과 없음 상태에 Empty를 적용하였습니다.
- UnitToggle: configStore의 기존 Action을 유지하고 단위 변경 Button만 Element Plus로 변경하였습니다.
- 상세 화면: 현재 날씨 Card와 Tag, 예보·대기질 Loading과 Error UI, 메인 이동 Button을 적용하였습니다.
- 단기 예보: 기존 Forecast API 배열과 Pinia 온도 계산을 유지하면서 각 항목을 Card와 Tag로 표시하였습니다.
- 날씨 상태 문구: OpenWeatherMap의 `온흐림`, `실 비`처럼 어색한 번역을 상태 코드에 따라 `흐림`, `비` 등 자연스러운 한글로 정리하였습니다.
- 날씨 상태 Tag: 일반 `span` 스타일과의 CSS 충돌을 제거하고, 맑음은 노랑·주황, 흐림은 회색·청회색, 비는 선명한 파랑, 눈은 밝은 하늘색·청록 계열의 작은 Badge로 구분하였습니다.
- 온도 색상: 메인 현재 기온, 상세 현재 기온, 단기예보 기온은 원본 섭씨를 기준으로 26도 이상은 빨간색, 11~25도는 파란색, 1~10도는 밝은 하늘색, 0도 이하는 청록색으로 표시하였습니다. 화씨 전환 후에도 같은 원본 섭씨 구간을 사용합니다.
- 대기질: Open-Meteo의 PM10과 PM2.5 값을 Card와 Tag로 표시하였습니다.
- 서비스 소개와 이용 안내: Element Plus Card, Tag, Divider, Button을 적용하고 사용 기술과 이용 순서를 현재 기능에 맞게 보완하였습니다.
- 404 화면: Catch-all Route는 그대로 유지하고 Card, Empty, Button으로 안내 화면을 구성하였습니다.

#### 기존 기능 유지

- OpenWeatherMap의 실제 현재 날씨 검색과 기본 도시 데이터 조회를 유지하였습니다.
- 대한민국 33개 도시의 한글 검색 변환 기능을 유지하였습니다.
- OpenWeatherMap 5 Day / 3 Hour Forecast API를 유지하였습니다.
- Open-Meteo Air Quality API를 유지하였습니다.
- Axios Loading과 Error 상태 및 `.env` API Key 관리 방식을 유지하였습니다.
- WeatherCard 선택과 같은 카드 재선택 시 선택 해제 기능을 유지하였습니다.
- Pinia 섭씨·화씨 전환과 상세정보 표시, 최근 확인 도시 기능을 유지하였습니다.
- RouterLink, RouterView, Dynamic Route, 서비스 소개, 이용 안내, 즐겨찾기 404와 Catch-all Route를 유지하였습니다.
- 기존 Component의 props와 emits 이름을 변경하지 않았습니다.

#### 생성 및 수정한 파일

- `src/main.js`
- `src/App.vue`
- `src/style.css`
- `src/api/weatherApi.js`
- `src/utils/weatherStyle.js`
- `src/components/weather/BaseDashboardCard.vue`
- `src/components/weather/SearchBar.vue`
- `src/components/weather/WeatherCard.vue`
- `src/components/exercise/UnitToggle.vue`
- `src/components/exercise/ForecastList.vue`
- `src/components/exercise/AirQualityCard.vue`
- `src/views/WeatherHomeView.vue`
- `src/views/WeatherDetailView.vue`
- `src/views/WeatherAboutView.vue`
- `src/views/WeatherGuideView.vue`
- `src/views/NotFoundView.vue`
- `package.json`
- `package-lock.json`
- `index.html`
- 기존 `README.md`

#### API Key 관리

- 실제 OpenWeatherMap Key는 기존과 같이 프로젝트 루트의 `.env`에서만 관리합니다.
- 실제 Key를 Vue 파일, JavaScript 파일, README, 주석, Console에 작성하지 않았습니다.
- `.env`와 `.env.local`은 기존 `.gitignore` 설정으로 제외됩니다.
- `.env.example`에는 실제 Key가 아닌 예제 값만 유지하였습니다.

#### 확인 결과

- Element Plus 설치와 Vue 앱 등록 및 기본 CSS 연결을 확인하였습니다.
- Input, Button, Card, Tag, Alert, Skeleton, Empty, Divider가 실제 Vue Template에 적용되었습니다.
- 한글·영문 도시 검색, 카드 선택·해제, 상세보기, 단위 변경 구조가 유지됩니다.
- 실제 현재 날씨, 단기 예보, 대기질 API 요청 함수와 화면 연결이 유지됩니다.
- 현재 날씨와 단기 예보의 상태 문구가 같은 변환 기준으로 자연스럽게 표시됩니다.
- 메인, 소개, 이용 안내, 상세 Dynamic Route, 즐겨찾기 404와 임의의 잘못된 주소가 기존 Router와 연결됩니다.
- 주요 수정 파일의 수정 이력을 `2026-08-27 15:00`로 기록하였습니다.
- 프로젝트 빌드가 정상 완료되었습니다.

#### 작성자

- 작성자: 김상우
- 작성일자: 2026-08-27
- 작성시간: 15:00

---

### 11. 2026-08-27 (목요일) 15:20 - 3D Location Globe 패널

#### 프로젝트 설명

기존 Weather UI Library 대시보드의 중앙 콘텐츠와 기능을 유지하면서, 넓은 데스크톱 화면의 오른쪽 공간에 실제 지구 표면이 보이는 3D 지구본을 추가한 과제입니다.
평면 지도나 장식용 CSS 구체가 아니라 지구 표면 이미지와 지형 굴곡 이미지가 적용된 WebGL 지구본을 사용하였으며, OpenWeatherMap Current Weather API가 이미 제공하는 도시명, 국가 코드, 위도, 경도를 위치 이동에 재사용하였습니다.

#### 작업 목적

- 데스크톱의 오른쪽 빈 공간을 활용한 3D Location 정보 시각화
- 실제 지구처럼 둥근 구체를 마우스로 회전하고 확대할 수 있는 기능 구현
- 검색하거나 선택한 도시로 지구본을 회전하고 위치 Marker 표시
- 기존 weatherStore와 Current Weather 응답 데이터 재사용
- 기존 중앙 대시보드 폭과 날씨 기능 유지
- 좁은 화면에서 기존 레이아웃이 깨지지 않는 반응형 처리

#### 사용 기술

| 기술 | 사용 목적 |
|---|---|
| Globe.gl | WebGL 기반 3D 지구본, 카메라 이동, 원형 Marker와 확산 Ring 표시 |
| Three.js | Globe.gl 내부의 3D 지구 구체와 지형 재질 렌더링 |
| Earth Blue Marble | 실제 지구 표면 지도 이미지 제공 |
| Earth Topology | 지구 표면의 지형 굴곡 효과 제공 |
| Element Plus | 오른쪽 Location Card 구성 |
| Pinia weatherStore | 검색·선택 도시 위치 데이터 공유 |
| OpenWeatherMap Current Weather | 도시명, 국가 코드, 위도와 경도 제공 |

#### Location 데이터 구성

| 데이터 | 기존 OpenWeatherMap 응답 | 화면 사용 위치 |
|---|---|---|
| 도시명 | `data.name` | 선택 도시 이름 |
| 국가 코드 | `data.sys.country` | 국가 이름 또는 원본 국가 코드 |
| 위도 | `data.coord.lat` | Latitude와 3D 지구본 카메라·Marker 위치 |
| 경도 | `data.coord.lon` | Longitude와 3D 지구본 카메라·Marker 위치 |

Current Weather 응답을 화면용 도시 객체로 정리할 때 기존 위도와 경도에 국가 코드만 추가하였습니다.
API 실패 시 사용하는 서울, 수원, 부산, 인천 예비 데이터에도 대한민국 국가 코드 `KR`을 추가하여 같은 Component에서 처리할 수 있도록 하였습니다.

#### 데이터 흐름

1. 앱 최초 실행 시에는 `weatherStore.selectedCity`가 비어 있어 3D 지구본이 천천히 자동 회전하고 Marker와 상세 위치 정보는 표시되지 않습니다.
2. 사용자가 도시 검색에 성공하면 기존 Current Weather API 응답이 화면용 도시 객체로 정리됩니다.
3. 검색한 도시 객체는 기존 `weatherStore.setSelectedCity()` Action을 통해 Store에 저장됩니다.
4. 사용자가 기본 WeatherCard를 선택한 경우에도 같은 Action으로 선택 도시가 Store에 저장됩니다.
5. LocationGlobe는 Store의 `selectedCity`를 computed로 읽어 도시명, 국가, 위도, 경도와 3D Marker를 자동으로 갱신합니다.
6. 잘못된 도시를 검색하여 요청이 실패하면 Store의 이전 선택 도시를 삭제하지 않으므로 기존 Location 정보가 깨지지 않습니다.

#### LocationGlobe Component

`src/components/exercise/LocationGlobe.vue`는 오른쪽 3D 지구본과 Location 정보 표시만 담당합니다.

- `weatherStore.selectedCity`를 직접 재사용하여 별도의 Store나 중복 state를 만들지 않았습니다.
- Element Plus `el-card`를 사용하여 기존 Weather Dashboard 카드 디자인과 통일하였습니다.
- Globe.gl로 실제 회전·확대가 가능한 WebGL 3D 지구본을 생성하였습니다.
- 지구 표면에는 Blue Marble 이미지, 높낮이에는 Earth Topology 이미지를 적용하였습니다.
- 푸른색 대기 효과를 지구 바깥에 표시하여 실제 행성과 같은 입체감을 추가하였습니다.
- 선택 도시가 있을 때만 해당 좌표에 작은 원형 Marker와 은은한 Glow, 반복되는 확산 Ring을 표시합니다.
- 원기둥 형태의 Point Layer와 식별하기 어려운 작은 Object Marker는 제거하고 지구 좌표를 따라 움직이는 원형 HTML Marker로 변경하였습니다.
- 원형 Marker는 흰색 테두리와 온도색 Glow를 적용하여 작은 지구본에서도 위치가 분명하게 보이도록 하였습니다.
- Marker와 Ring 색상은 화면 표시 단위가 아닌 기존 원본 섭씨 온도 구간을 재사용합니다.
- 도시명, 국가명, Latitude, Longitude를 3D 지구본 아래에 표시합니다.
- 선택 도시가 없을 때는 도시를 검색하거나 카드를 선택하라는 기본 안내 문구를 표시합니다.

#### 3D 지구본과 도시 위치 이동

- 선택 도시가 없으면 위도 20, 경도 0을 향한 지구 전체 화면에서 자동 회전을 시작합니다.
- 사용자는 마우스 드래그로 지구본을 직접 회전하고 마우스 휠로 확대·축소할 수 있습니다.
- 검색 또는 카드 선택으로 Store가 변경되면 자동 회전을 멈추고 카메라가 해당 위도와 경도로 1.2초 동안 부드럽게 이동합니다.
- 선택 도시 좌표에는 지표면에 붙은 작은 원형 Marker를 표시하고 주변에 반투명 Glow와 은은한 Ring을 반복 표시합니다.
- Marker에 마우스를 올리면 현재 도시 이름을 확인할 수 있습니다.
- Sidebar 폭이 달라질 때 `ResizeObserver`로 WebGL Canvas 폭을 다시 계산합니다.

#### Marker 온도 색상

Marker 색상은 메인, 상세, 단기예보에서 사용하는 기존 원본 섭씨 온도 구간과 동일합니다.
화씨로 화면 단위를 변경한 경우에도 API에서 받은 섭씨값을 기준으로 색상을 결정합니다.

| 원본 섭씨 온도 | Marker·Glow·Ring 색상 |
|---|---|
| 26℃ 이상 | 빨강 |
| 11~25℃ | 파랑 |
| 1~10℃ | 밝은 하늘색 |
| 0℃ 이하 | 청록색 |

#### 실제 지구 표면 이미지 연결

- 지구본 표면에는 `three-globe` 예제에서 제공하는 Earth Blue Marble 등거리 원통 도법 이미지를 적용하였습니다.
- Earth Topology 이미지를 Bump Map으로 함께 적용하여 산맥과 지표면에 미세한 높낮이와 입체감을 추가하였습니다.
- 두 지구 이미지는 jsDelivr CDN에서 불러오므로 화면 확인 시 인터넷 연결이 필요합니다.
- 도시 좌표를 찾기 위한 별도의 Geocoding 또는 위치 API는 추가하지 않았습니다.
- 지구본 카메라와 Marker는 기존 OpenWeatherMap 응답의 위도와 경도만 사용하여 이동합니다.

#### 국가 코드 표시

OpenWeatherMap이 반환하는 주요 국가 코드를 읽기 쉬운 국가 이름으로 연결하였습니다.

| 국가 코드 | 표시 이름 |
|---|---|
| `KR` | South Korea |
| `JP` | Japan |
| `US` | United States |
| `GB` | United Kingdom |
| `CN` | China |
| `FR` | France |
| `DE` | Germany |

목록에 없는 국가 코드는 외부 국가 Library를 추가하지 않고 API가 반환한 원본 코드를 그대로 표시합니다.

#### 위도와 경도 표시

- 위도와 경도는 너무 긴 소수 대신 소수점 둘째 자리까지 표시합니다.
- 위도가 0 이상이면 `N`, 음수이면 `S` 방향을 표시합니다.
- 경도가 0 이상이면 `E`, 음수이면 `W` 방향을 표시합니다.
- 서울은 약 `37.57° N`, `126.98° E` 형태로 표시됩니다.

#### Desktop Layout 및 반응형 처리

- App에 최대 1332px와 좌우 24px 여백을 가진 공통 `page-container`를 구성하여 Navigation과 현재 View가 같은 가로 기준선을 공유하도록 하였습니다.
- Navigation은 별도의 고정 폭을 사용하지 않고 공통 Container 안에서 `width: 100%`로 표시됩니다.
- 데스크톱에서는 공통 Container의 내부 폭 안에 기존 최대 980px 중앙 콘텐츠와 280px 3D Location Sidebar를 24px 간격의 Grid로 나란히 배치하였습니다.
- Navigation 왼쪽 경계는 도시 검색과 지역별 날씨 현황 카드의 왼쪽 경계에 맞추고, Navigation 오른쪽 경계는 Location Globe 카드의 오른쪽 경계에 맞추었습니다.
- 중앙 콘텐츠의 카드 폭, 검색 영역, 날씨 카드 Grid 구조는 변경하지 않았습니다.
- 오른쪽 패널은 스크롤 중에도 확인하기 쉽도록 상단 기준 Sticky 위치를 사용합니다.
- 화면 폭이 1332px 이하이면 Location Sidebar를 숨기고 기존 중앙 콘텐츠를 한 열로 유지합니다.
- 화면 폭이 720px 이하이면 공통 Container의 좌우 여백을 16px로 줄이고, 기존 한 열 WeatherCard 구성을 유지하여 가로 Scroll을 방지합니다.

#### 기존 기능 유지

- OpenWeatherMap 현재 날씨와 Forecast API 요청을 변경하지 않았습니다.
- Open-Meteo 대기질 API를 변경하지 않았습니다.
- 대한민국 33개 도시의 한글 검색 변환을 유지하였습니다.
- WeatherCard 선택과 재선택 시 선택 해제 표시를 유지하였습니다.
- 상세보기 Dynamic Route와 모든 Router View를 유지하였습니다.
- Pinia 섭씨·화씨 전환, 최근 확인 도시와 상세정보 설정을 유지하였습니다.
- 날씨 상태별 Tag 색상과 온도 구간별 색상을 변경하지 않았습니다.
- API Key와 `.env` 관리 방식을 변경하지 않았습니다.
- 도시 좌표 조회를 위한 새로운 위치 API는 추가하지 않고 기존 OpenWeatherMap 응답을 재사용하였습니다.
- 기존 평면 지도의 Leaflet 의존성은 제거하고 3D 렌더링을 위한 `globe.gl`을 추가하였습니다.

#### 생성 및 수정한 파일

- `src/components/exercise/LocationGlobe.vue`
- `src/utils/weatherStyle.js`
- `src/App.vue`
- `src/views/WeatherHomeView.vue`
- `src/api/weatherApi.js`
- `src/data/weatherData.js`
- `package.json`
- `package-lock.json`
- 기존 `README.md`

#### 확인 결과

- 최초 화면에서 Marker 없이 실제 지구 표면의 3D 지구본과 기본 안내 문구가 표시되는 구조를 확인하였습니다.
- 검색 성공 시 선택 도시의 이름, 국가 코드, 위도, 경도가 weatherStore에 전달됩니다.
- WeatherCard 선택 시에도 같은 Store 데이터가 갱신됩니다.
- 서울, 부산, Tokyo 등 국내외 도시 데이터에 같은 좌표 표시 규칙을 적용합니다.
- 잘못된 도시 검색 시 이전 Location Store 데이터가 유지됩니다.
- ℃와 ℉ 단위 변경은 Location 데이터와 3D Marker에 영향을 주지 않습니다.
- 원형 Marker, Glow와 Ring이 원본 섭씨 온도에 따라 빨강, 파랑, 밝은 하늘색, 청록색으로 구분됩니다.
- 상세보기, 소개, 이용 안내, 즐겨찾기 404와 Catch-all Route 구조가 유지됩니다.
- 데스크톱에서만 오른쪽 Sidebar를 표시하고 좁은 화면에서는 기존 중앙 화면을 유지합니다.
- 데스크톱에서 Navigation의 왼쪽·오른쪽 경계가 main content와 Location Globe를 합친 전체 Grid 경계에 일치합니다.
- Navigation 메뉴 간격과 버튼 크기, main content 980px, Location Sidebar 280px, Grid 간격 24px을 유지합니다.
- 공통 Container에 `box-sizing: border-box`를 적용하고 모바일 여백을 분리하여 가로 Scroll이 발생하지 않게 하였습니다.
- 1440px 데스크톱 화면에서 Navigation과 검색 카드의 왼쪽 좌표가 각각 78px로 일치하고, Navigation과 Location Globe의 오른쪽 좌표가 각각 1362px로 일치하는 것을 확인하였습니다.
- 같은 데스크톱 화면에서 main content는 980px, Location Sidebar는 280px, 두 영역 사이 간격은 24px로 기존 값이 유지됩니다.
- 1280px, 720px, 390px 화면에서 문서 너비와 화면 너비가 동일하여 가로 Scroll이 발생하지 않고, 1332px 이하에서는 Location Sidebar가 기존과 같이 숨겨집니다.
- 새로운 좌표 조회 API는 추가하지 않았으며 3D 표현에는 Globe.gl과 지구 표면 이미지만 사용합니다.
- 주요 생성·수정 파일의 작업 이력을 `2026-08-27 15:20`으로 기록하였습니다.
- 프로젝트 빌드가 정상 완료되었습니다.

#### 작성자

- 작성자: 김상우
- 작성일자: 2026-08-27
- 작성시간: 15:20

---

### 12. 2026-08-27 (목요일) 16:00 - Location Globe 현지 시간과 낮·밤 진행도

#### 프로젝트 설명

기존 3D Location Globe의 지구 표면, 회전, 확대·축소, 도시 좌표 이동과 온도별 Marker를 유지하면서 선택 도시의 현지 시간과 일출·일몰 정보를 패널 하단에 추가한 과제입니다.
새로운 시간 API나 날짜 Library를 설치하지 않고 OpenWeatherMap Current Weather API 응답에 이미 포함된 시간 데이터를 재사용하였습니다.

#### 작업 목적

- 사용자 PC가 아니라 검색한 도시의 UTC Offset을 기준으로 정확한 현지 시간 표시
- 검색 도시의 일출과 일몰을 해당 도시 현지 시간으로 변환
- 현재 Unix Timestamp와 일출·일몰 Timestamp를 비교하여 낮과 밤 구분
- 낮에는 일출부터 일몰까지, 밤에는 일몰부터 다음 일출까지의 진행도 시각화
- 일몰 또는 다음 일출까지 남은 시간을 시간과 분으로 표시
- 도시 변경 시 Location 정보와 시간 정보를 동일한 Pinia `selectedCity`로 즉시 갱신

#### 재사용한 OpenWeatherMap 데이터

| 응답 데이터 | 의미 | 사용 위치 |
|---|---|---|
| `data.timezone` | 검색 도시의 UTC Offset이며 초 단위로 제공 | 현지 시간과 UTC Offset 표시 |
| `data.sys.sunrise` | 검색 도시의 일출 Unix Timestamp | 일출 현지 시간, 낮 시작, 다음 일출 계산 |
| `data.sys.sunset` | 검색 도시의 일몰 Unix Timestamp | 일몰 현지 시간, 낮 종료, 밤 시작 계산 |

Current Weather 응답을 화면용 도시 객체로 정리하는 기존 `formatCurrentWeather`에 위 세 값만 추가하였습니다.
API 주소, 요청 Parameter, API Key 관리 방식은 변경하지 않았으며 별도의 시간 또는 천문 API 요청도 추가하지 않았습니다.

#### 검색 도시 현지 시간 계산

- 현재 시각은 `Date.now()`를 Unix Timestamp로 변환하여 사용합니다.
- 검색 도시의 `timezone` 초 값을 현재 Unix Timestamp에 더합니다.
- 변환 결과는 브라우저 지역 설정의 영향을 받지 않도록 UTC 기준 시·분 Getter로 읽습니다.
- 현지 시간은 24시간 형식의 두 자리 시·분으로 표시합니다.
- UTC Offset은 `UTC+09:00`, `UTC+01:00`, `UTC-04:00`과 같이 시간과 분을 함께 표시합니다.
- 1초 Timer로 현재 Timestamp를 갱신하므로 페이지를 다시 열지 않아도 시간과 진행도가 계속 변경됩니다.
- Component가 제거될 때 Timer를 정리하여 불필요한 갱신이 남지 않게 하였습니다.

#### 일출과 일몰 시간 변환

- 일출과 일몰은 OpenWeatherMap이 반환한 원본 Unix Timestamp를 사용합니다.
- 두 Timestamp에도 선택 도시의 같은 `timezone` Offset을 적용합니다.
- 일출은 `🌅`, 일몰은 `🌇` 아이콘과 함께 현지 시·분으로 표시합니다.
- Seoul, Tokyo, London, New York처럼 UTC Offset이 다른 도시를 검색하면 각각 다른 현지 시간이 표시됩니다.

#### 낮과 밤 판단

현재 Unix Timestamp와 원본 일출·일몰 Unix Timestamp를 직접 비교하여 시간대 변환 과정에서 생길 수 있는 혼동을 방지하였습니다.

| 조건 | 상태 | 표시 |
|---|---|---|
| 일출 이상이고 일몰 미만 | 낮 | `☀️ DAYLIGHT`, 현재: 낮 |
| 일출 이전 또는 일몰 이후 | 밤 | `🌙 NIGHT TIME`, 현재: 밤 |

지구본 자체의 조명이나 Earth Texture는 낮과 밤 상태에 따라 변경하지 않고 기존 모습 그대로 유지하였습니다.

#### 낮·밤 진행도 계산

- 낮에는 일출을 0%, 일몰을 100%로 두고 현재 시각의 진행률을 계산합니다.
- 일출 전 밤에는 전날 일몰부터 오늘 일출까지를 한 구간으로 계산합니다.
- 일몰 후 밤에는 오늘 일몰부터 다음날 일출까지를 한 구간으로 계산합니다.
- 일몰 후 다음 일출은 기존 일출 Timestamp에 24시간을 더하여 계산합니다.
- 계산 결과는 항상 0% 이상 100% 이하로 제한합니다.
- Progress Bar의 채워진 폭과 태양·달 Marker 위치에 같은 진행률을 적용합니다.

#### 남은 시간 표시

- 낮이면 현재 시각부터 일몰까지 남은 시간을 표시합니다.
- 밤이면 현재 시각부터 다음 일출까지 남은 시간을 표시합니다.
- 남은 초를 올림하여 시간과 분 단위로 변환하고 초 단위는 화면에 표시하지 않습니다.
- 낮에는 `일몰까지 X시간 Y분`, 밤에는 `일출까지 X시간 Y분` 형식을 사용합니다.

#### Local Time UI

- 기존 좌표 영역 아래에 구분선을 추가하고 `LOCAL TIME` Eyebrow를 표시하였습니다.
- 큰 숫자로 도시 현지 시간을 표시하고 아래에 도시명과 국가명을 함께 표시합니다.
- 오른쪽에는 해당 도시의 UTC Offset을 작은 Element Plus Tag로 표시합니다.
- 낮 영역은 연한 노랑·주황 Accent, 밤 영역은 연한 남색·보라 Accent를 사용합니다.
- CSS Progress Track 위에 낮에는 태양, 밤에는 달 Marker가 이동합니다.
- 별도의 Chart Library나 복잡한 Gradient Animation은 추가하지 않았습니다.

#### 서비스 소개와 이용 안내 갱신

- 서비스 소개 기술 목록에 `Globe.gl`과 `Three.js`를 추가하였습니다.
- 서비스 소개 기능 목록에 3D 도시 위치, 현지 시간, 일출·일몰과 낮·밤 진행도를 추가하였습니다.
- 이용 안내에 Location Globe에서 도시 위치, 좌표와 현지 시간을 확인하는 단계를 추가하였습니다.
- Location Globe가 넓은 데스크톱 화면의 오른쪽에 표시된다는 조건을 이용 안내에 함께 작성하였습니다.
- 기존 상세정보 이동과 온도 단위 변경 단계는 순서를 한 단계씩 조정하고 기능 자체는 변경하지 않았습니다.

#### 검색 전과 도시 변경 처리

- 선택 도시가 없거나 시간 데이터가 준비되지 않았으면 도시 검색 후 현지 시간을 확인할 수 있다는 안내를 표시합니다.
- `timezone`이 0인 London 같은 도시도 유효한 시간 데이터로 처리합니다.
- Seoul에서 Tokyo, London, New York으로 변경하면 도시명, 국가, 현지 시간, 일출, 일몰, 낮·밤 상태, 진행도와 남은 시간이 같은 `selectedCity`를 기준으로 즉시 변경됩니다.
- API 실패 시 사용하는 국내 예비 데이터에는 현재 날짜 기준 오전 6시 일출과 오후 6시 일몰 값을 생성하여 시간 영역에서 Error가 발생하지 않게 하였습니다.

#### 기존 기능 유지

- OpenWeatherMap Current Weather 요청 URL과 검색 로직을 변경하지 않았습니다.
- Forecast API와 Open-Meteo Air Quality API를 변경하지 않았습니다.
- Router, Dynamic Route와 404 화면을 변경하지 않았습니다.
- Pinia Store 구조와 Action을 변경하지 않았습니다.
- 섭씨·화씨 전환과 원본 섭씨 기준 온도 색상을 변경하지 않았습니다.
- WeatherCard, 날씨 상태 Tag, 중앙 Dashboard와 Navigation Layout을 변경하지 않았습니다.
- Globe의 Earth Texture, Atmosphere, 회전, 확대·축소, 좌표 이동, 온도별 Marker와 Ring을 변경하지 않았습니다.

#### 생성 및 수정한 파일

- `src/components/exercise/LocationGlobe.vue`
- `src/api/weatherApi.js`
- `src/data/weatherData.js`
- `src/views/WeatherAboutView.vue`
- `src/views/WeatherGuideView.vue`
- 기존 `README.md`

#### 확인 결과

- Current Weather 응답의 `timezone`, `sunrise`, `sunset`이 화면용 도시 객체에 포함됩니다.
- 사용자 PC의 Timezone 대신 선택 도시의 UTC Offset으로 현지 시·분을 표시합니다.
- 낮과 밤의 진행률이 0~100% 범위에서 계산됩니다.
- 낮에는 일몰까지, 밤에는 다음 일출까지 남은 시간이 표시됩니다.
- 선택 도시가 없는 초기 상태에서도 시간 안내 영역이 Error 없이 표시됩니다.
- 1초 Timer가 실행되고 Component 제거 시 정리되는 구조를 확인하였습니다.
- Seoul과 Tokyo는 모두 `UTC+09:00`으로 표시되면서 각 도시의 서로 다른 일출·일몰 값이 적용됩니다.
- London은 `UTC+01:00`, New York은 `UTC-04:00`으로 표시되어 한국과 다른 현지 시간이 적용됩니다.
- 테스트 시점의 New York은 `NIGHT TIME`, 현재: 밤 상태와 다음 일출까지 남은 시간이 정상 표시됩니다.
- 같은 도시에서 1초 뒤 Progress 값이 변경되어 Timer가 낮·밤 진행도에도 반영되는 것을 확인하였습니다.
- 네 도시를 연속으로 변경하는 동안 시간 영역과 기존 날씨 검색 영역에 Application Error가 발생하지 않았습니다.
- 서비스 소개에서 Globe.gl, Three.js와 현지 시간 기능을 확인할 수 있습니다.
- 이용 안내에서 Location Globe 확인 단계를 포함한 전체 사용 순서를 확인할 수 있습니다.
- 새로운 시간 API와 날짜 Library를 추가하지 않았습니다.
- 주요 생성·수정 파일의 작업 이력을 `2026-08-27 16:00`으로 기록하였습니다.
- 프로젝트 빌드가 정상 완료되었습니다.

#### 작성자

- 작성자: 김상우
- 작성일자: 2026-08-27
- 작성시간: 16:00

---

### 13. 2026-08-27 (목요일) 16:29 - Global Weather Dashboard 최종 품질관리 및 Vercel 배포

#### 프로젝트 설명

Vue 실습의 각 단계에서 구현한 기능을 하나의 완성된 날씨 서비스로 정리하고 Source Code 품질 검사, 환경변수 보안 확인, Production Build와 Vercel Hosting까지 완료한 최종 제출 작업입니다.
GitHub Source Repository에 최초 업로드가 완료된 실제 시각인 16:29를 작업 시간으로 기록하였습니다.

#### 프로젝트명과 사용자 화면 정리

- 공식 프로젝트명을 `Global Weather Dashboard`로 통일하였습니다.
- 메인 Hero를 `REAL-TIME WEATHER PLATFORM`과 최종 서비스명, 실시간 날씨·예보·대기질·위치·시간 안내 문구로 변경하였습니다.
- Navigation, 브라우저 제목, 문서 설명, Open Graph와 X 공유 정보를 최종 서비스명에 맞추었습니다.
- 서비스 소개와 이용 안내에서 실습용 또는 추가 View 문구를 제거하고 실제 사용자용 표현으로 정리하였습니다.
- 상세 화면의 데이터 출처 문구를 실시간 날씨와 예비 날씨 표현으로 변경하였습니다.
- 기존 날씨 카드, 검색창, 상세 카드, 색상, Navigation 간격과 반응형 Layout은 유지하였습니다.

#### ESLint 품질관리

- Vue 3와 JavaScript에 필요한 최소 ESLint Flat Configuration을 추가하였습니다.
- `package.json`에 별도의 lint Script를 추가하였습니다.
- 전체 Source를 검사하여 기존 연습 파일의 문법 오류 2건, 사용하지 않는 Import 1건과 상세 View의 사용하지 않는 오류 변수 1건을 수정하였습니다.
- 최종 대시보드에서 상태 확인 용도로만 남아 있던 `console.log` Watcher를 제거하였습니다.
- 이전 Composition 및 Component 학습 파일에서 과제 문법 확인에 필요한 Log와 Alert는 최종 Router Application에서 Import되지 않으므로 기존 학습 기록으로 유지하였습니다.
- 최종 `npm run lint`가 Error 없이 완료되었습니다.

#### API Key와 환경변수 보안

- 실제 OpenWeatherMap Key는 `import.meta.env.VITE_OPENWEATHER_API_KEY`를 통해서만 읽습니다.
- 기존 Axios 연습 파일에 남아 있던 하드코딩 Key를 제거하고 같은 환경변수를 사용하도록 수정하였습니다.
- `.env`, `.env.local`, `.env.*.local`과 Vercel Local 설정 폴더를 Git 업로드 대상에서 제외하였습니다.
- 실제 Key가 포함되지 않은 `.env.example`을 유지하였습니다.
- Git Repository는 Key 제거와 보안 검사가 끝난 뒤 새로 생성했으므로 이전 Commit에 Key가 포함된 이력이 없습니다.
- Git Stage에서도 환경변수 파일과 알려진 Key Pattern이 포함되지 않은 것을 확인한 뒤 Push하였습니다.
- Vercel Production 환경에는 Key 값을 Config 환경변수로 등록했으며 Source Repository와 README에는 값을 기록하지 않았습니다.
- `VITE_*` 값은 Frontend Build에서 브라우저가 사용하므로 완전한 Server Secret과 다르다는 점을 최종 환경변수 안내에 명시하였습니다.

#### Production Build

- Vite Production Build를 실행하여 `dist/index.html`, JavaScript, CSS, 이미지와 Globe 관련 Bundle이 정상 생성되는 것을 확인하였습니다.
- 대표 공유 이미지와 Favicon이 Production Asset에 포함됩니다.
- 3D Globe Library의 크기로 인해 Bundle 크기 안내가 표시되지만 Build Error는 발생하지 않았습니다.
- Production Preview에서 메인, 소개, 안내, 상세, 즐겨찾기 404 Route와 정적 Asset을 확인하였습니다.
- OpenWeatherMap Current Weather, Forecast, Open-Meteo Air Quality와 지구 Texture 요청이 모두 HTTP 200으로 응답하였습니다.

#### Vercel Hosting

- Vercel에서 `global-weather-dashboard` Vite 프로젝트를 생성하였습니다.
- `vercel.json`의 SPA Rewrite로 모든 Vue Router 주소를 `index.html`에 연결하였습니다.
- `/`, `/about`, `/guide`, `/weather/1835848`, `/favorites`를 주소창에서 직접 요청했을 때 모두 HTTP 200과 Vue Application Shell을 반환하는 것을 확인하였습니다.
- Favicon과 대표 공유 이미지가 Vercel Production 주소에서 HTTP 200으로 제공됩니다.
- Vercel Production Build가 완료되고 상태가 Ready인 것을 확인하였습니다.
- 실제 배포 주소는 [https://global-weather-dashboard-gules.vercel.app/](https://global-weather-dashboard-gules.vercel.app/)입니다.

#### Source Repository

- GitHub Repository: [https://github.com/dfklsna/global-weather-dashboard](https://github.com/dfklsna/global-weather-dashboard)
- `main` Branch에 최초 Source Code를 2026-08-27 16:29에 업로드하였습니다.
- 실제 Hosting은 최종 안내에 따라 Vercel을 사용합니다.

#### 기존 기능 유지

- Vue 3, Vue Router, Pinia, Axios와 Element Plus 구조를 유지하였습니다.
- 기본 네 도시의 실제 날씨와 국내 33개 도시 한글 검색을 유지하였습니다.
- 현재 날씨, 단기 예보와 대기질 외부 API를 유지하였습니다.
- 도시 카드 선택·선택 해제, 상세 Dynamic Route와 Catch-all Route를 유지하였습니다.
- 섭씨·화씨 변경, 최근 확인 도시와 상세정보 설정을 유지하였습니다.
- 날씨 상태별 Badge, 원본 섭씨 온도별 색상과 Marker 색상을 유지하였습니다.
- Location Globe의 회전, 도시 위치, Glow·Ring Marker와 Earth Texture를 유지하였습니다.
- 검색 도시 현지 시간, 일출·일몰, 낮·밤 진행도와 남은 시간을 유지하였습니다.
- Loading, Error, Empty 상태와 데스크톱·모바일 반응형 Layout을 유지하였습니다.

#### 생성 및 수정한 파일

- `eslint.config.js`
- `vercel.json`
- `public/og.png`
- `.env.example`
- `.gitignore`
- `package.json`
- `package-lock.json`
- `vite.config.js`
- `index.html`
- `src/App.vue`
- `src/views/WeatherHomeView.vue`
- `src/views/WeatherAboutView.vue`
- `src/views/WeatherGuideView.vue`
- `src/views/WeatherDetailView.vue`
- `src/components/practice/library/AxiosWeather.vue`
- `src/components/practice/basic/EventObjectExample.vue`
- `src/components/practice/basic/SampleTwo.vue`
- `src/components/practice/basic/v-onEnentHandlerExample.vue`
- 기존 `README.md`

#### 최종 확인 결과

- 화면과 문서의 공식 프로젝트명이 `Global Weather Dashboard`로 통일되었습니다.
- 최종 사용자 화면에서 수업 단계용 Hero 문구가 제거되었습니다.
- ESLint Error 0건으로 품질 검사가 완료되었습니다.
- 프로젝트 의존성 보안 검사에서 알려진 취약점이 발견되지 않았습니다.
- 실제 API Key가 Source, README, Git Stage와 Git History에 포함되지 않았습니다.
- Production Build와 Vercel Production Build가 모두 성공하였습니다.
- Vercel의 모든 대표 Route가 직접 접근 시 HTTP 200으로 응답합니다.
- Production 환경변수가 적용된 Bundle과 외부 API 응답을 확인하였습니다.
- GitHub Source Repository와 Vercel Deployment URL을 README에 기록하였습니다.

#### 작성자

- 작성자: 김상우
- 작성일자: 2026-08-27
- GitHub 업로드 시간: 16:29

---

## 이후 작업 기록 기준

새로운 과제나 기능은 기존 기록 아래에 순서대로 추가합니다.

- 작업 번호와 작업 이름
- 작업한 날짜, 요일, 시간
- 작업한 이유
- 추가하거나 수정한 기능
- 간단한 구현 방법
- 수정한 파일
- 화면 확인 결과
