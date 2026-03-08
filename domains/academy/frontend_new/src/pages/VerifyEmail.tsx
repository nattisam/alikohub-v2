import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Send, RefreshCw, CheckCircle } from "lucide-react";
import { useSSO } from "@/hooks/useSSO";
import { toast } from "sonner";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, emailVerified, signOut } = useSSO();
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [sendCount, setSendCount] = useState(0);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // If already verified, redirect to dashboard
    if (emailVerified) {
      navigate("/lms");
      return;
    }
  }, [isAuthenticated, emailVerified, navigate]);

  const handleResendEmail = async () => {
    if (sendCount >= 3) {
      toast.error(
        "Maximum resend attempts reached. Please check your email or contact support.",
      );
      return;
    }

    setIsSending(true);

    try {
      // Import Firebase modules
      const { getAuth } = await import("firebase/auth");
      const { getApps, initializeApp, getApp } = await import("firebase/app");

      const firebaseConfig = (await import("@/config/firebase")).default;

      // Initialize Firebase if not already initialized
      let app;
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApp();
      }

      const auth = getAuth(app);

      if (auth.currentUser) {
        await auth.currentUser.sendEmailVerification();
        setSendCount((prev) => prev + 1);
        toast.success("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast.error("Failed to send verification email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsChecking(true);

    try {
      // Import Firebase modules
      const { getAuth } = await import("firebase/auth");
      const { getApps, initializeApp, getApp } = await import("firebase/app");

      const firebaseConfig = (await import("@/config/firebase")).default;

      // Initialize Firebase if not already initialized
      let app;
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApp();
      }

      const auth = getAuth(app);

      if (auth.currentUser) {
        // Force reload the user to get updated email verification status
        await auth.currentUser.reload();

        if (auth.currentUser.emailVerified) {
          toast.success("Email verified! Redirecting to dashboard...");
          setTimeout(() => navigate("/lms"), 1500);
        } else {
          toast.error(
            "Email not yet verified. Please check your inbox and click the verification link.",
          );
        }
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      toast.error("Failed to check verification status. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-blue-200">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-800">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-blue-600">
              We sent a verification link to your email
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                Please check <span className="font-medium">{user.email}</span>{" "}
                and click the verification link to continue.
              </p>
            </div>

            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or request a
                new one.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={handleCheckVerification}
                disabled={isChecking}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    I've Verified My Email
                  </>
                )}
              </Button>

              <Button
                onClick={handleResendEmail}
                disabled={isSending || sendCount >= 3}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Resend Verification Email{" "}
                    {sendCount > 0 && `(${sendCount}/3)`}
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground pt-4 border-t">
              <p>Wrong email address?</p>
              <button
                onClick={handleLogout}
                className="text-blue-600 hover:underline mt-1"
              >
                Sign out and login with a different account
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
