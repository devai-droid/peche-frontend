# Changelog

## [Unreleased]

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
