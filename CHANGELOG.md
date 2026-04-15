# Changelog

## [Unreleased]

---

## [1.9.0] - 2026-04-15

### Added

- 의료진 소개 안태언 대표원장 정렬 보정 (가운데 정렬 + 시각 보정)
- 페슈의원 소개 인테리어 우측 이미지 교체 (정사각형 1:1)
- Why Pêche? 단체사진 모바일 가로 이미지 분기

### Changed

- GNB 메뉴명 외국어 단축 (의료진 소개, Blog ja)
- Why Pêche? GNB 메뉴 번역 적용 (zh/ja/tw/th)
- 시술 검색 버튼 5개 외국어 번역
- 소개 페이지 customerTrust2 / interior 텍스트 교체 (메타뷰 3D 진단)
- 한국어 외 모든 언어에서 카카오 지도 → 구글 지도 보기
- SNS 아이콘 (X, Facebook, Instagram, Tiktok 등) 신규 SVG 교체
- SNS 아이콘 사이즈 24px → 28px (헤더/푸터)
- PC/푸터 로고 SVG 적용 + PC 헤더 로고 1.15배 확대

### Fixed

- 일본 사이트 헤더 X 아이콘 노출
- 대만/태국 사이트 헤더/푸터 Facebook 아이콘 노출
- GNB active 표시 regex tw/zh-TW 매핑 추가
- 텍스트 줄바꿈 반영 (interior, customerTrust 등)

---

## [1.8.1] - 2026-04-14

### Changed

- 소개 페이지 customerTrust2 / interior 텍스트 6개 언어 교체
- 소개 페이지 trustHeading 하이라이트 단어 분리 (ja/zh/tw/th)
- Google Maps API → 정적 이미지로 교체 (intro, home, intro-map)
- 카카오 지도 보기 → 구글 지도 보기로 변경

---

## [1.8.0] - 2026-04-14

### Added

- Why Pêche? 페이지 GNB 메뉴 추가 (한국어 제외, 외국어 5개 언어 노출)
- Why Pêche? 페이지 최하단 Contact 섹션 (상담 카드 + 주소 카드 + 지도)
- PC 최소 너비 1440px 적용 (1025~1440px 가로 스크롤)
- PC/MO 헤더/푸터 로고 SVG 교체 + PC 로고 크기 조정

### Changed

- Why Pêche? 단체사진 섹션 — 풀와이드 이미지 + 하단 좌우 텍스트 구조로 변경
- Why Pêche? 이유 카드 5개 — 1024px 이하에서 세로 스택 레이아웃
- Why Pêche? Global Review 섹션 제거 (피그마 시안 반영)
- Why Pêche? 이미지 교체 (02, 06, 07, map)
- 의료진 소개 안태언 프로필 이미지 교체
- 소개 페이지 첫 섹션 이미지 왼쪽 배치, 1:1 비율 적용
- 의료진 소개 첫 섹션 구조 소개 페이지와 동일하게 통일
- 본문 간격 통일 (제목↔본문 16/24px, 본문↔본문 8/16px)
- 이름/직급 분리 ("안 태 언" 700 22px + "대표원장" 400 22px)

### Fixed

- URL /tw → i18n zh-TW 언어 매핑 수정 (직접 접속 시 언어 감지)
- 한국어 /ko/why-peche 접근 시 홈으로 리다이렉트

---

## [1.7.1] - 2026-04-11

### Changed

- 페슈의원 소개 / 의료진 소개 첫 섹션 레이아웃 통일
- 이미지 1:1 비율(aspect-square) 적용 (소개/의료진 공통)
- 본문 간격 통일 (제목↔본문, 본문↔본문)
- 소개 페이지 텍스트 수정 (정확한 진단, 자연스럽게 등)
- 소개 페이지 이미지 교체 (interior2, trust-pic2/3/4)
- 소개 페이지 복숭아 이미지 3장 제거, Core Value 유지
- 소개 페이지 상단 패딩 통일
- 의료진 소개 안태언 대표원장 이름/직급 다국어 적용
- 푸터 대표자명 외국어 Ahn Taeon 통일
- GNB 메뉴 간격 조정 (gap 4rem → 2rem)

---

## [1.7.0] - 2026-04-10

### Added

- Why Pêche? 페이지 신규 추가 (/why-peche)
- GNB에 "Why Pêche?" 메뉴 추가 (전 언어 통일)
- Global Review 섹션 — Google Places API 리뷰 연동 (API 키 설정 필요)

---

## [1.6.0] - 2026-04-10

### Added

- 의료진 소개 페이지 신규 추가 (/doctor)
- GNB에 "의료진 소개" 메뉴 추가 (6개 언어 지원)

---

## [1.5.1] - 2026-04-06

### Added

- 상세페이지 이벤트/상품 탭 분리 (가격·이벤트 / 전체시술)
- 상품 리스트에도 정상가+할인가 표시

### Changed

- 전체시술 상세페이지 목록 가격 — 할인가 기준 최소값으로 표시

---

## [1.5.0] - 2026-04-06

### Added

- 가격이벤트 페이지 탭 통합: 이벤트 대분류(4개, 베이지) + 상품 대분류(N개, 흰색) 통합 표시
- 상시 대분류 탭에서 상품 데이터 조회 + 할인가/정상가 표시
- 상세페이지 이벤트 리스트에 대분류명(번들명) 텍스트 표시
- 이벤트 다중 번들 지원 (bundleId 필터 제거)

### Changed

- 이벤트/상품 정렬: 번들 order → 행 order 순서 적용

---

## [1.4.8] - 2026-03-27

### Fixed

- 메인 페이지 "가장 많이 찾는 시술" 섹션 장비명 태그 위치 수정 (섬네일 밖으로 밀리던 문제 → 섬네일 우측 하단 정위치)
- 모바일 슬라이드 시 장비명 태그 깜빡임 수정 (GPU 레이어 고정)

---

## [1.4.7] - 2026-03-26

### Added

- Microsoft Clarity 트래킹 스크립트 추가 (운영 HTML 헤더)

---

## [1.4.6] - 2026-03-23

### Fixed

- 가격이벤트 대분류 탭 필러 배경색 수정 (`bg-white` → `bg-neutral`, 페이지 배경과 일치)

---

## [1.4.5] - 2026-03-23

### Fixed

- 가격이벤트/블로그 대분류 탭 그리드 우측 하단 회색 블록 수정 (필러 div `bg-white` + 음수 마진 복구)

---

## [1.4.4] - 2026-03-23

### Fixed

- 가격이벤트/블로그 대분류 탭 그리드 우측 하단 흰색 박스 제거 (외부 배경색 `bg-neutral30` 삭제 + 필러 div 제거)

---

## [1.4.3] - 2026-03-23

### Fixed

- 외국어 사이트 주소 내 건물명 오타 수정 (Miwang → Meewang Building)
  - EN/TH: Miwang Building → Meewang Building
  - JA: ミワンビル（Meewang Building） 영어명 병기
  - ZH/TW: 美王大厦/美王大樓 Meewang Building 영어명 병기
- 가격이벤트 페이지 대분류 탭 배경색 기준 수정 (PC/모바일 동일: 첫방문·원데이·이달의·패키지상품)
- 블로그 페이지 대분류 탭 배경색 기준 수정 (PC/모바일 동일: 전체·첫방문·원데이·이달의·패키지상품)

---

## [1.4.2] - 2026-03-23

### Fixed

- 가격이벤트 페이지 대분류 탭 배경색 모바일 미표시 수정 (`isFirstRow` 로직 desktop 5열/mobile 3열 분리)
- 블로그 대분류 탭 배경색 모바일 미표시 수정 (동일 원인)
- 블로그 글쓰기/수정/삭제 버튼 PC 전용으로 변경

---

## [1.4.1] - 2026-03-23

### Fixed

- EN 사이트 WhatsApp 버튼 클릭 시 QR 모달 → 링크 이동으로 변경
- 예약확인변경 페이지 어드민 로그인 시 빈화면 수정
- WeChat QR 이미지 확장자 통일 (.png → .jpg)

---

## [1.3.1] - 2026-03-19

### Fixed

- 언어 선택 국기 이모지를 인라인 SVG로 교체 (Windows Chrome 대응)
- 언어 선택 드롭다운 좌우 여백 균등 조정
- 다국어 브랜드명 수정 (zh/ja/tw/th)

---

## [1.4.0] - 2026-03-21

### Added - 블로그 기능 신규 출시

**블로그 백엔드 (BE)**
- `BlogPost`, `BlogCategory` 엔티티 및 CRUD API 추가
- 블로그 목록/상세/생성/수정/삭제 엔드포인트 (`/api/blog`)
- 조회수(`view_count`) 컬럼 마이그레이션 추가
- `eventCategoryId` 컬럼 마이그레이션 idempotent 처리 (`DROP COLUMN IF EXISTS`)
- `AddBlogKeywords`, `AddBlogViewCount` 마이그레이션 운영 배포 완료

**블로그 프론트엔드 (FE)**
- 블로그 목록 페이지 (`/blog`): 배너, 이벤트 대분류 탭 필터, 그리드, 페이지네이션
- 블로그 상세 페이지 (`/blog/:slug`): TOC 사이드바, 콘텐츠 렌더링, 작성자 프로필, SEO
- 블로그 작성/수정 페이지 (`/blog/write`, `/blog/edit/:slug`): 6개 언어 탭, HTML 에디터 툴바
- 어드민 전용 글쓰기 버튼 (썸네일 그리드 하단 우측, 게시글 없을 시 중앙)

### Fixed - 블로그 UI/UX 개선

- 이벤트 대분류 탭 배경색(`#FEF5EA`) 소실 수정: `isFirstRow` 로직 desktop(5열)/mobile(3열) 분리
- 탭 필러 div 배경색 gray → white
- 블로그 목록 상단 padding을 가격이벤트 페이지와 동일하게 맞춤 (`mt-8 lg:mt-16`)
- 블로그 카드·상세 페이지 카테고리 미표시 수정: `post.eventCategoryId` 기반 이벤트 대분류명 표시
- ol/ul 리스트 스타일 구분: `ul { list-style-type: disc }`, `ol { list-style-type: decimal }`
- 콘텐츠 textarea Enter 키 → `<br>` 자동 삽입
- TOC "가격이벤트 보기" 버튼: `CustomLink` 이중 language prefix 버그 수정 → 해당 대분류로 정확히 이동

### Ops - 운영 인프라

- 운영 DB `admin@pecheskin.clinic` 계정 ADMIN 권한 부여 (ECS exec 경유)
- ECS 서비스 `enableExecuteCommand: true` 영구 활성화 (운영 디버깅용)
- ECS task role `peche-ecs-task-role-prod`에 SSM exec 정책 추가

---

## [1.3.0] - 2026-03-11

### Changed - SNS 상담 아이콘 교체 및 인스타그램 추가

- 인스타그램 상담 아이콘 신규 추가 (한국 외 전체 언어: EN/ZH/JA)
  - 장바구니 Auth 섹션 (`auth.component.tsx`)
  - 예약확인 페이지 (`reservation.page.tsx`)
  - 모바일 하단 탭바 상담하기 (`cart-view.component.tsx`)
- 카카오/WhatsApp/LINE/WeChat help 아이콘 이미지 업데이트 (고해상도)
- 모바일 하단 인스타그램 버튼 초록색 배경 제거 → 이미지만 표시

### Added - ko 사이트 이메일 인증 추가

- 한국어 사이트 예약 페이지에 이메일 인증 버튼 추가 (카카오 인증 옆 병렬 배치)
- 예약확인 페이지에도 이메일 인증 버튼 추가
- 이메일 인증 클릭 시 해외고객 안내 confirm 모달 선행
  - "해외 거주 고객 및 외국인 고객을 위한 인증 방식" 안내
  - 확인 클릭 시에만 이메일 인증 모달 진행

### Fixed - 카카오 인증 장바구니 백업 개선

- Cookie 백업 데이터를 slim 포맷으로 변경 (4KB 쿠키 제한 대응)
  - 전체 Event/Product 객체 대신 id, 다국어 name, price만 저장
- Cookie domain을 `.pecheskin.clinic`으로 설정 (www/non-www 간 쿠키 공유)
- 카카오 리다이렉트 핸들러에서 navigate 전에 localStorage 직접 복원

---

## [1.2.0] - 2026-03-09

### Fixed - 카카오 인증 후 장바구니/예약시간 소실 버그

**증상**: 예약 페이지에서 시술을 담고 카카오 인증을 하면 장바구니가 비워지고, 모든 시간대가 선택 불가로 표시됨

**원인**: 카카오 OAuth는 크로스 도메인 리다이렉트(pecheskin.clinic → kauth.kakao.com → pecheskin.clinic)를 거침. Safari ITP 및 일부 모바일 브라우저에서 이 과정에서 localStorage가 초기화될 수 있음. 또한 `www.pecheskin.clinic` ↔ `pecheskin.clinic` 간 origin이 달라 localStorage가 공유되지 않는 문제도 있었음.

**해결 방법**: Cookie 백업/복원 2단계 방어

1. **카카오 인증 직전** (`auth.component.tsx`): `onBeforeKakaoAuth` 콜백으로 장바구니 데이터를 Cookie에 백업
2. **카카오 리다이렉트 후** (`kakao-redirected-oauth.page.tsx`): 로그인 성공 시 Cookie에서 localStorage로 복원한 뒤 페이지 이동
3. **예약 페이지 진입 시** (`reserve.page.tsx`): 추가 안전장치로 Cookie 복원 재시도

**수정 파일**:
- `src/features/product/hooks/use-cart.ts`
  - Cookie 유틸 함수 추가 (setCookie, getCookie, deleteCookie)
  - `slimCartItem()`: Cart의 전체 Event/Product 객체에서 표시 필수 필드만 추출 (4KB 쿠키 제한 대응)
  - `fattenCartItem()`: slim 데이터 → CartItem 복원
  - `backupToCookie()`: slim 포맷으로 장바구니 + 선택시간을 Cookie에 저장
  - `restoreFromCookie()`: Cookie → useLocalStorage 상태 복원
  - Cookie domain을 `.pecheskin.clinic`으로 설정해 www/non-www 간 공유
- `src/features/auth/components/auth.component.tsx`
  - `onBeforeKakaoAuth` prop 추가, 카카오 버튼 클릭 시 호출
- `src/pages/auth/kakao-redirected-oauth/kakao-redirected-oauth.page.tsx`
  - `onSuccess`에서 navigate 전에 Cookie → localStorage 직접 복원 (useLocalStorage 타이밍 이슈 방지)
- `src/pages/reservation/reserve.page.tsx`
  - 마운트 시 `restoreFromCookie()` 호출 (추가 안전장치)
  - Auth 컴포넌트에 `onBeforeKakaoAuth={backupToCookie}` 전달

**핵심 기술 포인트**:
- Cookie는 HTTP 프로토콜 레벨이라 Safari ITP의 JavaScript Storage 초기화 대상이 아님
- 전체 Event/Product 객체는 다국어 필드 등으로 수 KB → `slimCartItem`으로 id, 다국어 name, price만 추출해 4KB 내로 압축
- `domain=.pecheskin.clinic`으로 www/non-www 서브도메인 간 쿠키 공유
- 리다이렉트 핸들러에서 navigate 전에 localStorage를 직접 복원해야 useLocalStorage 초기화 타이밍 이슈 방지 가능

---

## [1.1.0] - 2026-03-06

### Changed
- 모바일 헤더: 언어 선택 아이콘(지구)을 햄버거 메뉴 내부 → 헤더 상단 우측으로 이동
- 언어 선택 드롭다운 UI 개선: 국기 이모지 + 2글자 코드, 다크 반투명 배경 (80%)
- 지구 아이콘 stroke-width 1.4 → 1.1 (더 얇게)
- 데스크탑: 언어 아이콘 크기 18px, 텍스트 15px (주변 메뉴와 균일)
- 모바일: 언어 아이콘 크기 24px, 간격 조정
- 데스크탑 헤더 메뉴 간격 균등 조정 (예약확인 ↔ 언어 선택)
