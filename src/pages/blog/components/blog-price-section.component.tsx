import React, { useState } from "react"
import tw, { css } from "twin.macro"
import { useTranslation } from "react-i18next"
import useLanguageValue from "@/lib/hooks/use-language-key"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import { useEventControllerFindMany } from "@/lib/orval/events/events"
import { Chip } from "@/design-system/components"
import CustomLink from "@/lib/components/custom-link.component"

const keyMatch = { ko: "", en: "EN", ja: "JA", th: "TH", zh: "ZH", "zh-TW": "ZHTW" } as const

export interface PriceDetailPageRef {
  id: string
  name: string
}

interface Labels {
  pop?: boolean
  isNew?: boolean
  kakao?: boolean
  best?: boolean
}
interface Row {
  name: string
  price: string
  original?: string
  category?: string
  labels?: Labels
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

const chipTw = tw`h-[24px] px-2 text-[14px] leading-[1] flex items-center`

/** 가격 카드 — 칩·코랄 대분류·정가 취소선+할인가 (사이트 상품카드 스타일) */
const PriceCard = ({ row, faded }: { row: Row; faded?: boolean }) => {
  const { t } = useTranslation()
  const l = row.labels
  const hasChip = l && (l.pop || l.isNew || l.kakao || l.best)
  return (
    <div css={[tw`flex flex-col gap-2 py-4 border-b border-neutral30`, faded && peekCss]}>
      {hasChip && (
        <div tw="flex gap-1">
          {l?.pop && (
            <Chip color="primary" css={[chipTw]}>
              {t("common.pop")}
            </Chip>
          )}
          {l?.isNew && (
            <Chip color="gray" css={[chipTw]}>
              {t("common.new")}
            </Chip>
          )}
          {l?.kakao && (
            <Chip color="pink" css={[chipTw]}>
              {t("common.kakaoFriend")}
            </Chip>
          )}
          {l?.best && (
            <Chip color="darkgray" css={[chipTw]}>
              {t("common.best")}
            </Chip>
          )}
        </div>
      )}
      <div tw="text-[17px] font-semibold leading-[1.4]">
        {row.category && <span css={[{ color: "#DA7F67" }]}>{row.category} </span>}
        <span tw="text-neutralBlack">{row.name}</span>
      </div>
      <div tw="flex items-baseline gap-2 whitespace-nowrap">
        {row.original && <span tw="text-[14px] text-neutral50 line-through">{row.original}</span>}
        <span tw="text-[17px] font-semibold" css={[{ color: "#AB6655" }]}>
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
    labels: {
      pop: e.label?.includes("POP"),
      isNew: e.label?.includes("NEW"),
      kakao: e.label?.includes("KAKAO"),
      best: e.label?.includes("BEST"),
    },
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
        <div tw="flex mb-3 rounded-sm overflow-hidden border border-neutral30">
          {(["event", "product"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              css={[
                tw`flex-1 py-[4px] text-[14px] font-medium transition [&:not(:last-child)]:border-r border-neutral30`,
                activeTab === k ? tw`bg-primary text-white` : tw`bg-white text-neutral70`,
              ]}>
              {k === "event" ? "가격이벤트" : "전체 시술"}
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
          tw="flex items-center justify-center gap-1 mt-3 py-[7px] bg-white border border-primary text-primary text-[15px] font-medium">
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
const BlogPriceSection = ({ detailPages }: { detailPages: PriceDetailPageRef[] }) => {
  const [activeDp, setActiveDp] = useState(0)
  if (!detailPages.length) return null
  const current = Math.min(activeDp, detailPages.length - 1)

  return (
    <div tw="pt-5 mt-5 border-t border-neutral30">
      {/* 상세페이지 탭 — 1개여도 동일하게 노출(제목 겸용). 회색선·스크롤 없음, active만 밑줄 */}
      <div tw="flex flex-wrap gap-x-3 gap-y-1 mb-3">
        {detailPages.map((dp, i) => (
          <button
            key={dp.id}
            type="button"
            onClick={() => setActiveDp(i)}
            css={[
              tw`flex-none whitespace-nowrap pt-1 pb-[6px] text-[16px] font-bold border-b-2 transition`,
              current === i
                ? css`
                    color: #da7f67;
                    border-bottom-color: #da7f67;
                  `
                : css`
                    color: #9b9b9b;
                    border-bottom-color: transparent;
                  `,
            ]}>
            {dp.name}
          </button>
        ))}
      </div>
      {detailPages.map((dp, i) => (
        <div key={dp.id} css={[current !== i && tw`hidden`]}>
          <PriceGroup detailPageId={dp.id} />
        </div>
      ))}
    </div>
  )
}

export default BlogPriceSection
