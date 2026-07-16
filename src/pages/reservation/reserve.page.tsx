/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-alert */
// reserve.page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"
import { CalendarSimpleIcon, PlusPrimaryIcon } from "@/assets/icon"
import { Button, Calendar, Checkbox, Icon, LinkButton } from "@/design-system/components"
import Auth from "@/features/auth/components/auth.component"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"

import tw from "twin.macro"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import useCart, { CartItem } from "@/features/product/hooks/use-cart"
import useLanguageValue from "@/lib/hooks/use-language-key"
import useLanguageQuery from "@/lib/hooks/use-language-query"
import { useEventControllerFindMany } from "@/lib/orval/events/events"
import { useProductControllerFindMany } from "@/lib/orval/products/products"
import { AvailableReservationResultDto, Event, Product } from "@/lib/orval/model"
import {
  buildProductByName,
  getChangedCartItemIds,
  getInvalidCartItemIds,
  isEventExpired,
} from "@/features/product/utils/cart-validation.util"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import {
  reservationControllerGetAvailableReservationByDayPublic,
  useReservationControllerCreate,
} from "@/lib/orval/reservations/reservations"
import {
  DEFAULT_CONSULTATION_PRODUCT_ID,
  DEFAULT_PACKAGE_USE_PRODUCT_ID,
} from "@/lib/constants/reservation.constants"
import { env } from "@/lib/env"
import { Language } from "@/lib/locales/i18n.config"
import { useTranslation } from "react-i18next"
import { userControllerUpdateMine } from "@/lib/orval/users/users"
import { useMe } from "@/features/user/hooks/use-user"
import Modal from "@/lib/components/modal/modal.component"

/* ---------------- Small UI ---------------- */
const H1 = tw.h1`text-xl font-bold`
const H2 = tw.h2`text-lg font-extrabold`

const TimeButton = ({ selected, children, ...props }: { selected?: boolean } & any) => {
  return (
    <Button
      tw="shrink-0 sm:h-[58px] h-[40px] text-[15px] md:text-[17px]"
      {...props}
      style={{
        size: "sm",
        color: selected ? "point" : "gray",
        variant: selected ? "filled" : "outlined",
        bold: !!selected,
      }}>
      {children}
    </Button>
  )
}

interface SurgeryItemProps {
  item: CartItem
  updateCartItem: (item: CartItem) => void
  checked: boolean
  onCheck: (checked: boolean) => void
}

const SurgeryItem = ({ item, updateCartItem, checked, onCheck }: SurgeryItemProps) => {
  const tv = useLanguageValue()
  const { i18n } = useTranslation()
  const language = i18n.language as Language

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const name = tv(item.product ?? item.event!, "name")
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const description = tv(item.product ?? item.event!, "description")
  const discount = item.event?.discountPrice ?? item.product?.discountPrice
  const price = item.event?.price || item.product?.price

  const formatDate = (value: string) => {
    const d = new Date(value)
    const m = `${d.getMonth() + 1}`.padStart(2, "0")
    const day = `${d.getDate()}`.padStart(2, "0")
    if (language === "ko") return `${m}월 ${day}일`
    return `${m}/${day}`
  }

  return (
    <div tw="py-2 font-pretendard tracking-tight leading-[150%] last-of-type:([&>hr]:hidden)">
      <div tw="flex gap-3 -ml-3">
        {/* 체크박스 */}
        <Checkbox checked={checked} onChange={(e) => onCheck(e.target.checked)} />

        <div tw="flex-1 flex flex-col gap-2">
          {/* 이름 */}
          <div tw="font-semibold text-[14px] md:text-[16px] leading-snug">
            {(item.event as any)?.bundle?.name && item.event?.category && (
              <span tw="text-[#DA7F67]">{tv(item.event.category, "name")} </span>
            )}
            <span>{name}</span>
          </div>

          {/* 기간 서브텍스트 제거 */}

          {/* 설명 */}
          {description && (
            <div tw="text-neutral70 text-[13px] leading-snug whitespace-pre-wrap">
              {description}
            </div>
          )}

          {/* 가격 + 수량 */}
          <div tw="flex justify-between items-start mt-1 flex-col gap-2 sm:flex-row sm:items-center">
            {/* 가격 */}
            <div tw="flex items-center gap-2">
              {discount && (
                <span tw="text-neutral50 line-through text-[13px]">
                  {price?.toLocaleString()}원
                </span>
              )}
              <span tw="text-[16px] font-bold text-neutralBlack">
                {(discount || price || 0).toLocaleString()}원
              </span>
            </div>

            {/* 수량 버튼 → 카트와 동일한 UI */}
            <div tw="flex items-center gap-2 shrink-0">
              <button
                tw="w-6 h-6 flex justify-center items-center text-neutral50 bg-neutral"
                disabled={item.count === 1}
                onClick={() => updateCartItem({ ...item, count: item.count - 1 })}>
                -
              </button>

              <span tw="w-4 text-center text-[13px] md:text-[15px]">{item.count}</span>

              <button
                tw="w-6 h-6 flex justify-center items-center text-neutral50 bg-neutral"
                onClick={() => updateCartItem({ ...item, count: item.count + 1 })}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr tw="my-5" />
    </div>
  )
}

interface SurgeryListProps {
  cart: CartItem[]
  updateCartItem: (item: CartItem) => void
  inquiry: boolean
  setInquiry: (value: boolean) => void
  inquiryMemo: string
  setInquiryMemo: (value: string) => void
  removeFromCart: (ids: string[]) => void
  consultCategories: string[]
  setConsultCategories: (v: string[]) => void
  usePackageChecked: boolean
  setUsePackageChecked: (v: boolean) => void
  packageCategories: string[]
  setPackageCategories: (v: string[]) => void
  packageMemo: string
  setPackageMemo: (v: string) => void
}

const CONSULT_CATEGORIES = [
  { key: "윤곽/탄력", labelKey: "reservePage.categoryContour" },
  { key: "색소", labelKey: "reservePage.categoryPigment" },
  { key: "모공/흉터", labelKey: "reservePage.categoryPores" },
  { key: "제모", labelKey: "reservePage.categoryHairRemoval" },
  { key: "기타", labelKey: "reservePage.categoryOther" },
]
const PACKAGE_CATEGORIES = [
  { key: "제모", labelKey: "reservePage.categoryHairRemoval" },
  { key: "토닝", labelKey: "reservePage.packageToning" },
  { key: "여드름/모공", labelKey: "reservePage.packageAcne" },
  { key: "스킨부스터", labelKey: "reservePage.packageSkinBooster" },
  { key: "기타", labelKey: "reservePage.categoryOther" },
]

const SurgeryList = ({
  cart,
  updateCartItem,
  inquiry,
  setInquiry,
  inquiryMemo,
  setInquiryMemo,
  removeFromCart,
  consultCategories,
  setConsultCategories,
  usePackageChecked,
  setUsePackageChecked,
  packageCategories,
  setPackageCategories,
  packageMemo,
  setPackageMemo,
}: SurgeryListProps) => {
  const { checkedList, setCheckedList, resetCart, hasHydrated } = useCart()
  const { t } = useTranslation()

  // cart와 동일한 모달 상태 추가
  const [inquiryChecked, setInquiryChecked] = React.useState(inquiry)
  const [showInquiryModal, setShowInquiryModal] = React.useState(false)

  // React.useEffect(() => {
  //   if (cart.length > 0 && inquiryChecked) {
  //     setInquiryChecked(false)
  //   }
  // }, [cart])
  React.useEffect(() => {
    // hydrate 중에는 실행하지 않음
    if (!hasHydrated.current) return

    if (cart.length > 0 && inquiryChecked) {
      setInquiryChecked(false)
    }
  }, [cart, inquiryChecked])

  React.useEffect(() => {
    setInquiryChecked(inquiry)
  }, [inquiry])

  const [showDuplicateModal, setShowDuplicateModal] = React.useState(false)
  const [showPackageCartModal, setShowPackageCartModal] = React.useState(false)

  // cart 페이지와 동일한 체크 로직
  const handleInquiryCheckbox = (checked: boolean) => {
    if (checked && usePackageChecked) {
      setShowDuplicateModal(true)
      return
    }
    if (checked && cart.length > 0) {
      // 장바구니에 시술이 있는데 방문 상담을 켜려는 경우 → 모달 띄움
      setShowInquiryModal(true)
      return
    }

    setInquiryChecked(checked)
    setInquiry(checked)
  }

  const handlePackageCheckbox = (checked: boolean) => {
    if (checked && inquiryChecked) {
      setShowDuplicateModal(true)
      return
    }
    if (checked && cart.length > 0) {
      setShowPackageCartModal(true)
      return
    }
    setUsePackageChecked(checked)
  }

  return (
    <>
      <div tw="flex items-center justify-between mb-3 -ml-3 font-pretendard tracking-tight leading-[150%]">
        <Checkbox
          checked={checkedList.length === cart.length}
          onChange={(e) => {
            if (e.target.checked) {
              setCheckedList(cart.map((item) => item.event?.id || item.product?.id || ""))
            } else {
              setCheckedList([])
            }
          }}
          label={
            <div tw="flex items-center gap-2">
              <H2>{t("button.selectAll")}</H2>
              <span tw="text-primary font-semibold text-[18px] lg:text-[22px]">
                ({checkedList.length}/{cart.length})
              </span>
            </div>
          }
        />
        <Button
          style={{ size: "sm", variant: "outlined" }}
          onClick={() => {
            removeFromCart(checkedList)
            setCheckedList([])
            setInquiryChecked(false)
            setInquiry(false)
            setInquiryMemo("")
            setUsePackageChecked(false)
          }}>
          {t("button.deleteSelection")}
        </Button>
      </div>

      <hr tw="mt-3 mb-5" />

      {inquiryChecked && cart.length === 0 && (
        <div tw="mt-4 px-1 flex-none">
          {/* 체크박스 + 이름 */}
          <div tw="flex items-center text-[14px] font-semibold mb-2">
            <Checkbox
              checked={inquiryChecked}
              onChange={(e) => handleInquiryCheckbox(e.target.checked)}
              label={t("cart.visitThenSelect")}
            />
          </div>

          {/* 가격 (0원) */}
          <div tw="flex items-center gap-2 mb-4 ml-10">
            <span tw="text-neutral50 line-through text-[13px]">{t("cart.freePrice")}</span>
            <span tw="text-[16px] font-bold text-neutralBlack">{t("cart.freePrice")}</span>
          </div>

          {/* 관심 분야 (최소 1개) */}
          <div tw="text-primary text-[13px] md:text-[14px] font-semibold mb-2 pl-10">
            {t("reservePage.consultCategoriesTitle")}
          </div>
          <div tw="flex flex-wrap gap-2 mx-10 mb-4">
            {CONSULT_CATEGORIES.map((cat) => {
              const checked = consultCategories.includes(cat.key)
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    if (checked) {
                      setConsultCategories(consultCategories.filter((c) => c !== cat.key))
                    } else {
                      setConsultCategories([...consultCategories, cat.key])
                    }
                  }}
                  css={[
                    tw`px-4 py-2 text-[13px] border rounded-sm`,
                    checked
                      ? tw`bg-primary text-white border-primary`
                      : tw`bg-white text-neutral70 border-neutral20`,
                  ]}>
                  {t(cat.labelKey)}
                </button>
              )
            })}
          </div>

          {/* 상담 내용 (필수) + 글자수 카운터 — textarea와 같은 width */}
          <div tw="mx-10 w-[85%] md:w-[92%]">
            <div tw="flex justify-between items-center mb-2">
              <div tw="text-primary text-[13px] md:text-[14px] font-semibold">
                {t("reservePage.consultDetailRequired")}
              </div>
              <div tw="text-neutral50 text-[12px]">{inquiryMemo.length}/200</div>
            </div>
            <textarea
              tw="w-full p-3 border border-neutral20 rounded-[1px] text-[16px] md:text-[14px] h-32"
              placeholder={t("reservePage.consultMemoPlaceholder")}
              value={inquiryMemo}
              maxLength={200}
              onChange={(e) => setInquiryMemo(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 기존 시술 보유권 사용 - 체크됐을 때만 노출 */}
      {usePackageChecked && cart.length === 0 && (
        <div tw="mt-4 px-1 flex-none">
          <div tw="flex items-center text-[14px] font-semibold mb-2">
            <Checkbox
              checked={usePackageChecked}
              onChange={(e) => handlePackageCheckbox(e.target.checked)}
              label={t("reservePage.usePackage")}
            />
          </div>

          {/* 가격 (0원) */}
          <div tw="flex items-center gap-2 mb-4 ml-10">
            <span tw="text-neutral50 line-through text-[13px]">{t("cart.freePrice")}</span>
            <span tw="text-[16px] font-bold text-neutralBlack">{t("cart.freePrice")}</span>
          </div>

          <div tw="text-primary text-[13px] md:text-[14px] font-semibold mb-2 pl-10">
            {t("reservePage.packageCategoriesTitle")}
          </div>
          <div tw="flex flex-wrap gap-2 mx-10 mb-4">
            {PACKAGE_CATEGORIES.map((cat) => {
              const checked = packageCategories.includes(cat.key)
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => {
                    if (checked) {
                      setPackageCategories(packageCategories.filter((c) => c !== cat.key))
                    } else {
                      setPackageCategories([...packageCategories, cat.key])
                    }
                  }}
                  css={[
                    tw`px-4 py-2 text-[13px] border rounded-sm`,
                    checked
                      ? tw`bg-primary text-white border-primary`
                      : tw`bg-white text-neutral70 border-neutral20`,
                  ]}>
                  {t(cat.labelKey)}
                </button>
              )
            })}
          </div>

          {packageCategories.includes("기타") && (
            <>
              <div tw="mx-10 w-[85%] md:w-[92%] mb-4">
                <div tw="flex justify-between items-center mb-2">
                  <div tw="text-primary text-[13px] md:text-[14px] font-semibold">
                    {t("reservePage.packageMemoRequired")}
                  </div>
                  <div tw="text-neutral50 text-[12px]">{packageMemo.length}/200</div>
                </div>
                <textarea
                  tw="w-full p-3 border border-neutral20 rounded-[1px] text-[16px] md:text-[14px] h-24"
                  placeholder={t("reservePage.packageMemoPlaceholder")}
                  value={packageMemo}
                  maxLength={200}
                  onChange={(e) => setPackageMemo(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      )}

      <div tw="pl-4 pr-4">
        <div>
          {cart.map((item) => (
            <SurgeryItem
              key={item.event?.id || item.product?.id}
              item={item}
              updateCartItem={updateCartItem}
              checked={checkedList.includes(item.event?.id || item.product?.id || "")}
              onCheck={(checked) => {
                const id = item.event?.id || item.product?.id || ""
                if (checked) {
                  setCheckedList([...checkedList, id])
                } else {
                  setCheckedList(checkedList.filter((x) => x !== id))
                }
              }}
            />
          ))}
        </div>
        {!inquiryChecked && <hr tw="border-t border-neutral20 my-4" />}
        <div tw="flex gap-2 my-6 justify-center">
          <LinkButton
            to="/events"
            tw="flex justify-center items-center gap-2"
            style={{ flexible: true, variant: "outlined" }}>
            {t("reservePage.addTreatments")}
            <Icon icon={PlusPrimaryIcon} size={12} />
          </LinkButton>
        </div>

        <div tw="-ml-3 my-3 text-[14px] md:text-[16px] font-semibold flex flex-col gap-2">
          {/* cart와 동일한 체크박스 로직 */}
          <Checkbox
            checked={inquiryChecked}
            onChange={(e) => handleInquiryCheckbox(e.target.checked)}
            label={t("reservePage.bookConsultation")}
          />
          <Checkbox
            checked={usePackageChecked}
            onChange={(e) => handlePackageCheckbox(e.target.checked)}
            label={t("reservePage.usePackage")}
          />
        </div>

        <div tw="mt-3 px-5 py-4 bg-primary text-white flex justify-between items-center">
          <div tw="text-[16px] md:text-[20px] font-semibold">
            {t("cart.totalPrice")}{" "}
            <span tw="text-[12px] md:text-[14px] font-normal">{t("cart.vatNotIncluded")}</span>
          </div>
          <div tw="text-[18px] md:text-[22px] font-bold">
            {cart
              .filter((cur) => checkedList.includes(cur.event?.id || cur.product?.id || ""))
              .reduce(
                (acc, cur) =>
                  acc +
                  cur.count *
                    (cur.event?.discountPrice ||
                      cur.event?.price ||
                      cur.product?.discountPrice ||
                      cur.product?.price ||
                      0),
                0,
              )
              .toLocaleString()}
            {t("cart.won")}
          </div>
        </div>
      </div>

      {/* 모달 (cart와 완전 동일) */}
      <Modal
        open={showInquiryModal}
        width="max-w-[400px]"
        onClose={() => setShowInquiryModal(false)}>
        <div tw="flex flex-col items-start justify-center h-full font-pretendard">
          <div tw="text-left text-[16px] lg:text-[18px] font-semibold leading-snug">
            {t("cart.emptyCartTitle")}
          </div>

          <div tw="text-neutral70 text-left text-[14px] lg:text-[16px] mt-3">
            {t("cart.emptyCartText")}
          </div>

          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="w-[150px] text-[13px] md:text-[15px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => {
                setInquiryChecked(false) // UI 상태 끄기
                setInquiry(false) // 전역 상태 끄기
                setShowInquiryModal(false) // 모달 닫기
              }}>
              {t("cart.cancel")}
            </Button>

            <Button
              tw="w-[150px] text-[13px] md:text-[15px] px-[10px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => {
                resetCart() // 🔥 모든 시술 비우기
                setInquiry(true) // 방문 상담 활성화
                setInquiryChecked(true)
                setShowInquiryModal(false)
              }}>
              {t("cart.emptyCart")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 보유권 사용 + 카트 시술 동시 선택 모달 */}
      <Modal
        open={showPackageCartModal}
        width="max-w-[400px]"
        onClose={() => setShowPackageCartModal(false)}>
        <div tw="flex flex-col items-start justify-center h-full font-pretendard">
          <div tw="text-left text-[16px] lg:text-[18px] font-semibold leading-snug">
            {t("reservePage.packageCartConflictTitle")}
          </div>
          <div tw="text-neutral70 text-left text-[14px] lg:text-[16px] mt-3">
            {t("reservePage.packageCartConflictText")}
          </div>
          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="w-[150px] text-[13px] md:text-[15px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => setShowPackageCartModal(false)}>
              {t("cart.cancel")}
            </Button>
            <Button
              tw="w-[150px] text-[13px] md:text-[15px] px-[10px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => {
                resetCart()
                setUsePackageChecked(true)
                setShowPackageCartModal(false)
              }}>
              {t("cart.emptyCart")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 중복 선택 불가 모달 */}
      <Modal
        open={showDuplicateModal}
        width="max-w-[400px]"
        onClose={() => setShowDuplicateModal(false)}>
        <div tw="flex flex-col items-start justify-center h-full font-pretendard">
          <div tw="text-left text-[16px] lg:text-[18px] font-semibold leading-snug">
            {t("reservePage.duplicateModalTitle")}
          </div>
          <div tw="text-neutral70 text-left text-[14px] lg:text-[16px] mt-3">
            {t("reservePage.duplicateModalText")}
          </div>
          <div tw="mt-8 w-full">
            <Button
              tw="w-full text-[13px] md:text-[15px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => setShowDuplicateModal(false)}>
              {t("common.confirm")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

/* ---------------- Reserve Main ---------------- */
const Reserve = () => {
  const { t, i18n } = useTranslation()
  const navigate = useCustomNavigate()
  const language = i18n.language as Language
  const { user: me } = useMe()

  // 카트 항목 유효성 판정을 위한 최신 이벤트 목록 (예약 클릭/새로고침 시 refetch)
  const langQuery = useLanguageQuery()
  const { data: liveEvents, refetch: refetchEvents } = useEventControllerFindMany({
    limit: 1000,
    ...langQuery,
  })
  const { data: liveProducts, refetch: refetchProducts } = useProductControllerFindMany({
    limit: 1000,
  })

  const buildExtraMemo = (baseMemo: string) => {
    const parts: string[] = []
    if (inquiry && consultCategories.length > 0) {
      parts.push(`[관심 분야] ${consultCategories.join(", ")}`)
    }
    if (inquiry && baseMemo) {
      parts.push(`[상담 내용] ${baseMemo}`)
    }
    if (usePackageChecked && packageCategories.length > 0) {
      parts.push(`[보유권 종류] ${packageCategories.join(", ")}`)
      if (packageCategories.includes("기타") && packageMemo) {
        parts.push(`[기타 메모] ${packageMemo}`)
      }
    }
    return parts.join("\n")
  }

  const {
    inquiry,
    setInquiry,
    inquiryMemo,
    setInquiryMemo,
    cart,
    updateCartItem,
    removeFromCart,
    reconcileCartEvents,
    checkedList,
    resetCart,
    getCheckedEventIds,
    getCheckedProductIds,
    getCheckedQuantities,
    hasHydrated,
    backupToCookie,
    restoreFromCookie,
    consultCategories,
    setConsultCategories,
    usePackageChecked,
    setUsePackageChecked,
    packageCategories,
    setPackageCategories,
    packageMemo,
    setPackageMemo,
  } = useCart()

  const [today, setToday] = React.useState(dayjs())
  const [todaySlots, setTodaySlots] = React.useState<AvailableReservationResultDto[]>([])
  const [selectedDatetime, setSelectedDatetime] = React.useState("")
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [eventPeriodAlert, setEventPeriodAlert] = React.useState(false)
  // 장바구니 안내 모달 종류: removed(예약 불가 삭제) / changed(가격·정보 변경)
  const [cartAlertMode, setCartAlertMode] = React.useState<"removed" | "changed">("removed")
  const [scheduleChangedAlert, setScheduleChangedAlert] = React.useState(false)

  /* -------- Auth 상태 -------- */
  interface AuthInfo {
    name: string
    phone?: string
    email?: string
  }

  const [authInfo, setAuthInfo] = React.useState<AuthInfo | null>(null)

  const [agree, setAgree] = React.useState({
    terms: false,
    privacy: false,
    marketing: false,
  })

  /* -------- NEW 예약 가능 시간 조회 -------- */
  const getAvailableReservationsPublic = async (y: number, m: number, d: number) => {
    return reservationControllerGetAvailableReservationByDayPublic({
      year: y,
      month: m,
      day: d,
      productIds: getProductIdsWithInquiry(),
      eventIds: getCheckedEventIds(),
      category: getReservationCategory(),
    })
  }

  const getProductIdsWithInquiry = () => {
    const ids = [...(getCheckedProductIds() ?? [])]
    const inquiryId = DEFAULT_CONSULTATION_PRODUCT_ID[env.STAGE]
    const packageId = DEFAULT_PACKAGE_USE_PRODUCT_ID[env.STAGE]
    if (inquiry && !ids.includes(inquiryId)) ids.push(inquiryId)
    if (usePackageChecked && !ids.includes(packageId)) ids.push(packageId)
    return ids
  }

  // 홈페이지 예약 → 닥터팔레트 스케줄 분류
  // 보유권 사용: 사용예정보유권에 "제모" 포함 → C(제모 보유권), 아니면 B(재진 보유권)
  // 그 외(방문상담/장바구니 시술) → A(초진)
  // 방문상담/장바구니/보유권은 폼에서 상호배제 처리됨
  const getReservationCategory = (): "A" | "B" | "C" => {
    if (usePackageChecked) {
      return packageCategories.includes("제모") ? "C" : "B"
    }
    return "A"
  }

  const [memoRequiredType, setMemoRequiredType] = React.useState<"consult" | "package" | null>(null)

  // 카트 검증 로직은 사이드 장바구니(cart-view)와 공유 — cart-validation.util (상품은 현재 언어 이름 기준)
  const getInvalidItemIds = (
    freshEventById: Map<string, Event>,
    freshProductByName: Map<string, Product> | null,
  ) => getInvalidCartItemIds(cart, checkedList, freshEventById, freshProductByName, language)

  const getChangedItemIds = (
    freshEventById: Map<string, Event>,
    freshProductByName: Map<string, Product> | null,
  ) => getChangedCartItemIds(cart, checkedList, freshEventById, freshProductByName, language)

  // 최신 이벤트/상품 목록 조회 (예약 클릭·모달 확인 공용). 상품은 임포트로 id가 바뀌므로 이름 Map으로.
  const fetchFresh = async () => {
    const [evRes, prRes] = await Promise.all([refetchEvents(), refetchProducts()])
    const freshEventById = new Map(
      (evRes.data?.items ?? liveEvents?.items ?? []).map((e) => [e.id, e]),
    )
    const prItems = prRes.data?.items ?? liveProducts?.items ?? []
    // 상품 목록을 못 받았으면(빈 배열) 상품은 건드리지 않음 — 정상 상품 오삭제 방지
    const freshProductByName = prItems.length > 0 ? buildProductByName(prItems, language) : null
    return { freshEventById, freshProductByName }
  }

  // '모달 확인' — 최신 정보로 갱신(가격·설명·id 재연결) + 예약 불가·만료된 이벤트·상품 자동 제거
  const handleRefreshCart = async () => {
    const { freshEventById, freshProductByName } = await fetchFresh()
    reconcileCartEvents(freshEventById, isEventExpired, freshProductByName, language)
    setEventPeriodAlert(false)
  }

  // 예약 버튼 클릭 시 모달만 여는 함수
  const openConfirmModal = async () => {
    if (!authInfo) {
      alert(t("reservePage.needAuth"))
      return
    }

    if (!agree.terms || !agree.privacy) {
      alert(t("reservePage.agreementRequired"))
      return
    }

    if (!selectedDatetime) {
      alert(t("reservePage.selectTimeRequired"))
      return
    }

    // 메모 필수 검증
    if (inquiry && !inquiryMemo.trim()) {
      setMemoRequiredType("consult")
      return
    }
    if (usePackageChecked && packageCategories.includes("기타") && !packageMemo.trim()) {
      setMemoRequiredType("package")
      return
    }

    // 1) 이벤트·상품 유효성 체크 — 옛 장바구니 값이 아닌 서버 최신값으로 (예약 불가/변경 차단)
    // reconcile 전에 판정 → 항상 reconcile(가격 그대로여도 임포트로 바뀐 상품 id를 이름매칭으로 재연결)
    const { freshEventById, freshProductByName } = await fetchFresh()
    const hasInvalid = getInvalidItemIds(freshEventById, freshProductByName).length > 0
    const hasChanged = getChangedItemIds(freshEventById, freshProductByName).length > 0
    reconcileCartEvents(freshEventById, isEventExpired, freshProductByName, language)
    if (hasInvalid) {
      setCartAlertMode("removed") // 예약 불가(이름 변경·삭제·만료) 안내 후 정리
      setEventPeriodAlert(true)
      return
    }
    if (hasChanged) {
      setCartAlertMode("changed") // 이름은 그대로·가격/설명 변경 → 최신값으로 갱신 안내
      setEventPeriodAlert(true)
      return
    }

    // 2) 슬롯 재검증 — 선택한 시간이 아직 닥팔에서 열려있는지 (조회~제출 사이 마감 레이스 방지)
    const freshSlots = await getAvailableReservationsPublic(
      today.year(),
      today.month() + 1,
      today.date(),
    )
    const patchedSlots = freshSlots.map((slot) => ({
      ...slot,
      datetime: dayjs(slot.datetime).add(9, "hour").toISOString(),
      building: "BUILDING_1",
    }))
    setTodaySlots(patchedSlots) // 버튼도 최신화 (마감된 시간 사라짐)
    const openTimes = new Set(
      patchedSlots.map((s) => dayjs(s.datetime.replace("Z", "")).format("HH:mm")),
    )
    if (!openTimes.has(dayjs(selectedDatetime.replace("Z", "")).format("HH:mm"))) {
      setSelectedDatetime("")
      localStorage.removeItem("reservation:selectedDatetime")
      setScheduleChangedAlert(true)
      return
    }

    setConfirmOpen(true)
  }

  const reserveConfirm = async () => {
    if (!authInfo) return

    const selected = dayjs(selectedDatetime.replace("Z", ""))

    const currentTime = dayjs()
    const cutoff = getTodayCutoffTime()

    const isToday = selected.isSame(currentTime, "day")

    if (isToday && selected.isBefore(cutoff)) {
      alert(t("reservePage.timeExpired"))
      setSelectedDatetime("")
      localStorage.removeItem("reservation:selectedDatetime")
      return
    }

    try {
      await userControllerUpdateMine({ languageLocale: language })

      mutate(
        {
          data: {
            datetime: selectedDatetime.replace("Z", ""),
            productIds: getProductIdsWithInquiry(),
            eventIds: getCheckedEventIds(),
            userMemo: buildExtraMemo(inquiryMemo) || undefined,
            category: getReservationCategory(),
            quantities: getCheckedQuantities(),
          },
        },
        {
          onSuccess: () => {
            localStorage.removeItem("reservation:selectedDatetime")
            resetCart()
            navigate("/reservation/complete")
          },
        },
      )
    } catch {
      // swallow error
    }
  }

  React.useEffect(() => {
    const token = localStorage.getItem("authToken")

    if (token && me) {
      const info = {
        name: me.name,
        phone: me.phoneNumber,
        email: me.email,
      }
      setAuthInfo(info)
    }
  }, [me])

  // 페이지 진입 시 cookie 백업 복원 → localStorage 확인
  React.useEffect(() => {
    const restored = restoreFromCookie()
    const savedDatetime =
      restored?.selectedDatetime || localStorage.getItem("reservation:selectedDatetime")
    const savedToday = restored?.today || localStorage.getItem("reservation:today")

    if (savedToday) {
      const saved = dayjs(savedToday)
      if (saved.isBefore(dayjs(), "day")) {
        // 저장된 날짜가 과거면 무시하고 오늘로
        localStorage.removeItem("reservation:today")
        localStorage.removeItem("reservation:selectedDatetime")
        setToday(dayjs())
      } else {
        setToday(saved)
        if (savedDatetime) setSelectedDatetime(savedDatetime)
      }
    }
  }, [])

  /* -------- 캘린더 변경 시 조회 -------- */
  React.useEffect(() => {
    if (
      getCheckedEventIds().length > 0 ||
      getCheckedProductIds().length > 0 ||
      inquiry ||
      usePackageChecked
    ) {
      getAvailableReservationsPublic(today.year(), today.month() + 1, today.date()).then((res) => {
        // UTC → KST (+9h) 변환 패치
        const patched = res.map((slot) => ({
          ...slot,
          datetime: dayjs(slot.datetime).add(9, "hour").toISOString(),
          building: "BUILDING_1",
        }))

        setTodaySlots(patched)
      })
    }
    // packageCategories: 제모 토글(B↔C)로 분류가 바뀌면 해당 스케줄 슬롯을 다시 조회
  }, [today, inquiry, usePackageChecked, packageCategories, checkedList])

  dayjs.extend(utc)

  const getTodayCutoffTime = () => {
    let cutoff = dayjs().startOf("minute").add(30, "minute")

    const remainder = cutoff.minute() % 30
    if (remainder !== 0) {
      cutoff = cutoff.add(30 - remainder, "minute")
    }

    return cutoff.second(0)
  }

  const renderTimeSlots = () => {
    const isToday = today.isSame(dayjs(), "day")
    const cutoffTime = isToday ? getTodayCutoffTime() : null

    const availableTimes = new Set(
      todaySlots.map((slot) => dayjs(slot.datetime.replace("Z", "")).format("HH:mm")),
    )

    return (
      <div tw="w-full p-4 font-pretendard">
        <div
          css={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
            gap: "5px",
            width: "100%",
            "@media (min-width: 2200px)": {
              gap: "10px",
            },
          }}>
          {[
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
            "18:30",
            "19:00",
            "19:30",
            "20:00",
            "20:30",
          ].map((slot) => {
            const availableFromBackend = availableTimes.has(slot)

            const slotDatetime = dayjs(`${today.format("YYYY-MM-DD")}T${slot}:00`)

            const blockedByTime = isToday && cutoffTime && slotDatetime.isBefore(cutoffTime)

            const disabled = !availableFromBackend || blockedByTime
            const selected = selectedDatetime.includes(slot)

            return (
              <TimeButton
                key={slot}
                disabled={disabled}
                selected={selected}
                onClick={() => {
                  if (disabled) return

                  const base = todaySlots[0]?.datetime
                  if (!base) return

                  const [datePart] = base.split("T")
                  const value = `${datePart}T${slot}:00.000Z`
                  setSelectedDatetime(`${datePart}T${slot}:00.000Z`)
                  // 카톡 본인인증 후 선택 리셋되는 것 방지하기 위해 localStorage 사용
                  localStorage.setItem("reservation:today", today.toISOString())
                  localStorage.setItem("reservation:selectedDatetime", value)
                }}>
                {slot}
              </TimeButton>
            )
          })}
        </div>
      </div>
    )
  }

  /* -------- 예약하기 -------- */
  const { mutate } = useReservationControllerCreate({
    mutation: {
      onError: (error: any) => {
        setConfirmOpen(false)
        const msg: string = error?.response?.data?.message ?? ""
        const isInvalidItem =
          typeof msg === "string" &&
          (msg.includes("Event is not available") || msg.includes("Product not found"))
        if (isInvalidItem) {
          setCartAlertMode("removed")
          setEventPeriodAlert(true) // 상황 A: 만료/삭제된 이벤트·상품 → 정리 모달
        } else {
          setScheduleChangedAlert(true) // 상황 B: 시간 마감/일시 오류 → 일정 재선택 안내
        }
      },
    },
  })

  // 장바구니에 시술이 있으면 상담하기는 항상 false
  // React.useEffect(() => {
  //   if (cart.length > 0 && inquiry) {
  //     setInquiry(false)
  //   }
  // }, [cart])
  React.useEffect(() => {
    if (!hasHydrated.current) return

    if (cart.length > 0 && inquiry) {
      setInquiry(false)
    }
    if (cart.length > 0 && usePackageChecked) {
      setUsePackageChecked(false)
    }
  }, [cart, inquiry, usePackageChecked])

  /* -------- 예약 버튼 disabled -------- */
  const reservationDisabled = !authInfo || !agree.terms || !agree.privacy || !selectedDatetime

  /* ---------------- Render ---------------- */
  return (
    <Page>
      <div tw="bg-neutral w-screen min-h-screen">
        <AppMaxWidth tw="py-8 lg:py-12 overflow-x-hidden font-pretendard">
          {/* ---------------- 회원가입 안내 배너 (임시) ---------------- */}
          {/* <div tw="bg-white rounded-lg p-5 mt-20 mb-6 text-center shadow-sm">
            <div tw="text-[15px] md:text-[17px] font-semibold mb-3">
              예약 전에 회원가입을 진행해주세요
            </div>

            <Button
              tw="w-[200px] h-[44px] font-bold mx-auto"
              style={{ variant: "filled", color: "point" }}
              onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </div> */}

          <H1 tw="pt-16 md:pt-10 pb-10 text-[24px] lg:text-[30px] text-center">
            {t("reservePage.shoppingCart")}
          </H1>

          <div tw="flex flex-col lg:flex-row gap-12 w-full">
            {/* ---------------- LEFT ---------------- */}
            <div tw="flex-1 min-w-0 flex flex-col gap-10">
              {/* --- 시술 리스트 섹션 --- */}
              <div tw="bg-white p-6">
                <SurgeryList
                  cart={cart}
                  updateCartItem={updateCartItem}
                  inquiry={inquiry}
                  setInquiry={setInquiry}
                  inquiryMemo={inquiryMemo}
                  setInquiryMemo={setInquiryMemo}
                  removeFromCart={removeFromCart}
                  consultCategories={consultCategories}
                  setConsultCategories={setConsultCategories}
                  usePackageChecked={usePackageChecked}
                  setUsePackageChecked={setUsePackageChecked}
                  packageCategories={packageCategories}
                  setPackageCategories={setPackageCategories}
                  packageMemo={packageMemo}
                  setPackageMemo={setPackageMemo}
                />
              </div>

              {/* --- 캘린더 섹션 --- */}
              <div tw="bg-white p-6">
                <Calendar
                  key={language}
                  value={today}
                  onChange={(value) => {
                    if (value) {
                      setToday(value)
                      setSelectedDatetime("")
                      localStorage.removeItem("reservation:selectedDatetime")
                      localStorage.setItem("reservation:today", value.toISOString())
                    }
                  }}
                  onMonthChange={() => {
                    // 노출기간 중이면 방문일(월)은 자유 — 미래 월로 이동해도 만료로 차단하지 않음
                  }}
                  footer={<div>{renderTimeSlots()}</div>}
                />
              </div>
            </div>

            {/* ---------------- RIGHT: Auth + 예약 버튼 ---------------- */}
            <div tw="hidden lg:block w-[390px] shrink-0">
              <Auth
                onAuth={(info) => setAuthInfo(info)}
                onAgreementChange={(a) => setAgree(a)}
                onBeforeKakaoAuth={backupToCookie}
              />

              {/* 예약 버튼 */}
              <Button
                tw="w-full h-[52px] mt-6 font-bold"
                style={{ variant: "filled", color: "point" }}
                disabled={reservationDisabled}
                onClick={openConfirmModal}>
                {t("button.reserve")}
              </Button>
              <div tw="mt-4 text-[13px] md:text-[14px] font-pretendard text-neutral70 whitespace-pre-wrap tracking-tight">
                {t("productDetail.reserveDescription")}
              </div>
            </div>
          </div>

          {/* ---------------- MOBILE ---------------- */}
          <div tw="block lg:hidden mt-10">
            <Auth
              onAuth={(info) => setAuthInfo(info)}
              onAgreementChange={(a) => setAgree(a)}
              onBeforeKakaoAuth={backupToCookie}
            />

            <Button
              tw="w-full h-[52px] mt-6 font-bold"
              style={{ variant: "filled", color: "point" }}
              disabled={reservationDisabled}
              onClick={openConfirmModal}>
              {t("button.reserve")}
            </Button>
          </div>
        </AppMaxWidth>
      </div>
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} width="max-w-[480px]">
        <div tw="font-pretendard">
          <div tw="text-[16px] md:text-[18px] font-semibold mb-4">
            {t("reservePage.reservationModalTitle")}
          </div>

          <div tw="text-neutral70 leading-[150%] text-[14px] md:text-[16px] mb-8">
            {t("reservePage.reservationModalText1")}
            <br />
            {t("reservePage.reservationModalText2")}
          </div>

          <div tw="flex gap-2 justify-center">
            <Button
              tw="flex-1 h-[40px] text-[13px] md:text-[15px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => setConfirmOpen(false)}>
              {t("reservePage.reservationModalCancelButton")}
            </Button>

            <Button
              tw="flex-1 h-[40px] text-[13px] md:text-[15px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={reserveConfirm}>
              {t("reservePage.reservationModalReserveButton")}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={eventPeriodAlert}
        onClose={() => setEventPeriodAlert(false)}
        width="max-w-[400px]">
        <div tw="font-pretendard">
          <div tw="text-[16px] md:text-[18px] font-semibold mb-4 leading-snug">
            {cartAlertMode === "changed"
              ? t("reservePage.productChangedTitle")
              : t("reservePage.eventExpiredTitle")}
          </div>
          <div tw="text-neutral70 text-[14px] md:text-[16px] mb-6 leading-relaxed">
            {cartAlertMode === "changed"
              ? t("reservePage.productChangedDesc")
              : t("reservePage.eventExpiredDesc")}
          </div>
          <Button
            tw="w-full h-[40px] text-[13px] md:text-[15px]"
            style={{ variant: "filled", color: "point", size: "sm" }}
            onClick={handleRefreshCart}>
            {t("common.confirm")}
          </Button>
        </div>
      </Modal>

      <Modal
        open={scheduleChangedAlert}
        onClose={() => setScheduleChangedAlert(false)}
        width="max-w-[400px]">
        <div tw="font-pretendard">
          <div tw="text-[16px] md:text-[18px] font-semibold mb-4 leading-snug">
            {t("reservePage.scheduleChangedTitle")}
          </div>
          <div tw="text-neutral70 text-[14px] md:text-[16px] mb-6 leading-relaxed">
            {t("reservePage.scheduleChangedDesc")}
          </div>
          <Button
            tw="w-full h-[40px] text-[13px] md:text-[15px]"
            style={{ variant: "filled", color: "point", size: "sm" }}
            onClick={() => {
              setScheduleChangedAlert(false)
              setSelectedDatetime("")
              localStorage.removeItem("reservation:selectedDatetime")
            }}>
            {t("common.confirm")}
          </Button>
        </div>
      </Modal>

      {/* 메모 필수 입력 모달 */}
      <Modal
        open={memoRequiredType !== null}
        width="max-w-[400px]"
        onClose={() => setMemoRequiredType(null)}>
        <div tw="flex flex-col items-start justify-center h-full font-pretendard">
          <div tw="text-left text-[16px] lg:text-[18px] font-semibold leading-snug">
            {memoRequiredType === "consult"
              ? t("reservePage.consultMemoRequiredAlert")
              : t("reservePage.packageMemoRequiredAlert")}
          </div>
          <div tw="mt-8 w-full">
            <Button
              tw="w-full text-[13px] md:text-[15px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => setMemoRequiredType(null)}>
              {t("common.confirm")}
            </Button>
          </div>
        </div>
      </Modal>
    </Page>
  )
}

export default Reserve
