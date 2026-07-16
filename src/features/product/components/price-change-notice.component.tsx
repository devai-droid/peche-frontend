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
  icon = false,
  compact = false,
}: {
  date: string
  alwaysBreak?: boolean
  icon?: boolean
  compact?: boolean
}) => {
  const { t } = useTranslation()
  // 날짜가 들어간 1줄 문구를 날짜값 위치에서 쪼개, 날짜만 별도 색상 span으로 렌더
  const line1 = t("cart.priceChangeNoticeLine1", { date })
  const [before, after] = line1.split(date)
  const line2 = t("cart.priceChangeNoticeLine2")
  return (
    <div
      css={[
        tw`font-pretendard text-neutral70 leading-[150%]`,
        // compact(사이드 장바구니): '결제는 내원시 진행됩니다' 문구와 동일 크기 / 기본(예약페이지): 크게
        compact ? tw`text-[13px] md:text-[14px]` : tw`text-[16px] md:text-[20px]`,
      ]}>
      {icon && (
        <span
          aria-hidden
          tw="inline-flex shrink-0 items-center justify-center align-middle w-[18px] h-[18px] md:w-[20px] md:h-[20px] mr-1.5 rounded-[5px] bg-primary text-white text-[12px] md:text-[13px] font-bold leading-none">
          !
        </span>
      )}
      {before}
      <span tw="text-tertiaryDark">{date}</span>
      {after}{" "}
      <span css={alwaysBreak ? tw`block` : tw`block md:inline`}>{line2}</span>
    </div>
  )
}

export default PriceChangeNotice
