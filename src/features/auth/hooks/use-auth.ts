import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { userKeys } from "@/lib/constants/query-keys/user.query-key"
import { useAuthControllerAuthenticateByPhone } from "@/lib/orval/auth/auth"
import { LocalStorage } from "@/lib/service/local-storage.service"
import { LocalStorageKeys } from "@/lib/constants/local-storage-key.constant"
import { useToken } from "@/lib/hooks/use-token"

export function useLogin() {
  const queryClient = useQueryClient()
  const { setToken } = useToken()

  const saveToken = useCallback(
    (token: string | null) => {
      setToken(token)
      queryClient.invalidateQueries([]).then(() => {})
    },
    [queryClient],
  )

  const { mutate: login } = useAuthControllerAuthenticateByPhone({
    mutation: {
      onSuccess: (data) => {
        const token = data as unknown as string
        saveToken(token)
      },
    },
  })
  return { login, setToken: saveToken }
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { setToken } = useToken()

  const { mutate } = useMutation(
    () => {
      setToken(null)
      LocalStorage.remove(LocalStorageKeys.User)
      return Promise.resolve()
    },
    {
      onMutate: () => {
        queryClient.setQueryData(userKeys.me, null)
        window.location.reload()
      },
    },
  )

  return { logout: mutate }
}
