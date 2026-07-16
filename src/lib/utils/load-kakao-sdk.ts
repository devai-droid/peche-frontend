import { env } from "@/lib/env"

// 카카오 로그인 SDK 지연 로더 (중국 접속 개선)
// 기존에는 index.html <head>에서 모든 언어·모든 방문자에게 동기 로드했으나,
// 카카오 로그인은 한국어 화면에서만 쓰이고 중국에서 kakaocdn 접속이 불안정하므로,
// 실제 로그인 시점에만(=한국어 사용자가 버튼 클릭 시) 로드하도록 변경.

const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js"
const KAKAO_SDK_INTEGRITY =
  "sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1"

// JS 앱 키. env(.env.{stage})에 값이 있으면 그것을, 없으면 공개 JS 키로 폴백.
// 기존 index.html이 전 환경에서 이 키를 하드코딩해 쓰던 동작과 동일하게 맞춘다.
// (dev 환경의 .env.dev에는 카카오 키가 없어 폴백이 필요함)
const KAKAO_JS_KEY = env.AUTH.KAKAO_APP_JAVASCRIPT_KEY || "5313d72500d7dac2b5295425113bf8e3"

let loadPromise: Promise<void> | null = null

const injectScript = () =>
  new Promise<void>((resolve, reject) => {
    // @ts-ignore
    if (window.Kakao) return resolve()

    const script = document.createElement("script")
    script.src = KAKAO_SDK_URL
    script.integrity = KAKAO_SDK_INTEGRITY
    script.crossOrigin = "anonymous"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      loadPromise = null // 실패 시 다음 클릭에서 재시도 가능하도록
      reject(new Error("카카오 SDK 로드 실패"))
    }
    document.head.appendChild(script)
  })

// SDK를 로드하고 초기화까지 보장한다. 여러 번 호출해도 스크립트는 한 번만 주입된다.
export const ensureKakaoSDK = async (): Promise<void> => {
  if (!loadPromise) {
    loadPromise = injectScript()
  }
  await loadPromise

  // @ts-ignore
  if (window.Kakao && !window.Kakao.isInitialized()) {
    // @ts-ignore
    window.Kakao.init(KAKAO_JS_KEY)
  }
}
