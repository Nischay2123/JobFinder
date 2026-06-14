import * as React from "react"
import { Card } from "@shared/components/ui/card"
import { StepItem } from "../hooks/useLandingPage"

interface HowItWorksSectionProps {
  steps: StepItem[];
  hoveredStep: number | null;
  setHoveredStep: (idx: number | null) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  steps,
  hoveredStep,
  setHoveredStep,
}) => {
  return (
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
  )
}
