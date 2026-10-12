import { customInstance } from "@/lib/api/http-client"
import { CreateReservationDto } from "@/lib/orval/model"

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
