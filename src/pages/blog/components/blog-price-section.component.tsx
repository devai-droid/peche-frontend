import React, { useRef, useState } from "react"
import tw, { css } from "twin.macro"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import CustomLink from "@/lib/components/custom-link.component"
import { blogV2PublicApi, BlogPriceGroup, BlogPriceRow } from "../blog-v2.api"

interface Row {
  name: string
  price: string
  original?: string
  category?: string
}

// 3번째(초과) 카드 페이드 — 세로 레이아웃, 제목 높이에서 잘라 흰여백 없이 페이드
const peekCss = css`
  position: relative;
  border-bottom: 0;
  max-height: 64px;
  overflow: hidden;
  padding-bottom: 0;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60%;
    pointer-events: none;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff);
  }
`

/** 가격 카드 — 상품명 + 가격(정가 취소선+할인가)만 */
const PriceCard = ({ row, faded }: { row: Row; faded?: boolean }) => {
  return (
    <div css={[tw`flex flex-col gap-[6px] py-[11px] border-b border-neutral30 last:border-b-0`, faded && peekCss]}>
      <div tw="text-[15px] font-semibold leading-[1.4]">
        {row.category && <span css={[{ color: "#DA7F67" }]}>{row.category} </span>}
        <span tw="text-neutralBlack">{row.name}</span>
      </div>
      <div tw="flex items-baseline gap-2 whitespace-nowrap">
        {row.original && <span tw="text-[12px] text-neutral50 line-through">{row.original}</span>}
        <span tw="text-[15px] font-semibold" css={[{ color: "#AB6655" }]}>
          {row.price}
        </span>
      </div>
    </div>
  )
}

/**
 * 가격 묶음(탭 1개) 렌더 — 데이터는 백엔드(봇 SSR과 동일 계산)에서 이미 산출됨.
 * page=상품+이벤트 내부 탭, category/event=단일 리스트(이벤트 우선). 3개 초과 시 2개+페이드+더보기.
 */
const PriceGroupView = ({ group }: { group: BlogPriceGroup }) => {
  const { t } = useTranslation()
  const won = t("reservePage.won")
  const money = (n: number) => `${n.toLocaleString()} ${won}`
  const toRow = (r: BlogPriceRow): Row => ({
    name: r.name,
    price: money(r.discountPrice || r.price),
    original: r.discountPrice ? money(r.price) : undefined,
    category: r.categoryName ?? undefined,
  })
  const eventRows = group.events.map(toRow)
  const productRows = group.products.map(toRow)

  const hasEvent = eventRows.length > 0
  const hasProduct = productRows.length > 0
  const [tab, setTab] = useState<"event" | "product">("event")

  if (!hasEvent && !hasProduct) return null
  // 내부 탭은 page 모드에서 상품·이벤트 둘 다 있을 때만. category/event는 단일 리스트(이벤트 우선).
  const showInnerTab = group.linkType === "page" && hasEvent && hasProduct
  const activeTab: "event" | "product" = showInnerTab ? tab : hasEvent ? "event" : "product"
  const list = activeTab === "event" ? eventRows : productRows
  const showFade = list.length > 2
  const shown = showFade ? list.slice(0, 3) : list

  // 더보기: page=상세페이지, category=상품 대분류, event=이벤트 대분류
  const moreTo =
    group.linkType === "event"
      ? `/events?category=${group.linkId}`
      : group.linkType === "category"
        ? `/products?category=${group.linkId}`
        : `/products/${group.linkId}`

  return (
    <div>
      {showInnerTab && (
        <div tw="flex mb-2 rounded-sm overflow-hidden border border-neutral30">
          {(["event", "product"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              css={[
                tw`flex-1 py-[2px] text-[12px] font-medium transition [&:not(:last-child)]:border-r border-neutral30`,
                activeTab === k ? tw`bg-primary text-white` : tw`bg-white text-neutral70`,
              ]}>
              {k === "event" ? t("blog.priceEvent") : t("blog.allTreatments")}
            </button>
          ))}
        </div>
      )}
      <div>
        {shown.map((row, i) => (
          <PriceCard key={i} row={row} faded={showFade && i === 2} />
        ))}
      </div>
      {list.length > 0 && (
        <CustomLink
          to={moreTo}
          tw="flex items-center justify-center gap-1 mt-3 py-1 bg-white border border-primary text-primary text-[13px] font-medium">
          {t("blog.priceMore")} →
        </CustomLink>
      )}
    </div>
  )
}

/**
 * 블로그 가격 섹션 — price_refs가 여러 개면 상위 탭(폴더 탭)으로 전환, 1개면 바로 표시.
 * 데이터는 백엔드 public/prices 엔드포인트(봇 SSR과 동일 계산)에서 가져옴.
 */
const LINE = "#e5ded9"

const BlogPriceSection = ({ postId, lang }: { postId: string; lang: string }) => {
  const { t } = useTranslation()
  const [activeDp, setActiveDp] = useState(0)
  const tabScrollRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 })
  // PC는 마우스 휠이 세로라 가로 스크롤이 안 됨 → 탭이 넘칠 때 세로 휠을 가로 스크롤로 변환(모바일은 터치로 그대로).
  const onTabWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = tabScrollRef.current
    if (!el || el.scrollWidth <= el.clientWidth) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      el.scrollLeft += e.deltaY
      e.preventDefault()
    }
  }
  // PC 클릭 드래그로도 가로 스크롤. 5px 이상 움직이면 드래그로 보고 탭 클릭(선택)은 무시한다.
  const onTabDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tabScrollRef.current
    if (!el) return
    drag.current = { down: true, moved: false, startX: e.pageX, startLeft: el.scrollLeft }
  }
  const onTabMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.current.down) return
    const el = tabScrollRef.current
    if (!el) return
    const dx = e.pageX - drag.current.startX
    if (Math.abs(dx) > 5) drag.current.moved = true
    el.scrollLeft = drag.current.startLeft - dx
  }
  const onTabUp = () => {
    drag.current.down = false
  }
  const { data } = useQuery({
    queryKey: ["blog-v2-prices", postId, lang],
    queryFn: () => blogV2PublicApi.prices(postId, lang),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  })
  const groups = data ?? []
  if (!groups.length) return null
  const current = Math.min(activeDp, groups.length - 1)

  return (
    <div tw="mt-6">
      {/* '가격 보기' 제목 — 목차와 동일 스타일(코랄 밑줄) */}
      <div
        tw="text-[16px] font-semibold text-neutralBlack pb-2 mb-3"
        css={[{ borderBottom: "1px solid #DA7F67" }]}>
        {t("blog.priceView")}
      </div>
      {/* 폴더 탭 — 열린 탭 흰 배경, 나머지는 선으로만 구분, 박스와 연결. 탭이 화면을 넘치면 가로 스크롤 */}
      <div
        ref={tabScrollRef}
        onWheel={onTabWheel}
        onMouseDown={onTabDown}
        onMouseMove={onTabMove}
        onMouseUp={onTabUp}
        onMouseLeave={onTabUp}
        tw="flex relative z-[1] overflow-x-auto"
        css={css`
          scrollbar-width: none;
          cursor: grab;
          user-select: none;
          &:active {
            cursor: grabbing;
          }
          &::-webkit-scrollbar {
            display: none;
          }
        `}>
        {groups.map((g, i) => (
          <button
            key={g.linkId + i}
            type="button"
            onClick={() => {
              if (drag.current.moved) return // 드래그(스크롤)였으면 탭 선택하지 않음
              setActiveDp(i)
            }}
            css={[
              tw`whitespace-nowrap text-[15px] font-bold px-2 pt-3 pb-2 lg:pt-1 lg:pb-1`,
              // 각 탭은 내용 폭으로 두되 최대 약 6자까지만 — 그보다 길면 그 탭만 말줄임(…). 축소하지 않아 탭이 많으면 컨테이너가 가로 스크롤.
              css`
                flex: 0 0 auto;
                max-width: 6em;
                overflow: hidden;
                text-overflow: ellipsis;
              `,
              // 모든 탭 하단을 박스 상단선과 겹쳐 단일 선으로. 탭끼리는 세로선 겹쳐 간격 0
              css`
                border: 1px solid ${LINE};
                border-radius: 0;
                margin-bottom: -1px;
              `,
              i > 0 &&
                css`
                  margin-left: -1px;
                `,
              // 선택 탭은 색으로만 강조(흰 배경 + 코랄 글자). 폭은 위에서 내용 기준으로 통일.
              current === i
                ? css`
                    background: #fff;
                    color: #da7f67;
                    border-bottom-color: #fff;
                    position: relative;
                    z-index: 1;
                  `
                : css`
                    background: #f2f2f2;
                    color: #9b9b9b;
                  `,
            ]}>
            {g.detailPageName}
          </button>
        ))}
      </div>
      {/* 가격 박스 — 흰 배경 + 얇은 선, 열린 탭과 연결 */}
      <div
        css={[
          tw`px-3.5 pt-4 pb-5 lg:pt-2.5 lg:pb-3.5`,
          css`
            background: #fff;
            border: 1px solid ${LINE};
            border-radius: 0;
          `,
        ]}>
        {groups.map((g, i) => (
          <div key={g.linkId + i} css={[current !== i && tw`hidden`]}>
            <PriceGroupView group={g} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogPriceSection
