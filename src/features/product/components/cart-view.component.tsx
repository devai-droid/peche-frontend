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
import Modal from "@/lib/components/modal/modal.component"

const BottomButton = tw.button`flex-1 h-16 flex justify-center items-center gap-2 text-white bg-secondary`
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
  hideDescription = false,
}: {
  item: CartItem
  updateCartItem: (item: CartItem) => void
  checked: boolean
  onCheck: (checked: boolean) => void
  hideDescription?: boolean
}) => {
  const tv = useLanguageValue()
  const name = tv(item.product ?? (item.event as Event), "name")
  const description = tv(item.product ?? (item.event as Event), "description")
  const discount = item.event?.discountPrice
  const price = item.event?.price || item.product?.price

  return (
    <div tw="py-4 font-pretendard">
      <div tw="flex">
        <Checkbox checked={checked} onChange={(e) => onCheck(e.target.checked)} />

        <div tw="flex flex-col gap-2 flex-1">
          {/* 이름 */}
          <div tw="font-semibold text-[14px] md:text-[16px] leading-snug">{name}</div>

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
                  {price?.toLocaleString()}원
                </span>
              )}
              <span tw="text-[16px] md:text-[18px] font-bold text-neutralBlack">
                {(discount || price || 0).toLocaleString()}원
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

              <span tw="w-4 text-center">{item.count}</span>

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

  const selectedCount = checkedList.length
  const totalCount = cart.length

  return (
    <>
      <div tw="pl-5 pr-4 py-6 bg-white font-pretendard tracking-tight leading-[150%]">
        <div tw="flex justify-between items-center pb-4 border-b border-b-[0.5px] border-neutral50">
          <div tw="font-bold text-[18px] md:text-[22px] flex items-center gap-1">
            장바구니
            <span tw="text-primary text-[16px] md:text-[18px] font-semibold">
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
            선택삭제
          </Button>
        </div>

        <div>
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
          {/* 🔥 장바구니 비어있을 때 보여줄 메시지 */}
          {cart.length === 0 && !inquiryChecked && (
            <div tw="py-6 text-neutral50 text-[14px] md:text-[16px]">선택한 시술이 없습니다.</div>
          )}
        </div>

        {inquiryChecked && cart.length === 0 && (
          <div tw="mt-6">
            <div tw="flex flex-col gap-3 font-pretendard mb-4">
              <div tw="text-[14px] md:text-[16px] font-semibold">
                <Checkbox
                  checked={inquiryChecked}
                  onChange={(event) => handleInquiryCheckbox(event.target.checked)}
                  label="방문 상담 후 시술 선택"
                />
              </div>
              <div tw="flex items-center gap-2 mt-1 ml-8">
                <span tw="text-neutral50 line-through text-[13px] md:text-[14px]">0원</span>
                <span tw="text-[16px] md:text-[18px] font-bold text-neutralBlack">0원</span>
              </div>
            </div>
            <div tw="text-primary text-[10px] md:text-[12px] font-semibold">
              상담 요청사항 (선택)
            </div>

            <textarea
              tw="w-full mt-2 p-3 border border-neutral20 rounded-[1px] text-[14px] h-32"
              placeholder="내용을 적어주세요"
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
            label="방문 상담 후 시술 선택"
          />
        </div>

        <div tw="mt-4 pt-4">
          <div tw="flex justify-between items-center">
            <div tw="text-[18px] md:text-[22px] font-semibold text-primary">
              총 금액{" "}
              <span tw="text-[13px] md:text-[14px] font-normal relative" css={{ top: "-2px" }}>
                (부가세 별도)
              </span>
            </div>

            <div tw="text-[18px] md:text-[22px] font-semibold text-neutralBlack">
              {cart
                .reduce(
                  (acc, cur) =>
                    acc +
                    cur.count *
                      (cur.event?.discountPrice || cur.event?.price || cur.product?.price || 0),
                  0,
                )
                .toLocaleString()}
              원
            </div>
          </div>
        </div>
      </div>
      <Button
        disabled
        // disabled={cart.length === 0 && !inquiryChecked}
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

      <Modal open={showInquiryModal} onClose={() => setShowInquiryModal(false)}>
        <div tw="flex flex-col items-center justify-center h-full font-pretendard">
          <div tw="text-center text-[16px] lg:text-[18px] font-semibold leading-snug">
            시술이 담겨있는 상태에서는 방문 상담 선택이 어렵습니다.
          </div>

          <div tw="text-neutral70 text-[14px] lg:text-[16px] text-center mt-3">
            선택한 시술을 모두 비운 후 상담을 예약해주세요.
          </div>

          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="min-w-[8rem]"
              style={{ variant: "outlined", color: "point", size: "sm" }}
              onClick={() => {
                setInquiryChecked(false) // 🔥 체크박스 끄기
                setInquiryMemo("")
                setInquiry(false) // 🔥 전역 상태 끄기
                setShowInquiryModal(false) // 모달 닫기
              }}>
              취소하기
            </Button>

            <Button
              tw="min-w-[8rem]"
              style={{ variant: "filled", color: "point", size: "sm" }}
              onClick={() => {
                resetCart() // 장바구니 비우기
                setInquiry(true) // 상담모드 활성화
                setInquiryChecked(true)
                setShowInquiryModal(false)
              }}>
              모두 비우기
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

  const totalPrice = cart.reduce(
    (acc, cur) =>
      acc + cur.count * (cur.event?.discountPrice || cur.event?.price || cur.product?.price || 0),
    0,
  )

  return (
    <div
      tw="fixed lg:hidden inset-x-0 font-pretendard tracking-tight leading-[150%] z-50"
      style={{ bottom: "60px" }}>
      <div tw="bg-neutral overflow-hidden p-1 pl-4">
        {/* 헤더 */}
        <div tw="flex justify-between items-center">
          <div tw="font-semibold text-[18px] md:text-[22px]">
            장바구니{" "}
            <span tw="text-primary font-semibold">
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
                <Checkbox checked={allSelected} onChange={toggleSelectAll} label="전체 선택" />

                <Button
                  style={{ variant: "outlined", color: "point", size: "sm" }}
                  onClick={() => {
                    removeFromCart(checkedList)
                    setCheckedList([])
                    setInquiryChecked(false)
                    setInquiry(false)
                    setInquiryMemo("")
                  }}>
                  선택 삭제
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
                      label="방문 상담 후 시술 선택"
                    />
                  </div>

                  {/* 가격 (0원) */}
                  <div tw="flex items-center gap-2 mb-4 ml-7">
                    <span tw="text-neutral50 line-through text-[13px]">0원</span>
                    <span tw="text-[16px] font-bold text-neutralBlack">0원</span>
                  </div>

                  {/* 상담 요청사항 */}
                  <div tw="text-primary text-[12px] font-semibold mb-1 ml-1">
                    상담 요청사항 (선택)
                  </div>

                  {/* textarea */}
                  <textarea
                    tw="w-full mt-1 p-3 border border-neutral20 rounded-[1px] text-[14px] h-16"
                    placeholder="내용을 적어주세요"
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
                  minHeight: "0",
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
                  label="방문 상담 후 시술 선택"
                />
              </div>
            </div>
          </div>

          {/* 총 금액 */}
          <div tw="py-3 flex justify-between items-center border-t border-neutral20 bg-neutral flex-none">
            <div tw="text-[18px] font-semibold text-primary">
              총 금액 <span tw="text-[13px] font-normal">(부가세 별도)</span>
            </div>
            <div tw="text-[20px] font-bold text-neutralBlack">{totalPrice.toLocaleString()}원</div>
          </div>
        </div>
      </div>

      {/* 안내 모달 (데스크탑과 동일) */}
      <Modal open={showInquiryModal} title="안내" onClose={() => setShowInquiryModal(false)}>
        <div tw="flex flex-col items-center justify-center h-full font-pretendard">
          <div tw="text-center text-[16px] font-semibold leading-snug">
            시술이 담겨있는 상태에서는 방문 상담 선택이 어렵습니다.
          </div>

          <div tw="text-neutral70 text-center mt-3">
            선택한 시술을 모두 비운 후 상담을 예약해주세요.
          </div>

          <div tw="flex justify-end gap-2 mt-8">
            <Button
              tw="min-w-[8rem]"
              style={{ variant: "outlined", color: "point", size: "lg" }}
              onClick={() => {
                setInquiryChecked(false)
                setInquiry(false)
                setShowInquiryModal(false)
              }}>
              취소하기
            </Button>

            <Button
              tw="min-w-[8rem]"
              style={{ variant: "filled", color: "point", size: "lg" }}
              onClick={() => {
                removeFromCart(checkedList) // 기존 상품 삭제
                setCheckedList([])
                setInquiry(true)
                setInquiryChecked(true)
                setShowInquiryModal(false)
              }}>
              모두 비우기
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
    <div tw="fixed lg:hidden bottom-0 inset-x-0 z-50">
      <div tw="bg-secondary gap-px flex">
        <BottomButton
          onClick={() => {
            console.log("clicked")
          }}>
          {t("button.inquiry")}
        </BottomButton>
        <div tw="w-px bg-neutral" />
        <BottomButton
          disabled
          onClick={() => {
            navigate("/reservation/new")
            setInquiry(true)
          }}>
          {t("button.reserve")}
        </BottomButton>
      </div>
      {/* {showInquiryButtons && (
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
      )} */}
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
          {!showInquiryButtons && (inquiry || cart.length > 0) ? <BottomSheet /> : null}
        </div>
      </div>
    </>
  )
}

export default CartView
