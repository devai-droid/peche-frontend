import React from "react"
import tw, { styled } from "twin.macro"
import CustomLink from "@/lib/components/custom-link.component"
import {
  NaverBlogGrayIcon,
  InstaLogoGrayIcon,
  TiktokGrayIcon,
  NaverPlaceGrayIcon,
  KakaoFriendsGrayIcon,
  WhatsappGrayIcon,
  WechatGrayIcon,
  XGrayIcon,
  LineGrayIcon,
  FacebookGrayIcon,
  CloseIcon,
} from "@/assets/icon"
import FooterLogoImg from "@/assets/images/peche-footer-logo.png"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import Modal from "@/lib/components/modal/modal.component"
import wechatQrImg from "@/assets/images/wechat-qr.png"

const FooterWrapper = tw.footer`
  w-full bg-neutral20 text-[#444] text-sm
`

const FooterInner = styled.div`
  ${tw`max-w-[1440px] mx-auto px-6 py-10 md:py-14 flex flex-col tracking-tight leading-[150%] font-pretendard text-[13px] md:text-[14px]`}
`

const FooterTop = tw.div`
  flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-10
`

const LogoBlock = tw.div`
  flex flex-col gap-2 text-neutral50
`

const Divider = tw.hr`
  border-t border-[#DCDCDC] my-4
`

const PolicyLinks = tw.div`
  flex gap-2 justify-start md:justify-start text-neutral50
`

const SNSIcons = tw.div`
  flex gap-[7px] justify-start md:justify-end items-center text-neutral50
`

const BottomRow = tw.div`
  flex flex-col md:flex-row md:items-center md:justify-between gap-4
`

const IconLink = styled.a`
  ${tw`hover:opacity-60 transition flex items-center`}
`
const Spacer = styled.div`
  ${tw`block lg:hidden`}
`

type FooterSocialItem =
  | {
      icon: React.FC<React.SVGProps<SVGSVGElement>>
      url: string
      type?: undefined
    }
  | {
      icon: React.FC<React.SVGProps<SVGSVGElement>>
      type: "modal"
      modalKey: "wechat"
      url?: undefined
    }

const FOOTER_SOCIAL_LINKS: Record<Language, FooterSocialItem[]> = {
  ko: [
    { icon: NaverPlaceGrayIcon, url: "https://naver.me/FLe0V59M" },
    { icon: NaverBlogGrayIcon, url: "https://blog.naver.com/pecheclinic" },
    { icon: KakaoFriendsGrayIcon, url: "http://pf.kakao.com/_dxoiLn" },
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/peche_clinic/" },
  ],
  en: [
    { icon: WhatsappGrayIcon, url: "https://wa.me/821025326285" },
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic.en/" },
    { icon: TiktokGrayIcon, url: "https://www.tiktok.com/@pecheclinic_eng" },
  ],
  zh: [
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic.cn/" },
    { icon: WechatGrayIcon, type: "modal", modalKey: "wechat" },
  ],
  "zh-TW": [
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic_tw/" },
    { icon: FacebookGrayIcon, url: "https://www.facebook.com/profile.php?id=61582363886175" },
    { icon: LineGrayIcon, url: "https://line.me/R/ti/p/@683jgqmd" },
  ],
  ja: [
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic.jp/" },
    { icon: LineGrayIcon, url: "https://line.me/R/ti/p/@235wfyao" },
    {
      icon: TiktokGrayIcon,
      url: "https://www.tiktok.com/@pecheclinic_jp?is_from_webapp=1&sender_device=pc",
    },
    { icon: XGrayIcon, url: "https://x.com/pecheclinic_jp" },
  ],
  th: [
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic_th/" },
    { icon: FacebookGrayIcon, url: "https://www.facebook.com/profile.php?id=61582230961269" },
    { icon: LineGrayIcon, url: "https://line.me/R/ti/p/@892druai" },
    { icon: TiktokGrayIcon, url: "https://www.tiktok.com/@pecheclinic_th" },
  ],
}

interface FooterProps {
  bottomCartExists?: boolean
}

const Footer = ({ bottomCartExists = false }: FooterProps) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

  const socialLinks = FOOTER_SOCIAL_LINKS[language] ?? FOOTER_SOCIAL_LINKS.ko

  // const socialLinks = [
  //   { icon: NaverPlaceGrayIcon, url: "https://blog.naver.com/" },
  //   { icon: NaverBlogGrayIcon, url: "https://blog.naver.com/" },
  //   { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/" },
  //   { icon: KakaoFriendsGrayIcon, url: "https://www.kakaocorp.com/" },
  //   { icon: YoutubeGrayIcon, url: "https://www.youtube.com/" },
  //   { icon: TiktokGrayIcon, url: "https://www.tiktok.com/" },
  // ]

  return (
    <FooterWrapper>
      <FooterInner>
        {/* Top */}
        <FooterTop>
          <LogoBlock>
            <img src={FooterLogoImg} alt="Peche Clinic" tw="w-[129px] h-auto" loading="lazy" />
            <div tw="mt-2">{t("footer.info")}</div>
            <div>© 2025 Peche. All Rights Reserved.</div>
          </LogoBlock>
        </FooterTop>

        <Divider />

        {/* Bottom */}
        <BottomRow>
          <PolicyLinks>
            <CustomLink to="/termsofservice">{t("footer.termsOfService")}</CustomLink>
            <span>|</span>
            <CustomLink to="/privacypolicy">{t("footer.privacyPolicy")}</CustomLink>
          </PolicyLinks>

          <SNSIcons>
            {socialLinks.map((item, i) => {
              const Icon = item.icon

              if (item.type === "modal") {
                return (
                  <button
                    key={i}
                    onClick={() => setOpenWeChatModal(true)}
                    className="sns-btn-conversion"
                    tw="flex items-center hover:opacity-60 transition">
                    <Icon width={24} height={24} />
                  </button>
                )
              }

              return (
                <IconLink key={i} href={item.url} target="_blank" rel="noopener noreferrer">
                  <Icon width={24} height={24} />
                </IconLink>
              )
            })}
          </SNSIcons>
        </BottomRow>
      </FooterInner>
      {/* 상담받기 버튼/카트 유무에 따라 height 조정 */}
      <Spacer className={bottomCartExists ? "h-[90px]" : "h-[40px]"} />
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
    </FooterWrapper>
  )
}

export default Footer
