<!--
============================================================
파일명      : LocationGlobe.vue
작성자      : 김상우
작성일      : 2026-08-27
작성시간    : 15:20
수정 이력   :
  - 2026-08-27 16:00 검색 도시 현지 시간과 낮·밤 진행도 추가
설명        : 실제 지구 표면 이미지가 적용된 3D 지구본에
              선택 도시의 위치, 현지 시간과 낮·밤 정보를 표시한다.
주요 기능   :
  1. weatherStore의 selectedCity 재사용
  2. Globe.gl 기반 회전·확대 가능한 3D 지구본 표시
  3. 검색·선택 도시 좌표에 온도별 원형 Marker와 Glow 표시
  4. 국가 이름과 위도·경도 방향 표시
  5. 도시 timezone 기준 실시간 현지 시간 표시
  6. 일출·일몰 기준 낮·밤 진행도와 남은 시간 표시
============================================================
-->

<script setup>
import Globe from 'globe.gl'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWeatherStore } from '../../stores/weatherStore.js'
import { getTemperatureColor } from '../../utils/weatherStyle.js'

const EARTH_IMAGE_URL =
  'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg'
const EARTH_BUMP_IMAGE_URL =
  'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png'
const GLOBE_HEIGHT = 250

const weatherStore = useWeatherStore()
const globeElement = ref(null)
const currentTimestamp = ref(Date.now())

let locationGlobe = null
let globeResizeObserver = null
let clockTimer = null

// OpenWeatherMap의 주요 국가 코드를 화면에 표시할 이름과 연결한다.
const countryNames = {
  KR: 'South Korea',
  JP: 'Japan',
  US: 'United States',
  GB: 'United Kingdom',
  CN: 'China',
  FR: 'France',
  DE: 'Germany',
}

const selectedCity = computed(() => weatherStore.selectedCity)

// 선택 도시와 좌표가 모두 있을 때만 Marker와 상세 위치를 표시한다.
const hasLocation = computed(() => {
  if (!selectedCity.value) return false

  return (
    Number.isFinite(Number(selectedCity.value.latitude)) &&
    Number.isFinite(Number(selectedCity.value.longitude))
  )
})

const countryName = computed(() => {
  const countryCode = selectedCity.value?.country
  return countryNames[countryCode] ?? countryCode ?? 'Unknown'
})

// 위도는 절댓값과 N/S 방향으로 나누어 두 자리까지 표시한다.
const latitudeText = computed(() => {
  if (!hasLocation.value) return ''

  const latitude = Number(selectedCity.value.latitude)
  const direction = latitude >= 0 ? 'N' : 'S'
  return `${Math.abs(latitude).toFixed(2)}° ${direction}`
})

// 경도는 절댓값과 E/W 방향으로 나누어 두 자리까지 표시한다.
const longitudeText = computed(() => {
  if (!hasLocation.value) return ''

  const longitude = Number(selectedCity.value.longitude)
  const direction = longitude >= 0 ? 'E' : 'W'
  return `${Math.abs(longitude).toFixed(2)}° ${direction}`
})

// timezone, sunrise, sunset이 모두 있을 때만 도시 시간 영역을 계산한다.
const hasTimeData = computed(() => {
  const city = selectedCity.value
  if (!city) return false

  return ['timezone', 'sunrise', 'sunset'].every((key) => {
    return city[key] !== null && city[key] !== undefined && Number.isFinite(Number(city[key]))
  })
})

const currentUnix = computed(() => Math.floor(currentTimestamp.value / 1000))

// Unix Timestamp에 검색 도시의 UTC Offset을 더한 후 UTC getter로 현지 시간을 읽는다.
const formatCityTime = (unixTimestamp) => {
  if (!hasTimeData.value) return ''

  const timezone = Number(selectedCity.value.timezone)
  const cityDate = new Date((Number(unixTimestamp) + timezone) * 1000)
  const hours = String(cityDate.getUTCHours()).padStart(2, '0')
  const minutes = String(cityDate.getUTCMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

const localTimeText = computed(() => formatCityTime(currentUnix.value))
const sunriseTimeText = computed(() => formatCityTime(selectedCity.value?.sunrise))
const sunsetTimeText = computed(() => formatCityTime(selectedCity.value?.sunset))

const timezoneText = computed(() => {
  if (!hasTimeData.value) return ''

  const timezone = Number(selectedCity.value.timezone)
  const sign = timezone >= 0 ? '+' : '-'
  const absoluteSeconds = Math.abs(timezone)
  const hours = String(Math.floor(absoluteSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((absoluteSeconds % 3600) / 60)).padStart(2, '0')

  return `UTC${sign}${hours}:${minutes}`
})

// 현재 Unix Timestamp를 원본 일출·일몰 Timestamp와 비교하여 낮인지 판단한다.
const isDaytime = computed(() => {
  if (!hasTimeData.value) return false

  const sunrise = Number(selectedCity.value.sunrise)
  const sunset = Number(selectedCity.value.sunset)

  return currentUnix.value >= sunrise && currentUnix.value < sunset
})

// 낮에는 일출→일몰, 밤에는 일몰→다음 일출 구간을 사용한다.
const currentPeriod = computed(() => {
  if (!hasTimeData.value) return null

  const sunrise = Number(selectedCity.value.sunrise)
  const sunset = Number(selectedCity.value.sunset)
  const current = currentUnix.value

  if (isDaytime.value) {
    return { start: sunrise, end: sunset }
  }

  if (current < sunrise) {
    return { start: sunset - 24 * 60 * 60, end: sunrise }
  }

  return { start: sunset, end: sunrise + 24 * 60 * 60 }
})

const periodProgress = computed(() => {
  if (!currentPeriod.value) return 0

  const duration = currentPeriod.value.end - currentPeriod.value.start
  if (duration <= 0) return 0

  const progress =
    ((currentUnix.value - currentPeriod.value.start) / duration) * 100

  return Math.min(100, Math.max(0, progress))
})

const periodProgressStyle = computed(() => ({ width: `${periodProgress.value}%` }))
const periodMarkerStyle = computed(() => ({ left: `${periodProgress.value}%` }))
const periodStartTime = computed(() => formatCityTime(currentPeriod.value?.start))
const periodEndTime = computed(() => formatCityTime(currentPeriod.value?.end))

const remainingTimeText = computed(() => {
  if (!currentPeriod.value) return ''

  const remainingSeconds = Math.max(0, currentPeriod.value.end - currentUnix.value)
  const totalMinutes = Math.ceil(remainingSeconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const target = isDaytime.value ? '일몰' : '일출'

  return `${target}까지 ${hours}시간 ${minutes}분`
})

// 화면에서 항상 식별할 수 있는 작은 원형 Marker와 Glow를 만든다.
const createLocationMarker = (marker) => {
  const markerElement = document.createElement('span')
  const glowColor = createMarkerRgba(marker.color, 0.42)

  markerElement.className = 'globe-city-marker'
  markerElement.title = `${marker.name} ${marker.temperature}℃`
  markerElement.setAttribute('aria-label', `${marker.name} 위치`)
  markerElement.style.backgroundColor = marker.color
  markerElement.style.boxShadow = `0 0 0 5px ${glowColor}, 0 0 18px 6px ${glowColor}`

  return markerElement
}

// Hex 온도 색상을 Marker Glow에서 사용할 rgba 값으로 변환한다.
const createMarkerRgba = (markerColor, opacity) => {
  const hexColor = markerColor.replace('#', '')
  const red = Number.parseInt(hexColor.slice(0, 2), 16)
  const green = Number.parseInt(hexColor.slice(2, 4), 16)
  const blue = Number.parseInt(hexColor.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`
}

// Ring도 Marker와 같은 온도 색상을 사용하되 바깥으로 갈수록 투명하게 만든다.
const createRingColor = (markerColor) => {
  const hexColor = markerColor.replace('#', '')
  const red = Number.parseInt(hexColor.slice(0, 2), 16)
  const green = Number.parseInt(hexColor.slice(2, 4), 16)
  const blue = Number.parseInt(hexColor.slice(4, 6), 16)

  return (time) =>
    `rgba(${red}, ${green}, ${blue}, ${Math.max(0, 0.45 * (1 - time))})`
}

// 선택 도시가 바뀌면 3D 지구본을 해당 좌표로 회전하고 위치 점을 갱신한다.
const updateGlobeLocation = async () => {
  await nextTick()

  if (!locationGlobe) return

  if (!hasLocation.value) {
    locationGlobe.htmlElementsData([]).ringsData([])
    locationGlobe.controls().autoRotate = true
    locationGlobe.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 900)
    return
  }

  const latitude = Number(selectedCity.value.latitude)
  const longitude = Number(selectedCity.value.longitude)
  const markerColor = getTemperatureColor(selectedCity.value.temp)
  const marker = {
    lat: latitude,
    lng: longitude,
    name: selectedCity.value.name,
    temperature: selectedCity.value.temp,
    color: markerColor,
    ringColor: createRingColor(markerColor),
  }

  locationGlobe.controls().autoRotate = false
  locationGlobe.htmlElementsData([marker]).ringsData([marker])
  locationGlobe.pointOfView({ lat: latitude, lng: longitude, altitude: 1.65 }, 1200)
}

onMounted(() => {
  const globeWidth = globeElement.value.clientWidth || 240

  locationGlobe = new Globe(globeElement.value, {
    rendererConfig: { antialias: true, alpha: true },
  })
    .width(globeWidth)
    .height(GLOBE_HEIGHT)
    .backgroundColor('rgba(0, 0, 0, 0)')
    .globeImageUrl(EARTH_IMAGE_URL)
    .bumpImageUrl(EARTH_BUMP_IMAGE_URL)
    .showAtmosphere(true)
    .atmosphereColor('#60a5fa')
    .atmosphereAltitude(0.18)
    .htmlElementsData([])
    .htmlLat('lat')
    .htmlLng('lng')
    .htmlAltitude(0.012)
    .htmlElement(createLocationMarker)
    .htmlTransitionDuration(500)
    .ringsData([])
    .ringLat('lat')
    .ringLng('lng')
    .ringColor('ringColor')
    .ringMaxRadius(2.4)
    .ringPropagationSpeed(1)
    .ringRepeatPeriod(1400)

  const globeControls = locationGlobe.controls()
  globeControls.autoRotate = true
  globeControls.autoRotateSpeed = 0.45
  globeControls.enableDamping = true
  globeControls.dampingFactor = 0.08

  locationGlobe.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 0)

  // Sidebar 폭이 달라지면 Canvas도 패널 폭에 맞게 다시 계산한다.
  if ('ResizeObserver' in window) {
    globeResizeObserver = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width)
      if (nextWidth > 0) locationGlobe?.width(nextWidth)
    })
    globeResizeObserver.observe(globeElement.value)
  }

  updateGlobeLocation()

  // 현재 시각을 갱신하여 검색 도시의 현지 시간과 진행도를 실시간으로 바꾼다.
  clockTimer = window.setInterval(() => {
    currentTimestamp.value = Date.now()
  }, 1000)
})

watch(selectedCity, updateGlobeLocation)

onBeforeUnmount(() => {
  window.clearInterval(clockTimer)
  globeResizeObserver?.disconnect()
  locationGlobe?._destructor()
  locationGlobe = null
})
</script>

<template>
  <el-card class="location-card" shadow="never">
    <div class="location-heading">
      <p>LOCATION GLOBE</p>
      <h2>검색 도시 위치</h2>
    </div>

    <div
      ref="globeElement"
      class="location-globe"
      role="img"
      :aria-label="hasLocation ? `${selectedCity.name} 위치 3D 지구본` : '회전 가능한 3D 지구본'"
    ></div>
    <p class="globe-guide">드래그하여 회전하고 스크롤하여 확대할 수 있습니다.</p>

    <template v-if="hasLocation">
      <div class="selected-location">
        <span class="pin-icon">📍</span>
        <div>
          <small>SEARCHED CITY</small>
          <strong>{{ selectedCity.name }}</strong>
        </div>
      </div>

      <el-tag class="country-tag" type="primary" effect="light" round>
        {{ countryName }}
      </el-tag>

      <div class="coordinate-grid">
        <div>
          <span>LATITUDE</span>
          <strong>{{ latitudeText }}</strong>
        </div>
        <div>
          <span>LONGITUDE</span>
          <strong>{{ longitudeText }}</strong>
        </div>
      </div>
    </template>

    <div v-else class="location-empty">
      <strong>표시할 도시가 없습니다.</strong>
      <p>도시를 검색하거나 날씨 카드를 선택하면 지구본에서 위치를 확인할 수 있습니다.</p>
    </div>

    <div class="panel-divider"></div>

    <section class="time-section" aria-label="검색 도시 현지 시간과 낮 밤 정보">
      <p class="time-eyebrow">LOCAL TIME</p>

      <template v-if="hasTimeData">
        <div class="local-time-row">
          <div>
            <strong class="local-clock">{{ localTimeText }}</strong>
            <span class="local-place">{{ selectedCity.name }}, {{ countryName }}</span>
          </div>
          <el-tag class="timezone-tag" type="primary" effect="plain" round>
            {{ timezoneText }}
          </el-tag>
        </div>

        <div class="daylight-panel" :class="isDaytime ? 'day-period' : 'night-period'">
          <div class="period-heading">
            <span class="period-icon">{{ isDaytime ? '☀️' : '🌙' }}</span>
            <div>
              <small>{{ isDaytime ? 'DAYLIGHT' : 'NIGHT TIME' }}</small>
              <strong>{{ isDaytime ? '현재: 낮' : '현재: 밤' }}</strong>
            </div>
          </div>

          <div class="period-time-row">
            <span>{{ isDaytime ? '🌅' : '🌇' }} {{ periodStartTime }}</span>
            <span>{{ periodEndTime }} {{ isDaytime ? '🌇' : '🌅' }}</span>
          </div>

          <div class="period-track" aria-label="낮 밤 진행도">
            <div class="period-progress" :style="periodProgressStyle"></div>
            <span class="period-marker" :style="periodMarkerStyle">
              {{ isDaytime ? '☀️' : '🌙' }}
            </span>
          </div>

          <div class="sun-summary">
            <span>🌅 {{ sunriseTimeText }}</span>
            <span>🌇 {{ sunsetTimeText }}</span>
          </div>

          <p class="remaining-time">{{ remainingTimeText }}</p>
        </div>
      </template>

      <div v-else class="time-empty">
        <strong>도시의 현지 시간이 필요하신가요?</strong>
        <p>도시를 검색하면 현지 시간과 일출·일몰 정보를 확인할 수 있습니다.</p>
      </div>
    </section>
  </el-card>
</template>

<style scoped>
.location-card {
  border-color: #dbe4f0;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(45, 62, 90, 0.07);
}

.location-card > :deep(.el-card__body) {
  padding: 20px;
}

.location-heading p {
  margin: 0 0 5px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.location-heading h2 {
  margin: 0;
  color: #172033;
  font-size: 20px;
}

.location-globe {
  position: relative;
  width: 100%;
  height: 250px;
  margin: 18px 0 8px;
  overflow: hidden;
  border: 1px solid #1e3a5f;
  border-radius: 14px;
  background:
    radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.85) 0 1px, transparent 1.4px),
    radial-gradient(circle at 75% 16%, rgba(147, 197, 253, 0.8) 0 1px, transparent 1.4px),
    radial-gradient(circle at 67% 76%, rgba(255, 255, 255, 0.65) 0 1px, transparent 1.3px),
    radial-gradient(circle at 27% 81%, rgba(96, 165, 250, 0.7) 0 1px, transparent 1.4px),
    linear-gradient(145deg, #020617, #0b1f3a 58%, #081426);
  cursor: grab;
  box-shadow: inset 0 0 35px rgba(59, 130, 246, 0.12), 0 10px 22px rgba(15, 23, 42, 0.16);
}

.location-globe:active {
  cursor: grabbing;
}

.location-globe :deep(.scene-container),
.location-globe :deep(canvas) {
  border-radius: 14px;
}

.location-globe :deep(.scene-nav-info) {
  display: none;
}

.location-globe :deep(.globe-city-marker) {
  display: block;
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid #ffffff;
  border-radius: 50%;
  cursor: help;
  pointer-events: auto;
  transform: translate(-50%, -50%);
}

.globe-guide {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 10px;
  line-height: 1.5;
  text-align: center;
}

.selected-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  text-align: left;
}

.pin-icon {
  font-size: 22px;
}

.selected-location div {
  display: flex;
  flex-direction: column;
}

.selected-location small,
.coordinate-grid span {
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.selected-location strong {
  color: #172033;
  font-size: 19px;
}

.country-tag {
  display: flex;
  width: fit-content;
  margin: 10px auto 0;
  font-weight: 700;
}

.coordinate-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 20px;
}

.coordinate-grid div {
  padding: 11px 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  text-align: center;
}

.coordinate-grid span,
.coordinate-grid strong {
  display: block;
}

.coordinate-grid strong {
  margin-top: 4px;
  color: #1d4ed8;
  font-size: 14px;
}

.location-empty {
  text-align: center;
}

.location-empty strong {
  color: #334155;
  font-size: 14px;
}

.location-empty p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.panel-divider {
  height: 1px;
  margin: 22px 0;
  background: #e2e8f0;
}

.time-eyebrow {
  margin: 0 0 12px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.local-time-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.local-time-row > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.local-clock {
  color: #172033;
  font-size: 30px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.local-place {
  margin-top: 6px;
  overflow: hidden;
  color: #64748b;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timezone-tag {
  flex: 0 0 auto;
  font-size: 10px;
  font-weight: 700;
}

.daylight-panel {
  margin-top: 18px;
  padding: 14px;
  border: 1px solid;
  border-radius: 12px;
}

.day-period {
  background: #fffaf0;
  border-color: #fde2a7;
}

.night-period {
  background: #f5f7ff;
  border-color: #cdd5ff;
}

.period-heading {
  display: flex;
  align-items: center;
  gap: 9px;
}

.period-icon {
  font-size: 21px;
}

.period-heading div {
  display: flex;
  flex-direction: column;
}

.period-heading small {
  color: #64748b;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.8px;
}

.period-heading strong {
  margin-top: 2px;
  color: #26334d;
  font-size: 13px;
}

.period-time-row,
.sun-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-variant-numeric: tabular-nums;
}

.period-time-row {
  margin-top: 15px;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
}

.period-track {
  position: relative;
  height: 7px;
  margin: 19px 4px 17px;
  background: #dbe4f0;
  border-radius: 999px;
}

.period-progress {
  height: 100%;
  border-radius: inherit;
}

.day-period .period-progress {
  background: #f59e0b;
}

.night-period .period-progress {
  background: #5267c9;
}

.period-marker {
  position: absolute;
  top: 50%;
  font-size: 17px;
  line-height: 1;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 2px 3px rgba(15, 23, 42, 0.18));
}

.sun-summary {
  color: #64748b;
  font-size: 10px;
}

.remaining-time {
  margin: 12px 0 0;
  color: #334155;
  font-size: 12px;
  font-weight: 800;
  text-align: center;
}

.time-empty {
  padding: 13px 12px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  text-align: center;
}

.time-empty strong {
  color: #334155;
  font-size: 12px;
}

.time-empty p {
  margin: 5px 0 0;
  color: #64748b;
  font-size: 11px;
  line-height: 1.55;
}
</style>
