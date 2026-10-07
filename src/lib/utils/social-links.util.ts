import { SiteSocialLink } from "@/pages/blog/blog-v2.api"

/** 관리 대상 SNS/외부링크 플랫폼 키 */
export type SocialPlatform =
  | "naverPlace"
  | "naverBlog"
  | "kakao"
  | "instagram"
  | "threads"
  | "whatsapp"
  | "tiktok"
  | "wechat"
  | "facebook"
  | "line"
  | "x"
  | "googlePlace"

/** 어드민에서 관리하는 전체 플랫폼 순서·라벨 (어드민 편집기·표시 순서 기준). */
export const SOCIAL_PLATFORMS: { platform: SocialPlatform; label: string; modal?: boolean }[] = [
  { platform: "naverPlace", label: "네이버 플레이스" },
  { platform: "googlePlace", label: "구글 플레이스" },
  { platform: "kakao", label: "카카오톡 상담" },
  { platform: "naverBlog", label: "네이버 블로그" },
  { platform: "instagram", label: "인스타그램" },
  { platform: "whatsapp", label: "WhatsApp" },
  { platform: "line", label: "LINE" },
  { platform: "wechat", label: "WeChat (QR)", modal: true },
  { platform: "facebook", label: "Facebook" },
  { platform: "tiktok", label: "TikTok" },
  { platform: "x", label: "X (트위터)" },
]

/**
 * 어드민 SNS 설정에서 노출할 링크만 order순으로 정렬해 반환.
 * 설정이 없거나 비면 null → 각 화면이 기존 하드코딩(폴백)을 쓴다.
 * wechat은 url 없이도(QR 모달) 노출 대상.
 */
export const activeSocialLinks = (links?: SiteSocialLink[]): SiteSocialLink[] | null => {
  if (!links || links.length === 0) return null
  const active = links.filter((l) => l.enabled && (!!l.url || l.platform === "wechat"))
  return active.length > 0 ? [...active].sort((a, b) => a.order - b.order) : null
}

/**
 * 특정 플랫폼의 활성 URL(카카오 상담·네이버/구글 플레이스 버튼용). 없으면 fallback.
 */
export const socialUrl = (
  links: SiteSocialLink[] | undefined,
  platform: SocialPlatform,
  fallback: string,
): string => {
  const hit = links?.find((l) => l.platform === platform && l.enabled && !!l.url)
  return hit?.url || fallback
}

/** 대표 상담 채널(상담하기 버튼·모바일 탭바 목적지) */
export interface ConsultChannel {
  platform: string
  url: string
  isModal: boolean // wechat 등 QR 모달
  iconUrl?: string // 업로드한 아이콘(있으면 기본 아이콘 대신 사용)
}

/** 어드민 미설정 시 언어별 대표 상담 채널 폴백 (기존 하드코딩과 동일) */
const CONSULT_FALLBACK: Record<string, { platform: string; url?: string }> = {
  ko: { platform: "kakao", url: "http://pf.kakao.com/_dxoiLn" },
  en: { platform: "whatsapp", url: "https://wa.me/message/4Y5JC2HX6OH5H1" },
  ja: { platform: "line", url: "https://line.me/R/ti/p/@235wfyao" },
  th: { platform: "line", url: "https://line.me/R/ti/p/@892druai" },
  "zh-TW": { platform: "line", url: "https://line.me/R/ti/p/@683jgqmd" },
  zh: { platform: "wechat" },
}

/**
 * 현재 언어의 대표 상담 채널.
 * 어드민의 언어별 SNS 중 isPrimary(대표)로 지정한 항목을 쓰고, 없으면 기존 primaryConsult* → 언어별 하드코딩 폴백.
 */
export const getConsultChannel = (
  cfg:
    | {
        socialLinks?: SiteSocialLink[]
        primaryConsultPlatform?: string
        primaryConsultUrl?: string
      }
    | undefined,
  lang: string,
): ConsultChannel => {
  const fb = CONSULT_FALLBACK[lang] ?? CONSULT_FALLBACK.ko
  const primary = cfg?.socialLinks?.find((l) => l.isPrimary && l.enabled)
  const platform = primary?.platform || cfg?.primaryConsultPlatform || fb.platform
  const url = primary?.url || cfg?.primaryConsultUrl || fb.url || ""
  return { platform, url, isModal: platform === "wechat" }
}

/**
 * 현재 언어의 대표 상담 채널 '여러 개'(모바일 하단 탭바용). isPrimary로 지정한 항목을 order순으로 모두 반환.
 * 지정이 없으면 단일 대표(getConsultChannel)를 폴백으로 1개 반환.
 */
export const getConsultChannels = (
  cfg: { socialLinks?: SiteSocialLink[]; primaryConsultPlatform?: string; primaryConsultUrl?: string } | undefined,
  lang: string,
): ConsultChannel[] => {
  const primaries = (cfg?.socialLinks ?? [])
    .filter((l) => l.isPrimary && l.enabled && (!!l.url || l.platform === "wechat"))
    .sort((a, b) => a.order - b.order)
  if (primaries.length > 0) {
    return primaries.map((p) => ({
      platform: p.platform,
      url: p.url || "",
      isModal: p.platform === "wechat",
      iconUrl: p.iconUrl,
    }))
  }
  const single = getConsultChannel(cfg, lang)
  return single.platform ? [single] : []
}
