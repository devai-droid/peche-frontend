import React from "react"
import Modal from "@/lib/components/modal/modal.component"
import { CloseIcon } from "@/assets/icon"
import whatsappQrImg from "@/assets/images/wechat-qr.jpg"

interface Props {
  open: boolean
  onClose: () => void
}

const WhatsAppQrModal = ({ open, onClose }: Props) => (
  <Modal open={open} onClose={onClose} width="max-w-sm">
    <div tw="-mx-10 -my-8">
      <div tw="bg-[#F3F3F3] w-full relative">
        <div tw="px-4 pb-3 pt-12">
          <div tw="text-[24px] font-time text-neutral90">Peche clinic</div>
        </div>
        <button tw="absolute top-3 right-4" onClick={onClose}>
          <CloseIcon width={22} height={22} />
        </button>
      </div>
      <div tw="p-6 flex justify-center bg-white">
        <a href="https://wa.me/message/4Y5JC2HX6OH5H1" target="_blank" rel="noopener noreferrer">
          <img src={whatsappQrImg} alt="WhatsApp QR" tw="w-[240px] h-[240px] object-contain" />
        </a>
      </div>
    </div>
  </Modal>
)

export default WhatsAppQrModal
