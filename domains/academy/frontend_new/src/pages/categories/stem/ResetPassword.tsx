import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { Input } from "@/components/categories/stem/ui/input";
import { Label } from "@/components/categories/stem/ui/label";
import { Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      // No recovery token, redirect
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    // Auth removed - show mock success
    toast.success("Password reset functionality removed");
    setDone(true);
    setTimeout(() => navigate("/login"), 3000);
  };

  if (done) {
    return (
      <Layout>
        <section className="gradient-hero py-24 lg:py-36">
          <div className="container-content text-center">
            <CheckCircle2 className="h-16 w-16 text-accent-green mx-auto mb-6" />
            <h1 className="font-display text-3xl font-extrabold text-foreground mb-4">Password Updated</h1>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="gradient-hero py-24 lg:py-36">
        <div className="container-content">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl font-extrabold text-foreground">
                New <span className="text-primary">Password</span>
              </h1>
            </div>
            <Card className="border-divider bg-card shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-bold">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="h-12 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-bold">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input id="confirmPassword" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" className="h-12 pl-10" />
                    </div>
                  </div>
                  <Button type="submit" variant="hero" size="lg" disabled={isLoading} className="w-full">
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;
