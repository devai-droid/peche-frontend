import { useMediaQuery } from "@mui/material"
import { theme } from "twin.macro"

const useResponsive = () => {
  const isMobile = useMediaQuery(`(max-width:${theme`screens.sm`})`)
  const isDesktop = useMediaQuery(`(min-width:${theme`screens.lg`})`)

  const isTablet = !isMobile && !isDesktop

  return { isMobile, isTablet, isDesktop }
}

export default useResponsive
