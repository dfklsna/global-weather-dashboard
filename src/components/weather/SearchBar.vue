<!--
============================================================
파일명      : SearchBar.vue
작성자      : 김상우
작성일      : 2026-08-26
수정 이력   :
  - 2026-08-27 13:30 Axios 실제 날씨 검색 이벤트와 검색 버튼 추가
  - 2026-08-27 15:00 Element Plus el-input과 el-button 적용
설명        : 부모에게 받은 검색어를 input에 표시하고,
              입력 및 실제 날씨 검색 이벤트를 부모에게 전달한다.
주요 기능   :
  1. props로 현재 검색어 전달받기
  2. update-query 이벤트로 검색어 전달하기
  3. 한글 검색어 즉시 화면에 표시하기
  4. search-weather 이벤트로 실제 API 검색 요청하기
============================================================
-->

<script setup>
// 부모로부터 현재 도시 검색어를 전달받는다.
const props = defineProps({
  query: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showApiSearch: {
    type: Boolean,
    default: false,
  },
})

// 검색어 변경 내용을 부모에게 전달하기 위한 이벤트를 선언한다.
const emit = defineEmits(['update-query', 'search-weather'])

// input에 입력된 값을 update-query 이벤트에 담아 부모에게 전달한다.
const handleInput = (value) => {
  emit('update-query', value)
}

// 검색 버튼 또는 Enter 입력 시 현재 검색어를 실제 API 검색 이벤트로 전달한다.
const handleSearch = () => {
  emit('search-weather', props.query.trim())
}
</script>

<template>
  <!-- 도시 검색 입력 영역 -->
  <div class="search-area">
    <div class="search-heading">
      <span class="search-icon">🔍</span>
      <div>
        <h2>도시 검색</h2>
        <p v-if="props.showApiSearch">도시 이름을 입력하고 실제 날씨를 조회할 수 있습니다.</p>
        <p v-else>한글 도시 이름이 입력 즉시 반영됩니다.</p>
      </div>
    </div>

    <label for="component-city-search">도시 이름</label>
    <form class="search-controls" @submit.prevent="handleSearch">
      <el-input
        id="component-city-search"
        :model-value="props.query"
        :disabled="props.loading"
        @input="handleInput"
        placeholder="서울, 부산, 제주, Tokyo 등 입력"
        clearable
      />
      <el-button
        v-if="props.showApiSearch"
        type="primary"
        native-type="submit"
        :loading="props.loading"
        :disabled="props.loading"
      >
        {{ props.loading ? '조회 중...' : '실제 날씨 검색' }}
      </el-button>
    </form>
    <p class="search-message">
      검색 중인 도시: <strong>{{ props.query }}</strong>
    </p>
  </div>
</template>

<style scoped>
/* 검색 영역 제목 */
.search-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: #eff6ff;
  border-radius: 12px;
  font-size: 20px;
}

.search-heading h2 {
  margin: 0 0 3px;
  color: #1e293b;
  font-size: 21px;
}

.search-heading p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

/* 기존 input 디자인을 유지하고 실제 검색 버튼만 옆에 추가한다. */
.search-area label {
  display: block;
  margin-bottom: 8px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.search-controls {
  display: flex;
  gap: 9px;
}

.search-area :deep(.el-input) {
  flex: 1;
  min-width: 0;
}

.search-area :deep(.el-input__wrapper) {
  min-height: 42px;
  border-radius: 9px;
}

.search-controls :deep(.el-button) {
  min-height: 42px;
  padding: 0 16px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 700;
}

.search-message {
  min-height: 21px;
  margin: 9px 0 0;
  color: #64748b;
  font-size: 13px;
}

.search-message strong {
  color: #2563eb;
}

@media (max-width: 560px) {
  .search-controls {
    flex-direction: column;
  }

  .search-controls :deep(.el-button) {
    width: 100%;
    padding: 11px 14px;
  }
}
</style>
