import * as React from "react"
import { useCompleteRegistration } from "../hooks/useCompleteRegistration"
import { Button } from "@shared/components/ui/button"
import { Input } from "@shared/components/ui/input"
import { Label } from "@shared/components/ui/label"
import { ArrowRight, Loader2, CheckCircle2, XCircle, GraduationCap, UserCheck, Briefcase } from "lucide-react"

interface CompleteRegistrationFormProps {
  form: ReturnType<typeof useCompleteRegistration>["form"];
  onSubmit: ReturnType<typeof useCompleteRegistration>["onSubmit"];
  isLoading: boolean;
  serverError: string | null;
  getErrorMessage: ReturnType<typeof useCompleteRegistration>["getErrorMessage"];
}

export const CompleteRegistrationForm: React.FC<CompleteRegistrationFormProps> = ({
  form,
  onSubmit,
  isLoading,
  serverError,
  getErrorMessage,
}) => {
  const password = form.watch("password") || ""
  const selectedStatus = form.watch("currentStatus")

  const passwordCriteria = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One lowercase letter", valid: /[a-z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(password) },
  ]

  const statusOptions = [
    {
      value: "STUDENT" as const,
      label: "Student",
      description: "Pursuing studies",
      icon: GraduationCap,
    },
    {
      value: "FRESHER" as const,
      label: "Fresher",
      description: "Ready for first job",
      icon: UserCheck,
    },
    {
      value: "WORKING_PROFESSIONAL" as const,
      label: "Professional",
      description: "Currently working",
      icon: Briefcase,
    },
  ]

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {serverError && (
        <div className="bg-red-950/20 border border-red-500/30 text-red-500 text-sm rounded-lg p-3 text-center">
          {serverError}
        </div>
      )}

      {/* Name field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" className="text-text-muted text-xs uppercase tracking-wider ml-1">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Nischay Sharma"
          {...form.register("name")}
          className={`bg-[#08090a] border rounded-lg py-6 px-4 text-text-primary placeholder:text-text-muted transition-all focus-visible:ring-primary-container ${
            getErrorMessage("name") ? 'border-red-500' : 'border-border-subtle'
          }`}
        />
        {getErrorMessage("name") && (
          <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage("name")}</span>
        )}
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" className="text-text-muted text-xs uppercase tracking-wider ml-1">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
          className={`bg-[#08090a] border rounded-lg py-6 px-4 text-text-primary placeholder:text-text-muted transition-all focus-visible:ring-primary-container ${
            getErrorMessage("password") ? 'border-red-500' : 'border-border-subtle'
          }`}
        />
        {getErrorMessage("password") && (
          <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage("password")}</span>
        )}

        {/* Password strength checklist */}
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-3 rounded-lg bg-[#08090a]/50 border border-border-subtle/50 text-xs">
          {passwordCriteria.map((criterion, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              {criterion.valid ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-text-muted/40 shrink-0" />
              )}
              <span className={criterion.valid ? "text-emerald-400" : "text-text-muted"}>
                {criterion.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Status selector cards */}
      <div className="flex flex-col gap-2">
        <Label className="text-text-muted text-xs uppercase tracking-wider ml-1">
          Professional Status
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {statusOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedStatus === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => form.setValue("currentStatus", option.value, { shouldValidate: true })}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer select-none gap-2 group ${
                  isSelected
                    ? "bg-primary-container/10 border-primary-container text-text-primary shadow-lg shadow-primary-container/10"
                    : "bg-[#08090a] border-border-subtle text-text-muted hover:border-border-strong hover:text-text-primary"
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isSelected ? "bg-primary-container text-white" : "bg-[#121315] group-hover:bg-[#1f2021]"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold text-xs tracking-tight">{option.label}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">{option.description}</span>
              </button>
            )
          })}
        </div>
        {getErrorMessage("currentStatus") && (
          <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage("currentStatus")}</span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-6 mt-4 bg-primary-container text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Complete Registration</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  )
}
