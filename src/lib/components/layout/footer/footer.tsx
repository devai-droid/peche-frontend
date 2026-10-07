import React from "react"
import tw, { styled } from "twin.macro"
import CustomLink from "@/lib/components/custom-link.component"
import {
  NaverBlogGrayIcon,
  InstaLogoGrayIcon,
  ThreadsGrayIcon,
  KakaoFriendsGrayIcon,
  WhatsappGrayIcon,
  WechatGrayIcon,
  LineGrayIcon,
  CloseIcon,
} from "@/assets/icon"
import { ReactComponent as FooterLogo } from "@/assets/icons/peche-footer-logo.svg"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import Modal from "@/lib/components/modal/modal.component"
import wechatQrImg from "@/assets/images/wechat-qr.png"
import { useSiteConfig } from "@/lib/hooks/use-site-config"
import { activeSocialLinks, SocialPlatform } from "@/lib/utils/social-links.util"

/**
 * 플랫폼 → 푸터용(회색) 아이콘. 여기 없는 플랫폼은 푸터 아이콘으로 노출하지 않음.
 * 플레이스(구글·네이버)는 SNS가 아니라 '위치/지도 링크'로 분리돼 여기 없다.
 */
const FOOTER_ICON: Partial<Record<SocialPlatform, React.FC<React.SVGProps<SVGSVGElement>>>> = {
  naverBlog: NaverBlogGrayIcon,
  kakao: KakaoFriendsGrayIcon,
  instagram: InstaLogoGrayIcon,
  threads: ThreadsGrayIcon,
  whatsapp: WhatsappGrayIcon,
  wechat: WechatGrayIcon,
  line: LineGrayIcon,
}

/**
 * 어드민 '기본 정보 관리' 값(표시용 주소·대표자명·사업자등록번호·대표번호)으로 푸터 한 줄을 조합.
 * 언어별 라벨·구분자만 다르고 구조는 동일. 값이 하나라도 비면 기존 하드코딩(footer.info)으로 폴백.
 */
const FOOTER_INFO_TEMPLATE: Partial<
  Record<Language, (addr: string, rep: string, biz: string, tel: string) => string>
> = {
  ko: (a, r, b, t) => `${a} | 대표 : ${r} | 사업자등록번호 ${b} | 대표 번호 ${t}`,
  en: (a, r, b, t) =>
    `${a}  |  Representative: ${r}  |  Business Registration Number ${b}  |  Main Number ${t}`,
  ja: (a, r, b, t) => `${a}｜代表者：${r}｜事業者登録番号：${b}｜代表電話番号：${t}`,
  zh: (a, r, b, t) => `${a} | 代表：${r} | 营业执照号码：${b} | 总机：${t}`,
  "zh-TW": (a, r, b, t) => `${a} | 代表：${r} | 營業執照號碼：${b} | 總機：${t}`,
  th: (a, r, b, t) => `${a} | ผู้แทน: ${r} | เลขทะเบียนธุรกิจ ${b} | เบอร์โทรศัพท์หลัก ${t}`,
}


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
      modalKey: "wechat" | "whatsapp"
      url?: undefined
    }

// 어드민 SNS 설정이 비었을 때만 쓰는 폴백. 지정 목록(플레이스·목록밖 제외)과 동일. 쓰레드는 URL 미정이라 제외.
const FOOTER_SOCIAL_LINKS: Record<Language, FooterSocialItem[]> = {
  ko: [
    { icon: KakaoFriendsGrayIcon, url: "http://pf.kakao.com/_dxoiLn" },
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/peche_clinic/" },
    { icon: NaverBlogGrayIcon, url: "https://blog.naver.com/pecheclinic" },
  ],
  en: [
    { icon: WhatsappGrayIcon, url: "https://wa.me/message/4Y5JC2HX6OH5H1" },
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic.en/" },
  ],
  zh: [{ icon: WechatGrayIcon, type: "modal", modalKey: "wechat" }],
  "zh-TW": [
    { icon: LineGrayIcon, url: "https://line.me/R/ti/p/@683jgqmd" },
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic_tw/" },
  ],
  ja: [
    { icon: LineGrayIcon, url: "https://line.me/R/ti/p/@235wfyao" },
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic.jp/" },
  ],
  th: [
    { icon: LineGrayIcon, url: "https://line.me/R/ti/p/@892druai" },
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/pecheclinic_th/" },
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

  // 어드민 값이 다 있으면 언어별 템플릿으로 조합, 아니면 기존 하드코딩 폴백
  const cfg = useSiteConfig()
  const tpl = FOOTER_INFO_TEMPLATE[language] ?? FOOTER_INFO_TEMPLATE.ko
  const footerInfo =
    cfg?.displayAddress && cfg?.representativeName && cfg?.businessRegistrationNumber && cfg?.telephone && tpl
      ? tpl(
          cfg.displayAddress.replace(/\n/g, " "),
          cfg.representativeName,
          cfg.businessRegistrationNumber,
          cfg.telephone,
        )
      : t("footer.info")

  // 어드민 SNS 설정이 있으면 그걸로(공통 + 언어별, 아이콘 매핑), 없으면 기존 하드코딩 목록으로.
  const cfgCommon = activeSocialLinks(cfg?.commonSocialLinks) ?? []
  const cfgLang = activeSocialLinks(cfg?.socialLinks) ?? []
  const cfgMerged = [...cfgCommon, ...cfgLang]
  const snsItems = cfgMerged.length
    ? cfgMerged
        .filter((l) => !!FOOTER_ICON[l.platform as SocialPlatform])
        .map((l, i) => ({
          Icon: FOOTER_ICON[l.platform as SocialPlatform] as React.FC<React.SVGProps<SVGSVGElement>>,
          url: l.url as string | undefined,
          isModal: l.platform === "wechat",
          key: `${l.platform}-${i}`,
        }))
    : socialLinks.map((item, i) => ({
        Icon: item.icon,
        url: item.url as string | undefined,
        isModal: item.type === "modal",
        key: String(i),
      }))

  return (
    <FooterWrapper>
      <FooterInner>
        {/* Top */}
        <FooterTop>
          <LogoBlock>
            <FooterLogo width={129} height={24} aria-label="Peche Clinic" />
            <div tw="mt-2">{footerInfo}</div>
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
            {snsItems.map(({ Icon, url, isModal, key }) => {
              if (isModal) {
                return (
                  <button
                    key={key}
                    onClick={() => setOpenWeChatModal(true)}
                    className="sns-btn-conversion"
                    tw="flex items-center hover:opacity-60 transition">
                    <Icon width={28} height={28} />
                  </button>
                )
              }

              return (
                <IconLink key={key} href={url} target="_blank" rel="noopener noreferrer">
                  <Icon width={28} height={28} />
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
