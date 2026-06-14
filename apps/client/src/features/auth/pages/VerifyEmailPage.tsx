import * as React from "react"
import { Link } from "react-router-dom"
import { useVerifyEmail } from "../hooks/useVerifyEmail"
import { Card, CardContent } from "@shared/components/ui/card"
import { Rocket } from "lucide-react"
import { VerifyEmailStatus } from "../components/VerifyEmailStatus"
import { Footer } from "@shared/components/Footer"

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
          <CardContent className="p-0">
            <VerifyEmailStatus isVerifying={isVerifying} error={error} />
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <Footer variant="auth" />
    </div>
  )
}

export default VerifyEmailPage;
