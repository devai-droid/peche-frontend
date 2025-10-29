import { useMe } from "./use-user"

const useIsLoggedIn = () => {
  const { user } = useMe()

  return !!user
}

export default useIsLoggedIn
