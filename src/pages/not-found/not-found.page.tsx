import Page from "@/lib/components/layout/page.component"
import CustomLink from "@/lib/components/custom-link.component"
import { useTranslation } from "react-i18next"
import Img404 from "@/assets/images/404.png"

/**
 * 표준 404 페이지. 없는 리소스(예: 특정 언어로 미번역된 블로그 글, 삭제된 페이지)에 사용.
 * hiddenChrome=true면 헤더/푸터 숨김(미리보기 등).
 */
const NotFoundPage = ({ hiddenChrome = false }: { hiddenChrome?: boolean }) => {
  const { t } = useTranslation()
  return (
    <Page
      hiddenHeader={hiddenChrome}
      hiddenFooter={hiddenChrome}
      bottomCartExists={false}
      hideOnScroll>
      <div tw="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-6 text-center font-pretendard">
        <img src={Img404} alt="404" tw="w-[160px] md:w-[220px] max-w-full" />
        <div tw="text-[18px] md:text-[22px] font-semibold text-neutral80">
          {t("blog.notFoundTitle")}
        </div>
        <div tw="text-[14px] md:text-[16px] text-neutral60 leading-[150%] whitespace-pre-line">
          {t("blog.notFoundDesc")}
        </div>
        <CustomLink
          to="/"
          tw="mt-2 px-5 py-2.5 border text-[14px] md:text-[15px] font-medium transition-colors duration-200"
          css={[{ color: "#DA7F67", borderColor: "#DA7F67" }]}>
          {t("blog.goHome")}
        </CustomLink>
      </div>
    </Page>
  )
}

export default NotFoundPage
