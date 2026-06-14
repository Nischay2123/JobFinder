import * as React from "react"
import { Link } from "react-router-dom"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@shared/components/ui/button"

interface VerifyEmailStatusProps {
  isVerifying: boolean;
  error: string | null;
}

export const VerifyEmailStatus: React.FC<VerifyEmailStatusProps> = ({ isVerifying, error }) => {
  return (
    <div className="flex flex-col items-center text-center py-4">
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
    </div>
  )
}
