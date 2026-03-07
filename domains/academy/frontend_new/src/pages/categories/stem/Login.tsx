import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { Input } from "@/components/categories/stem/ui/input";
import { Label } from "@/components/categories/stem/ui/label";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/my-applications";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Auth removed - just navigate to the redirect page
    toast.success("Login functionality removed");
    navigate(redirectTo);
  };

  return (
    <Layout>
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container-content">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                <LogIn className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-display text-4xl font-extrabold text-foreground">
                Sign <span className="text-primary">In</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Access your applications and learning dashboard.
              </p>
            </div>

            <Card className="border-divider bg-card shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="font-bold">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="hero" size="lg" disabled={isLoading} className="w-full">
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to={`/signup${redirectTo !== "/my-applications" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="text-primary font-bold hover:underline">
                    Create one
                    <ArrowRight className="inline h-3 w-3 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
