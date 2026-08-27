/**
 * 파일명: create-spa-fallback.mjs
 * 코드 내용: GitHub Pages에서 Vue Router 직접 접근을 처리할 404 문서를 생성한다.
 * 작성자: 김상우
 * 작성일자: 2026-08-27
 */

import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
