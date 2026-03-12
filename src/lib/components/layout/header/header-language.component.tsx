import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { GlobeIcon } from "@/assets/icon"
import { Language } from "@/lib/locales/i18n.config"
import { useLocation, useNavigate } from "react-router-dom"
import useResponsive from "@/lib/hooks/use-responsive"

/* ── 인라인 SVG 국기 (Windows Chrome 이모지 미지원 대응) ── */
const FlagKR = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="20" height="14">
    <rect width="36" height="24" fill="#fff" />
    <circle cx="18" cy="12" r="6" fill="#C60C30" />
    <path d="M18 6a6 6 0 0 1 0 12 3 3 0 0 1 0-6 3 3 0 0 0 0-6z" fill="#003478" />
    <g stroke="#000" strokeWidth="0.8">
      <line x1="26.5" y1="4" x2="30.5" y2="7" />
      <line x1="27.5" y1="5.2" x2="31.5" y2="8.2" />
      <line x1="25.5" y1="16" x2="29.5" y2="19" />
      <line x1="26.5" y1="17.2" x2="30.5" y2="20.2" />
      <line x1="5.5" y1="4" x2="9.5" y2="7" />
      <line x1="4.5" y1="5.2" x2="8.5" y2="8.2" />
      <line x1="3.5" y1="6.4" x2="7.5" y2="9.4" />
      <line x1="5.5" y1="16" x2="9.5" y2="19" />
      <line x1="6.5" y1="14.8" x2="10.5" y2="17.8" />
      <line x1="7.5" y1="13.6" x2="11.5" y2="16.6" />
    </g>
  </svg>
)

const FlagCN = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="20" height="14">
    <rect width="36" height="24" fill="#DE2910" />
    <g fill="#FFDE00">
      <polygon points="6,3 7.2,6.7 3,4.6 9,4.6 4.8,6.7" />
      <polygon points="12,1.5 11.4,3 10.2,1.8 11.8,2.8 10.4,3.2" />
      <polygon points="14,4 13.2,5.4 12.2,4 13.8,4.8 12.2,5.4" />
      <polygon points="14,7.5 13,8.8 12.4,7.2 13.8,8.2 12.2,8.4" />
      <polygon points="12,10 11.4,11.4 10.4,10 11.8,10.6 10.4,11.2" />
    </g>
  </svg>
)

const FlagJP = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="20" height="14">
    <rect width="36" height="24" fill="#fff" />
    <circle cx="18" cy="12" r="7" fill="#BC002D" />
  </svg>
)

const FlagUS = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="20" height="14">
    <rect width="36" height="24" fill="#B22234" />
    <g fill="#fff">
      {[1, 3, 5, 7, 9, 11].map((i) => (
        <rect key={i} y={(i * 24) / 13} width="36" height={24 / 13} />
      ))}
    </g>
    <rect width="14.4" height={(24 * 7) / 13} fill="#3C3B6E" />
    <g fill="#fff">
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2, 3, 4, 5]
          .slice(0, r % 2 === 0 ? 6 : 5)
          .map((c) => (
            <circle
              key={`${r}-${c}`}
              cx={1.2 + c * 2.4 + (r % 2 === 0 ? 0 : 1.2)}
              cy={1.2 + r * 2.4}
              r="0.6"
            />
          )),
      )}
    </g>
  </svg>
)

const FlagTW = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="20" height="14">
    <rect width="36" height="24" fill="#FE0000" />
    <rect width="18" height="12" fill="#000095" />
    <circle cx="9" cy="6" r="3.5" fill="#fff" />
    <circle cx="9" cy="6" r="2.8" fill="#000095" />
    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
      const a = (i * 30 * Math.PI) / 180
      return (
        <line
          key={i}
          x1={9 + 2.2 * Math.cos(a)}
          y1={6 + 2.2 * Math.sin(a)}
          x2={9 + 3.5 * Math.cos(a)}
          y2={6 + 3.5 * Math.sin(a)}
          stroke="#fff"
          strokeWidth="0.4"
        />
      )
    })}
  </svg>
)

const FlagTH = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" width="20" height="14">
    <rect width="36" height="24" fill="#A51931" />
    <rect y="4" width="36" height="16" fill="#F4F5F8" />
    <rect y="8" width="36" height="8" fill="#2D2A4A" />
  </svg>
)

const flagComponents: Record<string, React.FC> = {
  kr: FlagKR,
  cn: FlagCN,
  jp: FlagJP,
  us: FlagUS,
  tw: FlagTW,
  th: FlagTH,
}

const displayLanguages = [
  { key: Language.KOR, code: "Ko", countryCode: "kr" },
  { key: Language.CHN, code: "Ch", countryCode: "cn" },
  { key: Language.JPN, code: "Ja", countryCode: "jp" },
  { key: Language.ENG, code: "En", countryCode: "us" },
  { key: Language.TWN, code: "Tw", countryCode: "tw" },
  { key: Language.THA, code: "Th", countryCode: "th" },
]

const HeaderLanguage = () => {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const urlValue = location.pathname.split("/")[1]

  useEffect(() => {
    Object.values(Language).forEach((lang) => {
      if (urlValue === lang && i18n.language !== lang) {
        i18n.changeLanguage(lang)
      }
    })
  }, [urlValue])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const { isDesktop } = useResponsive()
  const current = displayLanguages.find((l) => l.key === i18n.language) ?? displayLanguages[0]
  const iconSize = isDesktop ? 18 : 24
  const fontSize = isDesktop ? "15px" : "15px"
  const btnPadding = isDesktop ? "8px 0" : "8px 2px"

  return (
    <div ref={containerRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <button
        style={{ display: "flex", alignItems: "center", gap: "4px", padding: btnPadding }}
        onClick={() => setOpen((v) => !v)}>
        <GlobeIcon width={iconSize} height={iconSize} />
        <span style={{ fontSize, fontWeight: 500, lineHeight: 1 }}>{current.code}</span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "rgba(42, 42, 42, 0.90)",
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            minWidth: "90px",
            paddingTop: "4px",
            paddingBottom: "4px",
          }}>
          {displayLanguages.map((lang) => (
            <button
              key={lang.key}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                color: lang.key === current.key ? "#DA7F67" : "white",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                setOpen(false)
                const restPath = location.pathname.split("/").slice(2).join("/")
                navigate({ pathname: `/${lang.key}/${restPath}`, search: location.search })
              }}>
              {React.createElement(flagComponents[lang.countryCode])}
              <span style={{ fontSize: "13px", fontWeight: 500 }}>{lang.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeaderLanguage
