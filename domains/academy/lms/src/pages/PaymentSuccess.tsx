import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useUser } from "@/hooks/useAuth";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  useEffect(() => {
    // Invalidate enrollments and transactions so fresh data is fetched after payment webhook processes
    queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    queryClient.invalidateQueries({ queryKey: ["my-transactions"] });

    // Show success message
    toast.success("Payment completed successfully!");
  }, [queryClient]);

  const handleGoToCourses = () => {
    navigate("/dashboard");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-green-200">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-green-600">
              Thank you for enrolling in AlikoHub Academy
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 text-center">
                Your enrollment has been confirmed and you now have access to
                your courses.
              </p>
            </div>

            {user && (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">
                  Welcome,{" "}
                  <span className="font-medium text-foreground">
                    {user.firstname} {user.lastname}
                  </span>
                  !
                </p>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <Button
                onClick={handleGoToCourses}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                Go to My Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button
                onClick={handleGoToDashboard}
                variant="outline"
                className="w-full border-green-200 text-green-700 hover:bg-green-50"
              >
                View Dashboard
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground pt-2">
              <p>
                A confirmation email has been sent to your registered email
                address.
              </p>
              <p className="mt-1">
                Need help? Contact{" "}
                <a
                  href="mailto:support@alikohub.com"
                  className="text-green-600 hover:underline"
                >
                  support@alikohub.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;
