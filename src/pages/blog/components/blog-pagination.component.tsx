import React from "react"
import tw, { css } from "twin.macro"

interface BlogPaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

const buttonBase = tw`
  w-[36px] h-[36px] flex items-center justify-center
  text-[14px] font-pretendard rounded-sm
  transition-colors duration-200
`

const BlogPagination = ({ currentPage, lastPage, onPageChange }: BlogPaginationProps) => {
  if (lastPage <= 1) return null

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = []
    const delta = 2

    pages.push(1)

    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(lastPage - 1, currentPage + delta)

    if (rangeStart > 2) {
      pages.push("...")
    }

    for (let i = rangeStart; i <= rangeEnd; i += 1) {
      pages.push(i)
    }

    if (rangeEnd < lastPage - 1) {
      pages.push("...")
    }

    if (lastPage > 1) {
      pages.push(lastPage)
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div tw="flex items-center justify-center gap-1 mt-8 mb-16">
      {/* Previous */}
      <button
        css={[
          buttonBase,
          tw`text-neutral70 hover:text-neutralBlack disabled:opacity-30 disabled:cursor-not-allowed`,
        ]}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}>
        &lt;
      </button>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} css={[buttonBase, tw`text-neutral50 cursor-default`]}>
              ...
            </span>
          )
        }

        const isActive = page === currentPage
        return (
          <button
            key={page}
            css={[
              buttonBase,
              isActive
                ? css`
                    color: #ffffff;
                    background-color: #da7f67;
                    font-weight: 600;
                  `
                : tw`text-neutral70 hover:text-neutralBlack hover:bg-neutral30`,
            ]}
            onClick={() => onPageChange(page)}>
            {page}
          </button>
        )
      })}

      {/* Next */}
      <button
        css={[
          buttonBase,
          tw`text-neutral70 hover:text-neutralBlack disabled:opacity-30 disabled:cursor-not-allowed`,
        ]}
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}>
        &gt;
      </button>
    </div>
  )
}

export default BlogPagination
