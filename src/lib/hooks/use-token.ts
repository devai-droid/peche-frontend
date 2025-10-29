import { useCallback } from "react"
import { atom, AtomEffect, useRecoilState } from "recoil"
import { LocalStorage } from "../service/local-storage.service"
import { LocalStorageKeys } from "../constants/local-storage-key.constant"
import { clearAuthHeader, setAuthHeader } from "../api/http-client"

type TokenState = string | null

const localStorageTokenEffect: AtomEffect<TokenState> = ({ onSet }) => {
  onSet((newValue) => {
    if (newValue) {
      LocalStorage.set(LocalStorageKeys.AuthToken, newValue)
    } else {
      LocalStorage.remove(LocalStorageKeys.AuthToken)
    }
  })
}

const tokenInitialState = () => {
  const token = LocalStorage.get(LocalStorageKeys.AuthToken)

  if (token) {
    setAuthHeader(token)
  }

  return token || null
}

const tokenState = atom<TokenState>({
  key: "tokenState",
  default: tokenInitialState(),
  effects: [localStorageTokenEffect],
})

export const useToken = () => {
  const [token, setTokenState] = useRecoilState(tokenState)

  const setToken = useCallback(
    (newToken: TokenState) => {
      if (newToken) {
        setAuthHeader(newToken)
      } else {
        clearAuthHeader()
      }
      setTokenState(newToken)
    },
    [setTokenState],
  )

  return { token, setToken }
}
