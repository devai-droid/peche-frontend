import axios, { AxiosResponse } from "axios"
import { KakaoOAuthToken } from "@/lib/types/kakao-auth.type"
import { KAKAO_OAUTH_REDIRECT_PATH } from "@/lib/constants/auth.constants"
import { env } from "@/lib/env"
import { authControllerAuthenticateByKakao } from "@/lib/orval/auth/auth"
import { ensureKakaoSDK } from "@/lib/utils/load-kakao-sdk"

const KAKAO_OAUTH_HOST = "https://kauth.kakao.com/oauth"

const authService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loginWithKakaoSDK: async (pathVisit: string | null, detailVisit: string | null) => {
    const currentPath = window.location.pathname + window.location.search
    const encodedState = encodeURIComponent(currentPath)

    const redirectUri = `${env.DISTRIBUTION_URL + KAKAO_OAUTH_REDIRECT_PATH}`

    try {
      // SDK를 index.html에서 미리 로드하지 않으므로, 사용 직전에 로드·초기화한다.
      await ensureKakaoSDK()
    } catch {
      alert("카카오 인증을 불러오지 못했습니다. 네트워크 상태를 확인해 주세요.")
      return
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Kakao.Auth.authorize({
      redirectUri,
      state: encodedState,
    })
  },
  loginWithKakao: async (authCode: string) => {
    const { data } = await axios.post<AxiosResponse<KakaoOAuthToken>>(
      `${KAKAO_OAUTH_HOST}/token`,
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: env.AUTH.KAKAO_APP_JAVASCRIPT_KEY,
          redirect_uri: env.DISTRIBUTION_URL + KAKAO_OAUTH_REDIRECT_PATH,
          code: authCode,
        },
      },
    )
    return authControllerAuthenticateByKakao({ idToken: data.id_token ?? "" })
  },
}

export { authService }
