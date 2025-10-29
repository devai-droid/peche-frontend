import React, { useEffect } from "react"
import tw from "twin.macro"

// TODO: 피그마 아바타가 이미지로 되어 있어서 후에 바꿔야함.
import AvatarImg from "@/assets/images/avatar.png"
import { preloadImage } from "@/lib/utils/util"

type Size = number

interface Props extends Pick<React.DOMAttributes<unknown>, "css" | "tw"> {
  src?: string

  /**
   * @default 48
   */
  size?: Size
}

const style = ({ size = 48 }: Props) => [
  tw`rounded-full inline-block object-cover`,
  {
    width: `${size / 16}rem`,
    height: `${size / 16}rem`,
  },
]

const Avatar: React.FC<Props> = ({ src, css, ...props }) => {
  const [showSkeleton, setShowSkeleton] = React.useState<null | boolean>(null)

  useEffect(() => {
    if (!src) {
      setShowSkeleton(true)
      return
    }

    preloadImage(src)
      .then(() => {
        setShowSkeleton(false)
      })
      .catch(() => {
        setShowSkeleton(true)
      })
  }, [src])

  const isLoading = showSkeleton === null

  return isLoading ? (
    <p css={[...style(props), css]} {...props} />
  ) : (
    <img
      src={showSkeleton ? AvatarImg : src}
      alt="avatar"
      onError={() => {
        setShowSkeleton(true)
      }}
      css={[...style(props), css]}
      {...props}
    />
  )
}

export default React.memo(Avatar)
