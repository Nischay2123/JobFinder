import * as React from "react"
import { Link } from "react-router-dom"
import { useLogin } from "../hooks/useLogin"
import { Button } from "@shared/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@shared/components/ui/card"
import { Input } from "@shared/components/ui/input"
import { Label } from "@shared/components/ui/label"
import { ArrowRight, Loader2, Rocket } from "lucide-react"

export const LoginPage: React.FC = () => {
  const { form, onSubmit, isLoading, loginError, getErrorMessage } = useLogin()

  // Extract server-side error if exists
  const serverError = loginError && 'data' in loginError
    ? (loginError.data as { message?: string })?.message || "Failed to sign in. Please try again."
    : loginError
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
          <Link to="/" className="text-text-muted hover:text-text-primary text-sm transition-colors">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 relative z-10 pt-20">
        <Card className="w-full max-w-[440px] bg-[#0c0d0e]/80 backdrop-blur-md border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50 hover:border-border-strong transition-all duration-300">
          <CardHeader className="flex flex-col gap-2 text-center p-0 mb-8">
            <CardTitle className="text-3xl font-bold tracking-tight text-text-primary">Welcome Back</CardTitle>
            <CardDescription className="text-sm text-text-muted">
              Enter your credentials to access your job search dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              {serverError && (
                <div className="bg-red-950/20 border border-red-500/30 text-red-500 text-sm rounded-lg p-3 text-center">
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
                  className={`bg-[#08090a] border rounded-lg py-6 px-4 text-text-primary placeholder:text-text-muted transition-all focus-visible:ring-primary-container ${
                    getErrorMessage("email") ? 'border-red-500' : 'border-border-subtle'
                  }`}
                />
                {getErrorMessage("email") && (
                  <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage("email")}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-text-muted text-xs uppercase tracking-wider">
                    Password
                  </Label>
                  <a href="#" className="text-xs text-primary-container hover:underline">
                    Forgot Password?
                  </a>
                </div>
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
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 mt-2 bg-primary-container text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
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
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-primary-container hover:underline font-semibold transition-all">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center relative z-10 mt-auto">
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} JobFinder. Built for high-performance careers.
        </p>
        <div className="mt-4 flex justify-center gap-6">
          <a className="text-xs text-text-muted hover:text-text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="text-xs text-text-muted hover:text-text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  )
}
