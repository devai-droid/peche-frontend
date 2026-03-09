#!/bin/bash
# 페슈의원 슬랙 알림 스크립트
#
# [기본 업데이트 템플릿]
# 사용법: ./scripts/slack-notify.sh update "v1.0.1" "변경사항1" "변경사항2" ...
#
# [자유 메시지]
# 사용법: ./scripts/slack-notify.sh msg "메시지 내용"

# Webhook URL 조회 (환경변수 > AWS SSM)
if [ -z "$SLACK_WEBHOOK_URL" ]; then
  SLACK_WEBHOOK_URL=$(aws ssm get-parameter \
    --profile peche \
    --region ap-northeast-2 \
    --name "/peche/prod/base/slack/webhook-url" \
    --with-decryption \
    --query "Parameter.Value" \
    --output text 2>/dev/null)
fi

if [ -z "$SLACK_WEBHOOK_URL" ]; then
  echo "❌ Slack Webhook URL을 가져올 수 없습니다."
  exit 1
fi

MODE="${1}"
DATE=$(date '+%Y-%m-%d %H:%M')

# ─── 업데이트 템플릿 모드 ───────────────────────────────────
if [ "$MODE" = "update" ]; then
  VERSION="${2}"
  if [ -z "$VERSION" ]; then
    echo "버전을 입력하세요 (예: v1.0.1):"
    read VERSION
  fi

  # 3번째 인자부터 변경사항 수집
  shift 2
  ITEMS=""
  if [ $# -eq 0 ]; then
    echo "변경사항을 입력하세요 (빈 줄 입력 시 종료):"
    while true; do
      read LINE
      [ -z "$LINE" ] && break
      ITEMS="${ITEMS}• ${LINE}\n"
    done
  else
    for ITEM in "$@"; do
      ITEMS="${ITEMS}• ${ITEM}\n"
    done
  fi

  TEXT=":peach: \`페슈의원 Update Report\` *${VERSION}*\n\n${ITEMS}"

# ─── 자유 메시지 모드 ──────────────────────────────────────
elif [ "$MODE" = "msg" ]; then
  TEXT="${2}"
  if [ -z "$TEXT" ]; then
    echo "메시지를 입력하세요:"
    read TEXT
  fi

# ─── 모드 미지정 시 안내 ───────────────────────────────────
else
  echo "사용법:"
  echo "  업데이트 알림: ./scripts/slack-notify.sh update \"v1.0.1\" \"변경사항1\" \"변경사항2\""
  echo "  자유 메시지:   ./scripts/slack-notify.sh msg \"메시지\""
  exit 1
fi

# ─── 전송 ─────────────────────────────────────────────────
PAYLOAD=$(printf '{"text": "%s", "username": "Peche Bot", "icon_emoji": ":peach:", "attachments": [{"footer": "pecheskin.clinic | %s", "color": "#BD7B60"}]}' "$TEXT" "$DATE")

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H 'Content-type: application/json' \
  --data "$PAYLOAD" \
  "$SLACK_WEBHOOK_URL")

if [ "$RESPONSE" = "200" ]; then
  echo "✅ 슬랙 메시지 전송 완료"
else
  echo "❌ 전송 실패 (HTTP $RESPONSE)"
  exit 1
fi
