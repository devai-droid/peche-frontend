export enum Stage {
  Local = "local",
  Development = "dev",
  Production = "prod",
  Staging = "staging",
}

export const env = {
  STAGE: (process.env.STAGE || Stage.Production) as Stage,
  BACKEND_API_URL: process.env.BACKEND_API_URL as string,
  DISTRIBUTION_URL: process.env.DISTRIBUTION_URL as string,
  AUTH: {
    KAKAO_APP_REST_KEY: process.env.KAKAO_APP_REST_KEY as string,
    KAKAO_APP_JAVASCRIPT_KEY: process.env.KAKAO_APP_JAVASCRIPT_KEY as string,
  },
}
