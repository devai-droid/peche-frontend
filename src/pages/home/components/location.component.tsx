import React from "react"
import tw, { styled } from "twin.macro"
import { CloseIcon } from "@/assets/icon"
import wechatQrImg from "@/assets/images/wechat-qr.png"
import GoogleMapComponent from "@/lib/components/google-map/google-map.component"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { useTranslation } from "react-i18next"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import { Language } from "@/lib/locales/i18n.config"
import Modal from "@/lib/components/modal/modal.component"

const MapSection = tw.section`
  w-full bg-neutral overflow-hidden
`

const MapInner = styled.div`
  ${tw`max-w-[1440px] mx-auto flex flex-col md:flex-row gap-2 md:gap-[40px] px-[20px] md:px-[40px] items-stretch`}
`

/* Left Column */
const InfoColumn = tw.div`
  w-full md:w-1/2 flex flex-col justify-center
  py-10 md:py-0
`

const InfoBlock = tw.div`
  flex flex-col h-full font-pretendard
`

const InfoTitle = tw.h3`
  text-primary text-[16px] md:text-[18px] tracking-tight font-semibold mb-2 md:mb-3
`

const InfoText = tw.p`
  text-[14px] md:text-[16px] text-neutral70 tracking-tight leading-[150%] font-pretendard
`

/* Buttons */
const ButtonGroup = tw.div`
  flex flex-row md:flex-col gap-3 mt-auto
`

const SolidButton = tw.button`
  flex-1 bg-primary text-white py-2 md:py-2 text-[15px] font-medium hover:bg-secondary3 transition
`

const OutlineButton = tw.button`
  flex-1 border border-primary bg-white text-primary py-2 md:py-2 text-[15px] font-medium hover:bg-primary/10 transition
`

/* Right Column (Map) */
const MapColumn = tw.div`
  w-full md:w-1/2 h-[400px] md:h-[480px] flex
`

const GoogleMapWrapper = tw.div`
  w-full h-full
`

const InfoTextWrapper = tw.div`
  flex flex-col
  justify-start
  lg:min-h-[140px]
  md:min-h-[200px]
  min-h-[120px]
`

const Location = () => {
  const tv = useLanguageValue()
  const { t, i18n } = useTranslation()
  const navigate = useCustomNavigate()
  const language = i18n.language as Language

  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

  const handleChatClick = () => {
    if (language === "ko") {
      window.open("https://pf.kakao.com/_dxoiLn", "_blank")
      return
    }

    if (language === "zh") {
      // 중국어 → 위챗 모달 표시
      setOpenWeChatModal(true)
      return
    }

    if (language === "ja") {
      window.open("https://line.me/R/ti/p/@235wfyao", "_blank")
      return
    }

    if (language === "en") {
      window.open("https://wa.me/821025326285", "_blank")
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
    <MapSection>
      <MapInner>
        {/* Left side */}
        <InfoColumn>
          <div tw="grid grid-cols-1 md:grid-cols-2 gap-6 md:auto-rows-fr">
            {/* 진료시간 안내 */}
            <InfoBlock>
              <InfoTextWrapper>
                <InfoTitle>{t("location.hours")}</InfoTitle>
                <InfoText>{t("location.weekdayHours")}</InfoText>
                <InfoText>{t("location.weekendHours")}</InfoText>
                <InfoText tw="text-primary">{t("location.lunch")}</InfoText>
              </InfoTextWrapper>

              <ButtonGroup tw="mt-[1px]">
                <SolidButton
                  onClick={() => {
                    navigate("/reservation/new")
                  }}>
                  {t("location.leftButton1")}
                </SolidButton>
                <SolidButton className="sns-btn-conversion" onClick={handleChatClick}>
                  {t("location.leftButton2")}
                </SolidButton>
              </ButtonGroup>
            </InfoBlock>

            <InfoBlock>
              <InfoTextWrapper>
                <InfoTitle>{t("location.directions")}</InfoTitle>
                <InfoText>{t("location.address1")}</InfoText>
                <InfoText>{t("location.address2")}</InfoText>
                <InfoText tw="text-primary">{t("location.subway")}</InfoText>
              </InfoTextWrapper>

              <ButtonGroup>
                <OutlineButton onClick={() => window.open("https://naver.me/FLe0V59M", "_blank")}>
                  {t("location.rightButton1")}
                </OutlineButton>
                <OutlineButton
                  onClick={() => window.open("https://kko.kakao.com/LK40uI5cBA", "_blank")}>
                  {t("location.rightButton2")}
                </OutlineButton>
              </ButtonGroup>
            </InfoBlock>
          </div>
        </InfoColumn>

        {/* Right side */}
        <MapColumn>
          <GoogleMapWrapper>
            <GoogleMapComponent />
          </GoogleMapWrapper>
        </MapColumn>
      </MapInner>
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
            <img src={wechatQrImg} alt="" tw="w-[240px] h-[240px] object-contain" />
          </div>
        </div>
      </Modal>
    </MapSection>
  )
}

export default Location
