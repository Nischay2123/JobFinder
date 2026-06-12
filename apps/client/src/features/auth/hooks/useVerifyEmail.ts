import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useVerifyEmailMutation } from "../api/authApi"

export const useVerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation()
  const [error, setError] = useState<string | null>(null)

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setError("Verification token is missing. Please check your verification link.")
      return
    }

    const runVerification = async () => {
      try {
        const response = await verifyEmail({ token }).unwrap()
        // Successfully verified, navigate to details page with registrationToken
        navigate("/auth/complete-registration", {
          state: { registrationToken: response.registrationToken },
          replace: true,
        })
      } catch (err: any) {
        console.error("Failed to verify email:", err)
        const errMsg = err?.data?.message || "Verification failed. The link may have expired or is invalid."
        setError(errMsg)
      }
    }

    runVerification()
  }, [token, verifyEmail, navigate])

  return {
    isVerifying: isLoading,
    error,
    token,
  }
}
