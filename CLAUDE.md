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
- 업데이트 템플릿: `./scripts/slack-notify.sh update "v버전" "변경사항1" "변경사항2"`
- 자유 메시지: `./scripts/slack-notify.sh msg "내용"`

## 배포

- 운영 서버: https://pecheskin.clinic
- 빌드: `STAGE=prod yarn build:prod`
- 배포: `aws s3 sync ./dist s3://pecheclinic-prod-website --profile peche --region ap-northeast-2`
- 캐시 무효화: `aws cloudfront create-invalidation --distribution-id E30SAPRYE84C3M --paths "/*" --profile peche --region ap-northeast-2`

## 로컬 개발

- 프론트엔드: `STAGE=dev yarn dev` → http://localhost:8086
- 백엔드 (Docker): `docker compose up` → http://localhost:3007
- 백엔드 API (prod 연결): `https://base.pecheskin.clinic/api`
