import * as React from "react"
import { useLogin } from "../hooks/useLogin"
import { Button } from "@shared/components/ui/button"
import { Input } from "@shared/components/ui/input"
import { Label } from "@shared/components/ui/label"
import { ArrowRight, Loader2 } from "lucide-react"

interface LoginFormProps {
  form: ReturnType<typeof useLogin>["form"];
  onSubmit: ReturnType<typeof useLogin>["onSubmit"];
  isLoading: boolean;
  serverError: string | null;
  getErrorMessage: ReturnType<typeof useLogin>["getErrorMessage"];
}

export const LoginForm: React.FC<LoginFormProps> = ({
  form,
  onSubmit,
  isLoading,
  serverError,
  getErrorMessage,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {serverError && (
        <div className="bg-red-950/20 border border-red-500/30 text-red-500 text-sm rounded-lg p-3 text-center">
          {serverError}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-text-muted text-xs uppercase tracking-wider ml-1">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
          {...form.register("email")}
          className={`bg-[#08090a] border rounded-lg py-6 px-4 text-text-primary placeholder:text-text-muted transition-all focus-visible:ring-primary-container ${
            getErrorMessage("email") ? 'border-red-500' : 'border-border-subtle'
          }`}
        />
        {getErrorMessage("email") && (
          <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage("email")}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center px-1">
          <Label htmlFor="password" className="text-text-muted text-xs uppercase tracking-wider">
            Password
          </Label>
          <a href="#" className="text-xs text-primary-container hover:underline">
            Forgot Password?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
          className={`bg-[#08090a] border rounded-lg py-6 px-4 text-text-primary placeholder:text-text-muted transition-all focus-visible:ring-primary-container ${
            getErrorMessage("password") ? 'border-red-500' : 'border-border-subtle'
          }`}
        />
        {getErrorMessage("password") && (
          <span className="text-red-500 text-xs mt-1 ml-1">{getErrorMessage("password")}</span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-6 mt-2 bg-primary-container text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  )
}
