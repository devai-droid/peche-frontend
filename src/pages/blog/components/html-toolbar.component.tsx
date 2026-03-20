import React from "react"
import tw, { css } from "twin.macro"

interface ToolbarItem {
  label: string
  title: string
  before: string
  after: string
  placeholder: string
}

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { label: "H2", title: "대제목 (H2)", before: "<h2>", after: "</h2>", placeholder: "제목" },
  { label: "H3", title: "소제목 (H3)", before: "<h3>", after: "</h3>", placeholder: "소제목" },
  { label: "P", title: "단락", before: "<p>", after: "</p>", placeholder: "내용" },
  {
    label: "B",
    title: "굵게 (Strong)",
    before: "<strong>",
    after: "</strong>",
    placeholder: "강조텍스트",
  },
  { label: "Link", title: "링크", before: '<a href="URL">', after: "</a>", placeholder: "링크텍스트" },
  {
    label: "UL",
    title: "순서없는 목록",
    before: "<ul>\n  <li>",
    after: "</li>\n  <li>항목2</li>\n</ul>",
    placeholder: "항목1",
  },
  {
    label: "OL",
    title: "순서있는 목록",
    before: "<ol>\n  <li>",
    after: "</li>\n  <li>항목2</li>\n</ol>",
    placeholder: "항목1",
  },
  {
    label: "FAQ",
    title: "FAQ 스키마 삽입",
    before: '<div class="schema-faq-question">\n  <strong>Q. ',
    after: '</strong>\n  <div class="schema-faq-answer">답변을 입력하세요</div>\n</div>',
    placeholder: "질문을 입력하세요",
  },
]

// Divider after these indices (0-based)
const DIVIDERS_AFTER = new Set([1, 4, 6])

interface HtmlToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onChange: (value: string) => void
}

const HtmlToolbar = ({ textareaRef, onChange }: HtmlToolbarProps) => {
  const handleInsert = (item: ToolbarItem) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = textarea.value
    const selected = value.substring(start, end)

    const content = selected || item.placeholder
    const insertion = item.before + content + item.after
    const newValue = value.substring(0, start) + insertion + value.substring(end)

    onChange(newValue)

    requestAnimationFrame(() => {
      textarea.focus()
      if (selected) {
        const pos = start + insertion.length
        textarea.setSelectionRange(pos, pos)
      } else {
        // Select placeholder so user can type immediately to replace it
        const selStart = start + item.before.length
        const selEnd = selStart + item.placeholder.length
        textarea.setSelectionRange(selStart, selEnd)
      }
    })
  }

  return (
    <div
      tw="flex flex-wrap items-center gap-[2px] p-1 border border-neutral30 bg-[#fafafa]"
      css={[{ borderBottom: "none" }]}>
      {TOOLBAR_ITEMS.map((item, idx) => (
        <React.Fragment key={item.label}>
          <button
            type="button"
            title={item.title}
            onMouseDown={(e) => {
              // Prevent textarea losing focus/selection on button click
              e.preventDefault()
              handleInsert(item)
            }}
            tw="px-2 py-[3px] text-[12px] font-medium border transition-colors duration-150"
            css={[
              item.label === "FAQ"
                ? css`
                    color: #da7f67;
                    border-color: #da7f67;
                    background: transparent;
                    &:hover {
                      background: #da7f67;
                      color: #fff;
                    }
                  `
                : css`
                    color: #555;
                    border-color: transparent;
                    background: transparent;
                    &:hover {
                      background: #da7f67;
                      color: #fff;
                      border-color: #da7f67;
                    }
                  `,
            ]}>
            {item.label}
          </button>
          {DIVIDERS_AFTER.has(idx) && <span tw="w-px self-stretch bg-neutral30 mx-1" />}
        </React.Fragment>
      ))}
    </div>
  )
}

export default HtmlToolbar
