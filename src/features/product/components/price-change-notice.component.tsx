import { useTranslation } from "react-i18next"
import tw from "twin.macro"

/**
 * 장바구니 상품 정보 변경 안내문구.
 * 날짜·느낌표 배지는 시스템 색 secondary3(#AB6655)로 강조, 나머지는 진한 회색(neutral70).
 * - 예약 페이지(compact=false): 가운데 정렬, 큰 글자, 모바일에서만 2줄로 줄바꿈(PC는 한 줄).
 * - 사이드 장바구니(compact=true): 왼쪽 정렬, 결제안내 문구 크기로 작게, 폭에 맞춰 자연스럽게 줄바꿈(강제 X).
 * 배지 아이콘은 직각 사각형이며, 인라인 vertical-align이 아닌 플렉스 세로중앙(items-center)으로 정렬(한글 보정).
 */
const PriceChangeNotice = ({
  date,
  icon = false,
  compact = false,
}: {
  date: string
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
        tw`flex items-center gap-1.5 font-pretendard text-neutral70 leading-[150%]`,
        compact
          ? tw`justify-start text-[13px] md:text-[14px]`
          : tw`justify-center text-[16px] md:text-[20px]`,
      ]}>
      {icon && (
        <span
          aria-hidden
          css={[
            tw`inline-flex shrink-0 items-center justify-center bg-secondary3 text-white font-bold leading-none`,
            // 직각 사각형. compact는 본문 글자 크기에 맞춰 작게.
            compact
              ? tw`w-[14px] h-[14px] md:w-[15px] md:h-[15px] text-[10px] md:text-[11px]`
              : tw`w-[18px] h-[18px] md:w-[20px] md:h-[20px] text-[12px] md:text-[13px]`,
          ]}>
          !
        </span>
      )}
      <div css={compact ? tw`text-left` : tw`text-center`}>
        {before}
        <span tw="text-secondary3">{date}</span>
        {after}{" "}
        {/* 예약 페이지는 모바일에서만 강제 줄바꿈, 사이드 장바구니는 자연 줄바꿈 */}
        <span css={compact ? tw`inline` : tw`block md:inline`}>{line2}</span>
      </div>
    </div>
  )
}

export default PriceChangeNotice
