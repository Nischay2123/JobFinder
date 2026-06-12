import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

export const startRegistrationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
})

export type StartRegistrationInput = z.infer<typeof startRegistrationSchema>

export const completeRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: passwordSchema,
  currentStatus: z.enum(["STUDENT", "FRESHER", "WORKING_PROFESSIONAL"], {
    errorMap: () => ({ message: "Please select your professional status" }),
  }),
})

export type CompleteRegistrationInput = z.infer<typeof completeRegistrationSchema>
