.PHONY: init env clean run lint build deploy

STAGE ?= dev
SERVICE_NAME ?= base
INFRA_NAME ?= peche
AWS_REGION ?= ap-northeast-2
ENV ?= $(STAGE)
# 협약 기업 임직원 전용 사이트(B2B) 빌드 여부. shoot-b2b 가 true 로 넘긴다.
B2B_MODE ?= false
AWS_PNR = --profile $(INFRA_NAME) --region $(AWS_REGION)

ifeq ($(ENV), local)
BACKEND_API_URL?=http://localhost:3007/api
DISTRIBUTION_URL?=http://localhost:8086
KAKAO_APP_REST_KEY?=$(shell aws ssm get-parameter $(AWS_PNR) --name \
	"/$(INFRA_NAME)/staging/$(SERVICE_NAME)/auth/kakao/app-rest-key" | jq '.Parameter | .Value')
KAKAO_APP_JAVASCRIPT_KEY ?= $(shell aws ssm get-parameter $(AWS_PNR) --name \
	"/$(INFRA_NAME)/staging/$(SERVICE_NAME)/auth/kakao/app-javascript-key" | jq '.Parameter | .Value')
else
BACKEND_API_URL?=$(shell aws ssm get-parameter $(AWS_PNR) --name \
	"/$(INFRA_NAME)/$(STAGE)/$(SERVICE_NAME)/backend/url" | jq '.Parameter | .Value')/api
S3_BUCKET_NAME?=$(shell aws ssm get-parameter $(AWS_PNR) --name \
	"/$(INFRA_NAME)/$(STAGE)/$(SERVICE_NAME)/frontend/bucket-name" | jq '.Parameter | .Value')
DISTRIBUTION_ID?=$(shell aws ssm get-parameter $(AWS_PNR) --name \
	"/$(INFRA_NAME)/$(STAGE)/$(SERVICE_NAME)/frontend/distribution-id" | jq '.Parameter | .Value')
DISTRIBUTION_URL?=$(if $(filter dev,$(STAGE)),https://dev.pecheskin.clinic,https://pecheskin.clinic)
KAKAO_APP_REST_KEY?=$(shell aws ssm get-parameter $(AWS_PNR) --name \
	"/$(INFRA_NAME)/$(STAGE)/$(SERVICE_NAME)/auth/kakao/app-rest-key" | jq '.Parameter | .Value')
KAKAO_APP_JAVASCRIPT_KEY ?= $(shell aws ssm get-parameter $(AWS_PNR) --name \
    "/$(INFRA_NAME)/$(STAGE)/$(SERVICE_NAME)/auth/kakao/app-javascript-key" | jq '.Parameter | .Value')
endif

tt:
	echo "/$(INFRA_NAME)/$(STAGE)/$(SERVICE_NAME)/frontend/bucket-name"
	echo $(S3_BUCKET_NAME)

env:
	@mkdir -p ./env
	@rm -f ./env/.env.$(STAGE)
	@echo "BACKEND_API_URL=$(BACKEND_API_URL)" >> ./env/.env.$(STAGE)
	@echo "DISTRIBUTION_URL=$(DISTRIBUTION_URL)" >> ./env/.env.$(STAGE)
	@echo "KAKAO_APP_REST_KEY=$(KAKAO_APP_REST_KEY)" >> ./env/.env.$(STAGE)
	@echo "KAKAO_APP_JAVASCRIPT_KEY=$(KAKAO_APP_JAVASCRIPT_KEY)" >> ./env/.env.$(STAGE)
	@echo "B2B_MODE=$(B2B_MODE)" >> ./env/.env.$(STAGE)

orval:
	@npx orval -i $(BACKEND_API_URL)/docs-json

init:
	@yarn install
	@make orval
	@make env

clean:
	@rm -rf ./node_modules

run: init copy-index
	@STAGE=$(STAGE) yarn dev

build: init copy-index
	@rm -rf ./dist
	@STAGE=$(STAGE) yarn build:prod

lint:
	@yarn lint

deploy:
	# 해시 붙은 정적 자산(js/css/이미지 등)은 오래 캐시 — 내용 바뀌면 파일명 해시가 바뀌므로 안전. html은 제외.
	@aws $(AWS_PNR) s3 sync ./dist s3://$(S3_BUCKET_NAME) --exclude "*.html" --cache-control "public, max-age=31536000"
	# html(index 등)은 항상 재검증(no-cache) — 브라우저가 옛 index를 붙잡아 옛 번들을 로드하는 문제 방지. cp라 매번 강제 업로드.
	@aws $(AWS_PNR) s3 cp ./dist s3://$(S3_BUCKET_NAME) --recursive --exclude "*" --include "*.html" --cache-control "no-cache, must-revalidate" --content-type "text/html"
	@aws $(AWS_PNR) cloudfront create-invalidation --distribution-id $(DISTRIBUTION_ID) --paths "/*"
	@echo $(DISTRIBUTION_URL)

copy-index:
	@echo "Copying index file for STAGE=$(STAGE)"
	@if [ "$(STAGE)" != "dev" ]; then \
		cp ./public/staging-index.html ./public/index.html; \
		echo "Using staging-index.html"; \
	else \
		cp ./public/default-index.html ./public/index.html; \
		echo "Using default-index.html"; \
	fi

shoot:
	@# 공식 사이트는 develop 에서만 배포(b2b 브랜치 내용이 공식 사이트에 올라가지 않도록)
	@if [ "$$(git rev-parse --abbrev-ref HEAD)" = "b2b" ]; then echo "❌ b2b 브랜치에서는 공식 사이트를 배포할 수 없습니다. B2B 사이트는 make shoot-b2b"; exit 1; fi
	@$(MAKE) build deploy

# ── B2B 사이트(협약 기업 임직원 전용, 별도 도메인) ──
# 같은 코드를 B2B_MODE=true 로 빌드해 별도 S3·CloudFront 에 올린다. 버킷·배포 ID 는 SSM /peche/$(STAGE)/base/b2b/*
B2B_PARAM = /$(INFRA_NAME)/$(STAGE)/$(SERVICE_NAME)/b2b
shoot-b2b:
	@# B2B 사이트는 반드시 b2b 브랜치에서 배포(공식 사이트 develop 과 분리)
	@if [ "$$(git rev-parse --abbrev-ref HEAD)" != "b2b" ]; then echo "❌ B2B 사이트는 b2b 브랜치에서만 배포합니다. (git checkout b2b)"; exit 1; fi
	@$(MAKE) build deploy-b2b STAGE=$(STAGE) B2B_MODE=true \
		DISTRIBUTION_URL=$$(aws ssm get-parameter $(AWS_PNR) --name "$(B2B_PARAM)/url" | jq -r '.Parameter.Value') \
		S3_BUCKET_NAME=$$(aws ssm get-parameter $(AWS_PNR) --name "$(B2B_PARAM)/bucket-name" | jq -r '.Parameter.Value') \
		DISTRIBUTION_ID=$$(aws ssm get-parameter $(AWS_PNR) --name "$(B2B_PARAM)/distribution-id" | jq -r '.Parameter.Value')

deploy-b2b: deploy
	# 검색엔진 수집 차단
	@printf "User-agent: *\nDisallow: /\n" > ./dist/robots.txt
	@aws $(AWS_PNR) s3 cp ./dist/robots.txt s3://$(S3_BUCKET_NAME)/robots.txt --cache-control "no-cache" --content-type "text/plain"
