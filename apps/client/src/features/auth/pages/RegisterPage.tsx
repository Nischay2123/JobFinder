import * as React from "react"
import { Link } from "react-router-dom"
import { useRegister } from "../hooks/useRegister"
import { Button } from "@shared/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shared/components/ui/card"
import { Input } from "@shared/components/ui/input"
import { Label } from "@shared/components/ui/label"
import { ArrowRight, Loader2, Mail, Rocket } from "lucide-react"

export const RegisterPage: React.FC = () => {
  const { form, onSubmit, isLoading, error, isSuccess, submittedEmail, getErrorMessage } = useRegister()

  const serverError = error && 'data' in error
    ? (error.data as { message?: string })?.message || "Failed to start registration. Please try again."
    : error
      ? "Unable to connect to the server."
      : null

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
        <div className="flex items-center gap-4">
          <Link to="/auth/login" className="text-text-muted hover:text-text-primary text-sm transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 relative z-10 pt-20">
        <Card className="w-full max-w-[440px] bg-[#0c0d0e]/80 backdrop-blur-md border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50 hover:border-border-strong transition-all duration-300">
          {!isSuccess ? (
            <>
              <CardHeader className="flex flex-col gap-2 text-center p-0 mb-8">
                <CardTitle className="text-3xl font-bold tracking-tight text-text-primary">Create Account</CardTitle>
                <CardDescription className="text-sm text-text-muted">
                  Enter your email address to receive a verification magic link.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                  {serverError && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3 text-center">
                      {serverError}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-text-muted text-xs uppercase tracking-wider ml-1">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      {...form.register("email")}
                      className="bg-[#08090a] border border-border-subtle rounded-lg py-6 px-4 text-text-primary placeholder:text-text-muted transition-all focus-visible:ring-primary-container"
                    />
                    {getErrorMessage("email") && (
                      <span className="text-destructive text-xs mt-1 ml-1">{getErrorMessage("email")}</span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 mt-2 bg-primary-container text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Magic Link</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="p-0 mt-8 flex flex-col gap-4">
                <div className="relative w-full py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-subtle" />
                  </div>
                </div>
                <p className="text-sm text-text-muted text-center w-full">
                  Already have an account?{" "}
                  <Link to="/auth/login" className="text-primary-container hover:underline font-semibold transition-all">
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-container/10 border border-primary-container/20 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-primary-container" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-3">Check Your Email</h2>
              <p className="text-sm text-text-muted mb-6 leading-relaxed">
                We have sent a verification link to <strong className="text-text-primary font-medium">{submittedEmail}</strong>.
                Click the link in the email to complete your registration.
              </p>

              {/* Dev notice helper */}
              <div className="w-full bg-[#08090a] border border-border-subtle rounded-xl p-4 text-left text-xs text-text-muted mb-6">
                <p className="font-semibold text-text-secondary mb-1">🛠️ Local Development Notice</p>
                <p className="leading-relaxed">
                  If email delivery is not configured, search for the verification token in the terminal logs of your API server or in the SQLite/PostgreSQL database, and navigate to:
                </p>
                <code className="block bg-[#0e0f11] border border-border-subtle p-2 rounded mt-2 text-[10px] break-all select-all text-primary-container">
                  /verify-email?token=TOKEN_FROM_LOGS
                </code>
              </div>

              <Button
                variant="outline"
                className="w-full py-6 border-border-subtle hover:border-border-strong text-text-muted hover:text-text-primary"
                onClick={() => window.location.reload()}
              >
                Resend Link / Back
              </Button>
            </div>
          )}
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
