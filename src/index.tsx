import { createRoot } from "react-dom/client"
import { RecoilRoot } from "recoil"
import { HelmetProvider } from "react-helmet-async"
import App from "./App"
import { env } from "@/lib/env"

import "@/lib/locales/i18n.config"

import "./styles/font-family.scss"
import "./styles/index.scss"
import "./styles/tailwind.css"

// B2B 사이트(협약 기업 임직원 전용)는 검색엔진 수집 차단
if (env.B2B_MODE) {
  const robots = document.createElement("meta")
  robots.name = "robots"
  robots.content = "noindex, nofollow"
  document.head.appendChild(robots)
}

const container = document.getElementById("root")
const root = createRoot(container as Element)

root.render(
  <RecoilRoot>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </RecoilRoot>,
)
