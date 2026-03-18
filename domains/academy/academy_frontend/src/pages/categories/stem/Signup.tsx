import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { Input } from "@/components/categories/stem/ui/input";
import { Label } from "@/components/categories/stem/ui/label";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/my-applications";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    // Auth removed - show success message
    toast.success("Signup functionality removed");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="gradient-hero py-24 lg:py-36">
          <div className="container-content">
            <div className="max-w-lg mx-auto text-center">
              <div className="h-16 w-16 rounded-xl bg-accent-green/20 border border-accent-green/30 flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-accent-green" />
              </div>
              <h1 className="font-display text-3xl font-extrabold text-foreground mb-4">
                Check Your <span className="text-accent-green">Email</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We've sent a confirmation link to <span className="font-bold text-foreground">{email}</span>. 
                Click the link to verify your account, then sign in.
              </p>
              <Button asChild variant="outline" size="lg" className="mt-8">
                <Link to="/login">Go to Login</Link>
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="gradient-hero py-20 lg:py-28">
        <div className="container-content">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-xl bg-accent-green/20 border border-accent-green/30 flex items-center justify-center mx-auto mb-5">
                <UserPlus className="h-7 w-7 text-accent-green" />
              </div>
              <h1 className="font-display text-4xl font-extrabold text-foreground">
                Create <span className="text-accent-green">Account</span>
              </h1>
              <p className="mt-3 text-muted-foreground">
                Sign up to apply for programs and track your applications.
              </p>
            </div>

            <Card className="border-divider bg-card shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-bold">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>
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
                    <Label htmlFor="password" className="font-bold">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="h-12 pl-10"
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="hero" size="lg" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-bold hover:underline">
                    Sign in
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

export default Signup;
