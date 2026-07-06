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
- Bot Token: AWS SSM `/peche/prod/base/slack/bot-token` (SecureString) — 쓰레드 답글용 (`chat:write`)
- 봇 이름: 개발도우미
- 알림 스크립트: `./scripts/slack-notify.sh`
- 업데이트 템플릿: `./scripts/slack-notify.sh update "" "변경사항1" "변경사항2"` (버전 빈값이면 package.json에서 자동 읽기)
- 자유 메시지: `./scripts/slack-notify.sh msg "내용"`
- 쓰레드 답글: 슬랙 메시지 링크(`/archives/<channel>/p<ts>`) + 답글 내용 → bot-token으로 `chat.postMessage` 호출 (`thread_ts` 파라미터)

### 슬랙 메시지 작성 규칙 (중요)

- **읽는 사람은 개발자가 아니라 마케터.** 기술 용어·코드·버전번호·내부 구현 설명 금지.
- **간결하게.** 주절주절 X. 변경 1건당 한 줄, "무엇이 좋아졌는지(역할·효과)" 중심으로. 마케터가 자기 업무에 어떻게 도움되는지가 핵심.
- **보내기 전 반드시 사용자에게 문구를 먼저 보여주고 OK 받은 뒤에만 전송** (자동 전송 금지).
- **초안은 반드시 실제 전송 형태 그대로 보여준다.** 산문·임의 이모지 헤더(🌸 등)로 쓰지 말 것. 형태는 아래 고정:
  ```
  :peach: `페슈의원 Update Report` *버전*

  • 변경사항1
  • 변경사항2
  ```
  전송은 `slack-notify.sh update "버전" "변경사항1" ...`.
- **버전 자리 규칙**: 프론트(사이트) 배포면 `v1.20.7`처럼 package.json 버전. **백엔드/어드민만 바뀐 건 사이트 버전이 없으므로 버전 자리에 `어드민 업데이트`** 로 표기(오해 방지).

## 버전 관리 루틴

- **버전 규칙**: Semantic Versioning (앞자리일수록 큰 변화)
  - `X.0.0` (**major**): 사이트 리뉴얼, 큰 구조 변경, 호환성 깨지는 변경
    - 예) 메인 페이지 전면 개편, 라우팅 구조 변경, 디자인 시스템 교체
  - `x.Y.0` (**minor**): 사용자가 **새로 보게 되는 것** — 새 페이지, 새 메뉴, 새 기능
    - 예) 블로그 페이지 추가, 외국어 사이트 추가, 새로운 결제 흐름 도입
  - `x.y.Z` (**patch**): 기존 기능의 **수정·조정** — 버그 fix, UI 조정, 텍스트/이미지 교체
    - 예) 카트 합계 버그, 모달 텍스트 번역, 배너 이미지 교체
- **헷갈릴 때 한 줄 기준**: 사용자에게 **새로운 게 보이면 minor**, **기존 게 고쳐지면 patch**, **사이트 자체가 바뀐 느낌이면 major**

## 작업 프로세스 (코드 수정 → 배포)

⚠️ 이 프로젝트는 **여러 PC(회사/집)에서 번갈아 작업**되므로, 아래 순서를 매번 동일하게 따라야 환경 차이·동기화 누락이 안 생깁니다. 한 단계라도 빼먹으면 다른 PC와 갈라져서 머지 지옥 발생.

### 1) 작업 시작 전 (필수)

```bash
git fetch origin
git status              # 미커밋 변경 / 다른 PC 작업 흔적 확인
git pull origin develop # 다른 PC가 push한 게 있으면 가져오기
yarn install            # lockfile이 변경됐으면 반드시 실행
```

- 미커밋 변경이 있으면 먼저 commit 또는 stash 후 pull
- `develop`이 `origin/develop`보다 앞서있으면 → 이전 작업이 push 누락된 것. 그것부터 push하고 시작

### 2) 작업 중

- 의미 단위로 작은 커밋 (영역별 분리 — 나중에 문제 시 `git revert`로 그 커밋만 되돌릴 수 있어 안전)
- 커밋 메시지 컨벤션: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`
- 의존성 변경했으면 `yarn.lock`도 같이 커밋

### 3) 작업 종료 시 (반드시 이 순서)

⚠️ **대원칙: 배포는 반드시 `develop` 브랜치에서.** 작업 브랜치를 직접 빌드/배포하면 develop에 있는 다른 변경이 빠진 채 운영에 올라가 페이지가 깨집니다.

#### Case A — `develop`에 직접 작업한 경우

1. `package.json` 버전 올리기 (patch/minor는 위 「버전 관리 루틴」 참조)
2. `CHANGELOG.md`에 해당 버전 entry 추가
3. `git add <변경 파일들>` → `git commit -m "feat/fix: ..."`
4. **`git push origin develop`** ← 이 단계 빠뜨리면 다른 PC와 동기화 즉시 깨짐
5. `STAGE=prod make shoot` (orval → webpack build → S3 sync → CloudFront 무효화)
6. CloudFront 무효화 완료 대기 (보통 1~2분)
7. **시크릿 창**으로 https://pecheskin.clinic 열어서 검증 (브라우저 캐시 우회)
8. ⚠️ **슬랙 알림은 보내기 전에 반드시 사용자에게 "보낼지" 확인받고 전송** — 메시지 문구를 먼저 보여주고 OK 받은 뒤에만 `./scripts/slack-notify.sh update "" "변경사항1" "변경사항2"` 실행 (자동 전송 금지)

#### Case B — 작업 브랜치(`fix/xxx`, `feature/xxx`)를 만들어 작업한 경우

1. `package.json` 버전 올리기
2. `CHANGELOG.md`에 해당 버전 entry 추가
3. `git add <변경 파일들>` → `git commit -m "feat/fix: ..."`
4. `git push origin <브랜치명>`
5. GitHub에서 PR 생성 (필요 시 리뷰)
6. ★ **PR 머지** — 이 단계 빠뜨리면 `develop`에 fix 코드가 안 들어감 (어제 깨진 원인)
7. `git checkout develop && git pull origin develop` ← 머지된 결과를 로컬로 받아오기
8. `STAGE=prod make shoot` ← 반드시 `develop`에서. 작업 브랜치 직접 배포 금지
9. CloudFront 무효화 완료 대기 (1~2분)
10. **시크릿 창**으로 https://pecheskin.clinic 검증
11. ⚠️ **슬랙 알림은 보내기 전에 반드시 사용자에게 "보낼지" 확인받고 전송** — 메시지 문구를 먼저 보여주고 OK 받은 뒤에만 `./scripts/slack-notify.sh update "" "변경사항1" "변경사항2"` 실행 (자동 전송 금지)
12. 머지된 작업 브랜치 삭제: `git push origin --delete <브랜치명>`

### 4) 검증 체크리스트

- [ ] 변경한 영역의 핵심 동작
- [ ] 인접 페이지 회귀 (예: 카트 변경 → 시술 페이지 + 예약 페이지 + 예약 확인 페이지 모두 확인)
- [ ] 모바일 + PC 양쪽
- [ ] 외국어 사이트 (locales 변경했을 때만)
- [ ] 시크릿 창 (캐시 우회)

### 5) 금지사항

- ❌ **작업 후 push 안 한 채 다른 PC에서 새 작업 시작** — 양 PC가 갈라져서 추후 머지 지옥
- ❌ `origin/develop`과 동기화 안 된 채로 운영 배포 — 운영은 항상 push된 상태와 일치해야 함
- ❌ 의존성 변경 후 `yarn.lock` 커밋 누락
- ❌ `package.json` 버전·`CHANGELOG.md` 업데이트 빠뜨린 채 배포

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
