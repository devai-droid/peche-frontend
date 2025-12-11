/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import useRipple from "@/lib/hooks/use-ripple"
import { HTMLButtonProps } from "@/lib/types/html-element-type"
import React, { useImperativeHandle, useRef } from "react"
import { LinkProps } from "react-router-dom"
import tw, { TwStyle } from "twin.macro"
import CustomLink from "@/lib/components/custom-link.component"

export const _ButtonColor = {
  BLACK: "black",
  POINT: "point",
  GRAY: "gray",
} as const

export type ButtonColor = (typeof _ButtonColor)[keyof typeof _ButtonColor]

export const _ButtonSize = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
} as const

export type ButtonSize = (typeof _ButtonSize)[keyof typeof _ButtonSize]

export const _ButtonVariant = {
  OUTLINED: "outlined",
  FILLED: "filled",
} as const

export type ButtonVariant = (typeof _ButtonVariant)[keyof typeof _ButtonVariant]

interface StyleOptions {
  /**
   * @default true
   * @abstract `rounded-full`
   */
  rounded?: boolean
  /**
   * @default false
   * @abstract `w-full`
   */
  flexible?: boolean
  /**
   * @default outlined
   */
  variant?: ButtonVariant
  /**
   * @default point
   */
  color?: ButtonColor
  /**
   * @default false
   * @abstract `shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] disabled:shadow-none`
   */
  shadow?: boolean
  /**
   * @default md
   * @abstract `sm:(h-9 text-xs) md:(h-10 text-sm) lg:(h-12 text-md)`
   */
  size?: ButtonSize
  /**
   * @default false
   * @abstract `font-bold`
   */
  bold?: boolean
}

interface Props extends HTMLButtonProps {
  style?: StyleOptions
}

const getButtonStyle = (style: StyleOptions): TwStyle[] => {
  const {
    rounded = true,
    flexible,
    shadow,
    bold,
    variant = _ButtonVariant.FILLED,
    color = _ButtonColor.POINT,
    size = _ButtonSize.MEDIUM,
  } = style ?? {}

  const buttonStyle: TwStyle[] = [
    tw`min-w-[5rem] px-4 transition-all relative overflow-hidden leading-none`,
  ]

  // 🔥 border-radius: 1px
  if (rounded) {
    buttonStyle.push(tw`rounded-[1px]`)
  }

  if (shadow) {
    buttonStyle.push(tw`shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] disabled:shadow-none`)
  }

  if (flexible) {
    buttonStyle.push(tw`w-full`)
  }

  // ---------------------------
  // 🔥 COLOR / VARIANT SYSTEM
  // ---------------------------

  if (variant === _ButtonVariant.OUTLINED) {
    // 🔸 OUTLINED BLACK
    if (color === _ButtonColor.BLACK) {
      buttonStyle.push(tw`text-neutralBlack bg-white border border-neutralBlack`)
    }
    // OUTLINED GRAY
    else if (color === _ButtonColor.GRAY) {
      buttonStyle.push(tw`text-neutral80 bg-white border border-neutral50`)
    }
    // 🔸 OUTLINED PRIMARY
    else {
      buttonStyle.push(tw`text-primary bg-white border border-primary hover:bg-tertiary`)
    }

    buttonStyle.push(tw`disabled:(text-neutral50 border-neutral20 bg-neutral20)`)
  } else {
    // 🔸 FILLED BLACK
    if (color === _ButtonColor.BLACK) {
      buttonStyle.push(tw`text-white bg-neutralBlack border border-neutralBlack`)
    }
    // 🔸 FILLED PRIMARY
    else {
      buttonStyle.push(tw`text-white bg-primary border border-primary`)
    }

    buttonStyle.push(tw`disabled:(text-white bg-neutral20 border-neutral20)`)
  }

  // ---------------------------
  // 🔥 SIZE SYSTEM
  // ---------------------------
  if (size === _ButtonSize.SMALL) {
    buttonStyle.push(tw`h-9 text-xs`) // 36px
  } else if (size === _ButtonSize.MEDIUM) {
    buttonStyle.push(tw`h-11 text-sm`) // 44px
  } else if (size === _ButtonSize.LARGE) {
    buttonStyle.push(tw`h-14 text-md`) // 56px
  }

  if (bold) {
    buttonStyle.push(tw`font-semibold`)
  }

  return buttonStyle
}

const ButtonComponent: React.ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  { style, children, disabled, ...props },
  forwardRef,
) => {
  const internalRef = useRef<HTMLButtonElement>(null)
  const ripples = useRipple(internalRef, {
    disabled,
  })

  useImperativeHandle(forwardRef, () => internalRef.current as HTMLButtonElement)

  return (
    <button ref={internalRef} css={getButtonStyle(style ?? {})} disabled={disabled} {...props}>
      {children}
      {ripples}
    </button>
  )
}

const LinkButtonComponent: React.ForwardRefRenderFunction<HTMLAnchorElement, Props & LinkProps> = (
  { style, children, disabled, ...props },
  forwardRef,
) => {
  const internalRef = useRef<HTMLAnchorElement>(null)
  const ripples = useRipple(internalRef, {
    disabled,
  })

  useImperativeHandle(forwardRef, () => internalRef.current as HTMLAnchorElement)

  return (
    <CustomLink
      ref={internalRef}
      tw="inline-flex justify-center items-center"
      css={getButtonStyle(style ?? {})}
      {...props}>
      {children}
      {ripples}
    </CustomLink>
  )
}

const Button = React.forwardRef(ButtonComponent)
const LinkButton = React.forwardRef(LinkButtonComponent)

export { Button, LinkButton }
