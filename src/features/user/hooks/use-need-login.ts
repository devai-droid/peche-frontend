import { useLocation, useNavigate } from "react-router-dom"
import useIsLoggedIn from "./use-is-logged-in"

const useNeedLogin = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggedIn = useIsLoggedIn()

  const needLogin = <T>(callback: T): T | (() => void) =>
    isLoggedIn ? callback : () => navigate("/login", { state: { from: location } })

  return needLogin
}

export default useNeedLogin
