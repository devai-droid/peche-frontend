import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { blogV2PublicApi, BlogV2SiteConfig } from "@/pages/blog/blog-v2.api"

/**
 * 어드민 '기본 정보 관리'에서 관리하는 사이트 공통 정보를 공개 API로 조회(현재 언어 병합).
 * 진료시간·주소·전화·대표자명·사업자등록번호·SNS 등을 화면에서 이 값으로 노출한다.
 * 값이 비어 있거나 조회에 실패하면 각 화면의 기존 하드코딩(폴백)을 그대로 쓴다.
 */
export const useSiteConfig = (): BlogV2SiteConfig | undefined => {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const { data } = useQuery({
    queryKey: ["site-config", lang],
    queryFn: () => blogV2PublicApi.siteConfig(lang),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  return data
}
