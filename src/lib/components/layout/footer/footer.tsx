import tw, { styled } from "twin.macro"
import CustomLink from "@/lib/components/custom-link.component"
import {
  NaverBlogGrayIcon,
  InstaLogoGrayIcon,
  YoutubeGrayIcon,
  TiktokGrayIcon,
} from "@/assets/icon"
import FooterLogoImg from "@/assets/images/peche-footer-logo.png"

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
  flex gap-3 justify-start md:justify-start text-neutral50
`

const SNSIcons = tw.div`
  flex gap-4 justify-start md:justify-end items-center text-neutral50
`

const BottomRow = tw.div`
  flex flex-col md:flex-row md:items-center md:justify-between gap-4
`

const IconLink = styled.a`
  ${tw`hover:opacity-60 transition flex items-center`}
`

const Footer = () => {
  const socialLinks = [
    { icon: NaverBlogGrayIcon, url: "https://blog.naver.com/" },
    { icon: InstaLogoGrayIcon, url: "https://www.instagram.com/" },
    { icon: YoutubeGrayIcon, url: "https://www.youtube.com/" },
    { icon: TiktokGrayIcon, url: "https://www.tiktok.com/" },
  ]

  return (
    <FooterWrapper>
      <FooterInner>
        {/* Top */}
        <FooterTop>
          <LogoBlock>
            <img src={FooterLogoImg} alt="Peche Clinic" tw="w-[129px] h-auto" loading="lazy" />
            <div tw="mt-2">
              서울특별시 강남구 강남대로 364, 3층 전체(역삼동, 미왕빌딩) | 대표 : 안태언 |
              사업자등록번호 219-05-28999 | 대표 번호 000-000-000
            </div>
            <div>© 2025 Peche. All Rights Reserved.</div>
          </LogoBlock>
        </FooterTop>

        <Divider />

        {/* Bottom */}
        <BottomRow>
          <PolicyLinks>
            <CustomLink to="/termsofservice">이용약관</CustomLink>
            <span>|</span>
            <CustomLink to="/privacypolicy">개인정보처리방침</CustomLink>
          </PolicyLinks>

          <SNSIcons>
            {socialLinks.map(({ icon: IconComponent, url }, i) => (
              <IconLink key={i} href={url} target="_blank" rel="noopener noreferrer">
                <IconComponent tw="w-5 h-5" />
              </IconLink>
            ))}
          </SNSIcons>
        </BottomRow>
      </FooterInner>
    </FooterWrapper>
  )
}

export default Footer
