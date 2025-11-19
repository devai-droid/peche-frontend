.PHONY: init env clean run lint build deploy

STAGE ?= dev
SERVICE_NAME ?= base
INFRA_NAME ?= peche
AWS_REGION ?= ap-northeast-2
ENV ?= $(STAGE)
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
	@aws $(AWS_PNR) s3 sync ./dist s3://$(S3_BUCKET_NAME)
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

shoot: build deploy
