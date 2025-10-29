import tw, { styled } from "twin.macro"

const textSizes = {
  xs: tw`text-xxs`,
  sm: tw`text-xs`,
  md: tw`text-sm`,
  lg: tw`text-md`,
  xl: tw`text-lg`,
}
const titleSizes = {
  xxs: tw`text-xxs`,
  xs: tw`text-xs`,
  sm: tw`text-sm`,
  md: tw`text-md`,
  lg: tw`text-lg`,
  xl: tw`text-xl`,
  xxl: tw`text-xxl`,
}

export type TypographyProps = {
  type?: "title" | "text"
  size?: keyof typeof textSizes | keyof typeof titleSizes
}

const Typography = styled.p(({ type = "text", size = "md" }: TypographyProps) => [
  ...(type === "title"
    ? [tw`font-bold`, titleSizes[size as keyof typeof titleSizes], tw`leading-normal`]
    : []),
  ...(type === "text"
    ? [tw`font-normal`, textSizes[size as keyof typeof textSizes], tw`leading-[1.75]`]
    : []),
])

export default Typography
