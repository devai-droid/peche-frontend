/**
 * 배포된 새 버전 감지.
 * 지금 실행 중인 번들 해시(로드된 main.<hash>.js)와, 서버 최신 index.html이 가리키는 번들 해시를 비교한다.
 * 다르면 새 배포가 나간 것 → 화면이 낡음(오래 켜둔 탭 등). 빌드 설정 없이 동작한다.
 */

const BUNDLE_RE = /main\.([a-f0-9]+)\.js/

// 현재 페이지에 로드된 메인 번들 해시
const runningBundleHash = (): string | null => {
  const match = Array.from(document.getElementsByTagName("script"))
    .map((s) => s.src.match(BUNDLE_RE))
    .find(Boolean)
  return match ? match[1] : null
}

/**
 * 서버 최신 index.html의 번들 해시와 현재 실행 번들이 다르면 true.
 * 네트워크 오류 등 확인 불가 시 false(예약 흐름을 막지 않음).
 */
export const isNewVersionDeployed = async (): Promise<boolean> => {
  try {
    // 예약 흐름을 막지 않도록 3초 타임아웃 — 느리면 확인 포기(진행)
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 3000)
    const res = await fetch(`/?_=${Date.now()}`, { cache: "no-store", signal: ctrl.signal })
    clearTimeout(timer)
    if (!res.ok) return false
    const html = await res.text()
    const server = html.match(BUNDLE_RE)?.[1]
    const mine = runningBundleHash()
    return !!server && !!mine && server !== mine
  } catch {
    return false
  }
}

const RELOADED_FLAG = "vc-reloaded"

/**
 * 낡았으면 새로고침(true 반환). 장바구니 등 localStorage는 유지된다.
 * 무한 새로고침 방지: 이미 한 번 새로고침했는데도 여전히 낡으면(index.html 캐시 등) 다시 새로고침하지 않는다.
 * 최신이 되면 플래그를 지워 다음 배포부터 다시 동작한다.
 */
export const reloadIfNewVersion = async (): Promise<boolean> => {
  const stale = await isNewVersionDeployed()
  if (!stale) {
    try {
      sessionStorage.removeItem(RELOADED_FLAG)
    } catch {
      // ignore
    }
    return false
  }
  try {
    if (sessionStorage.getItem(RELOADED_FLAG) === "1") return false // 새로고침했는데도 stale → 루프 방지
    sessionStorage.setItem(RELOADED_FLAG, "1")
  } catch {
    // ignore
  }
  window.location.reload()
  return true
}
