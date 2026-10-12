import { customInstance } from "@/lib/api/http-client"
import { CreateReservationDto, Reservation } from "@/lib/orval/model"

/**
 * B2B 사이트 전용 API. 회사 이메일 인증 토큰은 예약 1건용(30분·1회)이라
 * 공식 사이트 로그인 토큰(localStorage authToken)과 섞지 않고 sessionStorage 에만 둔다.
 */
const B2B_TOKEN_KEY = "b2b:token"

export interface B2bVerified {
  token: string
  expiresAt: string
  companyName: string
  name: string
}

export const b2bTokenStore = {
  get: () => {
    try {
      return sessionStorage.getItem(B2B_TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token: string) => {
    try {
      sessionStorage.setItem(B2B_TOKEN_KEY, token)
    } catch {
      // 저장 실패 시 메모리 상태만 사용
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(B2B_TOKEN_KEY)
    } catch {
      // noop
    }
  },
}

export const b2bApi = {
  /** 예약 화면 안내 문구(어드민에서 입력, 비어 있으면 null) */
  notice: () =>
    customInstance<{ reservationNotice: string | null }>({ url: "/api/b2b/notice", method: "GET" }),

  requestCode: (data: { email: string; name: string; phone: string }) =>
    customInstance<{ sent: boolean }>({ url: "/api/b2b/auth/code", method: "POST", data }),

  verify: (data: { email: string; name: string; phone: string; code: string }) =>
    customInstance<B2bVerified>({ url: "/api/b2b/auth/verify", method: "POST", data }),

  // 예약확인(조회·변경·취소)용 인증: 회사 이메일만
  requestLookupCode: (data: { email: string }) =>
    customInstance<{ sent: boolean }>({ url: "/api/b2b/lookup/code", method: "POST", data }),

  verifyLookup: (data: { email: string; code: string }) =>
    customInstance<{ token: string; expiresAt: string }>({
      url: "/api/b2b/lookup/verify",
      method: "POST",
      data,
    }),

  // B2B 예약확인 목록: B2B 사이트에서 한 예약만 + 예약 때 입력한 이름·연락처
  myReservations: () =>
    customInstance<{ items: (Reservation & { b2bName?: string; b2bPhone?: string })[] }>({
      url: "/api/b2b/my-reservations",
      method: "GET",
    }),

  createReservation: (data: CreateReservationDto, token: string) =>
    customInstance<unknown>({
      url: "/api/b2b/reservations",
      method: "POST",
      data,
      headers: { Authorization: `Bearer ${token}` },
    }),
}

/** 서버 오류 메시지(한국어) 추출 */
export const b2bErrorMessage = (error: unknown, fallback: string) => {
  const message = (error as { response?: { data?: { message?: string | string[] } } })?.response
    ?.data?.message
  if (Array.isArray(message)) return fallback
  return message || fallback
}

/** JWT 만료 여부(만료 정보를 못 읽으면 만료로 보지 않음) */
export const isTokenExpired = (token?: string | null) => {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()
  } catch {
    return false
  }
}

/** +821012345678 → 01012345678 */
export const formatB2bPhone = (phone?: string) =>
  phone?.startsWith("+82") ? `0${phone.slice(3)}` : phone
