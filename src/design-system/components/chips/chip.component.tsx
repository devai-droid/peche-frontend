import tw, { styled } from "twin.macro"

// eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
const _Color = {
  YELLOW: "yellow",
  POINT: "point",
  BLUE: "blue",
} as const

export type Color = (typeof _Color)[keyof typeof _Color]

const Chip = styled.div(({ color = "point" }: { color?: Color }) => [
  tw`inline-block px-2 py-1 text-sm rounded-full font-nanumgothic font-bold`,
  color === _Color.YELLOW && tw`bg-[#F3E14D] text-[#351D1C]`,
  color === _Color.POINT && tw`bg-[#FFEEF3] text-[#8D7B64]`,
  color === _Color.BLUE && tw`bg-[#E8F4FF] text-[#2B6BFF]`,
])

export default Chip
