import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import tw from "twin.macro"
import bannerImg from "@/assets/images/landing-page/landing-banner.webp"
// import { PlusIcon } from "@/assets/icon"
import { Button } from "@/design-system/components"
import React, { useState } from "react"
import Modal from "@/lib/components/modal/modal.component"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"

const BannerButton = tw.button`rounded-xl flex-1 h-12 text-lg font-bold sm:w-64`

const Banner = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleBannerButtonClick = () => {
    if (language === Language.KOR) {
      // Open the modal for Korean language
      openModal()
    } else if (language === Language.ENG) {
      window.open("http://pf.kakao.com/_pmGVxj/chat", "_blank")
    } else if (language === Language.CHN) {
      window.open("https://work.weixin.qq.com/kfid/kfc8dbe1152fad99e74", "_blank")
    } else if (language === Language.JPN) {
      window.open("https://lin.ee/efw7rbT", "_blank")
    } else if (language === Language.THA) {
      window.open("https://lin.ee/BNTlo0y", "_blank")
    }
  }

  const navigate = useCustomNavigate()

  return (
    <div tw="w-full pb-[80%] md:pb-[36.718%] bg-orange-200 relative">
      <img tw="absolute inset-0 w-full h-full object-cover" src={bannerImg} alt="banner" />
      <div tw="absolute inset-0 bg-black bg-opacity-40" />
      <div tw="absolute top-1/4 inset-x-0 flex flex-col items-center">
        <div tw="mb-[5%]">
          <div tw="font-nanumgothic font-extrabold text-[1.75rem] lg:text-[4rem] text-white">
            {t("home.title")}
          </div>
        </div>
        <div tw="">
          <div tw="text-[#FFCD00] flex text-lg items-center gap-1">
            {/* {t("home.subTitle")} <Icon icon={PlusIcon} size={18} /> */}
          </div>
        </div>
      </div>
      <div tw="absolute bottom-[10%] flex gap-4 max-sm:inset-x-0 sm:(left-1/2 -translate-x-1/2) px-4">
        <BannerButton tw="bg-white text-[#636363]" onClick={() => navigate("/reservation/new")}>
          {t("home.onlineReserve")}
        </BannerButton>
        <BannerButton tw="bg-point text-white" onClick={handleBannerButtonClick}>
          {t("home.onlineConsult")}
        </BannerButton>
      </div>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <div tw="flex flex-col items-center justify-center h-full text-center">
          <div tw="text-lg mt-8 mb-3">{t("home.consultationKoreanTitle")}</div>
          <div tw="mt-6 mb-10 whitespace-pre-wrap text-[#999]">
            {t("home.consultationKoreanDescription")}
          </div>

          <div tw="flex gap-4">
            <Button
              tw="min-w-[8rem] sm:hidden"
              style={{ variant: "outlined", color: "black", size: "lg" }}
              onClick={() => {
                window.open("tel:1661-2365", "_blank")
                closeModal()
              }}>
              {t("home.consultationKoreanPhone")}
            </Button>
            <Button
              tw="min-w-[8rem]"
              style={{ variant: "filled", color: "black", size: "lg" }}
              onClick={() => {
                window.open("http://pf.kakao.com/_pmGVxj/chat", "_blank")
                closeModal()
              }}>
              {t("home.consultationKoreanKakao")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Banner
