import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { UserPlus, SlidersHorizontal, Sparkles, LineChart } from "lucide-react"

export interface StepItem {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export const useLandingPage = () => {
  const navigate = useNavigate()
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const handleGetStarted = () => {
    navigate("/auth/register")
  }

  const handleSignIn = () => {
    navigate("/auth/login")
  }

  const steps: StepItem[] = [
    {
      id: 1,
      title: "Create Account",
      description: "Quick setup with your professional profile or resume upload.",
      icon: UserPlus,
    },
    {
      id: 2,
      title: "Set Preferences",
      description: "Define your role, salary, and company culture requirements.",
      icon: SlidersHorizontal,
    },
    {
      id: 3,
      title: "Discover Opportunities",
      description: "Our engine finds high-quality matches tailored to you.",
      icon: Sparkles,
    },
    {
      id: 4,
      title: "Track Applications",
      description: "Manage your entire pipeline in one minimalist dashboard.",
      icon: LineChart,
    },
  ]

  return {
    steps,
    hoveredStep,
    setHoveredStep,
    onGetStarted: handleGetStarted,
    onSignIn: handleSignIn,
  }
}
