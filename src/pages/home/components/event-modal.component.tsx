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
      return popup.imageEN?.url || popup.image.url || ""
    case "ja":
      return popup.imageJA?.url || popup.image.url || ""
    case "th":
      return popup.imageTH?.url || popup.image.url || ""
    case "zh":
      return popup.imageZH?.url || popup.image.url || ""
    default:
      return popup.image.url || ""
  }
}

const EventModal = ({ popup, onClose, isOpen, style, highestZIndexModalId }: EventModalProps) => {
  const { t, i18n } = useTranslation()
  const [checked, setChecked] = React.useState(false)

  const language = i18n.language as Language

  const imageUrl = getImageUrlByLanguage(popup, language)
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
