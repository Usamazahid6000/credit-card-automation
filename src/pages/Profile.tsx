import { useState } from "react";
import { User, Mail, Shield, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Profile() {
  const [name, setName] = useState("Test Dev Hassaan");
  const [email, setEmail] = useState("pt.hassaan@gmail.com");
  const [role, setRole] = useState("Auth Access");
  const [enableGoogleAuth, setEnableGoogleAuth] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate saving
    setTimeout(() => {
      toast.success("Profile updated", {
        description: "Your profile information has been saved successfully",
      });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Profile Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your account information and security settings
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-xl shadow-black/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-foreground">
                Basic Information
              </h2>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-background border-border focus-visible:ring-primary/30 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-background border-border focus-visible:ring-primary/30 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="pl-10 bg-background border-border focus-visible:ring-primary/30 h-12"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Settings Section */}
            <div className="space-y-6 pt-6 border-t border-border">
              <h2 className="text-lg font-bold text-foreground">
                Security Settings
              </h2>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label
                      htmlFor="google-auth"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Enable Google Authenticator
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Switch
                  id="google-auth"
                  checked={enableGoogleAuth}
                  onCheckedChange={setEnableGoogleAuth}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t border-border">
              <button
                type="submit"
                disabled={isSaving}
                className="btn-gradient w-full flex items-center justify-center gap-2 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2026 CC OCR Validator. All rights reserved.
        </p>
      </div>
    </div>
  );
}
