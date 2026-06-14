import * as React from "react"
import { useLandingPage } from "../hooks/useLandingPage"
import { Button } from "@shared/components/ui/button"
import { Navbar } from "@shared/components/Navbar"
import { Footer } from "@shared/components/Footer"
import { Logo } from "@shared/components/Logo"
import { HeroSection } from "../components/HeroSection"
import { HowItWorksSection } from "../components/HowItWorksSection"

export const LandingPage: React.FC = () => {
  const { steps, hoveredStep, setHoveredStep, onGetStarted, onSignIn } = useLandingPage()

  return (
    <div className="dark min-h-screen bg-background text-text-primary flex flex-col selection:bg-primary-container/30">
      {/* Top Navigation Bar */}
      <Navbar
        left={<Logo variant="landing" />}
        right={
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onSignIn}
              className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              Login
            </Button>
            <Button 
              onClick={onGetStarted}
              className="bg-primary-container text-on-primary-container hover:bg-primary-container/90 active:scale-95 transition-all font-semibold rounded-lg cursor-pointer"
            >
              Get Started
            </Button>
          </div>
        }
      />

      <main className="flex-grow pt-32">
        <HeroSection onGetStarted={onGetStarted} onSignIn={onSignIn} />

        {/* Spacer with subtle glow effect */}
        <div className="relative h-px w-full max-w-7xl mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/20 to-transparent"></div>
        </div>

        <HowItWorksSection 
          steps={steps} 
          hoveredStep={hoveredStep} 
          setHoveredStep={setHoveredStep} 
        />
      </main>

      {/* Simple Footer */}
      <Footer variant="landing" />
    </div>
  )
}
export default LandingPage;
