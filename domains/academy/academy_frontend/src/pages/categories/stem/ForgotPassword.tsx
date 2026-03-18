import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/categories/stem/layout/Layout";
import { Button } from "@/components/categories/stem/ui/button";
import { Card, CardContent } from "@/components/categories/stem/ui/card";
import { Input } from "@/components/categories/stem/ui/input";
import { Label } from "@/components/categories/stem/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Auth removed - show mock success
    toast.success("Password reset functionality removed");
    setSent(true);
  };

  return (
    <Layout>
      <section className="gradient-hero py-24 lg:py-36">
        <div className="container-content">
          <div className="max-w-md mx-auto">
            {sent ? (
              <div className="text-center">
                <div className="h-16 w-16 rounded-xl bg-accent-green/20 border border-accent-green/30 flex items-center justify-center mx-auto mb-6">
                  <Mail className="h-8 w-8 text-accent-green" />
                </div>
                <h1 className="font-display text-3xl font-extrabold text-foreground mb-4">
                  Check Your Email
                </h1>
                <p className="text-muted-foreground mb-8">
                  If an account exists for <span className="font-bold text-foreground">{email}</span>, we've sent a password reset link.
                </p>
                <Button asChild variant="outline">
                  <Link to="/login"><ArrowLeft className="mr-2 h-4 w-4" />Back to Login</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="font-display text-4xl font-extrabold text-foreground">
                    Reset <span className="text-primary">Password</span>
                  </h1>
                  <p className="mt-3 text-muted-foreground">Enter your email to receive a reset link.</p>
                </div>
                <Card className="border-divider bg-card shadow-2xl">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold">Email</Label>
                        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="h-12" />
                      </div>
                      <Button type="submit" variant="hero" size="lg" disabled={isLoading} className="w-full">
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </form>
                    <div className="mt-4 text-center">
                      <Link to="/login" className="text-sm text-primary hover:underline">
                        <ArrowLeft className="inline h-3 w-3 mr-1" />Back to Login
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
