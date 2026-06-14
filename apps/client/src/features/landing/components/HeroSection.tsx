import * as React from "react"
import { Button } from "@shared/components/ui/button"

interface HeroSectionProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 text-center pb-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-[64px] font-bold tracking-tight leading-[1.05] animate-fade-in-up">
          Stop Searching.<br />Let Jobs Find You.
        </h1>
        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-1">
          JobFinder automatically discovers relevant opportunities, helps you manage applications, and keeps your job search organized.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up-delay-2">
          <Button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-6 bg-primary-container text-on-primary-container text-lg font-semibold rounded-xl hover:bg-primary-container/90 active:scale-95 transition-all shadow-xl shadow-primary-container/20 cursor-pointer"
          >
            Get Started
          </Button>
          <Button 
            variant="outline"
            onClick={onSignIn}
            className="w-full sm:w-auto px-8 py-6 bg-transparent border border-border-strong text-text-primary text-lg font-semibold rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
          >
            Sign In
          </Button>
        </div>
      </div>
    </section>
  )
}
