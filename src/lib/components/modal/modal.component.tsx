import { CloseIcon } from "@/assets/icon"
import { IconButton } from "@/design-system/components"
import MuiModal, { ModalProps } from "@mui/material/Modal"

interface Props extends ModalProps {
  title?: string
}

const Modal = ({ children, title, ...props }: Props) => (
  <MuiModal {...props}>
    <div tw="fixed inset-0 flex items-center justify-center">
      <div tw="bg-white rounded-lg shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] p-6 max-sm:max-w-[calc(100vw-1rem)] w-full max-w-xl">
        <header tw="flex justify-between items-center -mt-4">
          <h1 tw="font-extrabold text-lg">{title}</h1>
          <div tw="-mr-4">
            <IconButton onClick={() => props.onClose?.({}, "escapeKeyDown")} icon={CloseIcon} />
          </div>
        </header>
        {children}
      </div>
    </div>
  </MuiModal>
)

export default Modal
