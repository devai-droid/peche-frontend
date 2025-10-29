import styled from "@emotion/styled"
import { useState, useEffect } from "react"
import { useDebounce } from "usehooks-ts"

interface Options {
  bgColor?: string
  disabled?: boolean
}

const useRipple = <T extends HTMLElement>(ref: React.RefObject<T>, options?: Options) => {
  const [ripples, setRipples] = useState<React.CSSProperties[]>([])
  useEffect(() => {
    const elem = ref.current
    if (!elem || options?.disabled) {
      return () => {}
    }

    const clickHandler = (e: MouseEvent) => {
      const rect = elem.getBoundingClientRect()
      const left = e.clientX - rect.left
      const top = e.clientY - rect.top

      const width = elem.clientWidth
      const height = elem.clientHeight
      const maxSize = Math.max(width, height)

      setRipples([
        ...ripples,
        {
          left: left - maxSize / 2,
          top: top - maxSize / 2,
          width: maxSize,
          height: maxSize,
        },
      ])
    }

    elem.addEventListener("click", clickHandler)

    return () => {
      elem.removeEventListener("click", clickHandler)
    }
  }, [ref, ripples])

  const debounced = useDebounce(ripples, 1000)

  useEffect(() => {
    if (debounced.length) {
      setRipples([])
    }
  }, [debounced.length])

  return ripples.map((style, index) => (
    <RippleStyled
      key={index}
      style={{ ...style, backgroundColor: options?.bgColor ?? "currentColor" }}
    />
  ))
}

export default useRipple

const RippleStyled = styled.span`
  @keyframes rippleEffect {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  position: absolute;
  opacity: 30%;
  transform: scale(0);
  animation: rippleEffect 0.6s linear;
  border-radius: 50%;
`
