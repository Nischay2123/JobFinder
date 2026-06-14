import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout, useLogoutMutation } from "@features/auth"

export const useHome = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state: any) => state.auth)
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login", { replace: true })
    } else if (user && user.profile && !user.profile.isCompleted) {
      navigate("/onboarding", { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap()
    } catch (err) {
      console.error("Failed to logout on server, clearing client state anyway", err)
    } finally {
      dispatch(logout())
      navigate("/auth/login", { replace: true })
    }
  }

  return {
    user,
    isAuthenticated,
    handleLogout,
    isLoggingOut,
  }
}
