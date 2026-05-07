import { Button } from "@/design-system/components"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import { Language } from "@/lib/locales/i18n.config"
import React from "react"
import Modal from "@/lib/components/modal/modal.component"
import wechatQrImg from "@/assets/images/wechat-qr.png"
import { CloseIcon } from "@/assets/icon"

const ReservationComplete = () => {
  const { t, i18n } = useTranslation()
  const navigate = useCustomNavigate()
  const { language } = i18n
  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

  const handleHelpClick = () => {
    if (language === "ko") {
      window.open("https://pf.kakao.com/_dxoiLn", "_blank")
      return
    }
    if (language === "en") {
      window.open("https://wa.me/message/4Y5JC2HX6OH5H1", "_blank")
      return
    }
    if (language === "zh") {
      setOpenWeChatModal(true)
      return
    }
    if (language === "ja") {
      window.open("https://line.me/R/ti/p/@235wfyao", "_blank")
      return
    }
    if (language === "th") {
      window.open("https://line.me/R/ti/p/@892druai", "_blank")
      return
    }
    if (language === "zh-TW") {
      window.open("https://line.me/R/ti/p/@683jgqmd", "_blank")
    }
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

      {/* WeChat QR 모달 */}
      <Modal open={openWeChatModal} onClose={() => setOpenWeChatModal(false)} width="max-w-md">
        <div tw="-mx-10 -my-8">
          <div tw="bg-[#F3F3F3] w-full relative">
            <div tw="px-4 pb-3 pt-12">
              <div tw="text-[24px] font-time text-neutral90">Peche clinic</div>
            </div>
            <button tw="absolute top-3 right-4" onClick={() => setOpenWeChatModal(false)}>
              <CloseIcon width={22} height={22} />
            </button>
          </div>
          <div tw="p-6 flex justify-center bg-white">
            <img src={wechatQrImg} alt="wechat qr" tw="w-[240px] h-[240px] object-contain" />
          </div>
        </div>
      </Modal>
    </Page>
  )
}

export default ReservationComplete
