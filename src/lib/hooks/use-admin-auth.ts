import { useMemo } from "react"
import { useToken } from "./use-token"

export const useAdminAuth = () => {
  const { token } = useToken()

  const isAdmin = useMemo(() => {
    if (!token) return false
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return Array.isArray(payload.roles) && payload.roles.includes("ADMIN")
    } catch {
      return false
    }
  }, [token])

  return { isAdmin, isLoggedIn: !!token }
}
