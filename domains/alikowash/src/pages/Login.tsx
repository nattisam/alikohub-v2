import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { Loader2, Droplets, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin, useUser } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const loginSchema = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

const LoginPage = () => {
  const { mutate: login, isPending } = useLogin();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorParam = searchParams.get("error");

  const isAdmin =
    !!user &&
    (user.globalRole === "ADMIN" ||
      user.isAdmin === true ||
      user.role === "admin");

  useEffect(() => {
    // If we're already logged in as an admin, go straight to the dashboard
    if (user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pattern-grid">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-glow">
            <Droplets className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Administrative Portal
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to manage Aliko WASH
          </p>
        </div>

        {errorParam === "not_admin" && (
          <Alert variant="destructive" className="mb-6 animate-fade-up">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              Your account does not have administrative privileges required to
              access this portal.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-card p-8 rounded-2xl shadow-card space-y-6 border border-border/50 backdrop-blur-sm"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
                      autoComplete="email"
                      className="h-11 border-border/60 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/80">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="h-11 border-border/60 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </Form>
        <p className="text-xs text-center text-muted-foreground mt-8">
          &copy; {new Date().getFullYear()} Aliko WASH. Administrative Use Only.
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
