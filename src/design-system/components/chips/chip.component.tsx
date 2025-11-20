import tw, { styled } from "twin.macro"

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const _Color = {
  YELLOW: "yellow",
  POINT: "point",
  BLUE: "blue",
  PRIMARY: "primary",
  GRAY: "gray",
  PINK: "pink",
  DARKGRAY: "darkgray",
} as const

export type Color = (typeof _Color)[keyof typeof _Color]

const Chip = styled.div(({ color = "point" }: { color?: Color }) => [
  tw`inline-block px-2 py-1 font-pretendard text-[10px] sm:text-[12px]`,
  color === _Color.PRIMARY && tw`bg-[#DA7F67] text-[#FFFFFF]`,
  color === _Color.GRAY && tw`bg-[#F4F4F4] text-[#8D7B64]`,
  color === _Color.PINK && tw`bg-[#FEF5EA] text-[#79473B]`,
  color === _Color.DARKGRAY && tw`bg-[#F4F4F4] text-[#121212]`,
])

export default Chip
