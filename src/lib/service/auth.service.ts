import axios, { AxiosResponse } from "axios"
import { KakaoOAuthToken } from "@/lib/types/kakao-auth.type"
import { KAKAO_OAUTH_REDIRECT_PATH } from "@/lib/constants/auth.constants"
import { env } from "@/lib/env"
import { authControllerAuthenticateByKakao } from "@/lib/orval/auth/auth"

const KAKAO_OAUTH_HOST = "https://kauth.kakao.com/oauth"

const authService = {
  loginWithKakaoSDK: (pathVisit: string | null, detailVisit: string | null) => {
    // const encodedStates =
    //   pathVisit && detailVisit
    //     ? encodeURIComponent(`?path_visit=${pathVisit}&detail_visit=${detailVisit}`)
    //     : ""
    const currentPath = window.location.pathname + window.location.search
    const encodedState = encodeURIComponent(currentPath)

    const redirectUri = `${env.DISTRIBUTION_URL + KAKAO_OAUTH_REDIRECT_PATH}`

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
