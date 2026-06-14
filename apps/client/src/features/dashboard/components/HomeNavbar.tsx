import * as React from "react"
import { Button } from "@shared/components/ui/button"
import { Navbar } from "@shared/components/Navbar"
import { Logo } from "@shared/components/Logo"

interface HomeNavbarProps {
  onEditProfile: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({
  onEditProfile,
  onLogout,
  isLoggingOut,
}) => {
  return (
    <Navbar
      className="!bg-[#08090a]/80 border-b border-outline-variant/30"
      left={<Logo variant="dashboard" />}
      right={
        <div className="flex items-center gap-4">
          <button
            onClick={onEditProfile}
            type="button"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 hover:border-primary-container/40 transition-all cursor-pointer text-white flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Profile
          </button>

          <Button
            onClick={onLogout}
            disabled={isLoggingOut}
            variant="destructive"
            className="px-4 py-2 h-auto text-xs bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20 hover:border-red-500/40 active:scale-95 transition-all font-semibold rounded-lg cursor-pointer"
          >
            {isLoggingOut ? "Logging out..." : "Log Out"}
          </Button>
        </div>
      }
    />
  )
}
