import tw, { styled } from "twin.macro"

const Input = styled.input(({ disabled }) => [
  [tw`bg-transparent border-b border-black py-2 text-md`],
  disabled && tw`border-b-0`,
])

export default Input
