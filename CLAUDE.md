# Peche Frontend - Claude 참고 정보

## 슬랙 사용자 ID

| 이름 | Slack ID | 태그 |
|------|----------|------|
| 조수현 | U0AHA6EH5B2 | `<@U0AHA6EH5B2>` |
| 이소이 | U07HB4RB7Q8 | `<@U07HB4RB7Q8>` |
| 박성재 | U05MZBWCM5H | `<@U05MZBWCM5H>` |
| 박수경 | U0A6MDB0HMK | `<@U0A6MDB0HMK>` |
| 손병극 | U055SM95WSX | `<@U055SM95WSX>` |

슬랙 메시지에서 태그할 때: `<@슬랙ID>` 형식 사용

## 슬랙 알림

- Webhook URL: AWS SSM `/peche/prod/base/slack/webhook-url` (SecureString)
- 알림 스크립트: `./scripts/slack-notify.sh`
- 업데이트 템플릿: `./scripts/slack-notify.sh update "" "변경사항1" "변경사항2"` (버전 빈값이면 package.json에서 자동 읽기)
- 자유 메시지: `./scripts/slack-notify.sh msg "내용"`

## 버전 관리 루틴

- **버전 규칙**: Semantic Versioning
  - `x.Y.0` (minor): 새 기능 추가 (새 페이지, 새 메뉴 등)
  - `x.y.Z` (patch): 버그 수정, UI 수정, 텍스트/이미지 변경
- **배포 시 필수 순서**:
  1. `package.json` 버전 올리기
  2. `CHANGELOG.md`에 변경사항 기록
  3. 커밋 → `STAGE=prod make shoot` → 슬랙 알림

## 배포

- 운영: `STAGE=prod make shoot` (orval → webpack build → S3 sync → CloudFront 무효화)
- 운영 서버: https://pecheskin.clinic
- AWS 프로파일: `--profile peche --region ap-northeast-2`

## 로컬 개발

- 프론트엔드: `STAGE=dev yarn dev` → http://localhost:8086
- 백엔드 (Docker): `docker compose up` → http://localhost:3007
- 백엔드 API (prod 연결): `https://base.pecheskin.clinic/api`

<!-- sync-docs:start -->

## 기술 스택

- React 18, TypeScript 5, Webpack 5
- 상태관리: Recoil 0.7 (글로벌) + TanStack React Query 4 (서버)
- 폼: React Hook Form 7 + Zod 3
- 스타일: Tailwind CSS 3 + twin.macro 3 + Emotion 11
- UI: MUI 5 (DatePicker 등), Swiper
- i18n: i18next + react-i18next (ko, en, zh, ja, th, tw)
- API: Axios + Orval 6 (OpenAPI → React Query 훅 자동생성)
- 패키지 매니저: yarn 3.6

## 아키텍처

```
src/
├── assets/          # 아이콘, 이미지
├── design-system/   # 공유 UI 컴포넌트 (Button, Input 등)
├── features/        # 기능 모듈
│   ├── auth/        # 인증 (카카오, 이메일)
│   ├── user/        # 사용자
│   └── product/     # 상품, 장바구니
├── lib/             # 공유 유틸리티
│   ├── api/         # HTTP 클라이언트 (axios)
│   ├── components/  # 레이아웃 (Header, Footer)
│   ├── constants/   # 쿼리 키, localStorage 키
│   ├── hooks/       # 공용 훅 (useToken, useResponsive)
│   ├── locales/     # i18n JSON 파일 (ko, en, zh, ja, th, tw)
│   ├── orval/       # 자동생성 API 클라이언트 (수정 금지)
│   ├── service/     # AuthService, LocalStorage
│   ├── types/       # 공유 타입
│   └── utils/       # 헬퍼 함수
├── pages/           # 페이지 컴포넌트
│   ├── home/        # 메인
│   ├── product/     # 시술 상품
│   ├── reservation/ # 예약
│   ├── blog/        # 블로그
│   └── auth/        # 카카오 리다이렉트
├── routers/         # React Router (/:lang 기반)
└── styles/          # 글로벌 스타일, 폰트
```

## 코딩 규칙

- 임포트: `@/` 별칭 사용 (tsconfig + webpack alias)
- 파일명: `kebab-case.component.tsx`, `kebab-case.page.tsx`, `use-kebab-case.ts`
- 컴포넌트: 화살표 함수, Props 인터페이스, default export
- 스타일: Tailwind 유틸리티 우선, twin.macro로 styled 컴포넌트
- 상태: Recoil atom (토큰 등 글로벌), React Query (서버), useState (로컬)
- 포맷: 쌍따옴표, 세미콜론 없음, trailing comma, 100자 폭
- SVG: `@svgr/webpack`으로 React 컴포넌트로 임포트
- 라우팅: 모든 경로 `/:lang` 파라미터 포함

## 금지사항

- `src/lib/orval/` 파일 직접 수정 금지 — `make orval`로 재생성
- `console.log` 허용이지만 프로덕션 코드에 남기지 말 것
- `process.env`로 환경변수 접근 (DefinePlugin으로 빌드타임 주입)

## 주요 결합

- `lib/hooks/use-token.ts` → Recoil atom + localStorage, auth/user 모듈에서 사용
- `lib/orval/model/` → 자동생성 타입, 전 페이지에서 사용 (변경 시 orval 재실행)
- `features/product/hooks/use-cart.ts` → localStorage + Cookie 백업, 예약 페이지에서 사용
- `features/auth/components/auth.component.tsx` → 예약, 장바구니 등 인증 필요 페이지에서 공유
- `lib/api/http-client.ts` → orval customInstance, 모든 API 호출의 기반
- `lib/locales/*.json` → 6개 언어 파일, 키 추가 시 전체 동기화 필요
- 환경변수: `env/.env.{STAGE}` → webpack DefinePlugin → `process.env.*`

## 제약사항

- Webpack 빌드 시 `env/.env.{STAGE}` 파일 필요 (Makefile의 `env` 타겟이 SSM에서 생성)
- orval 생성 파일은 TypeScript 체크 제외 (`ForkTsCheckerWebpackPlugin` exclude)
- `STAGE` 환경변수: `dev` → default-index.html, 그 외 → staging-index.html
- Tailwind 커스텀 색상: point, primary, secondary 등 (tailwind.config.js)

<!-- sync-docs:end -->
