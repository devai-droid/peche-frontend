import React, { useEffect, useRef } from "react"
import tw from "twin.macro"
import { useTranslation } from "react-i18next"
import { CloseIcon } from "@/assets/icon"
import { Checkbox, IconButton } from "@/design-system/components"
import { MainPopup } from "@/lib/orval/model/mainPopup"
import { Language } from "@/lib/locales/i18n.config"

interface EventModalProps {
  popup: MainPopup
  onClose: (checked: boolean) => void
  isOpen: boolean
  style?: React.CSSProperties
  highestZIndexModalId: string | null
}

const getImageUrlByLanguage = (popup: MainPopup, language: Language): string => {
  switch (language) {
    case "en":
      return popup.imageEN?.url || popup.image?.url || ""
    case "ja":
      return popup.imageJA?.url || popup.image?.url || ""
    case "th":
      return popup.imageTH?.url || popup.image?.url || ""
    case "zh":
      return popup.imageZH?.url || popup.image?.url || ""
    case "zh-TW":
      return popup.imageZHTW?.url || popup.image?.url || ""
    default:
      return popup.image?.url || ""
  }
}

const EventModal = ({ popup, onClose, isOpen, style, highestZIndexModalId }: EventModalProps) => {
  const { t, i18n } = useTranslation()
  const [checked, setChecked] = React.useState(false)

  const language = i18n.language as Language

  const imageUrl = getImageUrlByLanguage(popup, language)
  // 휴무·안내(Information) 팝업 항목. 있으면 이미지 대신 텍스트 안내로 표시.
  // (orval 재생성 전이라 지역 타입으로 읽는다)
  const noticeItems = (popup as unknown as { noticeItems?: { title: string; subtitle: string }[] })
    .noticeItems
  const isNotice = !!noticeItems && noticeItems.length > 0
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // If the click is outside the modal and the modal has the highest z-index, close the modal
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        popup.id === highestZIndexModalId &&
        isOpen
      ) {
        onClose(checked)
      }
    }

    // Add the event listener to the document
    document.addEventListener("mousedown", handleClickOutside)

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [modalRef, onClose, checked, popup.id, highestZIndexModalId, isOpen])

  const handleCheckboxChange = () => {
    setChecked(!checked)
  }

  const handleClose = () => {
    onClose(checked)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div style={style} tw="fixed bg-black bg-opacity-30 z-[1200] max-md:inset-0">
      <div tw="absolute-center z-[1200] px-4" css={tw`fixed`} ref={modalRef}>
        <div tw="drop-shadow-[0px_4px_24px_rgba(0,0,0,0.25)] bg-white w-[400px] max-w-[400px]">
          {isNotice ? (
            <div tw="relative w-full bg-white">
              {/* 상단 회색 헤더 + X */}
              <div tw="relative bg-[#EDEDED] py-6 text-center">
                <IconButton
                  icon={CloseIcon}
                  tw="absolute top-2 right-2 z-10"
                  css={{ "& g": { strokeWidth: 1 } }}
                  onClick={handleClose}
                />
                <div tw="text-[26px] font-medium text-neutral90">Information</div>
              </div>
              {/* 가운데 안내 항목 (어드민 입력) */}
              <div tw="px-6 py-8 text-center">
                {noticeItems?.map((it, i) => (
                  <div key={i} tw="mb-5">
                    <div tw="text-[18px] font-bold text-neutral90">{it.title}</div>
                    <div tw="text-neutral60 mt-1">{it.subtitle}</div>
                  </div>
                ))}
                <div tw="text-xs text-neutral50 mt-6">
                  *일정을 확인하시어 내원에 차질 없으시길 바랍니다.
                </div>
                <div tw="font-time text-[24px] text-neutral90 mt-6">Pêche</div>
              </div>
            </div>
          ) : (
            <div tw="relative w-full aspect-[400/467] bg-[#d9d9d9] max-h-[467px] max-w-[400px] mx-auto">
              {/* X 버튼을 이미지 위에 올림 */}
              <IconButton
                icon={CloseIcon}
                tw="absolute top-2 right-2 z-10"
                css={{ "& g": { strokeWidth: 1 } }}
                onClick={handleClose}
              />

              <img src={imageUrl} alt="팝업 이미지" tw="w-full h-full object-cover" />
            </div>
          )}

          <footer tw="px-4 py-2 flex items-center">
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              label={t("home.doNotShowToday")}
            />
          </footer>
        </div>
      </div>
    </div>
  )
}

export default EventModal
