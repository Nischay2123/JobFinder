import * as React from "react"
import { Link } from "react-router-dom"
import { useVerifyEmail } from "../hooks/useVerifyEmail"
import { Card, CardContent } from "@shared/components/ui/card"
import { Button } from "@shared/components/ui/button"
import { AlertCircle, Loader2, Rocket } from "lucide-react"

export const VerifyEmailPage: React.FC = () => {
  const { isVerifying, error } = useVerifyEmail()

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
      <main className="flex-grow flex items-center justify-center px-6 relative z-10 pt-20">
        <Card className="w-full max-w-[440px] bg-[#0c0d0e]/80 backdrop-blur-md border border-border-subtle rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50 hover:border-border-strong transition-all duration-300">
          <CardContent className="p-0 flex flex-col items-center text-center py-4">
            {isVerifying && (
              <>
                <Loader2 className="w-12 h-12 text-primary-container animate-spin mb-6" />
                <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-2">Verifying Email</h2>
                <p className="text-sm text-text-muted">
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {error && (
              <>
                <div className="w-16 h-16 bg-red-950/20 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-3">Verification Failed</h2>
                <p className="text-sm text-text-muted mb-6 leading-relaxed">
                  {error}
                </p>
                <Button
                  asChild
                  className="w-full py-6 bg-primary-container text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Link to="/auth/register">Restart Registration</Link>
                </Button>
              </>
            )}

            {!isVerifying && !error && (
              <>
                <Loader2 className="w-12 h-12 text-primary-container animate-spin mb-6" />
                <h2 className="text-2xl font-bold tracking-tight text-text-primary mb-2">Email Verified</h2>
                <p className="text-sm text-text-muted">
                  Redirecting to complete registration details...
                </p>
              </>
            )}
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
