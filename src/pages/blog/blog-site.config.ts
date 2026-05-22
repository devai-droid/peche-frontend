/**
 * 블로그 사이트 가변요소 (병원 단일 엔티티 정보).
 * 백엔드 peche.config.ts(PECHE_SITE)와 동일하게 유지. 다른 사이트 적용 시 이 파일만 교체.
 *
 * 값이 아직 안 들어온 항목(geo·credentials 등)은 비워두면 JSON-LD에서 자동 생략됩니다.
 * (병원 좌표·인증은 마케터 가이드 §1-2에서 받아 여기에 채움)
 */
export interface BlogSiteConfig {
  hospitalName: string
  baseUrl: string
  organizationType: string // schema.org @type (MedicalClinic 등)
  telephone?: string
  address: { locality: string; region: string; country: string }
  geo?: { latitude: number; longitude: number } // 위경도 (지역 SEO)
  medicalSpecialty?: string // 표방 진료과목 (config 고정값)
  sameAs?: string[] // 공식 SNS
  knowsAbout?: string[] // 진료/시술 영역
  credentials?: string[] // 병원 인증·자격 (hasCredential)
  supportedLangs: string[]
}

export const BLOG_SITE: BlogSiteConfig = {
  hospitalName: "페슈의원",
  baseUrl: "https://pecheskin.clinic",
  organizationType: "MedicalClinic",
  telephone: "1661-2365",
  address: { locality: "강남구", region: "서울특별시", country: "KR" },
  geo: undefined, // TODO: 마케터 좌표 입력 시 { latitude, longitude } 채움
  medicalSpecialty: "Dermatology",
  sameAs: ["https://blog.naver.com/pecheclinic"],
  knowsAbout: ["보톡스", "필러", "스킨부스터", "리프팅", "울쎄라", "레이저"],
  credentials: [], // 병원 인증·자격 있으면 채움
  supportedLangs: ["ko", "en", "zh", "zh-TW", "ja", "th"],
}

/** 루트 병원 엔티티 전역 앵커 — author/reviewedBy/publisher가 이 @id를 참조해 단일 병원으로 통합 */
export const HOSPITAL_JSON_LD_ID = `${BLOG_SITE.baseUrl}/#hospital`
