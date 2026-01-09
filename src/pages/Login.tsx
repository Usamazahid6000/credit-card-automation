import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLogin } from "@/hooks/useLogin";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, isSubmitting } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Login failed", {
        description: "Please enter valid credentials",
      });
      return;
    }

    try {
      const result = await handleLogin({ email, password });

      // Check if code verification is required
      if (
        result.login &&
        result.code_verification_required &&
        result.code_id &&
        result.code_id !== ""
      ) {
        toast.success(result.message || "Verification code sent", {
          description: "A 6-digit verification code has been sent to your email address.",
        });
        navigate("/2fa");
      } else if (result.login && result.access_token) {
        // Direct login without 2FA
        toast.success(result.message || "Login successful", {
          description: "Redirecting to dashboard...",
        });
        navigate("/dashboard");
      } else {
        toast.error("Login failed", {
          description: result.message || "Please enter valid credentials",
        });
      }
    } catch (error: any) {
      toast.error("Login failed", {
        description:
          error.response?.data?.message ||
          error.message ||
          "An error occurred during login",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <CreditCard className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            CC OCR Validator
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background border-border focus-visible:ring-primary/30 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background border-border focus-visible:ring-primary/30 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary/30"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gradient w-full flex items-center justify-center gap-2 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="#" className="text-primary hover:underline font-medium">
                Contact administrator
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2026 CC OCR Validator. All rights reserved.
        </p>
      </div>
    </div>
  );
}
