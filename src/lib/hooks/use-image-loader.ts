import { useEffect, useState } from "react"
import { preloadImage } from "../utils/util"

const useImageLoader = (src?: string) => {
  const [showSkeleton, setShowSkeleton] = useState<null | boolean>(null)

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

  return {
    isLoading,
    showSkeleton,
    setShowSkeleton,
  }
}

export default useImageLoader
