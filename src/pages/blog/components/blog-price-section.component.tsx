import React, { useState } from "react"
import tw, { css } from "twin.macro"
import { useTranslation } from "react-i18next"
import useLanguageValue from "@/lib/hooks/use-language-key"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import { useEventControllerFindMany } from "@/lib/orval/events/events"
import CustomLink from "@/lib/components/custom-link.component"

const keyMatch = { ko: "", en: "EN", ja: "JA", th: "TH", zh: "ZH", "zh-TW": "ZHTW" } as const

export interface PriceDetailPageRef {
  id: string
  name: string
}

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
    <div css={[tw`flex flex-col gap-[6px] py-[11px] border-b border-neutral30`, faded && peekCss]}>
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

/** 상세페이지 1개의 가격 블록 — 가격이벤트(게시중)·전체 시술 반반 탭. 3개 초과 시 2개+페이드+더보기 */
const PriceGroup = ({ detailPageId }: { detailPageId: string }) => {
  const { t, i18n } = useTranslation()
  const tv = useLanguageValue()
  const langQuery = useLanguageQuery()
  const suffix = keyMatch[i18n.language as keyof typeof keyMatch] ?? ""

  const { data: products } = useProductControllerFindMany(
    { detailPageId, sortBy: [`order${suffix}`], sortOrder: ["ASC"], page: 1, limit: 500, ...langQuery },
    { query: { enabled: !!detailPageId } },
  )
  const { data: events } = useEventControllerFindMany(
    { detailPageId, sortBy: ["order"], sortOrder: ["ASC"], page: 1, limit: 500, ...langQuery },
    { query: { enabled: !!detailPageId } },
  )

  const won = t("reservePage.won")
  const money = (n: number) => `${n.toLocaleString()} ${won}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventRows: Row[] = (events?.items ?? []).map((e: any) => ({
    name: tv(e, "name"),
    price: money(e.discountPrice || e.price),
    original: e.discountPrice ? money(e.price) : undefined,
    category: e.category ? tv(e.category, "name") : undefined,
  }))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productRows: Row[] = (products?.items ?? []).map((p: any) => ({
    name: tv(p, "name"),
    price: money(p.discountPrice || p.price),
    original: p.discountPrice ? money(p.price) : undefined,
  }))

  const hasEvent = eventRows.length > 0
  const hasProduct = productRows.length > 0
  const [tab, setTab] = useState<"event" | "product">("event")

  if (!hasEvent && !hasProduct) return null
  const activeTab = hasEvent && hasProduct ? tab : hasEvent ? "event" : "product"
  const list = activeTab === "event" ? eventRows : productRows
  const showFade = list.length > 2
  const shown = showFade ? list.slice(0, 3) : list

  return (
    <div>
      {hasEvent && hasProduct && (
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
              {k === "event" ? "가격·이벤트" : "전체 시술"}
            </button>
          ))}
        </div>
      )}
      <div>
        {shown.map((row, i) => (
          <PriceCard key={i} row={row} faded={showFade && i === 2} />
        ))}
      </div>
      {showFade && (
        <CustomLink
          to={`/products/${detailPageId}`}
          tw="flex items-center justify-center gap-1 mt-3 py-1 bg-white border border-primary text-primary text-[13px] font-medium">
          가격 더보기 →
        </CustomLink>
      )}
    </div>
  )
}

/**
 * 블로그 가격 섹션 — 상세페이지가 여러 개면 상위 탭(상세페이지)으로 전환, 1개면 바로 표시.
 * 각 상세페이지 안은 가격이벤트/전체 시술 반반 탭.
 */
const LINE = "#e5ded9"

const BlogPriceSection = ({ detailPages }: { detailPages: PriceDetailPageRef[] }) => {
  const [activeDp, setActiveDp] = useState(0)
  if (!detailPages.length) return null
  const current = Math.min(activeDp, detailPages.length - 1)

  return (
    <div tw="mt-6">
      {/* '가격 보기' 제목 — 목차와 동일 스타일(코랄 밑줄) */}
      <div
        tw="text-[16px] font-semibold text-neutralBlack pb-2 mb-5 lg:mb-3"
        css={[{ borderBottom: "1px solid #DA7F67" }]}>
        가격 보기
      </div>
      {/* 폴더 탭(상세페이지) — 열린 탭 흰 배경, 나머지는 선으로만 구분, 박스와 연결 */}
      <div tw="flex relative z-[1]">
        {detailPages.map((dp, i) => (
          <button
            key={dp.id}
            type="button"
            onClick={() => setActiveDp(i)}
            css={[
              tw`whitespace-nowrap text-[15px] font-bold px-4 py-1`,
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
            {dp.name}
          </button>
        ))}
      </div>
      {/* 가격 박스 — 흰 배경 + 얇은 선, 열린 탭과 연결 */}
      <div
        css={[
          tw`px-3.5 pt-6 pb-3.5 lg:pt-3.5`,
          css`
            background: #fff;
            border: 1px solid ${LINE};
            border-radius: 0;
          `,
        ]}>
        {detailPages.map((dp, i) => (
          <div key={dp.id} css={[current !== i && tw`hidden`]}>
            <PriceGroup detailPageId={dp.id} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogPriceSection
