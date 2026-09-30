import { SiteSocialLink } from "@/pages/blog/blog-v2.api"

/** 관리 대상 SNS/외부링크 플랫폼 키 */
export type SocialPlatform =
  | "naverPlace"
  | "naverBlog"
  | "kakao"
  | "instagram"
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
