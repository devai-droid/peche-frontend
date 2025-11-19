# peche-frontend

## Tools and Prerequisites
- node version >= 16.15
- yarn
- prettier
- aws cli
- [CSS Modules](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules)
- [react-query v5](https://tanstack.com/query/v5/docs/react/overview)
- [orval](https://orval.dev/guides/react-query)
- [tailwind css](https://tailwindcss.com/)
- [twin macro](https://github.com/ben-rogerson/twin.macro)

## Installation
- `aws configure --profile peche`
- `make init STAGE=dev`

## Running the app
`make run STAGE=dev`

stage 없으면 local 로 실행됩니다. 로컬 빌드 전에 백앤드 실행 필수.

### 주의점
1. url 변경 시 customLink, useCustomNavigate 사용해야 합니다.
    - 언어, GA 유지를 위해서.
    - 뒤로 가기는 일반 Link, useNavigate 사용하거나 custom 에서 수정 후 사용
    - 외부 링크에서 redirect 시 GA 키값 고려해주세요
2. 백앤드 데이터 표현 시 useLanguageValue 사용해서 텍스트 표시하면 언어에 맞는 키값으로 나옵니다. [ex. ProductDetail](src/pages/product/product-detail.page.tsx)
