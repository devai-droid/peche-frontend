import React from "react"
import tw, { styled } from "twin.macro"
import { CloseIcon } from "@/assets/icon"
import wechatQrImg from "@/assets/images/wechat-qr.png"
import mapImg from "@/assets/images/why-peche-map.png"
import { useTranslation } from "react-i18next"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import { Language } from "@/lib/locales/i18n.config"
import Modal from "@/lib/components/modal/modal.component"
import { useSiteConfig } from "@/lib/hooks/use-site-config"
import { getConsultChannel } from "@/lib/utils/social-links.util"

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
  const { t, i18n } = useTranslation()
  const siteConfig = useSiteConfig() // 어드민 진료시간 값. 비면 하드코딩 폴백.
  const navigate = useCustomNavigate()
  const language = i18n.language as Language

  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)
  const handleChatClick = () => {
    // 대표 상담 채널(어드민 값, 없으면 언어별 폴백). wechat은 QR 모달.
    const ch = getConsultChannel(siteConfig, language)
    if (ch.isModal) {
      setOpenWeChatModal(true)
      return
    }
    if (ch.url) window.open(ch.url, "_blank")
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
                <InfoText>{siteConfig?.weekdayHours || t("location.weekdayHours")}</InfoText>
                <InfoText>{siteConfig?.weekendHours || t("location.weekendHours")}</InfoText>
                <InfoText tw="text-primary">
                  {siteConfig?.lunchInfo || t("location.lunch")}
                </InfoText>
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
                {(siteConfig?.displayAddress
                  ? siteConfig.displayAddress.split("\n")
                  : [t("location.address1"), t("location.address2")]
                ).map((line, i) => (
                  <InfoText key={i}>{line}</InfoText>
                ))}
                <InfoText tw="text-primary">
                  {siteConfig?.landmark || t("location.subway")}
                </InfoText>
              </InfoTextWrapper>

              <ButtonGroup>
                <OutlineButton
                  onClick={() =>
                    window.open(siteConfig?.naverPlaceUrl || "https://naver.me/FLe0V59M", "_blank")
                  }>
                  {t("location.rightButton1")}
                </OutlineButton>
                <OutlineButton
                  onClick={() =>
                    window.open(
                      siteConfig?.googlePlaceUrl || "https://maps.app.goo.gl/bkkdJBLVdT7UkKtg9",
                      "_blank",
                    )
                  }>
                  {t("location.rightButton2")}
                </OutlineButton>
              </ButtonGroup>
            </InfoBlock>
          </div>
        </InfoColumn>

        {/* Right side */}
        <MapColumn>
          <GoogleMapWrapper
            onClick={() =>
              window.open(
                siteConfig?.googlePlaceUrl || "https://maps.app.goo.gl/bkkdJBLVdT7UkKtg9",
                "_blank",
              )
            }
            tw="cursor-pointer">
            <img src={mapImg} alt="페슈의원 위치" tw="w-full h-full object-cover" />
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
