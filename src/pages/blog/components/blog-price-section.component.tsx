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
  description?: string
  price: string
  original?: string
  category?: string
  labels?: Labels
}

// 3번째(초과) 카드 페이드 — 세로 레이아웃이라 제목 높이에서 잘라 흰여백 없이 페이드
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

const chipTw = tw`h-[24px] px-2 text-[13px] leading-[1] flex items-center`

/** 가격 카드 — 사이트 상품카드 스타일(칩·코랄 대분류·설명·정가/할인가). 항상 세로 */
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
      <div tw="text-[16px] font-semibold leading-[1.4]">
        {row.category && <span css={[{ color: "#DA7F67" }]}>{row.category} </span>}
        <span tw="text-neutralBlack">{row.name}</span>
      </div>
      <div tw="flex items-baseline gap-2 whitespace-nowrap">
        {row.original && <span tw="text-[13px] text-neutral50 line-through">{row.original}</span>}
        <span tw="text-[16px] font-semibold" css={[{ color: "#AB6655" }]}>
          {row.price}
        </span>
      </div>
    </div>
  )
}

/** 상세페이지 1개의 가격 블록 — 가격이벤트(게시중)·전체 시술 2탭. 3개 초과 시 2개+3번째 페이드+더보기 */
const PriceGroup = ({ detailPageId, detailPageName }: { detailPageId: string; detailPageName: string }) => {
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
    description: tv(e, "description") || undefined,
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
    description: tv(p, "description") || undefined,
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
    <section tw="mb-[52px] last:mb-0">
      <h2 tw="text-[21px] font-bold text-neutralBlack mb-3">{detailPageName} 가격</h2>
      {hasEvent && hasProduct && (
        <div tw="flex mb-3 rounded-sm overflow-hidden border border-neutral30">
          {(["event", "product"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              css={[
                tw`flex-1 py-[7px] text-[13px] font-medium transition [&:not(:last-child)]:border-r border-neutral30`,
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
          tw="flex items-center justify-center gap-1 mt-1.5 py-[11px] border border-neutral30 rounded-sm text-[14px] font-semibold"
          css={[{ color: "#AB6655" }]}>
          가격 더보기 →
        </CustomLink>
      )}
    </section>
  )
}

/** 블로그 글 가격 섹션 — product_page 상세페이지들을 상세페이지별로 구분해 노출(섞지 않음) */
const BlogPriceSection = ({ detailPages }: { detailPages: PriceDetailPageRef[] }) => {
  if (!detailPages.length) return null
  return (
    <div tw="pt-5 mt-5 border-t border-neutral30">
      {detailPages.map((dp) => (
        <PriceGroup key={dp.id} detailPageId={dp.id} detailPageName={dp.name} />
      ))}
    </div>
  )
}

export default BlogPriceSection
