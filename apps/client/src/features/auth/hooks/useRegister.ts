import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { startRegistrationSchema, type StartRegistrationInput } from "../schemas/registrationSchemas"
import { useStartRegistrationMutation } from "../api/authApi"
import { useState } from "react"

export const useRegister = () => {
  const [startRegistration, { isLoading, error }] = useStartRegistrationMutation()
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")

  const form = useForm<StartRegistrationInput>({
    resolver: zodResolver(startRegistrationSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: StartRegistrationInput) => {
    try {
      await startRegistration(data).unwrap()
      setSubmittedEmail(data.email)
      setIsSuccess(true)
    } catch (err) {
      console.error("Failed to start registration:", err)
    }
  }

  const getErrorMessage = (field: keyof StartRegistrationInput) => {
    return form.formState.errors[field]?.message
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    error,
    isSuccess,
    submittedEmail,
    getErrorMessage,
  }
}
