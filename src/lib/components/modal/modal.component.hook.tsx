import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export interface ModalControl {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}
interface UseModal {
  manageHistory?: boolean
}

const useModal = ({ manageHistory = true }: UseModal = { manageHistory: true }): ModalControl => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(false)

  const openModal = () => {
    setIsOpen(true)
    if (manageHistory) {
      navigate("")
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    if (manageHistory) {
      navigate(-1)
    }
  }

  useEffect(() => {
    const handleBackButton = () => {
      setIsOpen(false)
    }

    window.addEventListener("popstate", handleBackButton)

    return () => {
      window.removeEventListener("popstate", handleBackButton)
    }
  }, [])

  return {
    isOpen,
    openModal,
    closeModal,
  }
}

export default useModal
