import React from "react"

interface Props {
  hasNextPage?: boolean
  fetchNextPage: () => void
}

const InfiniteScroll = ({
  hasNextPage,
  fetchNextPage,
  children,
}: React.PropsWithChildren<Props>) => {
  const observerRef = React.useRef<HTMLDivElement>(null)
  const [intersecting, setIntersecting] = React.useState(false)

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
      },
      { threshold: 0.5 },
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
      observer.disconnect()
    }
  }, [])

  React.useEffect(() => {
    if (intersecting) {
      loadMore()
    }
  }, [intersecting])

  return (
    <>
      {children}
      <div ref={observerRef} />
    </>
  )
}

export default InfiniteScroll
