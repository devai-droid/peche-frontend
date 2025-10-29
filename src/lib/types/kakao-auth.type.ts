import { KAKAO_OAUTH_REDIRECT_PATH } from "@/lib/constants/auth.constants"
import { env } from "@/lib/env"

export interface KakaoOAuthToken {
  token_type: string
  access_token: string
  id_token?: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
  scope?: string
}

export class KakaoAuthParams {
  client_id = env.AUTH.KAKAO_APP_REST_KEY

  redirect_uri = env.DISTRIBUTION_URL + KAKAO_OAUTH_REDIRECT_PATH

  response_type = "code"

  scope = "openid"

  prompt?: string

  service_terms?: string

  state?: string

  nonce?: string
}
