/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight, CalendarIcon, ChatIcon } from "@/assets/icon"
import { Button, Checkbox, Icon, IconButton } from "@/design-system/components"
import React, { useEffect, useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import tw from "twin.macro"
import useCart, { CartItem } from "../hooks/use-cart"
import useLanguageValue from "@/lib/hooks/use-language-key"
import { Event } from "@/lib/orval/model"
import { Language } from "@/lib/locales/i18n.config"
import KakaoImg from "@/assets/images/sns/kakao.png"
import LineImg from "@/assets/images/sns/line.png"
import CallImg from "@/assets/images/sns/call.svg"
import WechatImg from "@/assets/images/sns/wechat.png"
import WhatsAppImg from "@/assets/images/sns/whatsapp.png"
import InstagramImg from "@/assets/images/sns/instagram.png"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"

const BottomButton = tw.button`flex-1 h-16 flex justify-center items-center gap-2 text-white bg-point hover:bg-[#BCA386]`
const InquiryButton = tw.button`rounded-lg border border-[#d0d0d0] w-16 h-16 flex justify-center items-center flex-col`

const call = tw`bg-[#F8EEEA]`
const kakao = tw`bg-[#FFE812]`
const line = tw`bg-[#00CF2E] text-white`
const weChat = tw`bg-[#45B035] text-white`
const instagram = tw`bg-[#F5F5F5]`
// const channelTalk = tw`bg-[#4A27FF] text-white`

const SurgeryItem = ({
  item,
  updateCartItem,
  checked,
  onCheck,
}: {
  item: CartItem
  updateCartItem: (item: CartItem) => void
  checked: boolean
  onCheck: (checked: boolean) => void
}) => {
  const tv = useLanguageValue()

  return (
    <div tw="flex justify-between items-center -ml-3">
      <div tw="flex-1">
        <Checkbox
          checked={checked}
          onChange={(event) => {
            onCheck(event.target.checked)
          }}
          label={tv(item.product ?? (item.event as Event), "name")}
        />
      </div>
      <div tw="shrink-0 flex gap-2 items-center">
        <button
          tw="w-6 h-6 flex justify-center items-center rounded-full text-point border border-point"
          disabled={item.count === 1}
          onClick={() => updateCartItem({ ...item, count: item.count - 1 })}>
          -
        </button>
        <span>{item.count}</span>
        <button
          tw="w-6 h-6 flex justify-center items-center rounded-full text-white bg-point border border-point"
          onClick={() => updateCartItem({ ...item, count: item.count + 1 })}>
          +
        </button>
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
  } = useCart()

  const navigate = useCustomNavigate()
  const [inquiryChecked, setInquiryChecked] = React.useState(inquiry)
  useEffect(() => {
    if (justAddedId && justAddedId !== "" && !checkedList.includes(justAddedId)) {
      setCheckedList([...checkedList, justAddedId])
    }
  }, [justAddedId])
  return (
    <>
      <div tw="font-bold text-xl">
        {t("productDetail.productList")} <span tw="text-point">{cart.length}</span>
      </div>

      <div tw="whitespace-pre-wrap text-[#888] text-center my-20" css={cart.length && tw`hidden`}>
        {t("productDetail.addProductYouWant")}
      </div>

      <div tw="mt-6 mb-9" css={cart.length === 0 && tw`hidden`}>
        <div tw="rounded-lg border border-[#d0d0d0] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] pl-5 pr-4 py-6">
          <div tw="flex justify-between items-center -ml-3">
            <div>
              <Checkbox
                checked={inquiryChecked}
                onChange={(event) => {
                  setInquiryChecked(event.target.checked)
                  setInquiry(event.target.checked)
                }}
                label={t("reservePage.bookConsultation")}
              />
            </div>

            <Button
              onClick={() => {
                removeFromCart(checkedList)
                setCheckedList([])
                setInquiryChecked(false)
                setInquiry(!inquiryChecked)
              }}
              style={{
                color: "black",
                size: "sm",
              }}>
              {t("button.deleteSelection")}
            </Button>
          </div>

          <hr tw="my-6" />

          <div>
            <div tw="flex flex-col">
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
            </div>
          </div>
          <hr tw="my-6" />

          <div>
            <h1 tw="text-black text-lg font-extrabold">{t("productDetail.totalPrice")}</h1>
            <div tw="text-xl text-point font-bold text-right">
              {cart
                .reduce(
                  (acc, cur) =>
                    acc +
                    cur.count *
                      (cur.event?.discountPrice || cur.event?.price || cur.product?.price || 0),
                  0,
                )
                .toLocaleString()}
              {t("reservePage.won")}
            </div>
          </div>
        </div>
        <div tw="mt-6 text-xs text-[#898989] whitespace-pre-wrap tracking-tight">
          {t("productDetail.reserveDescription")}
        </div>
      </div>

      <Button
        disabled={cart.length === 0 && !inquiryChecked}
        onClick={() => {
          navigate("/reservation/new")
        }}
        tw="mb-10"
        style={{
          flexible: true,
          variant: "filled",
        }}>
        {t("button.reserve")}
      </Button>
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
  } = useCart()
  const [inquiryChecked, setInquiryChecked] = React.useState(inquiry)
  const navigate = useCustomNavigate()

  return (
    <div tw="fixed lg:hidden inset-x-0" style={{ bottom: "60px" }}>
      <div tw="bg-white rounded-t-3xl overflow-hidden p-1 pl-4 shadow-[0px_-4px_4px_0px_rgba(0,0,0,0.25)]">
        <div tw="flex justify-between items-center">
          <div tw="font-bold text-xl">
            {t("productDetail.productList")} <span tw="text-point">{cart.length}</span>
          </div>
          <div>
            <IconButton
              icon={ArrowRight}
              css={openBottomSheet ? tw`transform rotate-90` : tw`transform -rotate-90`}
              onClick={() => {
                setOpenBottomSheet(!openBottomSheet)
              }}
            />
          </div>
        </div>

        <div
          tw="transition-all overflow-hidden pr-3"
          css={[!openBottomSheet && tw`max-h-0`, openBottomSheet && tw`max-h-96`]}>
          <div tw="mt-1 mb-6">
            <div tw="rounded-lg border border-[#d0d0d0] p-4">
              <div tw="flex justify-between items-center -ml-3">
                <div>
                  <Checkbox
                    checked={inquiryChecked}
                    onChange={(event) => {
                      setInquiryChecked(event.target.checked)
                      setInquiry(event.target.checked)
                    }}
                    label={t("reservePage.bookConsultation")}
                  />
                </div>

                <Button
                  style={{ color: "black", size: "sm" }}
                  onClick={() => {
                    removeFromCart(checkedList)
                    setCheckedList([])
                    setInquiryChecked(false)
                    setInquiry(!inquiryChecked)
                  }}>
                  {t("button.deleteSelection")}
                </Button>
              </div>

              <hr tw="my-2" />

              <div tw="max-h-40 overflow-auto pr-2">
                <div tw="flex flex-col">
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
                </div>
              </div>
            </div>
          </div>

          <Button
            tw="mb-10"
            disabled={cart.length === 0 && !inquiryChecked}
            onClick={() => {
              setOpenBottomSheet(false)
              navigate("/reservation/new")
            }}
            style={{
              flexible: true,
              variant: "filled",
              bold: true,
              size: "lg",
              shadow: true,
            }}>
            {t("button.reserve")}
          </Button>
        </div>
      </div>
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
  // // [TODO] XEN-64 상담하기 링크 연결

  const inquiryButtons: {
    id: number
    name: string
    icon: string
    css: any
    lang: Language[]
    link: string
  }[] = [
    {
      id: 1,
      name: t("button.inquiryButton.call"),
      icon: CallImg,
      css: call,
      lang: [Language.KOR],
      link: "tel:1661-2365",
    },
    {
      id: 2,
      name: t("button.inquiryButton.kakao"),
      icon: KakaoImg,
      css: kakao,
      lang: [Language.KOR],
      link: "https://pf.kakao.com/_pmGVxj/chat",
    },
    {
      id: 3,
      name: t("button.inquiryButton.weChat"),
      icon: WechatImg,
      css: weChat,
      lang: [Language.CHN],
      link: "https://work.weixin.qq.com/kfid/kfc8dbe1152fad99e74",
    },
    {
      id: 4,
      name: t("button.inquiryButton.line"),
      icon: LineImg,
      css: line,
      lang: [Language.JPN],
      link: "https://lin.ee/efw7rbT",
    },
    {
      id: 5,
      name: t("button.inquiryButton.channelTalk"),
      icon: KakaoImg,
      css: kakao,
      lang: [Language.ENG],
      link: "https://pf.kakao.com/_pmGVxj/chat",
    },
    {
      id: 6,
      name: t("button.inquiryButton.whatsApp"),
      icon: WhatsAppImg,
      css: line,
      lang: [Language.ENG],
      link: "https://wa.me/+821027694410",
    },
    {
      id: 7,
      name: t("button.inquiryButton.instagram"),
      icon: InstagramImg,
      css: instagram,
      lang: [Language.ENG],
      link: "https://www.instagram.com/pecheclinic_eng",
    },
    {
      id: 8,
      name: t("button.inquiryButton.line"),
      icon: LineImg,
      css: line,
      lang: [Language.CHN],
      link: "https://lin.ee/DDK3D3JK",
    },
    {
      id: 9,
      name: t("button.inquiryButton.line"),
      icon: LineImg,
      css: line,
      lang: [Language.THA],
      link: "https://lin.ee/BNTlo0y",
    },
  ]

  return (
    <div tw="fixed lg:hidden bottom-0 inset-x-0">
      <div tw="bg-white gap-px flex">
        <BottomButton onClick={() => setShowInquiryButtons(!showInquiryButtons)}>
          <Icon icon={ChatIcon} />
          {t("button.inquiry")}
        </BottomButton>
        <BottomButton
          onClick={() => {
            navigate("/reservation/new")
            setInquiry(true)
          }}>
          <Icon icon={CalendarIcon} />
          {t("button.reserve")}
        </BottomButton>
      </div>
      {showInquiryButtons && (
        <div tw="flex gap-3 absolute bottom-full px-4 py-2">
          {inquiryButtons
            .filter((button) => button.lang.includes(language))
            .map((button) => (
              <InquiryButton key={button.id} css={button.css}>
                <a href={button.link} target="_blank" rel="noopener noreferrer">
                  {button.icon && (
                    <img src={button.icon} alt="snsIcon" style={{ display: "inline" }} />
                  )}
                  <p tw="text-xs font-bold">{button.name}</p>
                </a>
              </InquiryButton>
            ))}
        </div>
      )}
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
      <div tw="flex gap-5 mb-20">
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
          {!showInquiryButtons && (inquiry || cart.length > 0) ? <BottomSheet /> : null}
        </div>
      </div>
    </>
  )
}

export default CartView
