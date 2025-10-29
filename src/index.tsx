import { createRoot } from "react-dom/client"
import { RecoilRoot } from "recoil"
import { HelmetProvider } from "react-helmet-async"
import App from "./App"

import "@/lib/locales/i18n.config"

import "./styles/font-family.scss"
import "./styles/index.scss"
import "./styles/tailwind.css"

const container = document.getElementById("root")
const root = createRoot(container as Element)

root.render(
  <RecoilRoot>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </RecoilRoot>,
)
