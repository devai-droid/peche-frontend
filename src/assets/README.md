## Icon

[아이콘 목록](https://www.figma.com/file/kdA0Rd79oo1ooN3fzNGG2h/angler?node-id=1%3A5384&mode=dev)

1. 피그마 아이콘 이름으로 파일에서 검색 후 없다면
2. 위 링크에서 아이콘 다운로드 받아서 이름 그대로 `/src/assets/icons` 에 넣은 후 svg안에 컬러 코드를 `currentColor` 로 변경합니다.
3. `/src/assets/icon.ts` 에서 export 해주세요.

```
export { ReactComponent as CloseIcon } from "./icon/close.svg"
```