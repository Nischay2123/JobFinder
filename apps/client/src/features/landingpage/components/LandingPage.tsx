import * as React from "react"
import { useLandingPage } from "../hooks/useLandingPage"
import { Button } from "@shared/components/ui/button"
import { Card } from "@shared/components/ui/card"

export const LandingPage: React.FC = () => {
  const { steps, hoveredStep, setHoveredStep, onGetStarted, onSignIn } = useLandingPage()

  return (
    <div className="dark min-h-screen bg-background text-text-primary flex flex-col selection:bg-primary-container/30">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
        <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">JobFinder</span>
          </div>
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
        </div>
      </nav>

      <main className="flex-grow pt-32">
        {/* Hero Section */}
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

        {/* Spacer with subtle glow effect */}
        <div className="relative h-px w-full max-w-7xl mx-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-container/20 to-transparent"></div>
        </div>

        {/* How It Works Section */}
        <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
          <div className="space-y-4 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary">How It Works</h2>
            <div className="h-1 w-12 bg-primary-container mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card 
                  key={step.id}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className={`p-8 rounded-2xl bg-surface-low border border-border-subtle hover:border-primary-container/40 transition-all duration-300 group cursor-pointer ${
                    hoveredStep === index ? 'translate-y-[-4px] shadow-lg shadow-primary-container/5 border-primary-container/30' : ''
                  }`}
                >
                  <div className="mb-6 flex items-center justify-center w-12 h-12 rounded-lg bg-surface-container text-primary-container group-hover:scale-110 group-hover:bg-primary-container/10 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{step.description}</p>
                </Card>
              )
            })}
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="mt-auto py-12 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} JobFinder. All rights reserved. Built for high-performance careers.
          </p>
          <div className="flex gap-8">
            <a className="text-sm text-text-muted hover:text-text-primary transition-colors" href="#">Privacy</a>
            <a className="text-sm text-text-muted hover:text-text-primary transition-colors" href="#">Terms</a>
            <a className="text-sm text-text-muted hover:text-text-primary transition-colors" href="#">Help</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
