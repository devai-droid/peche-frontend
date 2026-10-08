import React from "react"
import tw from "twin.macro"

// tw import가 twin.macro의 tw prop 매크로를 활성화한다(아래 JSX에서 tw="..." 사용).
void tw

/**
 * 플레이스(네이버·구글·카카오) 버튼 라벨.
 * 모바일에서는 마지막 단어('보기' 등) 앞에서 줄바꿈하고, 데스크톱에서는 한 줄로 둔다.
 * 단어 중간에서 끊기지 않도록 break-keep 적용.
 */
const PlaceButtonLabel = ({ text }: { text: string }) => {
  const i = text.lastIndexOf(" ")
  if (i < 0) return <span tw="break-keep">{text}</span>
  return (
    <span tw="break-keep">
      {text.slice(0, i)}
      <br tw="md:hidden" />
      <span tw="hidden md:inline"> </span>
      {text.slice(i + 1)}
    </span>
  )
}

export default PlaceButtonLabel
