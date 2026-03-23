# Changelog

## [Unreleased]

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
