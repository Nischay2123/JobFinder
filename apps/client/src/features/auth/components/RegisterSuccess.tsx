import * as React from "react"
import { Button } from "@shared/components/ui/button"
import { Mail } from "lucide-react"

interface RegisterSuccessProps {
  submittedEmail: string;
}

export const RegisterSuccess: React.FC<RegisterSuccessProps> = ({ submittedEmail }) => {
  return (
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
  )
}
