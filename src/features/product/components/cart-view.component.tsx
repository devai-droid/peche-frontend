/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight } from "@/assets/icon"
import { Button, Checkbox, IconButton } from "@/design-system/components"
import React, { useEffect, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import tw from "twin.macro"
import useCart, { CartItem } from "../hooks/use-cart"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { Event } from "@/lib/orval/model"
import { Language } from "@/lib/locales/i18n.config"
import KakaoImg from "@/assets/images/sns/kakao.png"
import LineImg from "@/assets/images/sns/line.png"
import WhatsAppImg from "@/assets/images/sns/whatsapp.png"
import WeChatImg from "@/assets/images/sns/wechat.png"
import InstaImg from "@/assets/images/sns/instagram.png"
import wechatQrImg from "@/assets/images/wechat-qr.jpg"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"
import Modal from "@/lib/components/modal/modal.component"

const BottomButton = tw.button`flex-1 h-16 flex justify-center items-center gap-2 text-white bg-secondary font-semibold`
const InquiryButton = tw.button`rounded-lg w-16 h-16 flex justify-center items-center flex-col`

const kakao = tw`bg-[#FFE812]`
const line = tw`bg-[#00CF2E] text-white`
const insta = tw`bg-transparent p-0`

const SurgeryItem = ({
  item,
  updateCartItem,
  checked,
  onCheck,
  hideDescription = false,
}: {
  item: CartItem
  updateCartItem: (item: CartItem) => void
  checked: boolean
  onCheck: (checked: boolean) => void
  hideDescription?: boolean
}) => {
  const { t } = useTranslation()
  const tv = useLanguageValue()
  const name = tv(item.product ?? (item.event as Event), "name")
  const description = tv(item.product ?? (item.event as Event), "description")
  const discount = item.event?.discountPrice ?? item.product?.discountPrice
  const price = item.event?.price || item.product?.price

  return (
    <div tw="py-4 font-pretendard">
      <div tw="flex">
        <Checkbox checked={checked} onChange={(e) => onCheck(e.target.checked)} />

        <div tw="flex flex-col gap-2 flex-1">
          {/* 이름 */}
          <div tw="font-semibold text-[14px] md:text-[16px] leading-snug">
            {(item.event as any)?.bundle?.name && item.event?.category && (
              <span tw="text-[#DA7F67]">{tv(item.event.category, "name")} </span>
            )}
            <span>{name}</span>
          </div>

          {/* 설명 */}
          {!hideDescription && description && (
            <div tw="text-neutral70 text-[13px] md:text-[14px] leading-snug whitespace-pre-wrap">
              {description}
            </div>
          )}

          {/* 가격 + 수량 조절 (한 줄로 맞춤) */}
          <div tw="flex justify-between items-start mt-1 flex-col gap-2 sm:flex-row sm:items-center">
            {/* 가격 */}
            <div tw="flex items-center gap-2">
              {discount && (
                <span tw="text-neutral50 line-through text-[13px] md:text-[14px]">
                  {price?.toLocaleString()} {t("reservePage.won")}
                </span>
              )}
              <span tw="text-[16px] md:text-[18px] font-semibold text-secondary3">
                {(discount || price || 0).toLocaleString()} {t("reservePage.won")}
              </span>
            </div>

            {/* 수량 조절 */}
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
    </div>
  )
}

const SurgeryList = () => {
  const { t } = useTranslation()
  const {
    inquiry,
    setInquiry,
    cart,
    updateCartItem,
    removeFromCart,
    justAddedId,
    checkedList,
    setCheckedList,
    resetCart,
    inquiryMemo,
    setInquiryMemo,
  } = useCart()

  const navigate = useCustomNavigate()
  // 체크박스 UI 상태
  const [inquiryChecked, setInquiryChecked] = React.useState(inquiry)
  // 모달 관련
  const [showInquiryModal, setShowInquiryModal] = React.useState(false)

  useEffect(() => {
    if (justAddedId && justAddedId !== "" && !checkedList.includes(justAddedId)) {
      setCheckedList([...checkedList, justAddedId])
    }
  }, [justAddedId])

  useEffect(() => {
    if (inquiryChecked && cart.length > 0) {
      setShowInquiryModal(true)
    }
  }, [cart])

  useEffect(() => {
    setInquiryChecked(inquiry)
  }, [inquiry])

  const handleInquiryCheckbox = (checked: boolean) => {
    if (checked && cart.length > 0) {
      setShowInquiryModal(true)
      return
    }

    setInquiryChecked(checked)
    setInquiry(checked)
  }

  return (
    <>
      <div tw="pl-5 pr-4 py-6 bg-white font-pretendard tracking-tight leading-[150%]">
        <div tw="flex justify-between items-center pb-4 border-b border-b-[0.5px] border-neutral30">
          <div tw="font-bold text-[18px] md:text-[22px] flex items-center gap-1">
            {t("cart.shoppingCart")}
            <span tw="text-primary text-[13px] md:text-[15px] font-semibold">
              ({checkedList.length}/{cart.length})
            </span>
          </div>

          <Button
            onClick={() => {
              removeFromCart(checkedList)
              setCheckedList([])
              setInquiryChecked(false)
              setInquiry(false)
              setInquiryMemo("")
            }}
            style={{ variant: "outlined", color: "point", size: "sm" }}>
            {t("cart.deleteSelection")}
          </Button>
        </div>

        <div
          tw="flex-1 overflow-auto mt-2"
          css={{
            maxHeight: "500px",
          }}>
          {cart.map((item) => (
            <SurgeryItem
              key={item.event?.id || item.product?.id}
              checked={checkedList.includes(item.event?.id || item.product?.id || "")}
              onCheck={(checked) => {
                const id = item.event?.id || item.product?.id || ""
                if (checked) {
                  setCheckedList([...checkedList, id])
                } else {
                  setCheckedList(checkedList.filter((checkedId) => id !== checkedId))
                }
              }}
              item={item}
              updateCartItem={updateCartItem}
            />
          ))}
          {/* 장바구니 비어있을 때 보여줄 메시지 */}
          {cart.length === 0 && !inquiryChecked && (
            <div tw="py-6 text-neutral50 text-[14px] md:text-[16px]">{t("cart.noSelection")}</div>
          )}
        </div>

        {inquiryChecked && cart.length === 0 && (
          <div tw="mt-6">
            <div tw="flex flex-col gap-3 font-pretendard mb-4">
              <div tw="text-[14px] md:text-[16px] font-semibold">
                <Checkbox
                  checked={inquiryChecked}
                  onChange={(event) => handleInquiryCheckbox(event.target.checked)}
                  label={t("cart.visitThenSelect")}
                />
              </div>
              <div tw="flex items-center gap-2 mt-1 ml-8">
                <span tw="text-neutral50 line-through text-[13px] md:text-[14px]">
                  {t("cart.freePrice")}
                </span>
                <span tw="text-[16px] md:text-[18px] font-bold text-neutralBlack">
                  {t("cart.freePrice")}
                </span>
              </div>
            </div>
            <div tw="text-primary text-[10px] md:text-[12px] font-semibold">
              {t("cart.request")}
            </div>

            <textarea
              tw="w-full mt-2 p-3 border border-neutral20 rounded-[1px] text-[14px] h-32"
              placeholder={t("cart.writeRequest")}
              value={inquiryMemo}
              maxLength={200}
              onChange={(e) => setInquiryMemo(e.target.value)}
            />

            <div tw="text-right text-neutral50 text-[12px] mt-1">{inquiryMemo.length}/200</div>
          </div>
        )}

        <div tw="pt-4 border-t border-t-[0.5px] border-neutralBlack text-[14px] md:text-[16px] font-semibold">
          <Checkbox
            checked={inquiryChecked}
            onChange={(event) => handleInquiryCheckbox(event.target.checked)}
            label={t("cart.visitThenSelect")}
          />
        </div>

        <div tw="pt-4">
          <div tw="flex justify-between items-center">
            <div tw="text-[18px] md:text-[22px] font-semibold text-primary">
              {t("cart.totalPrice")}{" "}
              <span tw="text-[13px] md:text-[14px] font-normal relative" css={{ top: "-2px" }}>
                {t("cart.vatNotIncluded")}
              </span>
            </div>

            <div tw="text-[18px] md:text-[22px] font-semibold text-primary">
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
      </div>
      <Button
        disabled={cart.length === 0 && !inquiryChecked}
        onClick={() => {
          navigate("/reservation/new", {
            state: {
              inquiryMemo,
            },
          })
        }}
        tw="mt-4 font-pretendard text-[15px] md:text-[17px]"
        style={{
          flexible: true,
          variant: "filled",
        }}>
        {t("button.reserve")}
      </Button>
      <div tw="mt-4 text-[13px] md:text-[14px] font-pretendard text-neutral70 whitespace-pre-wrap tracking-tight">
        {t("productDetail.reserveDescription")}
      </div>

      <Modal
        open={showInquiryModal}
        width="max-w-[400px]"
        onClose={() => setShowInquiryModal(false)}>
        <div tw="flex flex-col items-start justify-center h-full font-pretendard">
          <div tw="text-left text-[16px] lg:text-[18px] font-semibold leading-snug">
            {t("cart.emptyCartTitle")}
          </div>

          <div tw="text-neutral70 text-[14px] lg:text-[16px] text-left mt-3">
            {t("cart.emptyCartText")}
          </div>

          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="w-[150px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => {
                setInquiryChecked(false) // 🔥 체크박스 끄기
                setInquiryMemo("")
                setInquiry(false) // 🔥 전역 상태 끄기
                setShowInquiryModal(false) // 모달 닫기
              }}>
              {t("cart.cancel")}
            </Button>

            <Button
              tw="w-[150px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => {
                resetCart() // 장바구니 비우기
                setInquiry(true) // 상담모드 활성화
                setInquiryChecked(true)
                setShowInquiryModal(false)
              }}>
              {t("cart.emptyCart")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

const BottomSheet = () => {
  const { t } = useTranslation()
  const {
    inquiry,
    setInquiry,
    cart,
    updateCartItem,
    removeFromCart,
    checkedList,
    setCheckedList,
    openBottomSheet,
    setOpenBottomSheet,
    inquiryMemo,
    setInquiryMemo,
  } = useCart()

  const [inquiryChecked, setInquiryChecked] = React.useState(inquiry)
  const [showInquiryModal, setShowInquiryModal] = React.useState(false)

  // 전체 선택 여부
  const allSelected = checkedList.length === cart.length && cart.length > 0
  const toggleSelectAll = () => {
    if (allSelected) {
      setCheckedList([])
    } else {
      setCheckedList(cart.map((i) => i.event?.id || i.product?.id || ""))
    }
  }

  // 방문 상담 체크 로직 (데스크탑과 동일)
  const handleInquiryCheckbox = (checked: boolean) => {
    if (checked && cart.length > 0) {
      // 상품이 있는데 상담모드 활성 → 모달 띄우기
      setShowInquiryModal(true)
      return
    }

    setInquiryChecked(checked)
    setInquiry(checked)
  }

  const totalPrice = cart
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

  return (
    <div
      tw="fixed lg:hidden inset-x-0 font-pretendard tracking-tight leading-[150%] z-50"
      style={{ bottom: "60px" }}>
      {/* 상단 Gradient Bar 추가 */}
      <div
        tw="absolute top-[-30px] left-0 w-full h-[30px] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.2))",
        }}
      />
      <div tw="bg-neutral overflow-hidden p-1 pl-4">
        {/* 헤더 */}
        <div tw="flex justify-between items-center">
          <div tw="font-semibold text-[18px] md:text-[22px]">
            {t("cart.shoppingCart")}{" "}
            <span tw="text-primary font-semibold text-[13px] md:text-[15px]">
              ({checkedList.length}/{cart.length})
            </span>
          </div>
          <IconButton
            icon={ArrowRight}
            css={openBottomSheet ? tw`transform rotate-90` : tw`transform -rotate-90`}
            onClick={() => setOpenBottomSheet(!openBottomSheet)}
          />
        </div>

        {/* 내용 */}
        <div
          tw="transition-all overflow-hidden pr-3 flex flex-col"
          css={[
            !openBottomSheet && tw`max-h-0`,
            openBottomSheet && { maxHeight: "70vh", display: "flex", flexDirection: "column" },
          ]}>
          <div tw="mt-1 mb-6 flex-1 flex flex-col">
            <div tw="rounded-[1px] bg-white border border-neutral30 p-4 flex-1 flex flex-col">
              {/* 전체 선택 */}
              <div tw="flex justify-between items-center flex-none font-semibold text-[16px] md:text-[18px]">
                <Checkbox
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  label={t("cart.selectAll")}
                />

                <Button
                  style={{ variant: "outlined", color: "point", size: "sm" }}
                  onClick={() => {
                    removeFromCart(checkedList)
                    setCheckedList([])
                    setInquiryChecked(false)
                    setInquiry(false)
                    setInquiryMemo("")
                  }}>
                  {t("cart.deleteSelection")}
                </Button>
              </div>

              <hr tw="my-2 flex-none" />
              {/* 방문 상담 후 시술 선택 → 메모 입력 UI */}
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
                  <div tw="flex items-center gap-2 mb-4 ml-7">
                    <span tw="text-neutral50 line-through text-[13px]">{t("cart.freePrice")}</span>
                    <span tw="text-[16px] font-bold text-neutralBlack">{t("cart.freePrice")}</span>
                  </div>

                  {/* 상담 요청사항 */}
                  <div tw="text-primary text-[12px] font-semibold mb-1 ml-1">
                    {t("cart.request")}
                  </div>

                  {/* textarea */}
                  <textarea
                    tw="w-full mt-1 p-3 border border-neutral20 rounded-[1px] text-[14px] h-16"
                    placeholder={t("cart.writeRequest")}
                    value={inquiryMemo}
                    maxLength={200}
                    onChange={(e) => setInquiryMemo(e.target.value)}
                  />

                  {/* 글자수 카운트 */}
                  <div tw="text-right text-neutral50 text-[12px] mt-1">
                    {inquiryMemo.length}/200
                  </div>
                </div>
              )}

              {/* 상품 리스트 */}
              <div
                tw="overflow-auto pr-2 flex-1"
                css={{
                  maxHeight: "220px",
                }}>
                <div tw="flex flex-col">
                  {cart.map((item) => {
                    const id = item.event?.id || item.product?.id || ""

                    return (
                      <SurgeryItem
                        key={id}
                        item={item}
                        updateCartItem={updateCartItem}
                        checked={checkedList.includes(id)}
                        onCheck={(checked) => {
                          if (checked) setCheckedList([...checkedList, id])
                          else setCheckedList(checkedList.filter((x) => x !== id))
                        }}
                        hideDescription
                      />
                    )
                  })}
                </div>
              </div>

              {/* 방문 상담 후 시술 선택 */}
              <div tw="mt-4 pt-3 border-t border-neutral20 flex-none text-[14px] md:text-[16px] font-semibold">
                <Checkbox
                  checked={inquiryChecked}
                  onChange={(e) => handleInquiryCheckbox(e.target.checked)}
                  label={t("cart.visitThenSelect")}
                />
              </div>
            </div>
          </div>

          {/* 총 금액 */}
          <div tw="py-3 flex justify-between items-center border-t border-neutral20 bg-neutral flex-none">
            <div tw="text-[18px] font-semibold text-primary">
              {t("cart.totalPrice")}{" "}
              <span tw="text-[13px] font-normal">{t("cart.vatNotIncluded")}</span>
            </div>
            <div tw="text-[20px] font-semibold text-primary">
              {totalPrice.toLocaleString()}
              {t("cart.won")}
            </div>
          </div>
        </div>
      </div>

      {/* 안내 모달 (데스크탑과 동일) */}
      <Modal
        open={showInquiryModal}
        width="max-w-[400px]"
        onClose={() => setShowInquiryModal(false)}>
        <div tw="flex flex-col items-start justify-center h-full font-pretendard">
          <div tw="text-left text-[16px] md:text-[18px] font-semibold leading-snug">
            {t("cart.emptyCartTitle")}
          </div>

          <div tw="text-left text-neutral70 text-left text-[14px] md:text-[16px] mt-3 w-full">
            {t("cart.emptyCartText")}
          </div>

          <div tw="flex justify-end gap-2 mt-4 md:mt-8">
            <Button
              tw="w-[150px]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => {
                setInquiryChecked(false)
                setInquiry(false)
                setShowInquiryModal(false)
              }}>
              {t("cart.cancel")}
            </Button>

            <Button
              tw="w-[150px]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => {
                removeFromCart(checkedList) // 기존 상품 삭제
                setCheckedList([])
                setInquiry(true)
                setInquiryChecked(true)
                setShowInquiryModal(false)
              }}>
              {t("cart.emptyCart")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

const BottomButtons = ({
  showInquiryButtons,
  setShowInquiryButtons,
}: {
  showInquiryButtons: boolean
  setShowInquiryButtons: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { t, i18n } = useTranslation()
  const { setInquiry } = useCart()
  const language = i18n.language as Language

  const navigate = useCustomNavigate()
  const [openWeChatModal, setOpenWeChatModal] = React.useState(false)

  const inquiryButtons: {
    id: number
    name: string
    icon: string
    css: any
    lang: Language[]
    link?: string
    type?: "modal"
    modalKey?: "wechat" | "whatsapp"
  }[] = [
    {
      id: 1,
      name: t("button.inquiryButton.kakao"),
      icon: KakaoImg,
      css: kakao,
      lang: [Language.KOR],
      link: "http://pf.kakao.com/_dxoiLn",
    },
    {
      id: 2,
      name: t("button.inquiryButton.line"),
      icon: LineImg,
      css: line,
      lang: [Language.JPN],
      link: "https://line.me/R/ti/p/@235wfyao",
    },
    {
      id: 3,
      name: t("button.inquiryButton.whatsApp"),
      icon: WhatsAppImg,
      css: line,
      lang: [Language.ENG],
      link: "https://wa.me/message/4Y5JC2HX6OH5H1",
    },
    {
      id: 4,
      name: t("button.inquiryButton.line"),
      icon: LineImg,
      css: line,
      lang: [Language.THA],
      link: "https://line.me/R/ti/p/@892druai",
    },
    {
      id: 5,
      name: t("button.inquiryButton.line"),
      icon: LineImg,
      css: line,
      lang: [Language.TWN],
      link: "https://line.me/R/ti/p/@683jgqmd",
    },
    {
      id: 6,
      name: "WeChat",
      icon: WeChatImg,
      css: line,
      lang: [Language.CHN],
      type: "modal",
      modalKey: "wechat",
    },
    {
      id: 7,
      name: t("button.inquiryButton.instagram"),
      icon: InstaImg,
      css: insta,
      lang: [Language.ENG],
      link: "https://www.instagram.com/pecheclinic.en/",
    },
    {
      id: 8,
      name: t("button.inquiryButton.instagram"),
      icon: InstaImg,
      css: insta,
      lang: [Language.CHN],
      link: "https://www.instagram.com/pecheclinic.cn/",
    },
    {
      id: 9,
      name: t("button.inquiryButton.instagram"),
      icon: InstaImg,
      css: insta,
      lang: [Language.JPN],
      link: "https://www.instagram.com/pecheclinic.jp/",
    },
  ]

  return (
    <div tw="fixed lg:hidden bottom-0 inset-x-0 z-50 font-pretendard">
      <div tw="bg-secondary gap-px flex">
        <BottomButton
          onClick={() => {
            setShowInquiryButtons(!showInquiryButtons)
          }}>
          {t("button.inquiry")}
        </BottomButton>
        <div tw="w-px bg-neutral" />
        <BottomButton
          onClick={() => {
            navigate("/reservation/new")
            setInquiry(true)
          }}>
          {t("button.reserve")}
        </BottomButton>
      </div>
      {showInquiryButtons && (
        <div tw="flex gap-3 absolute bottom-full px-4 py-2">
          {inquiryButtons
            .filter((button) => button.lang.includes(language))
            .map((button) => (
              <InquiryButton
                key={button.id}
                className="sns-btn-conversion"
                css={button.css}
                onClick={() => {
                  if (button.type === "modal") {
                    setOpenWeChatModal(true)
                  }
                }}>
                {button.type === "modal" ? (
                  <img src={button.icon} alt="snsIcon" />
                ) : (
                  <a href={button.link} target="_blank" rel="noopener noreferrer">
                    <img src={button.icon} alt="snsIcon" />
                  </a>
                )}
              </InquiryButton>
            ))}
        </div>
      )}
      <Modal open={openWeChatModal} onClose={() => setOpenWeChatModal(false)} width="max-w-md">
        <div tw="-mx-10 -my-8">
          <div tw="bg-[#F3F3F3] w-full relative">
            <div tw="px-4 pb-3 pt-12">
              <div tw="text-[24px] font-time text-neutral90">Peche clinic</div>
            </div>

            <button tw="absolute top-3 right-4" onClick={() => setOpenWeChatModal(false)}>
              ✕
            </button>
          </div>

          <div tw="p-6 flex justify-center bg-white">
            <img src={wechatQrImg} alt="wechat qr" tw="w-[240px] h-[240px] object-contain" />
          </div>
        </div>
      </Modal>
    </div>
  )
}

const CartView = ({ children, isHome }: { children?: React.ReactNode; isHome: boolean }) => {
  const [headerHeight, setHeaderHeight] = React.useState(0)
  const { inquiry, cart } = useCart()
  // 상담 버튼이 보여야하는지 여부
  const [showInquiryButtons, setShowInquiryButtons] = React.useState(false)

  useLayoutEffect(() => {
    const height = document.getElementById("header-height")?.clientHeight || 0
    setHeaderHeight(height + 16)
  }, [])

  return (
    <>
      <div tw="flex gap-8 mb-0">
        {!isHome && <div tw="w-full lg:w-4/6">{children}</div>}
        {isHome && <div tw="w-full">{children}</div>}

        {!isHome && (
          <div tw="w-2/6 sticky h-full hidden lg:block" css={{ top: headerHeight }}>
            <SurgeryList />
          </div>
        )}
      </div>
      <div tw="relative">
        <BottomButtons
          showInquiryButtons={showInquiryButtons}
          setShowInquiryButtons={setShowInquiryButtons}
        />
        {/* 목록이 추가되면 보이게 */}
        <div tw="absolute bottom-0 inset-x-0">
          {!isHome && (inquiry || cart.length > 0) ? <BottomSheet /> : null}
        </div>
      </div>
    </>
  )
}

export default CartView
