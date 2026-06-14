import * as React from "react"
import { Link } from "react-router-dom"
import { useCompleteRegistration } from "../hooks/useCompleteRegistration"
import { Button } from "@shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card"
import { Input } from "@shared/components/ui/input"
import { Label } from "@shared/components/ui/label"
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Rocket,
  UserCheck,
  XCircle,
} from "lucide-react"

export const CompleteRegistrationPage: React.FC = () => {
  const { form, onSubmit, isLoading, error, getErrorMessage } = useCompleteRegistration()

  const serverError = error && 'data' in error
    ? (error.data as { message?: string })?.message || "Failed to complete registration. Please try again."
    : error
      ? "Unable to connect to the server."
      : null

  // Watch password value for dynamic checklist
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
    <div className="dark min-h-screen bg-background text-text-primary flex flex-col antialiased relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(94,106,210,0.12)_0%,rgba(8,9,10,0)_70%)] rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto left-0 right-0">
        <Link to="/" className="font-bold text-xl tracking-tight text-text-primary flex items-center gap-2 select-none">
          <Rocket className="w-5 h-5 text-primary-container" />
          <span>JobFinder</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 relative z-10 pt-24 pb-12">
        <Card className="w-full max-w-[500px] bg-[#0c0d0e]/80 backdrop-blur-md border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50 hover:border-border-strong transition-all duration-300">
          <CardHeader className="flex flex-col gap-2 text-center p-0 mb-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-text-primary">Complete Profile</CardTitle>
            <CardDescription className="text-sm text-text-muted">
              Just a few more details to create your developer account.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
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
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center relative z-10 mt-auto">
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} JobFinder. Built for high-performance careers.
        </p>
      </footer>
    </div>
  )
}
