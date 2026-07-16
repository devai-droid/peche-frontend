import { useTranslation } from "react-i18next"
import tw from "twin.macro"

/**
 * 장바구니 상품 정보 변경 안내문구.
 * 날짜는 시스템 어두운 붉은색(tertiaryDark)으로 강조, 나머지는 진한 회색(neutral70).
 * - 예약 페이지(alwaysBreak=false): 모바일에서만 2줄로 줄바꿈, PC는 한 줄.
 * - 사이드 장바구니(alwaysBreak=true): PC·모바일 모두 2줄로 줄바꿈.
 */
const PriceChangeNotice = ({
  date,
  alwaysBreak = false,
}: {
  date: string
  alwaysBreak?: boolean
}) => {
  const { t } = useTranslation()
  // 날짜가 들어간 1줄 문구를 날짜값 위치에서 쪼개, 날짜만 별도 색상 span으로 렌더
  const line1 = t("cart.priceChangeNoticeLine1", { date })
  const [before, after] = line1.split(date)
  const line2 = t("cart.priceChangeNoticeLine2")
  return (
    <div tw="text-[16px] md:text-[20px] font-pretendard text-neutral70 leading-[150%]">
      {before}
      <span tw="text-tertiaryDark">{date}</span>
      {after}{" "}
      <span css={alwaysBreak ? tw`block` : tw`block md:inline`}>{line2}</span>
    </div>
  )
}

export default PriceChangeNotice
