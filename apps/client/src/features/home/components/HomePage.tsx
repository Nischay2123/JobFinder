import * as React from "react"
import { useHome } from "../hooks/useHome"
import { Button } from "@shared/components/ui/button"

export const HomePage: React.FC = () => {
  const { user, handleLogout, isLoggingOut } = useHome()

  return (
    <div className="dark min-h-screen bg-background text-text-primary flex flex-col items-center justify-center selection:bg-primary-container/30 px-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-surface-low border border-border-subtle flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden ai-glow-border">
        {/* Accent glow in background */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col items-center gap-2 text-center">
          <span className="text-sm font-semibold tracking-wider text-primary-container uppercase">Welcome</span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Hello, {user?.name || "User"}!
          </h1>
          <p className="text-sm text-text-muted mt-1">
            You are successfully signed in to JobFinder.
          </p>
        </div>

        <Button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full py-6 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 hover:border-red-500/40 active:scale-95 transition-all font-semibold rounded-xl cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? "Logging out..." : "Log Out"}
        </Button>
      </div>
    </div>
  )
}
