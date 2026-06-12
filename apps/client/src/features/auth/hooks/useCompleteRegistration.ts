import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { completeRegistrationSchema, type CompleteRegistrationInput } from "../schemas/registrationSchemas"
import { useCompleteRegistrationMutation } from "../api/authApi"
import { setCredentials } from "../store/authSlice"
import { useEffect } from "react"

export const useCompleteRegistration = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [completeRegistration, { isLoading, error }] = useCompleteRegistrationMutation()

  const registrationToken = location.state?.registrationToken

  useEffect(() => {
    if (!registrationToken) {
      navigate("/auth/register", { replace: true })
    }
  }, [registrationToken, navigate])

  const form = useForm<CompleteRegistrationInput>({
    resolver: zodResolver(completeRegistrationSchema),
    defaultValues: {
      name: "",
      password: "",
      currentStatus: undefined,
    },
  })

  const onSubmit = async (data: CompleteRegistrationInput) => {
    if (!registrationToken) return
    try {
      const response = await completeRegistration({
        registrationToken,
        ...data,
      }).unwrap()

      dispatch(
        setCredentials({
          user: response.user,
        })
      )
      navigate("/home", { replace: true })
    } catch (err) {
      console.error("Failed to complete registration:", err)
    }
  }

  const getErrorMessage = (field: keyof CompleteRegistrationInput) => {
    return form.formState.errors[field]?.message
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    getErrorMessage,
    registrationToken,
  }
}
