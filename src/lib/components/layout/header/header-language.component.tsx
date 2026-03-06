import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { GlobeIcon } from "@/assets/icon"
import { Language } from "@/lib/locales/i18n.config"
import { useLocation, useNavigate } from "react-router-dom"
import useResponsive from "@/lib/hooks/use-responsive"

const displayLanguages = [
  { key: Language.KOR, code: "Ko", flag: "🇰🇷" },
  { key: Language.CHN, code: "Ch", flag: "🇨🇳" },
  { key: Language.JPN, code: "Ja", flag: "🇯🇵" },
  { key: Language.ENG, code: "En", flag: "🇺🇸" },
  { key: Language.TWN, code: "Tw", flag: "🇹🇼" },
  { key: Language.THA, code: "Th", flag: "🇹🇭" },
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
              <span style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}>{lang.flag}</span>
              <span style={{ fontSize: "13px", fontWeight: 500 }}>{lang.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default HeaderLanguage
