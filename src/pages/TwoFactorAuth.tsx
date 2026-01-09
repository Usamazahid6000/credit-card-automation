import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export default function TwoFactorAuth() {
  const navigate = useNavigate();
  const codeId = useAuthStore((state) => state.codeId);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Invalid code", {
        description: "Please enter a 6-digit verification code",
      });
      return;
    }

    if (!codeId) {
      toast.error("Session expired", {
        description: "Please login again",
      });
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post(
        "/Api/V8/custom/portal/verify-automation-code",
        {
          code_id: codeId,
          code: otp,
        }
      );

      const result = response.data;

      if (result.verified && result.access_token) {
        // Store auth data in zustand
        setAuth({
          user: result.user,
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          expires_in: result.expires_in,
        });

        toast.success(result.message || "Verification successful", {
          description: "Redirecting to dashboard...",
        });
        navigate("/dashboard");
      } else {
        toast.error("Verification failed", {
          description:
            result.message || "Invalid verification code. Please try again.",
        });
        setOtp("");
      }
    } catch (error: any) {
      toast.error("Verification failed", {
        description:
          error.response?.data?.message ||
          error.message ||
          "An error occurred during verification",
      });
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Two-Factor Authentication
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* 2FA Form */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block text-center">
                Verification Code
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Enter the 6-digit code from your authenticator app or email
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="btn-gradient w-full flex items-center justify-center gap-2 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Verify Code
                </>
              )}
            </button>
          </form>

          {/* <div className="mt-6 pt-6 border-t border-border">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground text-center">
                Didn't receive a code?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={isResending || countdown > 0}
                className="text-primary hover:text-primary/80"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend code in ${countdown}s`
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>
          </div> */}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
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
