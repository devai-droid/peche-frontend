import { Button } from "@/design-system/components"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import { Language } from "@/lib/locales/i18n.config"
import React from "react"

const ReservationComplete = () => {
  const { t, i18n } = useTranslation()
  const navigate = useCustomNavigate()
  const { language } = i18n
  const HELP_LINKS: Record<Language, string> = {
    ko: "https://pf.kakao.com/_dxoiLn",
    en: "https://wa.me/message/3ARKGGTBNAY2M1",
    ja: "https://line.me/R/ti/p/@235wfyao",
    th: "https://line.me/R/ti/p/@892druai",
    "zh-TW": "https://line.me/R/ti/p/@683jgqmd",
    zh: "https://pf.kakao.com/_dxoiLn",
  }

  const handleHelpClick = () => {
    if (language === Language.ENG) {
      window.open("https://wa.me/message/4Y5JC2HX6OH5H1", "_blank")
      return
    }

    const url = HELP_LINKS[language as Language]
    if (!url) return

    window.open(url, "_blank")
  }

  return (
    <Page>
      {/* 배경 */}
      <div tw="bg-neutral min-h-screen flex justify-center px-4 pt-[120px] md:pt-[160px] tracking-tight leading-[150%]">
        {/* 카드 */}
        <div tw="bg-white w-full max-w-[520px] h-[450px] text-center px-6 py-12 md:px-10 md:py-14 font-pretendard">
          {/* 제목 */}
          <div tw="text-[20px] md:text-[22px] font-semibold mb-4">
            {t("reservePage.reservationCompleteTitle")}
          </div>

          {/* 설명 */}
          <div tw="text-[14px] md:text-[15px] text-[#666] whitespace-pre-wrap mb-10">
            {t("reservePage.reservationCompleteText")}
          </div>

          {/* 버튼 영역 */}
          <div tw="flex gap-4">
            <Button
              tw="flex-1 text-[15px] md:text-[16px]"
              style={{ variant: "outlined", color: "point", size: "md" }}
              onClick={() => navigate("/reservation")}>
              {t("reservePage.reservationCheck")}
            </Button>

            <Button
              tw="flex-1 text-[15px] md:text-[16px]"
              style={{ variant: "filled", color: "point", size: "md" }}
              onClick={handleHelpClick}>
              {t("reservePage.kakaoConsult")}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default ReservationComplete
