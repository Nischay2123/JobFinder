import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginSchema, type LoginInput } from "../schemas/loginSchema"
import { useLoginMutation } from "../api/authApi"
import { setCredentials } from "../store/authSlice"

export const useLogin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await login(data).unwrap()
      dispatch(setCredentials(response))
      navigate("/home")
    } catch (err) {
      console.error("Failed to login:", err)
    }
  }

  const getErrorMessage = (field: keyof LoginInput) => {
    return form.formState.errors[field]?.message
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    loginError: error,
    getErrorMessage,
  }
}
