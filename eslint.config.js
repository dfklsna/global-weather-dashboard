/**
 * 파일명: eslint.config.js
 * 코드 내용: Global Weather Dashboard의 JavaScript와 Vue 파일을 검사한다.
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 * 작성시간: 16:29
 */

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
]
