import React from "react"
import tw, { styled } from "twin.macro"

/**
 * 플레이스(네이버·구글·카카오) 버튼 라벨.
 * 모바일에서는 마지막 단어('보기' 등) 앞에서 줄바꿈하고, 데스크톱에서는 한 줄로 둔다.
 * 단어 중간에서 끊기지 않도록 break-keep 적용.
 */
const Label = styled.span`
  ${tw`break-keep`}
`
const MobileBreak = styled.br`
  ${tw`md:hidden`}
`
const DesktopSpace = styled.span`
  ${tw`hidden md:inline`}
`

const PlaceButtonLabel = ({ text }: { text: string }) => {
  const i = text.lastIndexOf(" ")
  if (i < 0) return <Label>{text}</Label>
  return (
    <Label>
      {text.slice(0, i)}
      <MobileBreak />
      <DesktopSpace> </DesktopSpace>
      {text.slice(i + 1)}
    </Label>
  )
}

export default PlaceButtonLabel
